import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import { useEffect } from 'react';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            navigate('/projects');
        }

    }, []);

    async function handleLogin() {
        const email = document.getElementById('emailInput');
        const password = document.getElementById('passwordInput');

        const response = await login(email.value, password.value);
        
        sessionStorage.setItem('token', response.token);
        const user = {role: response.user.role, name: response.user.name};
        sessionStorage.setItem('user', JSON.stringify(user));
        console.log(sessionStorage.getItem('user'));
        if (response.success) {
            navigate('/projects');
        }
    }

    return (
        <main>
            <h1>Login Page</h1>
            <input id="emailInput" type="text" placeholder="example@example.com" />
            <input id="passwordInput" type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </main>
    );
}