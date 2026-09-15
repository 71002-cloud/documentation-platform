const express = require('express');
const router = express.Router();
const { checkPermission, isMemberOfProject } = require('../middleware/permison-tjek.js');
const { createProject, getProjectIdByMemberId, getProjectsByIds, deleteProject, addMemberToProjectByUserId, removeMemberFromProject, getProjectMembersByProjectId} = require('../database/project.js');
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

router.post('/delete', rateLimiter(5), async (req, res) => {
    const { allowed, user } = await checkPermission('user', req.headers.authorization);
    if (!allowed) {
        return res.status(403).json({ error: 'Login is required to delete a project' });
    }

    const { projectId } = req.body;
    if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required to delete a project' });
    }

    if (!user || !user.id) {
        return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    const { allowed: isMember, project } = await isMemberOfProject(user.id, projectId, 'owner');
    if (!isMember) {
        return res.status(403).json({ error: 'You are not the owner of this project' });
    }

    try {
        const result = await deleteProject(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

router.post('/remove-member', rateLimiter(5), async (req, res) => {
    const { allowed, user } = await checkPermission('user', req.headers.authorization);
    if (!allowed) {
        return res.status(403).json({ error: 'Login is required to remove a member from a project' });
    }

    const { projectId, userId } = req.body;
    if (!projectId || !userId) {
        return res.status(400).json({ error: 'Project ID and User ID are required to remove a member from a project' });
    }

    if (!user || !user.id) {
        return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    const { allowed: isMember, project } = await isMemberOfProject(user.id, projectId, 'owner');
    if (!isMember) {
        return res.status(403).json({ error: 'You are not the owner of this project' });
    }

    try {
        const result = await removeMemberFromProject(projectId, userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error removing member from project:', error);
        res.status(500).json({ error: 'Failed to remove member from project' });
    }
});

router.post('/add-member', rateLimiter(5), async (req, res) => {
    const { allowed, user } = await checkPermission('user', req.headers.authorization);
    if (!allowed) {
        return res.status(403).json({ error: 'Login is required to add a member to a project' });
    }

    const { projectId, name, role } = req.body;
    if (!projectId || !name || !role) {
        return res.status(400).json({ error: 'Project ID, User Name, and User Role are required to add a member to a project' });
    }

    if (!user || !user.id) {
        return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    const { allowed: isMember, project } = await isMemberOfProject(user.id, projectId, 'owner');
    if (!isMember) {
        return res.status(403).json({ error: 'You are not the owner of this project' });
    }

    const validRoles = ['viewer', 'editor', 'owner'];
    const roleLowerCase = role.toLowerCase();
    if (!validRoles.includes(roleLowerCase)) {
        return res.status(400).json({ error: `Invalid role. Role must be one of: ${validRoles.join(', ')}` });
    }

    try {
        const result = await addMemberToProjectByUserId(projectId, name, roleLowerCase);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error adding member to project:', error);
        res.status(500).json({ error: 'Failed to add member to project' });
    }
});


router.get('/members', rateLimiter(5), async (req, res) => {
    const { allowed, user } = await checkPermission('user', req.headers.authorization);
    if (!allowed) {
        return res.status(403).json({ error: 'Login is required to fetch project members' });
    }

    const { projectId } = req.query;
    if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required to fetch project members' });
    }

    if (!user || !user.id) {
        return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    const { allowed: isMember, project } = await isMemberOfProject(user.id, projectId, 'viewer');
    if (!isMember) {
        return res.status(403).json({ error: 'You are not a member of this project' });
    }

    try {
        const result = await getProjectMembersByProjectId(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching project members:', error);
        res.status(500).json({ error: 'Failed to fetch project members' });
    }
});

module.exports = router;