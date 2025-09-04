
const { Session, Sequelize } = require('../models');
const { Op } = Sequelize;

// Run every hour at minute 0
const updateSessionStatus= async () => {
  try {
    // 1. Get all active sessions with their timezone
    const sessions = await Session.findAll({
      where: { session_status: 'active' },
      attributes: ['id', 'timezone', 'session_date', 'sessionend_time'],
      raw: true
    });

    // 2. Filter in JS based on each session's own timezone
    const toCompleteIds = [];
    for (const s of sessions) {
      const nowInTz = new Date().toLocaleString('en-US', { timeZone: s.timezone });
      const now = new Date(nowInTz);

      const todayDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const currentTime = now.toTimeString().slice(0, 5); // HH:mm

      if (s.session_date === todayDate && s.sessionend_time <= currentTime) {
        toCompleteIds.push(s.id);
      }
    }

    // 3. Update all matching sessions at once
    if (toCompleteIds.length > 0) {
      await Session.update(
        { session_status: 'completed' },
        { where: { id: { [Op.in]: toCompleteIds } } }
      );
      console.log(`✅ ${toCompleteIds.length} sessions updated to completed`);
    } else {
      console.log('ℹ No sessions to update');
    }

  } catch (error) {
    console.error('❌ Error updating sessions:', error.message);
  }
};

module.exports = { updateSessionStatus }
