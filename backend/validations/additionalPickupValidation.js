const Joi = require("joi");
const mongoose = require("mongoose");

const additionalPickupValidation = {
  createAdditionalPickup: Joi.object({
    binId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.invalid": "Invalid bin ID format",
        "any.required": "Bin ID is required",
      }),
    wasteType: Joi.string()
      .valid("Food", "Non Recyclable Waste", "Recyclable Waste")
      .required(),
    pickupDate: Joi.date().greater("now").iso().required().messages({
      "date.greater": "Pickup date must be in the future",
      "date.format": "Pickup date must be in ISO 8601 format",
    }),
    description: Joi.string().max(500).allow("").optional(),
  }),

  updatePaymentStatus: Joi.object({
    id: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.invalid": "Invalid pickup ID format",
        "any.required": "Pickup ID is required",
      }),
  }),

  updatePickupStatus: Joi.object({
    id: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.invalid": "Invalid pickup ID format",
        "any.required": "Pickup ID is required",
      }),
  }),

  addComplaint: Joi.object({
    id: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.invalid": "Invalid pickup ID format",
        "any.required": "Pickup ID is required",
      }),
    complaint: Joi.string().min(10).max(1000).required().messages({
      "string.min": "Complaint must be at least 10 characters long",
      "string.max": "Complaint must not exceed 1000 characters",
      "any.required": "Complaint is required",
    }),
  }),

  getAdditionalPickupsByUserId: Joi.object({
    userId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.invalid": "Invalid user ID format",
        "any.required": "User ID is required",
      }),
  }),
};

module.exports = additionalPickupValidation;
