import { deleteProject, removeMemberFromProject, addMemberToProject, getProjectMembers} from "../api/projects";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProjectSettings(props) {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const membersList = await getProjectMembers(props.project.project_id);
                setMembers(membersList);
            } catch (error) {
                console.error('Error fetching project members:', error);
            }
        };
        fetchMembers();
    }, [props.project.project_id]);

    console.log('Project members:', members);
    const displayMembers = members.map((member) => (
        <li key={member.user_id}>
            {member.name} - Role: {member.role}
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

    return (
        <div>
            <h2>Project Settings for {props.project.name}</h2>
            <div>
                <p>Project Members:</p>
                <ul>
                    {displayMembers}
                </ul>
            </div>
            <button> Add Member</button>

            <p>Project Description: {props.project.description}</p>

            <h3>Danger zone </h3>
            <button onClick={handleDeleteProject}>Delete Project</button>
        </div>
    );
}