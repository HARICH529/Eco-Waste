import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Investigating', 'Resolved'],
        default: 'Pending',
    },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;
