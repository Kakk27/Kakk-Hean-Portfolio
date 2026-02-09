import React from 'react';
import { useLocation } from 'react-router-dom';

const GrainOverlay = () => {
    const location = useLocation();
    // Check if the current path starts with /admin (Dashboard)
    const isDashboard = location.pathname.startsWith('/admin');

    // Don't show grain on dashboard
    if (isDashboard) return null;

    return <div className="bg-grain"></div>;
};

export default GrainOverlay;
