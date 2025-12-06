import User from '../models/User.js';
import Request from '../models/Request.js';
import Center from '../models/Center.js';
import Report from '../models/Report.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        const { month, year } = req.query; // Expecting month (1-12) and year (e.g., 2024)

        // Base filter for specific month/year (for Pie Chart & Cards)
        let filter = {};
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            filter = { createdAt: { $gte: startDate, $lte: endDate } };
        } else if (year) {
            // If only year is selected (optional fallback)
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            filter = { createdAt: { $gte: startDate, $lte: endDate } };
        }

        // 1. Snapshot Metrics (Filtered)
        const totalUsers = await User.countDocuments({ role: 'citizen' }); // Users usually strictly filtered by time is weird, keeping total
        const totalRequests = await Request.countDocuments(filter);
        const pendingRequests = await Request.countDocuments({ ...filter, status: 'Pending' });
        const approvedRequests = await Request.countDocuments({ ...filter, status: 'Approved' });
        const completedRequests = await Request.countDocuments({ ...filter, status: 'Completed' });

        const totalCenters = await Center.countDocuments({});
        const totalReports = await Report.countDocuments(filter);
        const resolvedReports = await Report.countDocuments({ ...filter, status: 'Resolved' });

        // Calculate total waste (Filtered)
        const completedReqs = await Request.find({ ...filter, status: 'Completed' });
        let totalWaste = 0;
        completedReqs.forEach(req => {
            const qty = parseFloat(req.quantity);
            if (!isNaN(qty)) {
                totalWaste += qty;
            }
        });

        // 2. Yearly Trend Data (Bar Graph) - Aggregation
        // We need this for the *selected year* regardless of the specific month selected
        // If no year provided, default to current year
        const targetYear = year || new Date().getFullYear();
        const startOfYear = new Date(targetYear, 0, 1);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);

        const monthlyData = await Request.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Format for frontend (Fill missing months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyStats = monthNames.map((name, index) => {
            const found = monthlyData.find(d => d._id === (index + 1));
            return {
                name,
                total: found ? found.total : 0,
                completed: found ? found.completed : 0,
                approved: found ? found.approved : 0
            };
        });

        res.json({
            metrics: {
                totalUsers,
                totalRequests,
                pendingRequests,
                approvedRequests,
                completedRequests,
                totalCenters,
                totalReports,
                resolvedReports,
                totalWaste,
            },
            charts: {
                pieData: [
                    { name: 'Pending', value: pendingRequests, color: '#FBC02D' }, // Yellow
                    { name: 'Approved', value: approvedRequests, color: '#2196F3' }, // Blue
                    { name: 'Completed', value: completedRequests, color: '#4CAF50' }, // Green
                ],
                barData: monthlyStats
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
