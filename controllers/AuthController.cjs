const User = require('../model/UserModel.cjs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

exports.signup = async (req, res) => {
  try {
    const {fullname, address, email, password} = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already exists!'});
    }

    // Create a new user
    const newUser = new User({fullname, address, email, password});
    await newUser.save();

    res.status(201).json({message: 'User created successfully!'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Error while signing up!'});
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received", req.body);

  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }
// Compare the provided password with the hashed password in the database
    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Password match status:', isMatch);

    // if (!isMatch) {
    //   console.log("Password does not match");
    //   return res.status(400).json({ message: 'Invalid credentials 2' });
    // }
    // if (user.password !== password) {
    //   return res.status(401).json({message: 'Invalid password'});
    // }

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({
            token,
            user:user
          });
  } catch (error) { 
    console.log('error loggin in', error);
    res.status(500).json({message: 'Error loggin In'});
  }
};
// exports.login('/login', async (req, res) => {
//   try {
//     const {email, password} = req.body;

//     const user = await User.findOne({email});
//     if (!user) {
//       return res.status(401).json({message: 'Invalid email'});
//     }
// // Compare the provided password with the hashed password in the database
//     // const isMatch = await bcrypt.compare(password, user.password);
//     // console.log('Password match status:', isMatch);

//     // if (!isMatch) {
//     //   console.log("Password does not match");
//     //   return res.status(400).json({ message: 'Invalid credentials 2' });
//     // }
//     if (user.password !== password) {
//       return res.status(401).json({message: 'Invalid password'});
//     }

//     const secretKey = crypto.randomBytes(32).toString('hex');

//     const token = jwt.sign({userId: user._id}, secretKey);

//     res.status(200).json({
//             token,
//             user
//           });
//   } catch (error) {
//     console.log('error loggin in', error);
//     res.status(500).json({message: 'Error loggin In'});
//   }
// });