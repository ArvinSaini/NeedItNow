const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
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
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['active', 'fulfilled', 'cancelled'],
        default: 'active',
    },
}, {timestamps: true});

const Request = mongoose.model("request", requestSchema);

module.exports = Request;
