const { getUserByToken } = require('../database/auth');
const { getAProjectByMemberId } = require('../database/project');

const checkPermission = async (requiredRole, userToken) => {
    const user = await getUserByToken(userToken);
    if (!user) {
        console.log("getUserByToken returned null or undefined");
        return { allowed: false, user: null };
    }
    console.log(`User role: ${user.role}, Required role: ${requiredRole}`);

    const allowed = user.role === requiredRole || user.role === 'admin';

    return { allowed, user };
};

const isMemberOfProject = async (userId, projectId, requiredRole) => {
    const project = await getAProjectByMemberId(userId, projectId);
    if (!project) {
        console.log(`User with ID ${userId} is not a member of project with ID ${projectId}`);
        return false;
    }
    console.log(project);
    console.log(`Project role: ${project.role}, Required role: ${requiredRole}`);

    const allowed = project.role === requiredRole || project.role === 'owner' || (requiredRole === 'viewer' && project.role === 'editor');
    return { allowed, project };
};

module.exports = { checkPermission, isMemberOfProject };