const { getUserByToken, getUserById } = require('../database/auth');

const checkPermission = async (requiredRole, userToken) => {
    const user = await getUserByToken(userToken);
    if (!user) {
        console.log("getUserByToken returned null or undefined");
        return false;
    }
    console.log(`User role: ${user.role}, Required role: ${requiredRole}`);
    return user.role === requiredRole;
};

module.exports = { checkPermission };