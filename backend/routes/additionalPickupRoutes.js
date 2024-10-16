const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createAdditionalPickup,
  getAdditionalPickups,
  updatePaymentStatus,
  updatePickupStatus,
  addComplaint,
} = require("../controller/additionalPickupController");

const router = express.Router();

router.post("/additional-pickup", authMiddleware, createAdditionalPickup);
router.get("/additional-pickups", authMiddleware, getAdditionalPickups);
router.put("/additional-pickup/:id/pay", authMiddleware, updatePaymentStatus);
router.put(
  "/additional-pickup/:id/complete",
  authMiddleware,
  updatePickupStatus
);
router.post("/additional-pickup/:id/complain", authMiddleware, addComplaint);

module.exports = router;
