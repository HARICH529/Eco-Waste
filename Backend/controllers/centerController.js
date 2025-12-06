import Center from '../models/Center.js';

// @desc    Get all recycling centers
// @route   GET /api/centers
// @access  Public
export const getCenters = async (req, res) => {
    try {
        const centers = await Center.find({});
        res.json(centers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new recycling center (Admin)
// @route   POST /api/centers
// @access  Private/Admin
export const createCenter = async (req, res) => {
    const { name, location, contact, acceptedMaterials, capacity } = req.body;

    try {
        const center = new Center({
            name,
            location,
            contact,
            acceptedMaterials,
            capacity,
        });

        const createdCenter = await center.save();
        res.status(201).json(createdCenter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update center load (Admin)
// @route   PUT /api/centers/:id/load
// @access  Private/Admin
export const updateCenterLoad = async (req, res) => {
    const { currentLoad } = req.body;

    try {
        const center = await Center.findById(req.params.id);

        if (center) {
            center.currentLoad = currentLoad;
            const updatedCenter = await center.save();
            res.json(updatedCenter);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
