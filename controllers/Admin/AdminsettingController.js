const { AdminSetting } = require('../../models');
exports.postadminsettings= async (req, res) => {
  try {
    const {adminId,EnableNotification,MangeCourses,MangeDocuments,
        MangeTermsandConditions,MangePosts,MangeUserandMentorAccess} = req.body;
    if(!adminId){return res.status(400).json({ message: 'adminId is required'} );}

    const adminsetting = await AdminSetting.create({adminId,Notification:EnableNotification,MangeCourses,MangeDocuments,
        MangeTermsandConditions,MangePosts,MangeUserandMentorAccess});

    res.status(200).json({
          message:"admin setting enabled successfully",
          adminsetting
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.Updateadminsettings = async (req, res) => {
  try {
    const { adminId, ...rest } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: 'adminId is required' });
    }

    const admin = await AdminSetting.findOne({ where: { adminId } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin setting not found' });
    }

    // Get all valid column names from model
    const modelFields = Object.keys(AdminSetting.rawAttributes);

    // Keep only fields that exist in DB
    const updateData = {};
    for (const key of Object.keys(rest)) {
      if (modelFields.includes(key)) {
        updateData[key] = rest[key];
      }
    }

    await admin.update(updateData);

    res.status(200).json({
      message: 'Admin setting updated successfully',
      adminsetting: updateData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
