import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const HeaderComponent = () => {
    const { user, isAdmin, clearUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) { /* ignore */ }
        clearUser();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="brand">EMS</Link>

                <nav className="nav-links">
                    {user && isAdmin() && (
                        <>
                            <Link to="/employees" className="nav-link">Employees</Link>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </>
                    )}
                    {user && !isAdmin() && user.employeeId && (
                        <Link to={`/employees/${user.employeeId}`} className="nav-link">My Profile</Link>
                    )}
                </nav>

                <div className="header-actions">
                    {user && (
                        <>
                            <span className="username-tag">
                                {user.username}
                                <span className="role-badge">{isAdmin() ? 'Admin' : 'Employee'}</span>
                            </span>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderComponent;
