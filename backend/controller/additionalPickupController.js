const AdditionalPickup = require("../models/AdditionalPickup");
const WasteBin = require("../models/Bin");

exports.createAdditionalPickup = async (req, res) => {
  try {
    const { binId, wasteType, pickupDate, description } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

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
    res.status(500).json({ message: error.message });
  }
};

exports.getAdditionalPickups = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have authentication middleware
    const pickups = await AdditionalPickup.find({ userId });
    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdditionalPickupsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Ensure the requesting user can only access their own pickups
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const pickups = await AdditionalPickup.find({ userId });
    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.paymentStatus = "Paid";
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await AdditionalPickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.pickupStatus = "Completed";
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (pickup.pickupStatus !== "Pending") {
      return res
        .status(400)
        .json({ message: "Can only complain for pending pickups" });
    }

    pickup.complaint = complaint;
    await pickup.save();

    res.status(200).json(pickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
