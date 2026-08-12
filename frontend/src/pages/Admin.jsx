import { useState } from 'react';
import { createUser, deleteUser } from '../api/admin.js';

export default function Admin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');

    const handleDeleteUser = async (event) => {
        event.preventDefault();
        const response = await deleteUser(userId);
        console.log(response);
    }

    const handleCreateUser = async (event) => {
        event.preventDefault();
        const roleValue = role.toLowerCase();
        const user = { email, password, name, role: roleValue };
        console.log(user);

        const response = await createUser(email, password, name, roleValue);
        console.log(response);
    }
        

    return (
        <div>
            <h1>Admin Page</h1>
            <p>This is the Admin page of the Documentation Platform.</p>
            <div className="user-creation">
                <h2>Create User</h2>
                <form onSubmit={handleCreateUser}>
                    <input type="text" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password123" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    <p>if role is not "admin" it will be made user</p>
                    <input type="text" placeholder="admin/user" value={role} onChange={(e) => setRole(e.target.value)} />
                    <button type="submit">Create User</button>
                </form>
            </div>

            <div>
                <h3>Danger zone</h3>
                <p>Delete user by ID</p>
                <form onSubmit={handleDeleteUser}>
                    <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    <button type="submit">Delete User</button>
                </form>
            </div>
        </div>
    )
};