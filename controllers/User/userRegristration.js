const bcrypt = require('bcrypt');
const generateToken = require('../../utility/generateToken');
const db = require("../../models");
const User = db.User;
const Userqueryinfo=db.Userqueryinfo;
const { uploadBase64ToS3 } = require('../../utility/s3Uploader');





exports.userRegister = async (req, res) => {
  const { email,firstName,lastName,password,PhoneNumber,profilePicture,userType, username, } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let profilepicture=null
    if (profilePicture) {
    profilepicture = await uploadBase64ToS3(profilePicture, `user`)}

    const user = await User.create({
      firstname:firstName,
      lastname:lastName,
      email,
      password:hashedPassword,
      Phonenumber:PhoneNumber,
      profilepicture:profilepicture,
      usertype:userType,
      username:username,    
    });
    
    const queryuser=await Userqueryinfo.findOne({where:{email}})
    if(queryuser){
      await Userqueryinfo.update(
    {
       
      status: 'registered'      // Mark query as converted
    },
    {
      where: { email }          // Make sure you're updating the correct row
    }
  )
    }
    
    const token = generateToken(user);
  
    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: user.id,
        firstName:user.firstname,
        lastName:user.lastname,
        useremail: user.email,
        profilePicture:user.profilepicture,
        PhoneNumber:user.Phonenumber,
        userType:user.usertype,
        username:user.username,
      },
      token
    });
  } catch (err) {  
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
exports.uploadintodructionVideo=async(req,res)=>{
 try {
    const { base64, userId } = req.body;

    if (!base64 || !userId) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const user=await User.findByPK(userId)
    if(!user){return res.status(400).json({ message: "user not found" });}

   const introductionVideourl = await uploadBase64ToS3(base64, `user`)

   const upload=await User.update({introductionVideourl},{where:{userId}})
   if (upload[0] === 1) {
    res.status(200).json({
      message: "Upload successful",
      introductionVideourl,userId
    });}
    else {
      return res.status(500).json({ message: "Failed to update user record" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};


