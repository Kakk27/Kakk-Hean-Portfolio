// src/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ images, setImages }) => {
  
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newUrls]);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ padding: '40px', background: '#111', minHeight: '100vh', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>KAKK Admin Dashboard</h1>
        <Link to="/" style={{ color: '#E6E0D5', textDecoration: 'none', border: '1px solid #E6E0D5', padding: '10px 20px', borderRadius: '5px' }}>
          View 3D Site &rarr;
        </Link>
      </div>

      {/* Upload Section */}
      <div style={{ background: '#222', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Upload New Images</h3>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleUpload} 
          style={{ marginTop: '10px' }}
        />
      </div>

      {/* Gallery Preview */}
      <h3>Current Gallery ({images.length} items)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {images.map((img, index) => (
          <div key={index} style={{ position: 'relative', border: '1px solid #444', borderRadius: '5px', overflow: 'hidden' }}>
            <img src={img} alt="upload" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
            <button 
              onClick={() => removeImage(index)}
              style={{ 
                position: 'absolute', top: 0, right: 0, 
                background: 'red', color: 'white', border: 'none', 
                cursor: 'pointer', padding: '5px 10px' 
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;