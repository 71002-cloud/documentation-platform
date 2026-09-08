function rateLimiter(maxRequests) {
    const requests = new Map();
    return function(req, res, next) {
        const ip = req.ip;
        const now = Date.now();

        let data = requests.get(ip);

        if (!data) {
            data = { count: 1, firstRequest: now };
            requests.set(ip, data);
        };

        if (now - data.firstRequest >= 1000) {
            data.count = 0;
            data.firstRequest = now;
        };

        if (data.count >= 5) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }

        data.count++;
        next();
    }
};

module.exports = { rateLimiter };