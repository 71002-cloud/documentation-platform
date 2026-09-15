import TableOfContents from "../components/TableOfContens";
import ProjectHeader from "../components/ProjectHeader";
import Page from "../components/Page";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProjectPage() {
    const [currentProjectId, setCurrentProjectId] = useState(sessionStorage.getItem('currentProjectId'));
    const [currentProject, setCurrentProject] = useState(JSON.parse(sessionStorage.getItem('currentProject')));
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            navigate('/login');
        }
        if (!sessionStorage.getItem('currentProjectId')) {
            navigate('/projects');
        }

        if (!sessionStorage.getItem('currentProject')) {
            navigate('/projects');
        }

        setCurrentProjectId(sessionStorage.getItem('currentProjectId'));
        setCurrentProject(JSON.parse(sessionStorage.getItem('currentProject')));
    }, []);

    console.log(currentProject);

    return (
        <div>
            <ProjectHeader project={currentProject} />
            <div style={{ display: 'flex' }}>
                <TableOfContents documententTitles={['Introduction', 'Getting Started', 'Advanced Topics']} />
                <Page />
            </div>
        </div>
    );
}