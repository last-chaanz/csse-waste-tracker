const AdditionalPickup = require("../models/AdditionalPickup");
const WasteBin = require("../models/Bin");

exports.createAdditionalPickup = async (req, res) => {
  try {
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

    if (new Date(pickupDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Pickup date cannot be in the past" });
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
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    }
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

    const pickups = await AdditionalPickup.find();
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
