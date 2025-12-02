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
        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
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
        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: false },
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
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
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
        const listings = await Listing.find()
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
        const listing = await Listing.findByIdAndDelete(listingId);
        
        if (!listing) {
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
        const request = await Request.findByIdAndDelete(requestId);
        
        if (!request) {
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
