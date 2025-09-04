
const bcrypt = require('bcrypt');
const mentorService = require('../../services/mentorservices');
const crypto = require('crypto');
const { uploadBase64ToS3 } = require('../../utility/s3Uploader');
const { LoginDetail, Mentor, } = require('../../models');


exports.createMentor = async (req, res) => {
  try {
        const {full_name,email,profilePicture,password,resume, certificates = [], portfolio = [],...data} = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const logindetails=await LoginDetail.create({email,password:hashedPassword,role:"mentor"},{ transaction: t })
        const hash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
        const key = `mentors/${hash}/profilepicture`;
        let profilepictureUrl=null
        if (profilePicture) {  
          try {
        profilepictureUrl = await uploadBase64ToS3(profilePicture, key);
      } catch (uploadErr) {
        return res.status(500).json({success: false, message: "Profile picture upload failed", error: uploadErr.message });
      }
        }
    let resume_url = null;
    let certificates_urls = null;
    let portfolio_urls = null;

    if (resume) {
      const key = `mentors/${hash}/resume`;
      try {
      resume_url = await uploadBase64ToS3(resume, key);
    }catch (uploadErr) {
        return res.status(500).json({success: false, message: "resume upload failed", error: uploadErr.message });
      }}

      if (certificates.length > 0) {
      const key = `mentors/${hash}/cert`;
      try {
        certificates_urls = await Promise.all(
          certificates.map(base64 => uploadBase64ToS3(base64, key))
        );
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Certificates upload failed",
          error: uploadErr.message
        });
      }
    }

    // Upload Portfolio
    if (portfolio.length > 0) {
      const key = `mentors/${hash}/portfolio`;
      try {
        portfolio_urls = await Promise.all(
          portfolio.map(base64 => uploadBase64ToS3(base64, key))
        );
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Portfolio upload failed",
          error: uploadErr.message
        });
      }
    }
   const logindata = logindetails.get({ plain: true });
    const mentor = await Mentor.create({...data,full_name,resume_url,
      certificates_urls,portfolio_urls,profilepicture:profilepictureUrl,awsid:hash,loginId:logindata.id},{ transaction: t });

    const mentorData = mentor.get({ plain: true });
     await t.commit();
    res.status(201).json({
      success: true,
      message: "Mentor created successfully ",
      data:{...logindata,...mentorData}
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false,
      message: "Something went wrong",
      error: err.message,});
  }
};

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await mentorService.getMentorsWithFiles();
    res.status(201).json({
      success: true,
      message: "Mentor fetched successfully ",
      data:mentors
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMentors=async(req,res)=>{
  try {
    //const mentor = await Mentor.findByPk(req.params.id);
    const mentor = await LoginDetail.findOne({where:{id:req.params.id},include:[{model:Mentor,as:"mentor",required:false}]});

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor fetched successfully",
      data: mentor
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message
    });
  }
}

const deleteFromS3 = async (url) => {
  if (!url) return;
  const key = url.split(".amazonaws.com/")[1];
  if (!key) return;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key

  };

  try {
    await s3.deleteObject(params).promise();
  } catch (err) {
    console.warn("S3 delete failed:", err.message);
  }
};
exports.deleteMentor = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Find mentor by loginId
    const mentor = await Mentor.findOne({ where: { loginId: id }, transaction: t });
    if (!mentor) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Soft delete mentor
    await mentor.destroy({ transaction: t });

    // Soft delete associated login
    await LoginDetail.destroy({ where: { id }, transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Mentor and login deleted successfully (soft deleted)",
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};


exports.updateMentors = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { mentorId, password, profilepicture, resume, certificates, portfolio, ...rest } = req.body;
    if (!mentorId) return res.status(400).json({ message: "mentorId (loginId) is required" });

    // Find mentor by loginId
    const mentor = await Mentor.findOne({ where: { loginId: mentorId }, transaction: t });
    if (!mentor) {
      await t.rollback();
      return res.status(404).json({ message: "Mentor not found" });
    }

    const logindetails = await LoginDetail.findByPk(mentorId, { transaction: t });
    const updateData = {};
    const modelFields = Object.keys(Mentor.rawAttributes);

    // 1) Password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await logindetails.update({ password: hashedPassword }, { transaction: t });
    }

    // 2) Primitive fields
    for (const key of Object.keys(rest)) {
      if (modelFields.includes(key)) {
        updateData[key] = rest[key];
      }
    }

    // 3) Profile picture
    if (req.body.hasOwnProperty("profilepicture")) {
      if (profilepicture === null) {
        if (mentor.profilepicture) await deleteFromS3(mentor.profilepicture);
        updateData.profilepicture = null;
      } else if (profilepicture?.data || typeof profilepicture === "string") {
        const key = `mentors/${mentor.awsid}/profilepicture`;
        const newUrl = await uploadBase64ToS3(profilepicture, key);
        if (mentor.profilepicture) await deleteFromS3(mentor.profilepicture);
        updateData.profilepicture = newUrl;
      }
    }

    // 4) Resume
    if (req.body.hasOwnProperty("resume")) {
      if (resume === null) {
        if (mentor.resume_url) await deleteFromS3(mentor.resume_url);
        updateData.resume_url = null;
      } else if (resume?.data || typeof resume === "string") {
        const key = `mentors/${mentor.awsid}/resume`;
        const newUrl = await uploadBase64ToS3(resume, key);
        if (mentor.resume_url) await deleteFromS3(mentor.resume_url);
        updateData.resume_url = newUrl;
      }
    }

    // 5) Certificates
    if (req.body.hasOwnProperty("certificates")) {
      if (Array.isArray(certificates)) {
        if (mentor.certificates_urls?.length) {
          for (const url of mentor.certificates_urls) await deleteFromS3(url);
        }
        updateData.certificates_urls = certificates.length
          ? await Promise.all(certificates.map(b64 => uploadBase64ToS3(b64, `mentors/${mentor.awsid}/cert`)))
          : [];
      } else if (certificates === null) {
        if (mentor.certificates_urls?.length) {
          for (const url of mentor.certificates_urls) await deleteFromS3(url);
        }
        updateData.certificates_urls = [];
      }
    }

    // 6) Portfolio
    if (req.body.hasOwnProperty("portfolio")) {
      if (Array.isArray(portfolio)) {
        if (mentor.portfolio_urls?.length) {
          for (const url of mentor.portfolio_urls) await deleteFromS3(url);
        }
        updateData.portfolio_urls = portfolio.length
          ? await Promise.all(portfolio.map(b64 => uploadBase64ToS3(b64, `mentors/${mentor.awsid}/portfolio`)))
          : [];
      } else if (portfolio === null) {
        if (mentor.portfolio_urls?.length) {
          for (const url of mentor.portfolio_urls) await deleteFromS3(url);
        }
        updateData.portfolio_urls = [];
      }
    }

    // Update mentor
    await mentor.update(updateData, { transaction: t });

    await t.commit();

    // Fetch updated mentor + login details
    const updated = await Mentor.findOne({
      where: { id: mentor.id },
      include: [LoginDetail],
    });

    res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      data: updated.get({ plain: true }),
    });

  } catch (err) {
    await t.rollback();
    console.error("Mentor update error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};
