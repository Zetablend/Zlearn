const Sessions = require('../../models/Admin/Sessions');
const Goalprogress = require('../../models/Mentor/Goalprogress');


exports.postGoals = async (req, res) => {
  try {
    const { mentorId, goals, description, prerequirisation,batchId } = req.body;
  

    const goal = await Goalprogress.create({
      mentorId,
      goals,
      description,
      prerequirisation, // stored as JSON array
      batchId
    });
      res.status(201).json({
      message: 'Goals are listed successfully.',
      goal
    });
  } catch (error) {
   
    res.status(500).json({ error: 'Failed to Goals Listed.' });
  }}

exports.getGoalProgress = async (req, res) => {
  try {
    const { mentorId,batchId } = req.body;
    const goalProgress = await Goalprogress.findOne({ where: { mentorId,batchId}});
    res.status(200).json(goalProgress);
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ error: 'Failed to fetch goalProgress.' });
  }
};
exports.UpdateGoalProgress = async (req, res) => {
  try {
    const { mentorId,batchId,topic } = req.body;
    const goalProgress = await Goalprogress.findOne({ where: { mentorId,batchId}});

    let updateCompletedGoals = Array.isArray(goalProgress.completedgoals)
      ? [...goalProgress.completedgoals]
      : [];

    // Avoid duplicate topic entries
    if (!updateCompletedGoals.includes(topic)) {
      updateCompletedGoals.push(topic);
    }
    const count=await Sessions.count({where:{batchnumber:batchId}})
    await Goalprogress.update( {   
      completedgoals: updateCompletedGoals,
      completedhours:count,
    },{ where: { mentorId,batchId}});

    res.status(200).json({message: 'Goals are updated successfully.',updateCompletedGoals});
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to Update goal.' });
  }
};