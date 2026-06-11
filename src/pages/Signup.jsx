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
//   Java equivalent: A class field with a setter that triggers UI refresh.

import { useNavigate, Link } from 'react-router-dom';
// ▲ useNavigate — returns a function to programmatically change the URL
//   Like Spring's "redirect:/login" but from the client side.
//   Link — renders an <a> tag that navigates without page reload.

import { apiRequest } from '../utils/api';

function Signup() {
    // useNavigate() returns a function we can call to redirect the user
    // navigate('/login') → changes URL to /login and shows Login component
    const navigate = useNavigate();

    // ─── STATE DECLARATIONS ───
    // useState(initialValue) returns [currentValue, setterFunction]
    // Every time you call the setter, React re-renders this component
    //
    // Java equivalent (conceptually):
    //   private String email = "";
    //   public void setEmail(String e) { this.email = e; notifyUI(); }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storageType, setStorageType] = useState('file');  // Default selection
    const [error, setError] = useState('');  // Error message to display

    // ─── FORM SUBMISSION HANDLER ───
    // Called when the user clicks "Sign Up"
    // We prevent the default browser form submit (which would reload the page)
    // and handle it ourselves with fetch()
    const handleSubmit = async (e) => {
        // e.preventDefault() — CRITICAL in React forms!
        // Without this, the browser does a traditional form POST which reloads the page.
        // In React, we NEVER want full page reloads — we handle everything in JS.
        // Spring equivalent: There IS no equivalent — in Thymeleaf, form submission
        // IS the default behavior. In React, you intercept and handle manually.
        e.preventDefault();
        setError('');  // Clear any previous error

        // Basic frontend validation (backend validates too, this is just UX)
        if (!email || !password) {
            setError('Email and password are required');
            return;  // Stop here, don't send request
        }

        // Send registration request to backend
        const result = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, storage_type: storageType })
            // JSON.stringify converts JS object → JSON string for the request body
            // Spring equivalent: Jackson serializes your DTO automatically with @RequestBody
            // In frontend JS, you must manually stringify.
        });

        if (result && result.ok) {
            // Success! Navigate to login page so user can log in
            navigate('/login');
        } else if (result) {
            // Show the error message from the backend
            setError(result.data.error || 'Registration failed');
        }
    };

    // ─── JSX (the "template") ───
    // JSX looks like HTML but it's actually JavaScript.
    // It compiles to React.createElement() calls.
    // Spring equivalent: Thymeleaf HTML template with th:if, th:each, th:action
    return (
        <div>
            <h1>Sign Up</h1>

            {/* Conditional rendering: only show error if it exists */}
            {/* This is like th:if="${error}" in Thymeleaf */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* onSubmit triggers our handleSubmit function */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    {/* value={email} + onChange → "controlled input" (two-way binding) */}
                    {/* Every keystroke updates state, state controls what's displayed */}
                    {/* Spring/Thymeleaf equivalent: th:field="*{email}" */}
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

                <div>
                    <label>Storage Type: </label>
                    {/* <select> with value + onChange = controlled dropdown */}
                    <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
                        <option value="file">File Storage</option>
                        <option value="mongodb">MongoDB</option>
                    </select>
                </div>

                <button type="submit">Sign Up</button>
            </form>

            {/* Link navigates without page reload (client-side routing) */}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Signup;