const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'books', 'sports', 'utensils', 'clothing', 'stationery', 'other'],
    },
    images: [{
        type: String,
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    type: {
        type: String,
        enum: ['lend', 'sell'],
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'borrowed'],
        default: 'available',
    },
}, {timestamps: true});

// Lec 6: Compound Index — speeds up queries that filter by BOTH category AND status
listingSchema.index({ category: 1, status: 1 });

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
