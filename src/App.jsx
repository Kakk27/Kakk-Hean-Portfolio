import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import KakkTunnel from './KakkTunnel';
import Dashboard from './Dashboard';
import Contact from './Contact';
import About from './About';
import Work from './Work';
import ProjectDetail from './ProjectDetail';

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
        <Snowfall
          color="white"
          snowflakeCount={150}
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        />
        <Routes>
          {/* Route 1: The 3D Tunnel Website */}
          <Route path="/" element={
            <>
              <KakkTunnel images={images} />
              {/* Hidden Admin Link at bottom left */}
              <Link to="/admin" style={{ position: 'fixed', bottom: 10, left: 10, color: '#333', textDecoration: 'none', fontSize: '12px', zIndex: 200 }}>
                Admin
              </Link>
            </>
          } />

          {/* Route 2: The Dashboard */}
          <Route path="/admin" element={
            <Dashboard
              images={images}
              setImages={setImages}
              aboutData={aboutData}
              setAboutData={setAboutData}
            />
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
