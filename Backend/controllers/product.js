const Listing = require('../models/product');

async function handleCreateListing(req, res) {
    const body = req.body;
    
    if (!body.title || !body.description || !body.category || !body.type) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
        const listing = await Listing.create({
            title: body.title,
            description: body.description,
            category: body.category,
            images: body.images || [],
            owner: req.user.userId, // Get from JWT token
            type: body.type,
            price: body.price || 0,
            status: 'available',
        });

        return res.status(201).json({ 
            message: 'Listing created successfully',
            listingId: listing._id 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create listing' });
    }
}

async function handleGetAllListings(req, res) {
    try {
        const { search, category, type, hostel } = req.query;
        
        let filter = { status: 'available' };
        
        // Keyword search in title and description
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Category filter
        if (category) {
            filter.category = category;
        }
        
        // Type filter (lend/sell)
        if (type) {
            filter.type = type;
        }
        
        const listings = await Listing.find(filter)
            .populate('owner', 'name email phone hostel roomNumber')
            .sort({ createdAt: -1 });
        
        // Hostel filter (after populate)
        let filteredListings = listings;
        if (hostel) {
            filteredListings = listings.filter(listing => 
                listing.owner && listing.owner.hostel === hostel
            );
        }
        
        return res.json({ 
            count: filteredListings.length,
            listings: filteredListings 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch listings' });
    }
}

async function handleGetListing(req, res) {
    const listingId = req.params.id;
    
    try {
        // Lec 2: findOne — raw MongoDB read by field
        const listing = await Listing.findOne({ _id: listingId })
            .populate('owner', 'name email phone hostel roomNumber');
        
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        return res.json(listing);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch listing' });
    }
}

async function handleUpdateListing(req, res) {
    const listingId = req.params.id;
    const updates = req.body;
    
    try {
        // Lec 2: findOne — raw MongoDB read to check ownership before updating
        const listing = await Listing.findOne({ _id: listingId });
        
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Check if user is the owner (from JWT token)
        if (listing.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own listings' });
        }

        // Lec 2: findOneAndUpdate — raw MongoDB update by field
        const updatedListing = await Listing.findOneAndUpdate(
            { _id: listingId },
            { $set: updates }, // Lec 4: $set — updates only the provided fields
            { new: true }
        );

        return res.json({ 
            message: 'Listing updated successfully',
            listing: updatedListing 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update listing' });
    }
}

async function handleDeleteListing(req, res) {
    const listingId = req.params.id;
    
    try {
        // Lec 2: findOne — raw MongoDB read to check ownership before deleting
        const listing = await Listing.findOne({ _id: listingId });
        
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Check if user is the owner (from JWT token)
        if (listing.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete your own listings' });
        }

        // Lec 2: deleteOne — raw MongoDB delete by field
        await Listing.deleteOne({ _id: listingId });

        return res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete listing' });
    }
}

async function handleGetListingsByOwner(req, res) {
    const ownerId = req.params.ownerId;
    
    try {
        // Lec 2: $ne — exclude listings that are unavailable
        const listings = await Listing.find({ owner: ownerId, status: { $ne: 'unavailable' } })
            .sort({ createdAt: -1 });
        
        return res.json({ 
            count: listings.length,
            listings 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch listings' });
    }
}

module.exports = {
    handleCreateListing,
    handleGetAllListings,
    handleGetListing,
    handleUpdateListing,
    handleDeleteListing,
    handleGetListingsByOwner,
};
