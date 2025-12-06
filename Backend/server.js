import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/waste-management';
console.log('Connecting to MongoDB at:', mongoURI);
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import centerRoutes from './routes/centerRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/modules', moduleRoutes);

app.get('/', (req, res) => {
    res.send('Waste Management API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
