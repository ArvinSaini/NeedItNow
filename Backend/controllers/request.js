const Request = require('../models/request');

async function handleCreateRequest(req, res) {
    const body = req.body;
    
    if (!body.title || !body.description || !body.category) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
        const request = await Request.create({
            title: body.title,
            description: body.description,
            category: body.category,
            requester: req.user.userId, // Get from JWT token
            urgency: body.urgency || 'medium',
            status: 'active',
        });

        return res.status(201).json({ 
            message: 'Request created successfully',
            requestId: request._id 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create request' });
    }
}

async function handleGetAllRequests(req, res) {
    try {
        const requests = await Request.find({ status: 'active' })
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

async function handleGetRequest(req, res) {
    const requestId = req.params.id;
    
    try {
        const request = await Request.findById(requestId)
            .populate('requester', 'name email phone hostel');
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        return res.json(request);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch request' });
    }
}

async function handleUpdateRequest(req, res) {
    const requestId = req.params.id;
    const updates = req.body;
    
    try {
        const request = await Request.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is the requester (from JWT token)
        if (request.requester.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own requests' });
        }

        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            updates,
            { new: true }
        );

        return res.json({ 
            message: 'Request updated successfully',
            request: updatedRequest 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update request' });
    }
}

async function handleDeleteRequest(req, res) {
    const requestId = req.params.id;
    
    try {
        const request = await Request.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is the requester (from JWT token)
        if (request.requester.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete your own requests' });
        }

        await Request.findByIdAndDelete(requestId);

        return res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete request' });
    }
}

async function handleGetRequestsByUser(req, res) {
    const userId = req.params.userId;
    
    try {
        const requests = await Request.find({ requester: userId })
            .sort({ createdAt: -1 });
        
        return res.json({ 
            count: requests.length,
            requests 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch requests' });
    }
}

module.exports = {
    handleCreateRequest,
    handleGetAllRequests,
    handleGetRequest,
    handleUpdateRequest,
    handleDeleteRequest,
    handleGetRequestsByUser,
};
