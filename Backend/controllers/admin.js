const User = require('../models/user');
const Listing = require('../models/product');
const Request = require('../models/request');

// User Management
async function handleGetAllUsers(req, res) {
    try {
        const users = await User.find().select('-password');

        return res.json({
            count: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
}

async function handleBlockUser(req, res) {
    const userId = req.params.userId;

    try {
        // Lec 2: findOneAndUpdate — raw MongoDB update by field
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isBlocked: true } }, // Lec 4: $set — updates only this field
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({
            message: 'User blocked successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to block user' });
    }
}

async function handleUnblockUser(req, res) {
    const userId = req.params.userId;

    try {
        // Lec 2: findOneAndUpdate — raw MongoDB update by field
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isBlocked: false } }, // Lec 4: $set — updates only this field
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({
            message: 'User unblocked successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to unblock user' });
    }
}

async function handleDeleteUser(req, res) {
    const userId = req.params.userId;

    try {
        // Lec 2: deleteOne — raw MongoDB delete by field
        const result = await User.deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete user' });
    }
}

// Listing Management
async function handleGetAllListingsAdmin(req, res) {
    try {
        // Lec 2: $in — matches listings whose status is in this array
        const listings = await Listing.find({ status: { $in: ['available', 'borrowed', 'unavailable'] } })
            .populate('owner', 'name email phone hostel')
            .sort({ createdAt: -1 });

        return res.json({
            count: listings.length,
            listings
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch listings' });
    }
}

async function handleDeleteListingAdmin(req, res) {
    const listingId = req.params.listingId;

    try {
        // Lec 2: deleteOne — raw MongoDB delete by field
        const result = await Listing.deleteOne({ _id: listingId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        return res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete listing' });
    }
}

// Request Management
async function handleGetAllRequestsAdmin(req, res) {
    try {
        const requests = await Request.find()
            .populate('requester', 'name email phone hostel')
            .sort({ createdAt: -1 });

        return res.json({
            count: requests.length,
            requests
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch requests' });
    }
}

async function handleDeleteRequestAdmin(req, res) {
    const requestId = req.params.requestId;

    try {
        // Lec 2: deleteOne — raw MongoDB delete by field
        const result = await Request.deleteOne({ _id: requestId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        return res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete request' });
    }
}

module.exports = {
    handleGetAllUsers,
    handleBlockUser,
    handleUnblockUser,
    handleDeleteUser,
    handleGetAllListingsAdmin,
    handleDeleteListingAdmin,
    handleGetAllRequestsAdmin,
    handleDeleteRequestAdmin,
};
