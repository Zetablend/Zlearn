const { MentorResource,Notification,Grouping } = require('../../models');
const { uploadBase64ToS3 } = require('../../utility/s3Uploader');

exports.postMentorResource = async (req, res) => {
  try {
    const { mentorId, title, description, files,batchId } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'At least one file is required.' });
    }

    const fileUrls = await Promise.all(
      files.map(base64 => uploadBase64ToS3(base64, `mentor_${mentorId}`))
    );

    const resource = await MentorResource.create({
      mentorId,
      title,
      description,
      fileUrls, // stored as JSON array
      batch_id:batchId
    });
     const userGroup = await Grouping.findAll({
        where: { batchnumber:batchId }
    });

    // 3. Create notifications
    const notifications = userGroup.map(user => ({
      userId: user.userId,
      title: 'New Group Resource',
      message: `A mentor uploaded a new document: "${title}"`,
      isRead: false
    }));

    await Notification.bulkCreate(notifications);


    res.status(201).json({
      message: 'Resource uploaded and users notified.',
      resource
    });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Failed to upload resource.' });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const resources = await MentorResource.findAll({ where: { mentorId}});
    res.status(200).json(resources);
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ error: 'Failed to fetch resources.' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { mentorId } = req.body;

    const resource = await MentorResource.findOne({ where: { id: resourceId, mentorId } });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized.' });
    }

    await resource.destroy();

    res.status(200).json({ message: 'Resource deleted successfully.' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: 'Failed to delete resource.' });
  }
};



exports.getAllNotifications = async (req, res) => {
  const userId = req.userId;

  const all = await Notification.findAll({
    where: { userId:userId },
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(all);
};

exports.getUnreadNotifications = async (req, res) => {
  const userId = req.userId;

  const unread = await Notification.findAll({
    where: { userId, isRead: false },
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(unread);
};

exports.markAsRead = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  await Notification.update(
    { isRead: true },
    { where: { id, userId } }
  );

  res.status(200).json({ message: 'Notification marked as read' });
};

