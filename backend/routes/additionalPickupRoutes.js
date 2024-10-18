const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createAdditionalPickup,
  getAdditionalPickups,
  getAdditionalPickupsByUserId,
  updatePaymentStatus,
  updatePickupStatus,
  addComplaint,
  acceptAdditionalPickup,
  completePickup,
} = require("../controller/additionalPickupController");

const router = express.Router();

router.post("/additional-pickup", authMiddleware, createAdditionalPickup);
router.get("/additional-pickups", authMiddleware, getAdditionalPickups);
router.get(
  "/additional-pickups/:userId",
  authMiddleware,
  getAdditionalPickupsByUserId
);
router.put("/additional-pickup/:id/pay", authMiddleware, updatePaymentStatus);
// router.put(
//   "/additional-pickup/:id/complete",
//   authMiddleware,
//   updatePickupStatus
// );
router.post("/additional-pickup/:id/complain", authMiddleware, addComplaint);
router.put(
  "/additional-pickup/:id/accept",
  authMiddleware,
  acceptAdditionalPickup
);
router.put("/additional-pickup/:id/complete", authMiddleware, completePickup);

module.exports = router;
