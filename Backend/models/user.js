const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    hostel: {
        type: String,
        required: true,
    },
    roomNumber: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

// Add post-save hook for debugging
// userSchema.post('save', function(doc) {
//     console.log('📝 User document saved to database:');
//     console.log('   Collection:', this.collection.name);
//     console.log('   Database:', this.db.name);
//     console.log('   Document ID:', doc._id);
// });

const User = mongoose.model("user", userSchema);

// console.log('📋 User Model Created');
// console.log('   Collection Name:', User.collection.name);

module.exports = User;
