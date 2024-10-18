const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendEmail } = require("../util/email");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

// User Registration Route
router.post(
  "/register",
  // [
  //   body("name").notEmpty().withMessage("Name is required"),
  //   body("email").isEmail().withMessage("Invalid email"),
  //   body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  //   body("address").notEmpty().withMessage("Address is required"),
  //   body("role").notEmpty().withMessage("Role is required"),
  //   body("userType")
  //     .if(body("role").equals("user"))
  //     .notEmpty()
  //     .withMessage("User type is required for user role"),
  // ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role, userType } = req.body;
    // console.log('✌️name --->', name);

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      user = new User({
        name,
        email,
        password,
        address,
        role,
        userType,
        isVerified: true,
      });
      await user.save();

      res.status(201).json({ msg: "Registered successfully" });
    } catch (err) {
      console.log("✌️err --->", err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// User Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      const token = jwt.sign(
        { userId: user._id, role: user.role, location: user.address },
        JWT_SECRET,
        { expiresIn: "10d" }
      );
      res.status(200).json({
        token,
        role: user.role,
        userType: user.userType,
        address: user.address,
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Email Verification Route
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ msg: "User already verified" });

    user.isVerified = true;
    await user.save();
    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
});

// User Dashboard Route
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin Route to Get All Users
router.get("/admin/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied, admin only" });
  }

  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin Route to Update User
router.put("/admin/users/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied, admin only" });
  }

  const { name, email, address, role, userType } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.address = address || user.address;

    await user.save();
    res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin Route to Delete User
router.delete("/admin/users/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied, admin only" });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// User Update Profile Route
router.put("/user", authMiddleware, async (req, res) => {
  const { name, email, address } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.address = address || user.address;
    console.log("✌️user --->", user);

    await user.save();
    res.status(200).json({ msg: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// User Delete Account Route
router.delete("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update a garbage collector
router.put("/:id", async (req, res) => {
  try {
    const { name, address } = req.body;
    const { id } = req.params;

    let collector = await User.findById(id);
    if (!collector) {
      return res.status(404).json({ msg: "Collector not found" });
    }

    // Update the fields if they are provided in the request
    collector.name = name || collector.name;
    collector.address = address || collector.address;

    await collector.save();
    res.status(200).json({ msg: "Collector updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete a garbage collector
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collector = await User.findByIdAndDelete(id);

    if (!collector) {
      return res.status(404).json({ msg: "Collector not found" });
    }
    res.status(200).json({ msg: "Collector deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Get all garbage collectors with role 'collector'
router.get("/collectors", async (req, res) => {
  try {
    // Find users where role is 'collector', exclude passwords from results
    const collectors = await User.find({ role: "collector" }).select(
      "-password"
    );

    // Respond with the list of collectors
    res.status(200).json(collectors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/userAddress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user from the database
    const user = await User.findById(userId).select("address");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's address
    res.status(200).json({ address: user.address });
  } catch (error) {
    console.error("Error in fetching user:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
