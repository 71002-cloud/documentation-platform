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