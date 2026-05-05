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
            tags: body.tags || [], // Lec 5: Array field — e.g. ["urgent", "hostel-A"]
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
        // Lec 2: $in — matches requests with status in this array
        const requests = await Request.find({ status: { $in: ['active', 'fulfilled'] } })
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
        // Lec 2: findOne — raw MongoDB read by field
        const request = await Request.findOne({ _id: requestId })
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
        // Lec 2: findOne — raw MongoDB read to verify ownership before updating
        const request = await Request.findOne({ _id: requestId });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is the requester (from JWT token)
        if (request.requester.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own requests' });
        }

        // Lec 2: findOneAndUpdate — raw MongoDB update by field
        const updatedRequest = await Request.findOneAndUpdate(
            { _id: requestId },
            { $set: updates }, // Lec 4: $set — updates only the provided fields
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
        // Lec 2: findOne — raw MongoDB read to verify ownership before deleting
        const request = await Request.findOne({ _id: requestId });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is the requester (from JWT token)
        if (request.requester.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete your own requests' });
        }

        // Lec 2: deleteOne — raw MongoDB delete by field
        await Request.deleteOne({ _id: requestId });

        return res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete request' });
    }
}

async function handleGetRequestsByUser(req, res) {
    const userId = req.params.userId;

    try {
        // Lec 5: $elemMatch — finds requests where AT LEAST ONE tag matches the query
        // e.g., find all requests this user tagged as 'urgent'
        const tagFilter = req.query.tag
            ? { tags: { $elemMatch: { $eq: req.query.tag } } }
            : {};
        const requests = await Request.find({ requester: userId, ...tagFilter })
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
