import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import KakkTunnel from './KakkTunnel';
import Dashboard from './Dashboard';
import Contact from './Contact';
import About from './About';
import Work from './Work';
import ProjectDetail from './ProjectDetail';
import Login from './Login';
import GrainOverlay from './components/GrainOverlay';
import { SiteDataProvider } from './SiteDataContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <SiteDataProvider>
      <Router>
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <GrainOverlay />
          <Routes>
            {/* Route 1: The 3D Tunnel Website */}
            <Route path="/" element={
              <>
                <KakkTunnel />
                <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999, pointerEvents: 'auto' }}>
                  <Link to="/admin" style={{ color: 'rgba(255,255,255,0.05)', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    ADMIN // AREA
                  </Link>
                </div>
              </>
            } />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Route 2: The Dashboard (Protected) */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Public Pages */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:projectId" element={<ProjectDetail />} />
          </Routes>
        </div>
      </Router>
    </SiteDataProvider>
  );
}

export default App;
