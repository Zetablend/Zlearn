const { PlatformFeedback } = require("../../models");

exports.submitFeedback = async (req, res) => {
  try {
    const { message, submittedBy, pageOrSection } = req.body;

    if (!message || !submittedBy) {
      return res.status(400).json({ message: "Message and submittedBy are required." });
    }

    const newFeedback = await PlatformFeedback.create({
      message,
      submittedBy,
      pageOrSection
    });

    const unreviewedCount = await PlatformFeedback.count({
      where: { status: 'new' }
    });

    // 🔔 Notify admin (real-time)
     const io = req.app.get('socketio');
    io.emit("newFeedback", {
      feedback: newFeedback,
      unreviewedCount
    });

    res.status(201).json({ message: "Feedback submitted", data: newFeedback });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await PlatformFeedback.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Get Feedbacks Error:", error);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const feedback = await PlatformFeedback.findByPk(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    feedback.status = status;
    await feedback.save();

    // ⏱ Update unreviewed count
    const unreviewedCount = await PlatformFeedback.count({
      where: { status: 'new' }
    });

    // 🔔 Notify admin panel to refresh feedback list
    req.io.emit("feedbackStatusUpdated", {
      updatedFeedback: feedback,
      unreviewedCount
    });

    res.status(200).json({ message: "Status updated", data: feedback });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
