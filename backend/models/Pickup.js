const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  wasteBin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WasteBin",
    required: true,
  }, // Bin associated with the pickup
  city: {
    type: String,
    required: true,
  }, // City where the bin is located
  wasteType: {
    type: String,
    required: true,
  }, // Type of waste for the pickup
  description: {
    type: String,
    required: true,
  }, // Additional details provided by the user
  requestDate: {
    type: Date,
    default: Date.now,
  }, // When the request was made
  collectionDate: {
    type: Date,
    required: true,
  }, // Preferred collection date by the user
  status: {
    type: String,
    enum: ["Awaiting Payment", "Pending", "Done", "Complaint"],
    default: "Awaiting Payment",
  }, // Tracks the pickup status
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  }, // Payment status
  complaint: {
    type: String,
  }, // For any complaint raised by the user
});

const Pickup = mongoose.model("Pickup", pickupSchema);
module.exports = Pickup;
