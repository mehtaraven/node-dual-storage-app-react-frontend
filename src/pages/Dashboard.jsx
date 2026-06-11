// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD — The main authenticated page
// ─────────────────────────────────────────────────────────────────────────────
// This is a "protected page" — if you're not logged in, you get redirected.
// Contains the Records section for managing business data.
//
// Spring equivalent: A page behind Spring Security's .authenticated() rule.
// If no valid session exists, Spring redirects to /login automatically.
// Here, we check manually in useEffect.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordsSection from '../components/RecordsSection';
import UserInfo from '../components/UserInfo';

function Dashboard() {
    const navigate = useNavigate();

    // useEffect runs AFTER the component renders (like @PostConstruct in Spring)
    // The [] means "run only once on mount" (not on every re-render)
    // Without [], it would run on EVERY state change — infinite loops!
    useEffect(() => {
        // Route guard: check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            // No token = not logged in = redirect to login
            // Spring equivalent: Spring Security's AuthenticationEntryPoint
            navigate('/login');
        }
    }, [navigate]);
    // ▲ [navigate] is the "dependency array" — React re-runs the effect
    //   if any value in this array changes. navigate is stable so it
    //   effectively means "run once on mount".

    const handleLogout = () => {
        // Remove the token from localStorage (destroys the "session")
        // Spring equivalent: SecurityContextHolder.clearContext() + session.invalidate()
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            <hr />
            <UserInfo />
            <hr />
            <RecordsSection />
        </div>
    );
}

export default Dashboard;