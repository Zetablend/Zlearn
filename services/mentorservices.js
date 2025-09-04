const { Mentor, Sequelize, Op, fn, col, where,User } = require('../models');

const getMentorsWithFiles = async (filters = {}) => {
  try {
    const {
      preferred_gender,
      style_of_support = '',
      industry_field = [],
      support_needed = [],
    } = filters;

    const whereConditions = [];

    // Gender (skip if "no strong preferences")
    if (preferred_gender && preferred_gender.toLowerCase() !== 'no strong preferences') {
      whereConditions.push({ gender: preferred_gender });
    }

    // Style of support (skip if "I'm not sure")
    if (style_of_support && style_of_support.toLowerCase() !== "i'm not sure") {
      whereConditions.push({ mentoring_style: style_of_support });
    }

    // Industry field (skip "I'm not sure yet")
    const filteredIndustry = industry_field.filter(i => i.toLowerCase() !== "i'm not sure yet");
    if (filteredIndustry.length > 0) {
      const skillFilters = filteredIndustry.map(skill =>
        where(fn('JSON_CONTAINS', col('Mentor.areas_of_competence'), JSON.stringify(skill)), 1)
      );
      whereConditions.push({ [Op.or]: skillFilters });
    }

    // Support needed (skip "Still figuring it out/Not sure")
    const filteredSupport = support_needed.filter(s =>
      s.toLowerCase() !== "still figuring it out/not sure"
    );
    if (filteredSupport.length > 0) {
      const supportFilters = filteredSupport.map(support =>
        where(fn('JSON_CONTAINS', col('Mentor.specialization'), JSON.stringify(support)), 1)
      );
      whereConditions.push({ [Op.or]: supportFilters });
    }

    const mentors = await Mentor.findAll({
      where: {
        [Op.and]: whereConditions
      }
    });

    return mentors;
  } catch (error) {
    throw new Error('Failed to fetch mentors with files: ' + error.message);
  }
};

const getUserId=async (useremail,mentoremail)=>{
  try{
    if(useremail){
    const user = await User.findOne({where:{email:useremail}})
    const userId=user.id
    return userId}
    if(mentoremail){
    const mentor = await Mentor.findOne({where:{email:mentoremail}})
    const mentorId=mentor.id
    return mentorId
    }
}
 catch (error) {
    throw new Error('Failed to fetch mentors with files: ' + error.message);
  }}

module.exports = {
  getMentorsWithFiles,
  getUserId
};
