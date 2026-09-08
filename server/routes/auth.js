const express = require('express');
const router = express.Router();
const { loginUser } = require('../database/auth.js');
const { rateLimiter } = require('../middleware/rate-limiter.js');

router.post('/login', rateLimiter(5), async (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt with email: ${email} and password: ${password}`);

    try {
        const user = await loginUser(email, password);

        res.json({ success: true, message: 'Login successful', 
            token: user.session.access_token,
            user: {
            email: user.user.email,
            name: user.userInfo.name,
            role: user.userInfo.role
        } });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

module.exports = router;