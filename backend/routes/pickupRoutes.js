const express = require("express");
const {
  schedulePickup,
  updatePaymentStatus,
  getUserPickups,
  updatePickupStatus,
  raiseComplaint,
} = require("../controller/pickupController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to schedule a pickup for a waste bin
router.post("/schedule-pickup", authMiddleware, schedulePickup);

// Route to update payment status after successful payment
router.post("/payment-success", authMiddleware, updatePaymentStatus);

// Route to get all pickups for the authenticated user
router.get("/user-pickups", authMiddleware, getUserPickups);

// Route for garbage collectors to update the pickup status
router.post("/update-pickup-status", authMiddleware, updatePickupStatus);

// Route for users to raise a complaint for a missed pickup
router.post("/raise-complaint", authMiddleware, raiseComplaint);

module.exports = router;
