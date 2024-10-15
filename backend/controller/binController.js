const WasteBin = require('../models/Bin');
const mongoose = require("mongoose");

// Create a new waste bin
const createWasteBin = async (req, res) => {
  try {
      const { location, binType, image, waste_level, status, userId } = req.body;

      if (!location || !binType || !userId) {
          return res.status(400).json({ message: 'Missing required fields' });
      }

      const wasteBin = new WasteBin({
          location,
          binType,
          image,
          waste_level,
          status,
          userId,
      });

      await wasteBin.save();
      res.status(201).json(wasteBin);
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(400).json({ message: error.message });
  }
};
  

  const getWasteBinsByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const wasteBins = await WasteBin.find({ userId: new mongoose.Types.ObjectId(userId) });
  
      if (wasteBins.length === 0) {
        return res.status(404).json({ message: 'No waste bins found for this user.' });
      }
      
      res.json(wasteBins);
    } catch (error) {
      console.error('Error fetching waste bins:', error);
      res.status(500).json({ message: error.message });
    }
  };

// Get a single waste bin by ID
const getWasteBinById = async (req, res) => {
  try {
    const wasteBin = await WasteBin.findById(req.params.id);
    if (!wasteBin) return res.status(404).json({ message: 'Waste bin not found' });
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
    console.error('Error fetching waste bins:', error);
    res.status(500).json({ message: 'Error fetching waste bins.' });
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

    if (!wasteBin) return res.status(404).json({ message: 'Waste bin not found' });

    res.json(wasteBin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a waste bin
const deleteWasteBin = async (req, res) => {
  try {
    const wasteBin = await WasteBin.findByIdAndDelete(req.params.binId);
    if (!wasteBin) return res.status(404).json({ message: 'Waste bin not found' });
    res.json({ message: 'Waste bin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simulate IoT Data: Waste Levels Update
async function simulateIoTData() {
    try {
      // Find all bins and update waste levels randomly
      const bins = await WasteBin.find(); // Use await for Promises
  
      // Loop through each bin and update its waste level
      for (const bin of bins) {
        let newLevel = Math.min(bin.waste_level + Math.random() * 20, 100); // increase by 0-20%, max 100%
        let status = newLevel >= 90 ? 'Full' : newLevel >= 30 ? 'Partial' : 'Empty';
  
        // Update bin with new waste level and status
        await WasteBin.findByIdAndUpdate(bin._id, { 
          waste_level: newLevel, 
          status, 
          last_updated: Date.now() 
        });
        
        console.log(`Bin ${bin.binId} updated: ${newLevel}% (${status})`);
      }
    } catch (err) {
      console.error('Error in simulateIoTData:', err);
    }
  }

  module.exports = {createWasteBin, getWasteBinsByUser, getWasteBinById, getAllWasteBins, updateWasteBin, deleteWasteBin, simulateIoTData};