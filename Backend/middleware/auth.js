const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verifies the JWT, then re-reads the user so a block (or deletion) applies to the very
// next request, not just at login. Throws { status, code, message } on any failure.
async function loadAuthenticatedUser(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw { status: 401, message: 'No token provided. Authorization required.' };
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw { status: 401, code: 'TOKEN_EXPIRED', message: 'Token expired. Please login again.' };
        }
        throw { status: 401, code: 'TOKEN_INVALID', message: 'Invalid token. Authorization failed.' };
    }

    const user = await User.findById(decoded.userId).select('role isBlocked');

    if (!user) {
        throw { status: 401, code: 'USER_NOT_FOUND', message: 'Account no longer exists. Please login again.' };
    }

    if (user.isBlocked) {
        throw { status: 403, code: 'ACCOUNT_BLOCKED', message: 'Your account has been blocked. Contact admin.' };
    }

    // role comes from the live user record (not the token claim) so an admin
    // promotion/demotion also takes effect on the very next request.
    return { userId: decoded.userId, email: decoded.email, role: user.role };
}

function sendAuthError(res, error) {
    // Only trust errors loadAuthenticatedUser threw on purpose (they carry a numeric
    // status). Anything else — e.g. a Mongo blip from User.findById — is an unexpected
    // failure, not an auth decision, so don't expose it or answer 401 (the frontend
    // treats 401 as a dead session and would mass-logout users on a transient error).
    if (typeof error.status !== 'number') {
        console.error('Unexpected error during authorization:', error);
        return res.status(503).json({ error: 'Could not verify your session right now. Please try again.' });
    }

    return res.status(error.status).json({
        error: error.message || 'Authorization failed.',
        ...(error.code && { code: error.code }),
    });
}

// Middleware to verify JWT token and extract user info
async function verifyToken(req, res, next) {
    try {
        req.user = await loadAuthenticatedUser(req);
        next();
    } catch (error) {
        return sendAuthError(res, error);
    }
}

// Middleware to check if user is admin
async function isAdmin(req, res, next) {
    try {
        const user = await loadAuthenticatedUser(req);

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return sendAuthError(res, error);
    }
}

module.exports = { verifyToken, isAdmin };
