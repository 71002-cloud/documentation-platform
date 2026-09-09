const { getUserByToken } = require('../database/auth');

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

module.exports = { checkPermission };