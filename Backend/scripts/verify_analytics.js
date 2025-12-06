import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyAnalytics = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create or Find Admin User
        const adminEmail = 'verify_admin@example.com';
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            console.log('Creating new admin user...');
            adminUser = await User.create({
                name: 'Verify Admin',
                email: adminEmail,
                password: 'password123',
                role: 'admin'
            });
        } else {
            console.log('Admin user found.');
            // Ensure role is admin
            if (adminUser.role !== 'admin') {
                adminUser.role = 'admin';
                await adminUser.save();
            }
        }

        // 2. Generate Token
        const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        console.log('Token generated.');

        // 3. Fetch Analytics
        const url = 'http://localhost:5000/api/admin/analytics?month=12&year=2024';
        console.log(`Fetching: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('--- Analytics Data ---');
        console.log(JSON.stringify(data, null, 2));

        // 4. Verify Structure
        if (data.metrics && data.charts && data.charts.pieData && data.charts.barData) {
            console.log('\nSUCCESS: Analytics data structure is valid.');
        } else {
            console.error('\nFAILURE: Missing expected data fields.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyAnalytics();
