const { google } = require('googleapis');
const { Session } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { Op, literal } = require('sequelize');
const { DateTime } = require('luxon');
require('dotenv').config();
const { Grouping, User, Mentor } = require('../../models');



const SCOPES = ['https://www.googleapis.com/auth/calendar'];

exports.getTimezones=async(req,res)=>{
try{
const searchQuery = req.query.search?.toLowerCase() || '';

    // Get all IANA timezones
    const timezones = Intl.supportedValuesOf('timeZone');

    // Filter based on search term (case-insensitive)
    const filteredTimezones = timezones.filter((tz) =>
      tz.toLowerCase().includes(searchQuery)
    );

    return res.status(200).json({ 
      count: filteredTimezones.length,
      data: filteredTimezones 
    });
}
catch (error) {
    res.status(500).json({ error: error.message });
  }
},

exports.createEvent = async (req, res) => {
  try {
    const { batchId, date, startTime, endTime, goal,mentorname,adminemail,timezone } = req.body;

    if (!batchId || !date || !startTime || !endTime || !goal||!timezone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get mentor email for the batch
    const mentor = await Mentor.findOne({ where: { full_name:mentorname } });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const mentorEmail = mentor.email;

    // Get user emails using Grouping table joined with User table
    const groupedUsers = await Grouping.findAll({
      where: { batchId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email'],
        }
      ]
    });

    const userEmails = groupedUsers
      .map(g => g.user?.email)
      .filter(email => typeof email === 'string' && email.includes('@')); // remove undefined/null

    if (userEmails.length === 0) {
      return res.status(404).json({ message: 'No users found for this batch' });
    }

    
    const startDateTime = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm', timezone).format();
    const endDateTime = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm', timezone).format();


    const requestId = uuidv4().slice(0, 6); // generate random id

    const event = {
      summary:goal,
      start: {
        dateTime: startDateTime,
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: timezone,
      },
      attendees: [
        { email: mentorEmail },
        ...userEmails.map(email => ({ email })),
      ],
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: 'hangoutMeet' },
        },
      },
    };

     const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.private_key.replace(/\\n/g, '\n'),
      SCOPES,
      adminemail // subject impersonation
    );

     const calendar = google.calendar({ version: 'v3', auth });
     const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    }); 
   
    const meetlink = response.data.conferenceData?.entryPoints?.[0]?.uri;
    const calenderlink=response.data?.htmlLink;
    const sessionId=response.data?.id;
try{
    const eventdata_db=await Session.create({meetlink,calenderlink,sessionId, batchId, session_date:date,timezone, sessionstart_time:startTime, sessionend_time:endTime, goal,mentorname})

    return res.status(200).json({ message: 'Event created successfully',eventdata_db, event: response.data });}
    catch (dbError) {
    return res.status(500).json({
      message: 'Google event created, but failed to save in DB',
      dbError: dbError.message,
    });
  }

  } catch (error) {
    const errorMessage = error?.response?.data || error.message || 'Unknown error';

  // Check if the error is due to domain restriction or unauthorized access
  if (
    errorMessage.includes('Not Found') ||
    errorMessage.includes('Access denied') ||
    errorMessage.includes('Invalid') ||
    errorMessage.includes('does not exist')
  ) {
    return res.status(403).json({
      message: `Failed to create event: ${errorMessage}. 
This may happen if the admin email '${adminemail}' is not part of the authorized Google Workspace domain.`,
    });
  }

  return res.status(500).json({
    message: `Google Calendar error: ${errorMessage}`,
  });
  }
};

exports.getNextSession=async(req,res)=>{
  try{
  const {batchId}=req.body
  if(!batchId){res.status(404).json({ message: 'required batch id'});}

   const {timezone}= await Session.findOne({where:{batchId,session_status:"active",},attributes:["timezone"],raw: true})
   
     //const timeZone = sessionInfo.timezone;
     const currentTime = DateTime.now().setZone(timezone).toFormat('HH:mm');

  const session= await Session.findOne({where:{batchId,session_status:"active",
    [Op.and]: [literal(`TIME(sessionstart_time) > '${currentTime}'`)]},order: [["session_date", "ASC"]]})
  if(!session){res.status(404).json({ message: 'No upcoming session scheduled'});}

  res.status(200).json({session})

}
catch (error) {
    res.status(500).json({ error: error.message });
  }
}
exports.getUpcomingSessions=async(req,res)=>{
  try{
  const {batchId}=req.body
  if(!batchId){res.status(400).json({ message: 'required batch id'});}
  const session= await Session.findAll({where:{batchId,session_status:"active"},order: [["session_date", "ASC"], ["sessionstart_time", "ASC"]],
      raw: true})
  if(!session.length){res.status(404).json({ message: 'No Session Scheduled'});}
  const timezone = session[0].timezone;
  const now = new Date().toLocaleString('en-US', { timeZone: timezone });
    const currentTime = new Date(now);
    const filteredSessions = session.filter((item) => {
      const fullDateTime = new Date(`${item.session_date}T${item.sessionstart_time}`);
      return fullDateTime > currentTime;
    });
  res.status(200).json({filteredSessions})

}
catch (error) {
    res.status(500).json({ error: error.message });
  }
}
exports.getPastSessions=async(req,res)=>{
  try{
  const batchId=req.body
  if(!batchId){res.status(404).json({ message: 'required batch id'});}
  const session= await Session.findAll({where:{batchId,session_status:"completed",}})
  if(session.length){res.status(401).json({ message: 'batch id not found'});}
  res.status(200).json({session})
}
catch (error) {
    res.status(500).json({ error: error.message });
  }
}
exports.UpdateSession=async(req,res)=>{
try{
  const {batchId,session_number}=req.body
   if (!batchId || !session_number) {
      return res.status(400).json({ message: 'batchId and session_number are required' });
    }
  const session= await Session.findOne({where:{batchId,session_number}})
  if(!session){res.status(404).json({ message: 'incorrect sessionId or batchId'});}
  await Session.update({session_status:"cancelled"},{where:{batchId,session_number}})
  
  res.status(200).json({message: 'session successfully cancelled'})

}
catch (error) {
    res.status(500).json({ error: error.message });
  }
}
exports.uploaddocument=async(req,res)=>{
try{
  const {batchId,goal,summarydocument}=req.body
   if (!batchId || !goal||!summarydocument) {
      return res.status(400).json({ message: 'batchId,goal and summarydocument are required' });
    }
  const session= await Session.findOne({where:{batchId,goal}})
  if(!session){res.status(404).json({ message: 'incorrect goal or batchId'});}

  const uploadToS3 = async (buffer, key, contentType) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read"
    };
  
    const result = await s3.upload(params).promise();
    return result.Location;
  };
  
  const decodeBase64 = (base64Str) => Buffer.from(base64Str, 'base64');
  let summarydocument_url = null;
  if (summarydocument) {
      const buffer = decodeBase64(summarydocument.data);
      
      const key = `summarydocument-${summarydocument.filename}`;
      summarydocument_url = await uploadToS3(buffer, key, summarydocument.mimetype);
    }

   const document = await Session.update({summarydocument_url
    },{where:{batchId,goal,}});
  
  res.status(200).json({message: 'summary documnet uploaded successfully'})

}
catch (error) {
    res.status(500).json({ error: error.message });
  }
}
exports.getdocuments=async(req,res)=>{
  try{
  const batchId=req.body
  if(!batchId){res.status(404).json({ message: 'required batch id'});}
   
  const documents= await Session.findAll({ where: {
        batchId,
        session_status: {
          [Op.or]: ['active', 'completed']
        }
      },
      order: [["session_date", "ASC"]],
      attributes: ['summarydocument_url', 'goal', 'session_date']})
  if(!documents || documents.length === 0){res.status(401).json({ message: 'No documents found'});}
  res.status(200).json({data:documents})

}
catch (error) {
    res.status(500).json({ error: error.message });
  }
}