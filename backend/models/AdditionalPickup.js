const mongoose = require("mongoose");

const additionalPickupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  binId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WasteBin",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  wasteType: {
    type: String,
    enum: ["Food", "Non Recyclable Waste", "Recyclable Waste"],
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpaid",
  },
  pickupStatus: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  complaint: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdditionalPickup = mongoose.model(
  "AdditionalPickup",
  additionalPickupSchema
);

module.exports = AdditionalPickup;
