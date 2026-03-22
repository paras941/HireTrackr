const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = signToken(user._id.toString());

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, headline: user.headline },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id.toString());
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        targetRoles: user.targetRoles,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, headline, targetRoles } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, headline, targetRoles: targetRoles || [] },
      { new: true }
    ).select("-password");
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, me, updateProfile };
