const db = require('../../models');
const Userqueryinfo = db.Userqueryinfo;
const db = require('../../models');
const Mentor=db.Mentor;
const MentorFile=db.MentorFile;
const mentorService = require('../../services/mentorservices');


exports.getmatchingmentors = async (req, res) => {
  try {
    const {
      preferred_gender,
      preferred_style,
      interest_field,
      support_type
    } = req.body;

    // store user query
    const user = await Userqueryinfo.create(req.body);

    // get mentors
    const mentors = await mentorService.getMentorsWithFiles({
      preferred_gender,
      style_of_support: preferred_style,
      industry_field: interest_field,
      support_needed: support_type
    });

    

    // Step 5: Get mentors sorted by bayesScore
    const recommendations = await Mentor.findAll({
      where: { industry_field: interest_field },
      include: [{ model: MentorFile, as: 'files', required: false }],
      order: [['bayesScore', 'DESC']]
    });

    // return response
    res.status(200).json({
      message: "User query stored successfully",
      query: user,
      data: mentors,
      recommendations
    });
  } catch (err) {
    console.error("User request error:", err);
    res.status(500).json({
      message: "User request failed",
      error: err.message
    });
  }
};
