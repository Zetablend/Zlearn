
const { PlatformHelpArticle } = require("../../models");

const { uploadBase64ToS3 } = require('../../utility/s3Uploader');

exports.uploadHelpArticle = async (req, res) => {
  try {
    const { title, type, uploadedBy,file } = req.body;
    

    if (!file) return res.status(400).json({ message: "File is required" });

   const fileUrl = await uploadBase64ToS3(file, `admin_${uploadedBy}`)

    const newDoc = await PlatformHelpArticle.create({
      title,
      type,
      uploadedBy,
      fileUrl
    });

    return res.status(201).json(newDoc);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllHelpArticles = async (req, res) => {
  try {
    const articles = await PlatformHelpArticle.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.json(articles);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching articles" });
  }
};
