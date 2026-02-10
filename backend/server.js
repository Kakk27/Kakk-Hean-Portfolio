const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Increase limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DATA_FILE = path.join(__dirname, 'data', 'projects.json');

// Helper to read data
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // Ensure directory exists
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DATA_FILE, '[]');
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
};

// Routes

// GET all projects
app.get('/api/projects', (req, res) => {
    const projects = readData();
    // Sort by id or year descending if you like, but basic default is fine
    res.json(projects);
});

// GET single project
app.get('/api/projects/:id', (req, res) => {
    const projects = readData();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
});

// POST new project
app.post('/api/projects', (req, res) => {
    const projects = readData();
    const newProject = {
        ...req.body,
        id: req.body.id || Date.now().toString() // Generate ID if not provided
    };

    projects.unshift(newProject); // Add to beginning
    if (writeData(projects)) {
        res.status(201).json(newProject);
    } else {
        res.status(500).json({ message: 'Failed to save project' });
    }
});

// PUT update project
app.put('/api/projects/:id', (req, res) => {
    const projects = readData();
    const index = projects.findIndex(p => p.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: 'Project not found' });

    const updatedProject = { ...projects[index], ...req.body };
    projects[index] = updatedProject;

    if (writeData(projects)) {
        res.json(updatedProject);
    } else {
        res.status(500).json({ message: 'Failed to update project' });
    }
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
    const projects = readData();
    const filteredProjects = projects.filter(p => p.id !== req.params.id);

    if (projects.length === filteredProjects.length) {
        return res.status(404).json({ message: 'Project not found' });
    }

    if (writeData(filteredProjects)) {
        res.json({ message: 'Project deleted successfully' });
    } else {
        res.status(500).json({ message: 'Failed to delete project' });
    }
});

// Auth Route
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    // In a real app, use hashed passwords and a database
    if (password === 'admin122') {
        res.json({ success: true, token: 'mock-jwt-token-kakk-portfolio', user: { name: 'Admin', role: 'owner' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
