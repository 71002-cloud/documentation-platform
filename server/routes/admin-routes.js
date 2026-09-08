const express = require('express');
const router = express.Router();
const { createUser, deleteUser } = require('../database/admin.js');
const { checkPermission } = require('../middleware/permison-tjek.js');
const { rateLimiter } = require('../middleware/rate-limiter.js');

router.post('/create-user', rateLimiter(2), async (req, res) => {
    const { email, password, name, role } = req.body;

    // Check if the user has the required permission
    const hasPermission = await checkPermission('admin', req.headers.authorization);
    if (!hasPermission) {
        return res.status(403).json({
            success: false,
            message: 'Insufficient permissions to create user'
        });
    }

    await createUser(email, password, name, role)

    res.status(200).json({
        success: true,
        message: 'User created successfully',
        user: { email, name, role }
    });

});

router.post('/delete-user', rateLimiter(2), async (req, res) => {
    const { userId } = req.body;

    console.log(`Attempting to delete user with ID: ${userId}`);
    console.log(`Authorization header: ${req.headers.authorization}`);

    // Check if the user has the required permission
    const hasPermission = await checkPermission('admin', req.headers.authorization);
    if (!hasPermission) {
        return res.status(403).json({
            success: false,
            message: 'Insufficient permissions to delete user'
        });
    }

    await deleteUser(userId);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

module.exports = router;