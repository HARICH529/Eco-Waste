import Request from '../models/Request.js';

// @desc    Create a new pickup request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
    const { wasteType, quantity, location } = req.body;

    try {
        const request = new Request({
            user: req.user._id,
            wasteType,
            quantity,
            location,
        });

        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests (Admin) or User's requests
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res) => {
    try {
        let requests;
        if (req.user.role === 'admin') {
            requests = await Request.find({}).populate('user', 'id name email');
        } else {
            requests = await Request.find({ user: req.user._id });
        }
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status (Admin)
// @route   PUT /api/requests/:id
// @access  Private/Admin
export const updateRequestStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            request.status = status;
            const updatedRequest = await request.save();

            // Add points if completed
            if (status === 'Completed') {
                const User = (await import('../models/User.js')).default;
                const user = await User.findById(request.user);
                if (user) {
                    user.points += 25; // Add 25 points per request
                    await user.save();
                }
            }

            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
export const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            if (request.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await request.deleteOne();
            res.json({ message: 'Request removed' });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
