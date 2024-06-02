const User = require('../model/UserModel.cjs');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { fullname, address, email, password } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create a new user
    const newUser = new User({
      fullname,
      address,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server problem' });
  }
};
