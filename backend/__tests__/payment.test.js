const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const AdditionalPickup = require("../models/AdditionalPickup");
const paymentController = require("../controllers/paymentController");

// Mock the models
jest.mock("../models/Payment");
jest.mock("../models/AdditionalPickup");

describe("Payment Controller", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response
    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createPayment", () => {
    const mockPaymentData = {
      userId: "507f1f77bcf86cd799439011",
      additionalPickupId: "507f1f77bcf86cd799439012",
      amount: 50,
      paymentMethod: "Card",
    };

    it("should create a new payment successfully", async () => {
      // Setup
      const mockSavedPayment = {
        ...mockPaymentData,
        _id: "507f1f77bcf86cd799439013",
      };
      Payment.prototype.save.mockResolvedValue(mockSavedPayment);
      AdditionalPickup.findByIdAndUpdate.mockResolvedValue({});

      mockRequest.body = mockPaymentData;

      // Execute
      await paymentController.createPayment(mockRequest, mockResponse);

      // Assert
      expect(Payment.prototype.save).toHaveBeenCalled();
      expect(AdditionalPickup.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPaymentData.additionalPickupId,
        { paymentStatus: "Paid" }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSavedPayment);
    });

    it("should handle errors during payment creation", async () => {
      // Setup
      const errorMessage = "Database error";
      Payment.prototype.save.mockRejectedValue(new Error(errorMessage));
      mockRequest.body = mockPaymentData;

      // Execute
      await paymentController.createPayment(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("getUserPayments", () => {
    const mockUserId = "507f1f77bcf86cd799439011";

    it("should get all payments for a valid user", async () => {
      // Setup
      const mockPayments = [
        { _id: "1", amount: 50 },
        { _id: "2", amount: 75 },
      ];
      Payment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockPayments),
        }),
      });

      mockRequest.params.userId = mockUserId;

      // Execute
      await paymentController.getUserPayments(mockRequest, mockResponse);

      // Assert
      expect(Payment.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(mockResponse.json).toHaveBeenCalledWith(mockPayments);
    });

    it("should handle invalid user ID format", async () => {
      // Setup
      mockRequest.params.userId = "invalid-id";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

      // Execute
      await paymentController.getUserPayments(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid user ID format",
      });
    });
  });

  describe("getPendingPayments", () => {
    const mockUserId = "507f1f77bcf86cd799439011";

    it("should get pending payments for a user", async () => {
      // Setup
      const mockPendingPickups = [
        { _id: "1", status: "Unpaid" },
        { _id: "2", status: "Unpaid" },
      ];
      AdditionalPickup.find.mockResolvedValue(mockPendingPickups);
      mockRequest.params.userId = mockUserId;

      // Execute
      await paymentController.getPendingPayments(mockRequest, mockResponse);

      // Assert
      expect(AdditionalPickup.find).toHaveBeenCalledWith({
        userId: mockUserId,
        paymentStatus: "Unpaid",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockPendingPickups);
    });

    it("should handle errors when fetching pending payments", async () => {
      // Setup
      const errorMessage = "Database error";
      AdditionalPickup.find.mockRejectedValue(new Error(errorMessage));
      mockRequest.params.userId = mockUserId;

      // Execute
      await paymentController.getPendingPayments(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("getPaymentById", () => {
    const mockPaymentId = "507f1f77bcf86cd799439011";

    it("should get payment by ID successfully", async () => {
      // Setup
      const mockPayment = { _id: mockPaymentId, amount: 50 };
      Payment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPayment),
      });
      mockRequest.params.id = mockPaymentId;

      // Execute
      await paymentController.getPaymentById(mockRequest, mockResponse);

      // Assert
      expect(Payment.findById).toHaveBeenCalledWith(mockPaymentId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPayment);
    });

    it("should handle payment not found", async () => {
      // Setup
      Payment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      mockRequest.params.id = mockPaymentId;

      // Execute
      await paymentController.getPaymentById(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Payment not found",
      });
    });
  });
});
