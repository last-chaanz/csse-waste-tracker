const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Assuming you have auth middleware

router.post("/payment", authMiddleware, paymentController.createPayment);
router.get(
  "/payment/user/:userId",
  authMiddleware,
  paymentController.getUserPayments
);
router.get(
  "/payment/pending/:userId",
  authMiddleware,
  paymentController.getPendingPayments
);
router.get("/payment/:id", authMiddleware, paymentController.getPaymentById);

module.exports = router;
