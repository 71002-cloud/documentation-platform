import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects.js';

export default function CreateProject() {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const navigate = useNavigate();

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const project = await createProject(projectName, projectDescription);
            console.log('Project created:', project);
            navigate(`/projects/${project.id}`);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }

    return (
        <div>
            <h1>Create Project</h1>
            <form onSubmit={handleCreateProject}>
                <input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <textarea placeholder="Project Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}></textarea>
                <button type="submit">Create Project</button>
            </form>
        </div>
    )
}