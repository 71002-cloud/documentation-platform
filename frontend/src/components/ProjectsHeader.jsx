import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectsHeader() {
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    const showProfileToggle = () => {
        setShowProfile(!showProfile);
    }
    return (
        <header>
            <h1>Projects Page</h1>
            <button onClick={showProfileToggle}>Profile</button>
            {showProfile && (
                <div>
                    <p>Name: {JSON.parse(sessionStorage.getItem('user')).name}</p>
                    <p>Role: {JSON.parse(sessionStorage.getItem('user')).role}</p>
                    <button onClick={() => {
                        sessionStorage.removeItem('user');
                        sessionStorage.removeItem('token');
                        navigate('/login');
                    }}>
                        Logout
                    </button>
                </div>
            )}
        </header>
    )
}