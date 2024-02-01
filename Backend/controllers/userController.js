const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// register user function
const registerUser = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("please fill all the details");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      username,
      email,
      password,
      profilePic,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("something went wrong");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// authentication user function for login

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// serching all users from app
const allusers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allusers };
