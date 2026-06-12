// DASHBOARD — main authenticated page
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordsSection from '../components/RecordsSection';
import UserInfo from '../components/UserInfo';

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        // Route guard: check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
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