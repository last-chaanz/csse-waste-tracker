const mongoose = require("mongoose");

const additionalPickupSchema = new mongoose.Schema({
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
    required: false,
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
    required: false,
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
