//const AWS = require('aws-sdk');
const s3 = require("../config/s3");
const { v4: uuidv4 } = require('uuid');



/**
 * Uploads a base64-encoded file to S3
 * @param {string} base64Data - base64 string (with data URI prefix)
 * @param {string} folder - folder path inside S3 bucket (optional)
 * @returns {string} - public URL of uploaded file
 */
const uploadBase64ToS3 = async (base64Data, folder = 'mentor_resources') => {
  try {
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const mimeType = matches[1].trim(); // e.g., "application/pdf"
    const base64String = matches[2].replace(/\s/g, "");

    const fileBuffer = Buffer.from(base64String, 'base64');
    const fileExtension = mimeType.split('/')[1];
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentEncoding: 'base64',
      ContentType: mimeType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (err) {
    console.error('S3 upload error:', err);
    throw err;
  }
};

module.exports = { uploadBase64ToS3 };
