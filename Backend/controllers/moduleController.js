import Module from '../models/Module.js';
import User from '../models/User.js';

// @desc    Get all awareness modules
// @route   GET /api/modules
// @access  Private
export const getModules = async (req, res) => {
    try {
        console.log('Fetching modules for user:', req.user._id);
        const modules = await Module.find({});
        console.log('Modules found:', modules.length);
        res.json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark module as completed and add points
// @route   POST /api/modules/:id/complete
// @access  Private
export const completeModule = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Check if already completed
        if (user.completedModules.includes(module._id)) {
            return res.status(400).json({ message: 'Module already completed' });
        }

        user.completedModules.push(module._id);
        user.points += 100; // Add 100 points
        await user.save();

        res.json({ message: 'Module completed', points: user.points, completedModules: user.completedModules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
