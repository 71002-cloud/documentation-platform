const { getSupabase } = require('./supabase.js');

const addMemberToProject = async (projectId, userId, role) => {
    if (!projectId || !userId || !role) {
        throw new Error('Project ID, user ID, and role are required to add a member to a project.');
    }
    if (!['viewer', 'editor', 'admin'].includes(role)) {
        throw new Error('Invalid role. Role must be one of: viewer, editor, admin.');
    }
    const supabase = getSupabase();

    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('projectmembers')
    .insert([{ project_id: projectId, user_id: userId, role: role}])
    .single();
};

const getProjectIdByMemberId = async (userId) => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('projectmembers')
    .select('project_id')
    .eq('user_id', userId);

    if (error) {
        throw new Error(`Error fetching project ID by member ID: ${error.message}`);
    }

    console.log('Fetched project ID by member ID:', data);
    return data;
};

const getProjectById = async (id) => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_id', id)
    .single();

    if (error) {
        throw new Error(`Error fetching project by ID: ${error.message}`);
    }
    console.log('Fetched project by ID:', data);
    return data;
};

const getProjectsByIds = async (projectIds) => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }
    const { data, error } = await supabase
    .from('projects')
    .select('*')
    .in('project_id', projectIds);

    if (error) {
        throw new Error(`Error fetching projects by IDs: ${error.message}`);
    }

    console.log('Fetched projects by IDs:', data);
    return data;
};

const getProjectsByOwnerId = async (userId) => {
    const supabase = getSupabase();

    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching projects by owner ID: ${error.message}`);
    }
    console.log('Fetched projects by owner ID:', data);
    return data;
};

const getProjectsIdByMemberId = async (userId) => {
    const supabase = getSupabase();

    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('projectmembers')
    .select('project_id')
    .eq('user_id', userId);

    if (error) {
        throw new Error(`Error fetching projects by member ID: ${error.message}`);
    }

    console.log('Fetched projects by member ID:', data);
    return data;
};

const createProject = async (name, description, userId) => {
    if (!name || !userId) {
        throw new Error('Project name and user ID are required to create a project.');
    }

    const safeDescription = description ?? null;

    const supabase = getSupabase();

    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
    .from('projects')
    .insert([{ name, description: safeDescription, owner_id: userId }])
    .select()
    .single();

    if (error) {
        throw new Error(`Error creating project: ${error.message}`);
    }
    console.log('Created project:', data);

    const { error: memberError } = await supabase.from('projectmembers').insert([{ project_id: data.project_id, user_id: userId, role: 'owner' }]);

    if (memberError) {
        const { error: rollbackError } = await supabase
            .from('projects')
            .delete()
            .eq('project_id', data.project_id)
            .select('project_id')
            .single();

        if (rollbackError) {
            throw new Error(`Error adding owner to projectmembers: ${memberError.message}. Rollback failed: ${rollbackError.message}`);
        }

        throw new Error(`Error adding owner to projectmembers: ${memberError.message}`);
    }

    return data;
};

module.exports = { getProjectById, getProjectsByOwnerId, getProjectsIdByMemberId, createProject, addMemberToProject, getProjectIdByMemberId, getProjectsByIds };