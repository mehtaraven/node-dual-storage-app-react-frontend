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
        e.preventDefault();
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
            // ── THE KEY STEP ──
            // Store the JWT token in localStorage
            // From now on, apiRequest() will auto-attach it to every request
            //
            // localStorage is like a browser-side key-value store that persists
            // across page refreshes and browser restarts (until manually cleared).
            //
            // Spring equivalent: Setting a session cookie that the browser
            // automatically sends with every subsequent request.
            // But here it's a manual token in Authorization header, not a cookie.
            localStorage.setItem('token', result.data.token);

            // Redirect to dashboard
            navigate('/dashboard');
        } else if (result) {
            setError(result.data.error || 'Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
}

export default Login;