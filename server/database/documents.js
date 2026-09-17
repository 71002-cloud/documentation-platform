const { getSupabase } = require('./supabase.js');

const getAllDocumentsTitleByProjectId = async (project_id) => {
    if (!project_id) {
        throw new Error('Project ID is required to fetch documents.');
    }

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data: documents, error } = await supabase
        .from('documents')
        .select('title, order_index, document_id')
        .eq('project_id', project_id);
    
    if (error) {
        throw new Error(`Error fetching documents: ${error.message}`);
    }

    return documents;
}

const getDocumentById = async (document_id) => {
    if (!document_id) {
        throw new Error('Document ID is required to fetch a document.');
    }

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data: document, error } = await supabase
        .from('documents')
        .select('*')
        .eq('document_id', document_id)
        .single();
    
    if (error) {
        throw new Error(`Error fetching document: ${error.message}`);
    }

    return document;
}

const createDocument = async (project_id, order_index) => {
    if (!project_id || order_index === undefined || order_index === null) {
        throw new Error('Project ID and order index are required to create a document.');
    }

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
        .from('documents')
        .insert([{ project_id, title: 'Untitled', content: '', order_index }])
        .select()
        .single();

    if (error) {
        throw new Error(`Error creating document: ${error.message}`);
    }

    return data;
}

const updateDocument = async (document_id, title, content) => {
    if (!document_id || !title || !content) {
        throw new Error('Document ID, title, content, and project ID are required to update a document.');
    }

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
        .from('documents')
        .update({ title, content })
        .eq('document_id', document_id)
        .select()
        .single();

    if (error) {
        throw new Error(`Error updating document: ${error.message}`);
    }

    return data;
}

const deleteDocument = async (document_id) => {
    if (!document_id) {
        throw new Error('Document ID is required to delete a document.');
    }

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }

    const { data, error } = await supabase
        .from('documents')
        .delete()
        .eq('document_id', document_id)
        .select()
        .single();

    if (error) {
        throw new Error(`Error deleting document: ${error.message}`);
    }

    return data;
}

module.exports = { getAllDocumentsTitleByProjectId, getDocumentById, createDocument, updateDocument, deleteDocument };