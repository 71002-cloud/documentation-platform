import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsHeader from '../components/ProjectsHeader.jsx';
import CreateProjectMenu from '../components/CreateProjectMenu.jsx';
import { getProjectsToDisplay } from '../api/projects.js';

export default function Projects() {
  const navigate = useNavigate();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect( () => {
    if (!sessionStorage.getItem('user')) {
      navigate('/login');
    }
  
    async function getProjects() {
      const response = await getProjectsToDisplay();
      if (!response || response.length === 0) {
        console.log('No projects found for the user.');
        setProjects([]);
        return;
      }

      if (response.error) {
        console.error('Error fetching projects:', response.error);
        setProjects([]);
        if (response.error === 'Login is required to view projects') {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          navigate('/login');
        }
        return;
      }
      setProjects(response);
    }

    getProjects();

  }, [0]);

  const projectsDisplay = projects.map((project) => (
    <div key={project.project_id} className="project-card" style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '300px', cursor: 'pointer' }}>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>
  ));

  return (
    <div>
      <ProjectsHeader />
      <p>This is the Projects page of the Documentation Platform.</p>
      <div>
        <button onClick={() => setShowCreateMenu(!showCreateMenu)}>{showCreateMenu ? '-' : '+'}</button>
      </div>
      {showCreateMenu && <CreateProjectMenu />}
      <div className="projects-list">
        {projectsDisplay.length > 0 ? projectsDisplay : <p>You arent a part of a project yet, why not make one.</p>}
      </div>
    </div>
  );
}