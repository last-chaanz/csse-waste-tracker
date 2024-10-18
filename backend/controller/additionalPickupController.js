const AdditionalPickup = require("../models/AdditionalPickup");
const WasteBin = require("../models/Bin");
const additionalPickupValidation = require("../validations/additionalPickupValidation");

exports.createAdditionalPickup = async (req, res) => {
  try {
    const { error } =
      additionalPickupValidation.createAdditionalPickup.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { binId, wasteType, pickupDate, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const bin = await WasteBin.findById(binId);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    const newPickup = new AdditionalPickup({
      userId,
      binId,
      location: bin.location,
      wasteType,
      pickupDate,
      description,
    });

    await newPickup.save();

    res.status(201).json(newPickup);
  } catch (error) {
    console.error("Error in createAdditionalPickup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAdditionalPickups = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    if (user.role !== "collector") {
      return res
        .status(403)
        .json({ message: "Forbidden: Access restricted to collectors" });
    }

    const pickups = await AdditionalPickup.find({ location: user.location });
    res.status(200).json(pickups);
  } catch (error) {
    console.error("Error in getAdditionalPickups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAdditionalPickupsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const pickups = await AdditionalPickup.find({ userId });
    res.status(200).json(pickups);
  } catch (error) {
    console.error("Error in getAdditionalPickupsByUserId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { error } = additionalPickupValidation.updatePaymentStatus.validate(
      req.params
    );
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (pickup.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    pickup.paymentStatus = "Paid";
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePickupStatus = async (req, res) => {
  try {
    const { error } = additionalPickupValidation.updatePickupStatus.validate(
      req.params
    );
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (pickup.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    pickup.pickupStatus = "Completed";
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    console.error("Error in updatePickupStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { complaint } = req.body;

    const { error } = additionalPickupValidation.addComplaint.validate({
      id,
      complaint,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (pickup.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (pickup.pickupStatus !== "Pending") {
      return res
        .status(400)
        .json({ message: "Can only complain for pending pickups" });
    }

    pickup.complaint = complaint;
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    console.error("Error in addComplaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.acceptAdditionalPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.collectorAccepted = true;
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    console.error("Error in acceptAdditionalPickup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.completePickup = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (!pickup.collectorAccepted) {
      return res
        .status(400)
        .json({ message: "Pickup must be accepted before completion" });
    }

    pickup.pickupStatus = "Completed";
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    console.error("Error in completePickup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
