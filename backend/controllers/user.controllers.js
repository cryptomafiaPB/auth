import User from "../model/User.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  // 1. Get DATA
  const { name, email, password } = req.body;

  // 2. Validate
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Invalid data" }); // 400 means invalid data
  }

  try {
    // 3.  Check if user exist in DB with same Email
    const existingUser = await User.findOne({ email });

    // 4. 1. If not, then Create a new User in DB
    if (existingUser) {
      return res.status(400).json("Email is alredy registered.");
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    // 5. generate a new verification token using 'crypto'
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;

    // 6. save varification token on DB
    await user.save(); // Always await when interating with DB

    // 8. send email with verification link
    await sendEmail(email, name, token, "register");

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: user,
      dev: { verificationToken: token }, // In Development
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  return res.status(200).json({ message: "Email verified succesfully", user });
};

const loginUser = async (req, res) => {
  // 1. Get data
  const { email, password } = req.body;

  // 2. Validate
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid email and password" });
  }

  try {
    // 3. Check if email exist in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 4. Check if password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 5. Create a JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 6. Send 200OK responce with jwt cookies
    const cookieOptions = {
      httpOnly: true,
      secure: false, // in Production set to true
      sameSite: "lax", // helps with CSRF and cross-site sending
      maxAge: 24 * 60 * 60 * 1000,
    };
    return res.cookie("id", token, cookieOptions).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error: ", error);
  }
};

const getProfile = async (req, res) => {
  // 1. get data
  const id = req.user.id;
  console.log("/profile  id:", id);

  // 2. validate
  if (!id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // 3. get User by id
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 4. return 200OK with user
    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
const logoutUser = async (req, res) => {
  res
    .cookie("id", "", {
      expires: new Date(0),
    })
    .json({ success: true, message: "Logout successfully" });
};

const forgotPassword = async (req, res) => {
  // 1. get Email
  const { email } = req.body;
  // 2.  Validate
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email" });
  }

  try {
    // get User based on Email
    const user = await User.findOne({ email });

    // 3. Generate token using crypto
    const token = crypto.randomBytes(32).toString("hex");

    // 4. resetToken + resetExpiry => DB
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 5. Send Email
    await sendEmail(email, "Reset Password", token, "resetPassword");

    // 6. return 200OK
    return res.status(200).json({
      success: true,
      message: `If user exist with this email then Verification Email send successfully on ${email}`,
      dev: { resetPasswordToken: token }, // Only in Development
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: `Error sending forgot password email`,
    });
  }
};

const resetPassword = async (req, res) => {
  // 1. get token and new password
  const { token } = req.params;
  const { password } = await req.body;

  // 2. Validate

  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  // check if resetPasswordToken Exist to we can know user has requested for resetPassword
  const isResetTokenExist = await User.exists({ resetPasswordToken: token });

  if (!isResetTokenExist) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }

  // 3. Find User with token and expiry time
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  // 4. change password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  // return 200OK

  return res.status(200).json({
    success: true,
    message: "Password change successfully",
  });
};

export {
  registerUser,
  verifyUser,
  loginUser,
  getProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
};
