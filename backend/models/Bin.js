const mongoose = require("mongoose");

const wasteBinSchema = new mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    location: 
    { 
        type: String, 
        required: true 
    },
    image:
    {
        type: String, 
        required: true 
    },
    binType:
    {
        type: String,
        enum: ["Food", "Non Recyclable Waste", "Recyclable Waste"], 
        default: "Food",
        required: true 
    },
    waste_level: 
    { 
        type: Number, 
        required: true, 
        default: 0, 
        min: 0, 
        max: 100 
    },
    status: 
    { 
        type: String, 
        enum: ["Empty", "Partial", "Full"], 
        default: "Empty",
    },
    last_updated: 
    { 
        type: Date, 
        default: Date.now 
    },
});

const WasteBin = mongoose.model('WasteBin', wasteBinSchema);
module.exports = WasteBin;
