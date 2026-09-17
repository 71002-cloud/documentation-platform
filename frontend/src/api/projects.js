export async function createProject(name, description) {
    if (!name) {
        throw new Error('Project name is required');
    }

    const response = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description }),
    });
    const project = await response.json();
    return project;
}

export async function getProjectsToDisplay() {
    const response = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    const projects = await response.json();
    return projects;
}

export async function deleteProject(projectId) {
    if (!projectId) {
        throw new Error('Project ID is required to delete a project');
    }

    const response = await fetch(`http://localhost:5000/api/projects/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Failed to remove member');
    }

    return result;
}

export async function removeMemberFromProject(projectId, userId) {
    if (!projectId || !userId) {
        throw new Error('Project ID and User ID are required to remove a member from a project');
    }

    const response = await fetch(`http://localhost:5000/api/projects/remove-member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId, userId }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Failed to add member');
    }

    return result;
}

export async function addMemberToProject(projectId, name, role) {
    if (!projectId || !name || !role) {
        throw new Error('Project ID, User Name, and User Role are required to add a member to a project');
    }

    const response = await fetch(`http://localhost:5000/api/projects/add-member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId, name, role }),
    });

    const result = await response.json();
    return result;
}

export async function getProjectMembers(projectId) {
    if (!projectId) {
        throw new Error('Project ID is required to get project members');
    }

    const response = await fetch(`http://localhost:5000/api/projects/members?projectId=${projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    const members = await response.json();
    return members;
}

export async function getProjectDocuments(projectId) {
    if (!projectId) {
        throw new Error('Project ID is required to get project documents');
    }

    const response = await fetch(`http://localhost:5000/api/projects/documents?projectId=${projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    const documents = await response.json();
    return documents;
}

export async function getDocument(projectId, documentId) {
    if (!projectId || !documentId) {
        throw new Error('Project ID and Document ID are required to get a document');
    }

    const params = new URLSearchParams({ projectId, documentId });
    const response = await fetch(`http://localhost:5000/api/projects/document?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    const document = await response.json();
    return document;
}

export const createDocument = async (projectId, order_index) => {
    if (!projectId || order_index === undefined) {
        throw new Error('Project ID, and order index are required to create a document');
    }

    const response = await fetch(`http://localhost:5000/api/projects/create-document`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId, order_index }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Failed to create document');
    }
    return result;
}

export const updateDocument = async (projectId, documentId, title, content) => {
    if (!documentId || !title || content === undefined || !projectId) {
        throw new Error('Document ID, title, content, and project ID are required to update a document');
    }

    const response = await fetch(`http://localhost:5000/api/projects/document`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId, documentId, title, content }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Failed to update document');
    }
    return result;
}