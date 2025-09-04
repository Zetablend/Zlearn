const { where } = require('sequelize');
const { User, Mentor, Session, Payment, Sequelize } = require('../models');
const moment = require('moment');

exports.getDashboardData = async (req, res) => {
  // Helper: Get "ago" label
  const formatJoinedDate = (joinedDateStr) => {
    const today = new Date();
    const joinedDate = new Date(joinedDateStr);
    const diffDays = Math.floor((today - joinedDate) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    }
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  };

  // Helper: Fetch latest list (users or mentors)
  const getLatestList = (Model, attrMap, where = {}) => {
    return Model.findAll({
      attributes: [
        ...attrMap,
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'joineddate']
      ],
      where,
      order: [['createdAt', 'DESC']],
      limit: 5,
      raw: true
    }).then(list =>
      list.map(item => {
        const applied = formatJoinedDate(item.joineddate);
        delete item.joineddate;
        return { ...item, applied };
      })
    );
  };

  try {
    const results = await Promise.allSettled([
      // Dashboard counts
      User.count(),
      Mentor.count({ where: { Status: 'active' } }),
      Session.count({ where: { session_status: "active" } }),
      Payment.sum('amount'),

      // Session Data
      Session.findAll({
        attributes: [
          "session_date",
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'scheduled'],
          [
            Sequelize.literal(`COUNT(CASE WHEN session_status = 'completed' THEN 1 END)`),
            "completed"
          ],
          [
            Sequelize.literal(`COUNT(CASE WHEN session_status = 'cancelled' THEN 1 END)`),
            "cancelled"
          ]
        ],
        group: ["session_date"],
        raw: true
      }),

      // Monthly Revenue
      Payment.findAll({
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'monthKey'],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue']
        ],
        group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
        raw: true
      }),

      // Latest Users
      getLatestList(User, ['id', 'username', 'email']),

      // Latest Mentors
      getLatestList(Mentor, ['id', 'full_name', 'email']),

      // Pending Mentors
      getLatestList(Mentor, ['id', 'full_name', 'specialisations'], { Status: "pending" })
    ]);

    const getValue = (i, fallback) =>
      results[i].status === 'fulfilled' ? results[i].value : fallback;

    // Format Monthly Revenue
    const dbRevenueData = getValue(5, []);
    const revenueMap = {};
    dbRevenueData.forEach(row => {
      revenueMap[row.monthKey] = Number(row.totalRevenue) || 0;
    });

    const months = [];
    const start = moment().subtract(11, 'months').startOf('month');
    const end = moment().endOf('month');
    let current = start.clone();
    while (current.isSameOrBefore(end, 'month')) {
      const monthKey = current.format('YYYY-MM');
      months.push({
        month: current.format('MMMM YYYY'),
        totalRevenue: revenueMap[monthKey] || 0
      });
      current.add(1, 'month');
    }

    res.status(200).json({
      totalUsers: getValue(0, 0),
      activeMentors: getValue(1, 0),
      activeSessions: getValue(2, 0),
      totalRevenue: getValue(3, 0),
      sessionData: getValue(4, []),
      monthlyRevenue: months,
      latestUsers: getValue(7, []),
      latestMentors: getValue(8, []),
      pendingMentors: getValue(9, [])
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search, status, subscription, page = 1, limit = 10 } = req.query;

    const userWhere = {};
    const subscriptionWhere = {};

    // Search filter
    if (search) {
      const caseconversion = search.toLowerCase();

      if (search.includes("@")) {
        userWhere.email = { [Op.like]: `%${caseconversion}%` };
      } else {
        userWhere.username = { [Op.like]: `%${caseconversion}%` };
      }
    }

    // Status filter
    if (status) {
      userWhere.status = status;
    }

    // Subscription filter
    if (subscription) {
      subscriptionWhere.packagename = subscription;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await User.findAndCountAll({
      attributes: [
        "id",
        "username",
        "email",
        "status",
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'joineddate']
      ],
      where: userWhere,
      include: [
        {
          model: Payment,
          as: 'paymentdetails',
          required: !!subscription,
          where: Object.keys(subscriptionWhere).length ? subscriptionWhere : undefined,
          attributes: ["packagename", "amount", "createdAt"]
        },
        {
          model: Grouping,
          as: 'groupings', // must match alias in User.hasMany(Grouping)
          required: false,
          attributes: ["batchnumber", "field", "totalsessions", "joiningDate"],
          include: [
            {
              model: Mentor,
              as: 'mentor',
              attributes: ["id", "mentorname",Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'since']
            }
          ]
        }

      ],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      distinct: true,
      raw: false // IMPORTANT: so paymentdetails stays as nested object
    });

    // Add fallback if no payment details
    const processedUsers = rows.map(user => {
      const userData = user.toJSON();
      if (!userData.paymentdetails || Object.keys(userData.paymentdetails).length === 0) {
        userData.paymentdetails = { message: "User not subscribed" };  
      }
      if(!Array.isArray(userData.groupings) || userData.groupings.length === 0){
         userData.groupings = [{ "mentor": { "message": "No mentor assigned" } }] 
      }
      return userData;
    });

    res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: processedUsers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateuserStatus=async(req,res)=>{
  try{
    const { id: userId }=req.param
    const status=req.body
    if(status){return res.status(400).json({ message: 'Status is required'} );}
   const [updated]= User.Update({
      status},
      {where:{id:userId}})

  if (updated === 0) {
      return res.status(404).json({ message: 'User not found' });
    } 
    res.status(200).json({
      message:"user status updated successfully",
      userId,
      newstatus:status
    });
  }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
}
exports.getUserDetails=async(res,req)=>{
  try{
     const { id } = req.params;
     const user = await User.findOne({
     
      where: {id},
      include: [
        {
          model: Payment,
          as: 'paymentdetails',
          required: false,
        },
        {
          model: Grouping,
          as: 'groupings', // must match alias in User.hasMany(Grouping)
          required: false,
          attributes: ["batchnumber", "field", "totalsessions", "joiningDate"],
          include: [
            {
              model: Mentor,
              as: 'mentor',
              required: false,
            }
          ]
        }

      ],
      
    });
    if(!user){return res.status(404).json({ message: 'User not found' })}
    
    res.status(200).json({
      message:"user details fetched successfully",
      user,
      userid:id
    });

  }catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getAllMentors = async (req, res) => {
  try {
    const { search, status, field, page = 1, limit = 10 } = req.query;

    const mentorWhere = {};
  
    // Search filter
    if (search) {
      const caseconversion = search.toLowerCase();

      if (search.includes("@")) {
        mentorWhere.email = { [Op.like]: `%${caseconversion}%` };
      } else {
        mentorWhere.full_name = { [Op.like]: `%${caseconversion}%` };
  
    }}

    // Status filter
    if (status) {
      mentorWhere.status = status;
    }
    if (field) {
  const fieldsArray = Array.isArray(field) ? field : [field];
  mentorWhere[Op.and] = fieldsArray.map(f =>
    Sequelize.where(
      Sequelize.fn("JSON_CONTAINS", Sequelize.col("specialisations"), JSON.stringify([f])),
      1
    )
  );
}

   

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Mentor.findAndCountAll({
      attributes: [
        "id",
        "full_name",
        "email",
        "status",
        "specialisations",
        "totalstudents",
        "bayesScore",
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'joineddate']
      ],
      where: mentorWhere,
      include: [
        {
          model: Payment,
          as: 'paymentdetails',
          required: false,
          attributes: ["id","dateofpayment","amount","status"]
        },
        {
          model: Session,
          as: 'programs', // must match alias in User.hasMany(Grouping)
          required: false,
          attributes: ["id", "sessionId", "goal", "session_date","studentscount"],
          
        }

      ],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      distinct: true,
      raw: false // IMPORTANT: so paymentdetails stays as nested object
    });

    // Add fallback if no payment details
    const processedMentor = rows.map(mentor => {
      const mentorData = mentor.toJSON();
      if (!mentorData.paymentdetails || mentorData.paymentdetails.length === 0) {
        mentorData.paymentdetails = [{ message: "No payement done" }];  
      }
      if (!mentorData.programs || mentorData.programs.length === 0) {
        mentorData.programs = [{ message: "No programs attended" }];  
      }
      
      return mentorData;
    });

    res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      mentor: processedMentor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updatementorStatus=async(req,res)=>{
  try{
    const { id: mentorId }=req.param
    const Status=req.body
    if(Status){res.status(400).json({ message: 'Status is required'} );}
   const [updated]= Mentor.Update({
      Status},
      {where:{id:mentorId}})

  if (updated === 0) {
      return res.status(404).json({ message: 'Mentor not found' });
    } 
    res.status(200).json({
      message:"Mentor status updated successfully",
      mentorId,
      newstatus:Status
    });
  }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
}
