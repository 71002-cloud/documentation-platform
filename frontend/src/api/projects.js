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
    return result;
}

export async function addMemberToProject(projectId, userId) {
    if (!projectId || !userId) {
        throw new Error('Project ID and User ID are required to add a member to a project');
    }

    const response = await fetch(`http://localhost:5000/api/projects/add-member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId, userId }),
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