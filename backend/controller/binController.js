const WasteBin = require("../models/Bin");
const mongoose = require("mongoose");

// Create a new waste bin
const createWasteBin = async (req, res) => {
  try {
    const {
      location,
      binType,
      image,
      waste_level,
      status,
      userId,
      collectionDay,
      collectionStatus,
    } = req.body;

    // Check for missing required fields
    if (!location || !binType || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new WasteBin instance
    const wasteBin = new WasteBin({
      location,
      binType,
      image,
      waste_level,
      status,
      userId,
      collectionDay,
      collectionStatus,
    });

    // Save the new bin to the database
    const savedWasteBin = await wasteBin.save();

    // Trigger the simulation function after bin is created
    simulateIoTData(savedWasteBin._id); // Pass the newly created bin's ID to start simulation

    // Send a success response with the saved waste bin
    res.status(201).json({
      message: "Waste bin created and simulation started",
      wasteBin: savedWasteBin,
    });
  } catch (error) {
    console.error("Error creating waste bin:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWasteBin };

const getWasteBinsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const wasteBins = await WasteBin.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (wasteBins.length === 0) {
      return res
        .status(404)
        .json({ message: "No waste bins found for this user." });
    }

    res.json(wasteBins);
  } catch (error) {
    console.error("Error fetching waste bins:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single waste bin by ID
const getWasteBinById = async (req, res) => {
  try {
    const wasteBin = await WasteBin.findById(req.params.id);
    if (!wasteBin)
      return res.status(404).json({ message: "Waste bin not found" });
    res.json(wasteBin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllWasteBins = async (req, res) => {
  try {
    const wasteBins = await WasteBin.find();
    res.status(200).json(wasteBins);
  } catch (error) {
    console.error("Error fetching waste bins:", error);
    res.status(500).json({ message: "Error fetching waste bins." });
  }
};

// Update waste bin details
const updateWasteBin = async (req, res) => {
  try {
    const { location, binType } = req.body;

    const wasteBin = await WasteBin.findByIdAndUpdate(
      req.params.id,
      { location, binType },
      { new: true } // Return the updated document
    );

    if (!wasteBin)
      return res.status(404).json({ message: "Waste bin not found" });

    res.json(wasteBin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a waste bin
const deleteWasteBin = async (req, res) => {
  try {
    const wasteBin = await WasteBin.findByIdAndDelete(req.params.binId);
    if (!wasteBin)
      return res.status(404).json({ message: "Waste bin not found" });
    res.json({ message: "Waste bin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const binSimulations = {};

// Simulate IoT Data: Waste Levels Update
const simulateIoTData = async (binId) => {
  try {
    // Check if there is an existing simulation for this bin
    if (binSimulations[binId]) {
      console.log(`Simulation already running for Bin ${binId}.`);
      return; // Exit if a simulation is already running
    }

    // Find the bin by ID
    const bin = await WasteBin.findById(binId);

    if (!bin) {
      console.log(`Bin with ID ${binId} not found.`);
      return;
    }

    // If waste_level is 0, start the simulation
    if (bin.waste_level === 0) {
      console.log(`Starting simulation for Bin ${binId}`);

      // Store the interval reference in the binSimulations object
      binSimulations[binId] = setInterval(async () => {
        let newLevel = Math.min(bin.waste_level + Math.random() * 20, 100); // Increase by 0-20%, max 100%

        // Update bin with new waste level and status
        const updatedBin = await WasteBin.findByIdAndUpdate(
          binId,
          {
            waste_level: newLevel,
            status:
              newLevel >= 90 ? "Full" : newLevel >= 30 ? "Partial" : "Empty",
            last_updated: Date.now(),
          },
          { new: true }
        );

        // If bin is full (100%), stop the simulation
        if (newLevel >= 100) {
          console.log(`Bin ${binId} is full. Stopping simulation.`);
          clearInterval(binSimulations[binId]); // Stop this bin's simulation
          delete binSimulations[binId]; // Remove the reference
        }

        // If the bin waste level is manually reset to 0, restart the simulation
        if (updatedBin.waste_level === 0) {
          console.log(`Bin ${binId} emptied. Restarting simulation.`);
          clearInterval(binSimulations[binId]); // Stop current simulation
          delete binSimulations[binId];
          simulateIoTData(binId); // Restart the simulation after reset
        }
      }, 5000); // Simulate data every 5 seconds
    }
  } catch (err) {
    console.error("Error in simulateIoTData:", err);
  }
};

// Controller to get waste bin details by location
const getWasteBinByLocation = async (req, res) => {
  try {
    const { location } = req.params; // Extract the location from the request parameters

    // Find waste bins that match the provided location
    const wasteBins = await WasteBin.find({ location: location });

    if (wasteBins.length === 0) {
      return res
        .status(404)
        .json({ message: "No waste bins found for this location" });
    }

    // Return the waste bin details
    res.status(200).json({ wasteBins });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCollectionDay = async (req, res) => {
  const { binId } = req.params; // Extract binId from the request params
  const { collectionDay } = req.body; // Extract the new collection day from the request body

  try {
    // Find the bin by ID and update the collection day
    const updatedBin = await WasteBin.findByIdAndUpdate(
      binId,
      { collectionDay, last_updated: Date.now() }, // Update collectionDay and last_updated fields
      { new: true } // Option to return the updated document
    );

    if (!updatedBin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    return res.status(200).json({
      message: "Collection day updated successfully",
      bin: updatedBin,
    });
  } catch (error) {
    console.error("Error updating collection day:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetWasteLevel = async (req, res) => {
  const { binId } = req.params; // Assuming binId is passed as a URL parameter

  try {
    // Find the bin by ID and update its waste level to 0
    const updatedBin = await WasteBin.findByIdAndUpdate(
      binId,
      { waste_level: 0, status: "Empty", last_updated: Date.now() },
      { new: true }
    );

    if (!updatedBin) {
      return res.status(404).json({ message: "Waste bin not found" });
    }

    console.log(`Waste level for Bin ${binId} reset to 0.`);

    // Trigger the simulation function for this bin
    simulateIoTData(binId);

    res.status(200).json({
      message: "Waste level reset to 0 and simulation restarted",
      wasteBin: updatedBin,
    });
  } catch (error) {
    console.error("Error resetting waste level:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWasteBin,
  getWasteBinsByUser,
  getWasteBinById,
  getAllWasteBins,
  updateWasteBin,
  deleteWasteBin,
  simulateIoTData,
  getWasteBinByLocation,
  updateCollectionDay,
  resetWasteLevel,
};
