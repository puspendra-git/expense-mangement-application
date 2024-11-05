const userModel = require("../models/userModels");

// Login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (!user) {
      return res.status(404).send("User Not Found");
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// Register Callback
const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { loginController, registerController };
