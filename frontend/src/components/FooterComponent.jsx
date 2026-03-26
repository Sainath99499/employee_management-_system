import React from 'react';

const FooterComponent = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span>© {new Date().getFullYear()} EtsyHR Employee Management. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default FooterComponent;
