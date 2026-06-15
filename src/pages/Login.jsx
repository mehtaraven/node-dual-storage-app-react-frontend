// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE — Authenticate and receive a JWT token
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the page refresh on form submit
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result && result.ok) {
            localStorage.setItem('token', result.data.token); // Store JWT in localStorage
            navigate('/dashboard'); // Redirect to dashboard
        } else if (result) {
            setError(result.data.error || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px' }}>
            <h1 style={{ marginBottom: '50px' }}>Login</h1>

            {/* Show error message if login fails */}
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* Each row: flex container with fixed-width label + flex input */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <label style={{ width: '90px', fontWeight: 'bold' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <label style={{ width: '90px', fontWeight: 'bold' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px', cursor: 'pointer', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '15px' }}
                >
                    Login
                </button>
            </form>

            {/* Link navigates without page reload (client-side routing) */}
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}

export default Login;
