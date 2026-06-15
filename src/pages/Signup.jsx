// ─────────────────────────────────────────────────────────────────────────────
// SIGNUP PAGE — Register a new user with email, password, and storage type
// ─────────────────────────────────────────────────────────────────────────────
// React components are FUNCTIONS that return JSX (HTML-like syntax).
// They re-render whenever their STATE changes (like a LiveData/Observable pattern).
//
// Spring/Thymeleaf equivalent: A signup.html template with a <form> that
// submits to POST /api/auth/register. But here, we prevent the default
// form submission and use fetch() instead (no page reload).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
// ▲ useState is a "React Hook" — it lets you declare state variables in a function component.
//   When state changes, React re-renders the component (like calling invalidate() on a view).

import { useNavigate, Link } from 'react-router-dom';
// ▲ useNavigate — programmatically change the URL (like Spring's "redirect:/login")
//   Link — renders an <a> tag that navigates without page reload.

import { apiRequest } from '../utils/api';

function Signup() {
    const navigate = useNavigate();

    // ─── STATE DECLARATIONS ───
    // useState(initialValue) returns [currentValue, setterFunction]
    // Every time you call the setter, React re-renders this component
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storageType, setStorageType] = useState('file');  // Default selection
    const [error, setError] = useState('');

    // ─── FORM SUBMISSION HANDLER ───
    const handleSubmit = async (e) => {
        // e.preventDefault() — CRITICAL in React forms!
        // Without this, the browser does a traditional form POST which reloads the page.
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        // Send registration request to backend
        const result = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, storage_type: storageType })
            // JSON.stringify converts JS object → JSON string for the request body
        });

        if (result && result.ok) {
            navigate('/login'); // Success → go to login
        } else if (result) {
            setError(result.data.error || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '60px auto', padding: '30px' }}>
            <h1 style={{ marginBottom: '50px' }}>Sign Up</h1>

            {/* Conditional rendering: only show error if it exists */}
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

            {/* onSubmit triggers our handleSubmit function */}
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <label style={{ width: '120px', fontWeight: 'bold' }}>Email:</label>
                    {/* value + onChange = "controlled input" (two-way binding) */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <label style={{ width: '120px', fontWeight: 'bold' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <label style={{ width: '120px', fontWeight: 'bold' }}>Storage Type:</label>
                    {/* <select> with value + onChange = controlled dropdown */}
                    <select
                        value={storageType}
                        onChange={(e) => setStorageType(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="file">File Storage</option>
                        <option value="mongodb">MongoDB</option>
                    </select>
                </div>

                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px', cursor: 'pointer', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '15px' }}
                >
                    Sign Up
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Signup;
