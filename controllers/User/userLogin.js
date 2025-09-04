const bcrypt = require('bcrypt');
const generateToken = require('../../utility/generateToken');

const { LoginDetail, Mentor,User } = require('../../models');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await LoginDetail.findOne({ where: { email } });

    if (!user) {

      return res.status(401).json({ message: "Invalid email " });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      
      return res.status(401).json({ message: "Invalid password" });
    }

   
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      
      role:user.role,
      email: user.email, 
      token:token
    });

  } catch (err) {

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { user_id,currentpassword,Newpassword,confirmpassword } = req.body;

  try {
    const id=user_id
    const user = await User.findByPk(id);

    const isPasswordValid = await bcrypt.compare(currentpassword, user.password);

    if (!isPasswordValid) {  
      return res.status(401).json({ message: "Invalid  current password" });
    }
   if(Newpassword!==confirmpassword){
      return res.status(400).json({ message: "New password and confirm password must match" });
   }

   const isSameAsOld = await bcrypt.compare(Newpassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

   const hashedPassword = await bcrypt.hash(Newpassword, 10);

    await user.update({ password:hashedPassword });

    res.status(200).json({
      message: "password successfully changed",
      username:user.username,
      email: user.email, 
    });

  } catch (err) {

    res.status(500).json({ message: "Server error", error: err.message });
  }
};