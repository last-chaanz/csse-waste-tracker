const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  additionalPickupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdditionalPickup",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Card", "PayPal"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  billingDetails: {
    name: String,
    email: String,
    address: String,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
