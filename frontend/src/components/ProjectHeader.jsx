import ProjectSettings from './ProjectSettings';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectHeader(props) {
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        setShowSettings(!showSettings);
    }

    return (
        <div>
            <h1>Project Header</h1>
            <button onClick={handleSettingsClick}>Settings</button>
            <button onClick={() => navigate('/projects')}>Back to Projects</button>
            {showSettings && <ProjectSettings project={props.project} />}
        </div>
    );
}