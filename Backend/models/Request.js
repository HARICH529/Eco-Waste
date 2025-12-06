import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    wasteType: {
        type: String,
        required: true,
        enum: ['Plastic', 'Organic', 'Metal', 'Glass', 'E-Waste', 'Paper', 'Other'],
    },
    quantity: {
        type: String, // e.g., "5 kg"
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Completed', 'Rejected'],
        default: 'Pending',
    },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

export default Request;
