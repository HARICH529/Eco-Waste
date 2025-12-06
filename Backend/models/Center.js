import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    operatingHours: {
        type: String,
    },
    acceptedWasteTypes: [{
        type: String,
    }],
    acceptedMaterials: [{
        type: String,
    }],
    capacity: {
        type: Number, // e.g., in tons
        default: 0,
    },
    currentLoad: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Center = mongoose.model('Center', centerSchema, 'recyclingcenters');

export default Center;
