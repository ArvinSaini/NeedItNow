const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function handleUserSignup(req, res) {
    const body = req.body;
    
    if (!body.name || !body.email || !body.password || !body.phone || !body.hostel) {
        return res.status(400).json({ error: 'All fields (name, email, password, phone, hostel) are required' });
    }

    try {
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if email is in admin list
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
        const isAdmin = adminEmails.includes(body.email);

        const user = await User.create({
            name: body.name,
            email: body.email,
            password: body.password,
            phone: body.phone,
            hostel: body.hostel,
            roomNumber: body.roomNumber,
            role: isAdmin ? 'admin' : 'user',
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({ 
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hostel: user.hostel,
                roomNumber: user.roomNumber,
                phone: user.phone,
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user' });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email, password });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'Your account has been blocked. Contact admin.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hostel: user.hostel,
                roomNumber: user.roomNumber,
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
}

async function handleGetUser(req, res) {
    const userId = req.params.id;
    
    try {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user' });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleGetUser,
};
