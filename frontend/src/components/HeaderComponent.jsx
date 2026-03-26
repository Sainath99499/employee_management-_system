import React from 'react';
import { Link } from 'react-router-dom';

const HeaderComponent = () => {
    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="brand">
                    <span>Etsy</span>HR
                </Link>
                <nav>
                    <Link to="/employees" className="btn btn-secondary">Employees</Link>
                </nav>
            </div>
        </header>
    );
};

export default HeaderComponent;
