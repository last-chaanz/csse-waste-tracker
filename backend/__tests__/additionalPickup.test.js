const Joi = require("joi");
const mongoose = require("mongoose");
const additionalPickupValidation = require("../validations/additionalPickupValidation");

describe("additionalPickupValidation Schema", () => {
  describe("createAdditionalPickup", () => {
    it("should pass when all fields are valid", () => {
      const validData = {
        binId: new mongoose.Types.ObjectId().toString(),
        wasteType: "Food",
        pickupDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // Future date
        description: "This is valid",
      };
      const { error } =
        additionalPickupValidation.createAdditionalPickup.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should fail when binId is invalid", () => {
      const invalidData = {
        binId: "invalid-id",
        wasteType: "Food",
        pickupDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        description: "Invalid binId",
      };
      const { error } =
        additionalPickupValidation.createAdditionalPickup.validate(invalidData);
      expect(error.details[0].message).toBe("Invalid bin ID format");
    });

    it("should fail when wasteType is invalid", () => {
      const invalidData = {
        binId: new mongoose.Types.ObjectId().toString(),
        wasteType: "InvalidWaste",
        pickupDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      };
      const { error } =
        additionalPickupValidation.createAdditionalPickup.validate(invalidData);
      expect(error.details[0].message).toBe(
        '"wasteType" must be one of [Food, Non Recyclable Waste, Recyclable Waste]'
      );
    });

    it("should fail when pickupDate is in the past", () => {
      const invalidData = {
        binId: new mongoose.Types.ObjectId().toString(),
        wasteType: "Food",
        pickupDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      };
      const { error } =
        additionalPickupValidation.createAdditionalPickup.validate(invalidData);
      expect(error.details[0].message).toBe(
        "Pickup date must be in the future"
      );
    });
  });

  describe("updatePaymentStatus", () => {
    it("should pass with a valid ID", () => {
      const validData = { id: new mongoose.Types.ObjectId().toString() };
      const { error } =
        additionalPickupValidation.updatePaymentStatus.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should fail when ID is invalid", () => {
      const invalidData = { id: "invalid-id" };
      const { error } =
        additionalPickupValidation.updatePaymentStatus.validate(invalidData);
      expect(error.details[0].message).toBe("Invalid pickup ID format");
    });
  });

  describe("updatePickupStatus", () => {
    it("should pass with a valid ID", () => {
      const validData = { id: new mongoose.Types.ObjectId().toString() };
      const { error } =
        additionalPickupValidation.updatePickupStatus.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should fail when ID is invalid", () => {
      const invalidData = { id: "invalid-id" };
      const { error } =
        additionalPickupValidation.updatePickupStatus.validate(invalidData);
      expect(error.details[0].message).toBe("Invalid pickup ID format");
    });
  });

  describe("addComplaint", () => {
    it("should pass with valid data", () => {
      const validData = {
        id: new mongoose.Types.ObjectId().toString(),
        complaint: "This is a valid complaint with sufficient length.",
      };
      const { error } =
        additionalPickupValidation.addComplaint.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should fail when complaint is too short", () => {
      const invalidData = {
        id: new mongoose.Types.ObjectId().toString(),
        complaint: "Short",
      };
      const { error } =
        additionalPickupValidation.addComplaint.validate(invalidData);
      expect(error.details[0].message).toBe(
        "Complaint must be at least 10 characters long"
      );
    });
  });

  describe("getAdditionalPickupsByUserId", () => {
    it("should pass with a valid userId", () => {
      const validData = { userId: new mongoose.Types.ObjectId().toString() };
      const { error } =
        additionalPickupValidation.getAdditionalPickupsByUserId.validate(
          validData
        );
      expect(error).toBeUndefined();
    });

    it("should fail when userId is invalid", () => {
      const invalidData = { userId: "invalid-id" };
      const { error } =
        additionalPickupValidation.getAdditionalPickupsByUserId.validate(
          invalidData
        );
      expect(error.details[0].message).toBe("Invalid user ID format");
    });
  });
});
