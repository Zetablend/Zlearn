const { Mentor, Review, Sequelize } = require('../models');
const { Op } = Sequelize;

const m = 10; // Minimum review threshold

const updateBayesianScores = async () => {
  try {
    // Step 1: Get all industry fields from mentors
    const industries = await Mentor.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('industry_field')), 'industry_field']],
      raw: true
    });

  

    const allIndustryFields = industries.map(item => item.industry_field);
   

    for (const industry of allIndustryFields) {
      // Step 2: Get all mentors for this field
      const mentors = await Mentor.findAll({
        where: { industry_field: industry },
        attributes: ['id'],
        raw: true
      });

 

      const mentorIds = mentors.map(m => m.id);
       
      if (mentorIds.length === 0) continue;

      // Step 3: Get avgscore (r) and count (v) per mentor
      const mentorStats = await Review.findAll({
        attributes: [
          'mentorId',
          [Sequelize.fn('AVG', Sequelize.col('avgscore')), 'r'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'v']
        ],
        where: {
          mentorId: { [Op.in]: mentorIds }
        },
        group: ['mentorId'],
        raw: true
      });
    

      // Step 4: Get global average (c) across same field mentors
    const totalR = mentorStats.reduce((sum, item) => sum + parseFloat(item.r), 0);
    const global = totalR / mentorStats.length || 0;

      const c = parseFloat(global);

     
      

      // Step 5: Calculate and update bayesScore
      const updatePromises = mentorStats.map(stat => {
        const mentorId = stat.mentorId;
        const r = parseFloat(stat.r);
        const v = parseInt(stat.v);
        const bayesScore = ((v / (v + m)) * r) + ((m / (v + m)) * c);

        return Mentor.update(
          { bayesScore: bayesScore.toFixed(2) },
          { where: { id: mentorId } }
        );
      });

      

      await Promise.all(updatePromises);
      console.log(`Updated Bayesian scores for industry: ${industry}`);
    }
  } catch (err) {
    console.error('Error updating bayesian scores:', err);
  }
};

module.exports = { updateBayesianScores };
