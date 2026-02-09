import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import KakkTunnel from './KakkTunnel';
import Dashboard from './Dashboard';
import Contact from './Contact';
import About from './About';
import Work from './Work';
import ProjectDetail from './ProjectDetail';
import Login from './Login';

import GrainOverlay from './components/GrainOverlay';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  // Central State: Holds the images for the whole app
  const [images, setImages] = useState([
    "https://picsum.photos/id/1015/600/400",
    "https://picsum.photos/id/1039/600/400",
    "https://picsum.photos/id/1047/600/400",
  ]);

  const [aboutData, setAboutData] = useState({
    title: "About The Studio",
    bio: "With over 5 years of experience in digital design and engineering, I help businesses bring their vision to life through minimal design and efficient engineering. Our methodology focuses on clean typography, open space, and perfect motion.",
    location: "Cambodia",
    availability: "Active.24",
    email: "hello@kakkhean.com"
  });

  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
        <GrainOverlay />
        <Routes>
          {/* Route 1: The 3D Tunnel Website */}
          <Route path="/" element={
            <>
              <KakkTunnel images={images} />
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
              <Dashboard
                images={images}
                setImages={setImages}
                aboutData={aboutData}
                setAboutData={setAboutData}
              />
            </ProtectedRoute>
          } />

          {/* ADD THIS ROUTE */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About aboutData={aboutData} />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:projectId" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
