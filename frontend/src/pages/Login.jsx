import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';

export default function Login() {
    const navigate = useNavigate();

    async function handleLogin() {
        const email = document.getElementById('emailInput');
        const password = document.getElementById('passwordInput');

        const response = await login(email.value, password.value);
        sessionStorage.setItem('token', response.token);
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