const express = require('express');
const router = express.Router();
const { checkPermission } = require('../middleware/permison-tjek.js');
const { createProject, getProjectIdByMemberId, getProjectsByIds} = require('../database/project.js');
const { rateLimiter } = require('../middleware/rate-limiter.js');

router.post('/create', rateLimiter(5), async (req, res) => {
    const { allowed, user } = await checkPermission('user', req.headers.authorization);
    if (!allowed) {
        return res.status(403).json({ error: 'Login is required to create a project' });
    }

    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }

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
    const { allowed, user } = await checkPermission('user', req.headers.authorization);
    if (!allowed) {
        return res.status(403).json({ error: 'Login is required to view projects' });
    }

    if (!user || !user.id) {
        return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    const projectIds = await getProjectIdByMemberId(user.id);

    const projects = await getProjectsByIds(projectIds.map((p) => p.project_id));

    res.status(200).json(projects);
});

module.exports = router;