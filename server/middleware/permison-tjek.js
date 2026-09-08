const { getUserByToken, getUserById } = require('../database/auth');

const checkPermission = async (requiredRole, userToken) => {
    const user = await getUserByToken(userToken);
    let fitrequiredRole = false;
    if (!user) {
        console.log("getUserByToken returned null or undefined");
        return false;
    }
    console.log(`User role: ${user.role}, Required role: ${requiredRole}`);

    if (user.role === requiredRole) {
        fitrequiredRole = true;
    } else if (user.role === 'admin') {
        fitrequiredRole = true;
    }

    return fitrequiredRole;
};

module.exports = { checkPermission };