import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
    },
    points: {
        type: Number,
        default: 100,
    },
}, { timestamps: true });

const Module = mongoose.model('Module', moduleSchema, 'awarenessmodules');

export default Module;
