import RecordsSection from '../components/RecordsSection';
import UserInfo from '../components/UserInfo';
import FormBuilder from './FormBuilder';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('user');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Decode role from JWT
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.role || 'user');
        } catch (e) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <UserInfo />
            <RecordsSection />

            {/* Only admins see the Form Builder */}
            {userRole === 'admin' && (
                <>
                    <hr style={{ margin: '210px 0' }} />
                    <FormBuilder />
                </>
            )}
        </div>
    );
}

export default Dashboard;