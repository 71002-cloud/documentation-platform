const express = require('express');
const router = express.Router();
const { checkPermission } = require('../middleware/permison-tjek.js');
const { createProject, getProjectIdByMemberId, getProjectsByIds} = require('../database/project.js');
const { getUserByToken } = require('../database/auth.js');
const { rateLimiter } = require('../middleware/rate-limiter.js');

router.post('/create', rateLimiter(5), async (req, res) => {
    const hasPermission = await checkPermission('user', req.headers.authorization);
    if (!hasPermission) {
        return res.status(403).json({ error: 'Login is required to create a project' });
    }

    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    const userToken = req.headers.authorization.split(' ')[1];
    const user = await getUserByToken(userToken);
    if (!user || !user.id) {
        return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    try {
        const safeDescription = description ?? null;
        const project = await createProject(name, safeDescription, user.id);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.get('/', rateLimiter(5), async (req, res) => {
    const hasPermission = await checkPermission('user', req.headers.authorization);
    if (!hasPermission) {
        return res.status(403).json({ error: 'Login is required to view projects' });
    }

    const user = await getUserByToken(req.headers.authorization.split(' ')[1])
        .then((user) => {
            if (!user || !user.id) {
                return res.status(401).json({ error: 'Invalid or expired user session' });
            }
            return user;
        })
        .catch((error) => {
            console.error('Error fetching user:', error);
            return res.status(500).json({ error: 'Failed to fetch user' });
        });
    const projectIds = await getProjectIdByMemberId(user.id);

    const projects = await getProjectsByIds(projectIds.map((p) => p.project_id));

    res.status(200).json(projects);
});

module.exports = router;