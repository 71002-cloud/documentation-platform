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
        // Try the common call signature; support both string and object forms
        let result = await supabase.auth.getUser(token);

        if ((!result || !result.data || !result.data.user) && typeof token === 'string') {
            // Some versions expect an object with access_token
            result = await supabase.auth.getUser({ access_token: token });
        }

        if (!result || result.error || !result.data?.user) {
            console.log('No auth user found or error:', result?.error);
            return null;
        }

        const authUser = result.data.user;
        console.log('Auth user from token:', authUser.id);

        const profile = await getUserById(authUser.id);
        return profile;
    } catch (err) {
        console.error('getUserByToken error:', err);
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

    return data;
};

module.exports = { getUserByEmail, getUserByToken, getUserById, loginUser };