import Report from '../models/Report.js';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
    const { location, description, imageUrl } = req.body;

    try {
        const report = new Report({
            user: req.user._id,
            location,
            description,
            imageUrl,
        });

        const createdReport = await report.save();
        res.status(201).json(createdReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reports (Admin) or User's reports
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res) => {
    try {
        let reports;
        if (req.user.role === 'admin') {
            reports = await Report.find({}).populate('user', 'id name email');
        } else {
            reports = await Report.find({ user: req.user._id });
        }
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const report = await Report.findById(req.params.id);

        if (report) {
            report.status = status;
            const updatedReport = await report.save();

            // Add points if resolved
            if (status === 'Resolved') {
                const User = (await import('../models/User.js')).default;
                const user = await User.findById(report.user);
                if (user) {
                    user.points += 25; // Add 25 points per report
                    await user.save();
                }
            }
            res.json(updatedReport);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
