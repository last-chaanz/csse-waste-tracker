const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create a schema for User
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true, // Remove leading/trailing spaces
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    index: true, // Create an index for better performance
    match: [/.+@.+\..+/, "Please enter a valid email address"],
    trim: true, // Remove leading/trailing spaces
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true, // Remove leading/trailing spaces
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "user", "collector"],
    default: "user",
    required: true,
  },
  userType: {
    type: String,
    enum: ["residence", "business", "collector"],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
