const { getSupabase } = require('./supabase.js');

const getUserByEmail = async (email) => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

    if (error) {
        throw new Error(`Error fetching user by email: ${error.message}`);
    }

    return data;
};

const getUserById = async (id) => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
    if (error) {
        throw new Error(`Error fetching user by ID: ${error.message}`);
    }
    return data;
}

const getUserByToken = async (token) => {
    if (!token) {
        console.log("No token provided");
        return null; // No token provided
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove 'Bearer ' prefix
    }

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    try {
        const result = await supabase.auth.getUser(token);

        if (!result || result.error || !result.data?.user) {
            console.log('Token is invalid or expired.');
            return null;
        }

        const authUser = result.data.user;
        console.log('Auth user from token:', authUser.id);

        const profile = await getUserById(authUser.id);
        console.log('Profile fetched for user:', profile);
        return profile;
    } catch (err) {
        if (err.status === 401 || err.code === 'no_authorization') {
            console.log('Token is invalid or expired.');
        } else {
            console.error('getUserByToken error:', err.message);
        }
        return null;
    }
}

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required for login.');
    }

    email = email.toLowerCase(); // Normalize email to lowercase

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw new Error(`Error logging in user: ${error.message}`);
    }

    const profile = await getUserById(data.user.id);

    return { ...data, userInfo: profile };
};

module.exports = { getUserByEmail, getUserByToken, getUserById, loginUser };