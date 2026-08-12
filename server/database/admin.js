const { getSupabase } = require('./supabase.js');

const createUser = async (email, password, name, role) => {
    if (!email || !password || !name) {
        throw new Error('Email, password, name, and role are required to create a user.');
    }

    if (!['admin', 'user'].includes(role)) {
        role = 'user'; // Default role if not provided or invalid
    }

    email = email.toLowerCase(); // Normalize email to lowercase

    const supabase = getSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true // Automatically confirm the user's email
    });

    if (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }

    const { error: userError } = await supabase.from('users').insert([{ id: data.user.id, email: email, name: name, role: role }]);

    if (userError) {
        await supabase.auth.admin.deleteUser(data.user.id); // Rollback user creation if inserting into 'users' table fails
        throw new Error(`Error creating user record: ${userError.message}`);
    }

    return {
        id: data.user.id,
        email,
        name,
        role
    }
};

const deleteUser = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required to delete a user.');
    }

    const supabase = getSupabase();

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};

module.exports = { createUser, deleteUser };