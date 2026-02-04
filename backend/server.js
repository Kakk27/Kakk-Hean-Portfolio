const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data (Moved from projectsData.js)
const projects = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        img: '01',
        tags: ['Web Development', 'UI/UX'],
        client: 'TechStore Inc.',
        year: '2024',
        description: 'Developed a comprehensive e-commerce platform with advanced features including real-time inventory management, secure payment processing, and personalized user experiences.',
        gallery: ['Primary View', 'Detail View']
    },
    {
        id: 2,
        title: 'Brand Identity Design',
        img: '02',
        tags: ['Branding', 'Strategy'],
        client: 'Creative Studio',
        year: '2024',
        description: 'Created a complete brand identity system including logo design, color palette, typography, and brand guidelines. The project involved extensive market research.',
        gallery: ['Brand System', 'Applications']
    },
    // ... add more as needed
];

// Routes
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') {
        res.json({ success: true, token: 'mock-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
