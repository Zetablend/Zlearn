
const { User,Mentor, MentorFile,Grouping,Sessions } = require("../../models");




exports.clientProfile = async (req, res) => {
  const { userId,batchId } = req.body;

  try {
    
    const grouping = await Grouping.findOne({ where: { userId } });

    if (!grouping || !grouping.mentorname || !grouping.mentoremail) {
      return res.status(401).json({ message: "No mentor assigned" });
    }
    
    // Update user's batchnumber if exists
    if (grouping.batchnumber&&(batchId === null || batchId === undefined)) {
      await User.update(
        { batchnumber: grouping.batchnumber },
        { where: { id: userId } }
      );
    }

    // Search mentor by name and email
    const mentorProfile = await Mentor.findOne({
      where: {
        full_name: grouping.mentorname,
        email: grouping.mentoremail
      },
      include: [
        {
          model: MentorFile,
          as: 'files', // as per association alias
          required: false
        }
      ]
    });

    if (!mentorProfile) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    // Return user + mentor profile
    res.status(200).json({
      username: grouping.username,
      email: grouping.email,
      batchId: grouping.batchnumber,
      mentorProfile
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.sessionDetails = async (req, res) => {
  const { batchnumber } = req.body;

  try {
    const status = "active";

    const sessiondetails = await Sessions.findAll({
      where: {
        batchnumber,
        session_status: status
      }
    });

    // ✅ Use `.length === 0` for arrays (findAll always returns array)
    if (!sessiondetails || sessiondetails.length === 0) {
      return res.status(404).json({ message: "Session not scheduled" });
    }

    return res.status(200).json({
      sessiondetails
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
