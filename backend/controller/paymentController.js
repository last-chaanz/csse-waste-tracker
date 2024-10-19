const Payment = require("../models/Payment");
const AdditionalPickup = require("../models/AdditionalPickup");
const mongoose = require("mongoose");

const paymentController = {
  // Create new payment
  async createPayment(req, res) {
    try {
      const { userId, additionalPickupId, amount, paymentMethod } = req.body;

      // Create a mock transaction ID (in real app, this would come from payment processor)
      const transactionId =
        "TXN" + Date.now() + Math.random().toString(36).substr(2, 6);

      const payment = new Payment({
        userId,
        additionalPickupId,
        amount,
        paymentMethod,
        transactionId,

        paymentStatus: "Completed", // In real app, this would be set based on payment processor response
      });

      await payment.save();

      // Update the additional pickup status
      await AdditionalPickup.findByIdAndUpdate(additionalPickupId, {
        paymentStatus: "Paid",
      });

      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all payments for a user
  async getUserPayments(req, res) {
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const payments = await Payment.find({ userId })
        .populate("additionalPickupId")
        .sort({ paymentDate: -1 });

      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get pending payments for a user
  async getPendingPayments(req, res) {
    try {
      const userId = req.params.userId;

      const pendingPickups = await AdditionalPickup.find({
        userId,
        paymentStatus: "Unpaid",
      });

      res.json(pendingPickups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get payment by ID
  async getPaymentById(req, res) {
    try {
      const payment = await Payment.findById(req.params.id).populate(
        "additionalPickupId"
      );

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paymentController;
