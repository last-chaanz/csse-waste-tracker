const express = require('express');
const { 
    createWasteBin, 
    getWasteBinById, 
    getWasteBinsByUser, 
    getAllWasteBins,
    updateWasteBin, 
    deleteWasteBin 
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

// Export the router
module.exports = router;
