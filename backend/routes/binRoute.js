const express = require('express');
const { 
    createWasteBin, 
    getWasteBinById, 
    getWasteBinsByUser, 
    getAllWasteBins,
    updateWasteBin, 
    deleteWasteBin,
    getWasteBinByLocation,
    updateCollectionDay,
    resetWasteLevel
} = require('../controller/binController');

// Create a router instance
const router = express.Router();

// Define routes
router.post('/wastebins', createWasteBin);

router.get("/wastebins/:id", getWasteBinById);
router.get("/wastebinUser/:userId", getWasteBinsByUser);

router.put("/updateBin/:id", updateWasteBin);

router.delete("/wastebins/:binId", deleteWasteBin);

router.get('/wastebins', getAllWasteBins);

router.get("/wastebin/:location", getWasteBinByLocation);

router.put('/wastebin/updateDay/:binId', updateCollectionDay);

router.put('/wastebin/markCollected/:binId', resetWasteLevel);

// Export the router
module.exports = router;
