import { deleteProject, removeMemberFromProject, addMemberToProject } from "../api/projects";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProjectSettings(props) {
    const [addMemberFormVisible, setAddMemberFormVisible] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('viewer');
    const navigate = useNavigate();
    const { members, setMembers, currentUserIsOwner } = props;

    const handleRemoveMember = async (userId) => {
        if (window.confirm("Are you sure you want to remove this member from the project?")) {
            try {
                console.log('Removing member with user ID:', userId, 'from project ID:', props.project.project_id);
                await removeMemberFromProject(props.project.project_id, userId);
                setMembers((currentMembers) => currentMembers.filter((member) => member.user_id !== userId));
            } catch (error) {
                console.error('Error removing member from project:', error);
            }
        }
    };

    const displayMembers = members.map((member) => (
        <li key={member.user_id}>
            {member.name} - Role: {member.role}
            {currentUserIsOwner && member.role !== 'owner' && (
                <button onClick={() => handleRemoveMember(member.user_id)}>Remove</button>
            )}
        </li>
    ));

    const handleDeleteProject = async () => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            try {
                const result = await deleteProject(props.project.project_id);
                console.log('Project deleted:', result);
                if (result.success) {
                    sessionStorage.removeItem('currentProjectId');
                    sessionStorage.removeItem('currentProject');
                    navigate('/projects');
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    }

    const handleAddMember = async () => {
        if (newMemberName.trim() === '') {
            alert('Member name cannot be empty.');
            return;
        }
        if (newMemberRole !== 'viewer' && newMemberRole !== 'editor') {
            alert('Invalid role selected. Please choose either "viewer" or "editor".');
            return;
        }

        try {
            console.log('Adding member to project ID:', props.project.project_id, 'Name:', newMemberName, 'Role:', newMemberRole);
            const result = await addMemberToProject(props.project.project_id, newMemberName, newMemberRole);
            console.log('Member added:', result);
            setMembers((currentMembers) => [
                ...currentMembers,
                { ...result, name: newMemberName }
            ]);
            setNewMemberName('');
            setNewMemberRole('viewer');
            setAddMemberFormVisible(false);
        } catch (error) {
            console.error('Error adding member to project:', error);
        }
    }

    return (
        <div>
            <h2>Project Settings for {props.project.name}</h2>
            <div>
                <p>Project Members:</p>
                <ul>
                    {displayMembers}
                </ul>
            </div>
            {currentUserIsOwner && (addMemberFormVisible ? (
                <div>
                    <p>Add a new member to the project:</p>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }}>
                        <input type="text" placeholder="Joe" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
                        <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)}>
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                        </select>
                        <button type="submit">Add Member</button>
                    </form>
                </div>
            ) : (
                <button onClick={() => setAddMemberFormVisible(true)}>Add Member</button>
            ))}

            <p>Project Description: {props.project.description}</p>

            {currentUserIsOwner && (
                <div>
                    <h3>Danger zone</h3>
                    <button onClick={handleDeleteProject}>Delete Project</button>
                </div>
            )}
        </div>
    );
}