const Pickup = require("../models/Pickup");
const WasteBin = require("../models/Bin");

// Schedule an additional pickup
exports.schedulePickup = async (req, res) => {
  const { binId, collectionDate, wasteType, description } = req.body;

  try {
    const bin = await WasteBin.findById(binId);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    const pickup = new Pickup({
      wasteBin: bin._id,
      city: bin.location, // Automatically associate the bin's city
      wasteType,
      description,
      collectionDate,
      status: "Awaiting Payment", // Initially awaiting payment
      paymentStatus: "Unpaid",
    });

    await pickup.save();
    res
      .status(201)
      .json({ message: "Pickup scheduled. Awaiting payment.", pickup });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error scheduling pickup", error: error.message });
  }
};

// After payment success, update the pickup to 'Pending'
exports.updatePaymentStatus = async (req, res) => {
  const { pickupId } = req.body;

  try {
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.paymentStatus = "Paid";
    pickup.status = "Pending"; // After payment, set status to pending
    await pickup.save();

    res.json({ message: "Payment successful. Pickup is now pending.", pickup });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
};

// Get all pickups for the user
exports.getUserPickups = async (req, res) => {
  try {
    const bins = await WasteBin.find({ userId: req.user.userId });
    const binIds = bins.map((bin) => bin._id);

    const pickups = await Pickup.find({ wasteBin: { $in: binIds } }).populate(
      "wasteBin"
    );
    res.json(pickups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pickups", error: error.message });
  }
};

// Garbage collector updates the pickup status to 'Done'
exports.updatePickupStatus = async (req, res) => {
  const { pickupId, status } = req.body;

  try {
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (status === "Done") {
      pickup.status = "Done"; // Mark the pickup as done
    }

    await pickup.save();
    res.json({ message: "Pickup status updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating pickup status", error: error.message });
  }
};

// User raises a complaint for a missed pickup
exports.raiseComplaint = async (req, res) => {
  const { pickupId, complaint } = req.body;

  try {
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.complaint = complaint;
    pickup.status = "Complaint"; // Mark as complaint status
    await pickup.save();

    res.json({ message: "Complaint raised successfully", pickup });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error raising complaint", error: error.message });
  }
};
