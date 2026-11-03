import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  getProjects,
  getProject,
  insertProject,
  updateProjectInDb,
  deleteProjectFromDb,
  getAllSiteSettings,
  updateSiteSettingInDb,
  insertMessage,
  getMessages,
  db
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'karonahean123@HEAN';

// Uploads directory configuration
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueName = `${cleanBase || 'upload'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));
// Generous limit for high-resolution images & portfolio assets
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });
}

// ─── API Routes ─────────────────────────────────────────────────────────────

// Health Check
app.get('/api/health', (req, res) => {
  try {
    const projects = getProjects();
    res.json({
      status: 'ok',
      database: 'sqlite-connected',
      projectsCount: projects.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Image Upload Endpoint (Multipart Form Data)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, message: 'Image upload failed', error: err.message });
  }
});

// Image Upload Endpoint (Base64 fallback)
app.post('/api/upload/base64', (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 image data' });
    }

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    let ext = '.jpg';
    if (mime.includes('png')) ext = '.png';
    else if (mime.includes('webp')) ext = '.webp';
    else if (mime.includes('svg')) ext = '.svg';
    else if (mime.includes('gif')) ext = '.gif';

    const filename = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      size: buffer.length
    });
  } catch (err) {
    console.error('Base64 upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to process base64 upload', error: err.message });
  }
});

// Admin Authentication
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  // Support primary password and backward compatibility credentials
  const validPasswords = [ADMIN_PASSWORD, 'karonahean123@HEAN', 'admin122', 'admin123'];
  if (validPasswords.includes(password)) {
    const token = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    return res.json({
      success: true,
      token,
      user: {
        name: 'Kakk Hean',
        email: 'hello@kakkhean.com',
        role: 'owner'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
});

// ─── Projects CRUD ─────────────────────────────────────────────────────────

// GET all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// GET single project
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
});

// POST create project
app.post('/api/projects', (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const created = insertProject(req.body);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

// PUT update project
app.put('/api/projects/:id', (req, res) => {
  try {
    const updated = updateProjectInDb(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const success = deleteProjectFromDb(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

// ─── Site Settings (About, Contact, Gallery) ────────────────────────────────

// GET all site settings
app.get('/api/site-data', (req, res) => {
  try {
    const settings = getAllSiteSettings();
    res.json({
      about: settings.about || {},
      contact: settings.contact || {},
      gallery: settings.gallery || [],
      tunnelConfig: settings.tunnelConfig || null
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Failed to fetch site settings', error: error.message });
  }
});

// PUT update site settings
app.put('/api/site-data', (req, res) => {
  try {
    const { key, value, about, contact, gallery, tunnelConfig } = req.body;

    if (key && value !== undefined) {
      updateSiteSettingInDb(key, value);
    } else {
      if (about !== undefined) updateSiteSettingInDb('about', about);
      if (contact !== undefined) updateSiteSettingInDb('contact', contact);
      if (gallery !== undefined) updateSiteSettingInDb('gallery', gallery);
      if (tunnelConfig !== undefined) updateSiteSettingInDb('tunnelConfig', tunnelConfig);
    }

    const updated = getAllSiteSettings();
    res.json({
      success: true,
      about: updated.about || {},
      contact: updated.contact || {},
      gallery: updated.gallery || [],
      tunnelConfig: updated.tunnelConfig || null
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ message: 'Failed to update site settings', error: error.message });
  }
});

// ─── Contact Form Messages ──────────────────────────────────────────────────

// POST submit contact message
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const saved = insertMessage(name, email, message);
    res.status(201).json({ success: true, message: 'Message sent successfully', data: saved });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to save message', error: error.message });
  }
});

// GET list messages (admin)
app.get('/api/contact/messages', (req, res) => {
  try {
    const messages = getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

// ─── Static Production Serving & SPA Fallback ───────────────────────────────

const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1d' }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Portfolio Database Server running at http://localhost:${PORT}`);
  console.log(`📦 Database path: ${process.env.DATABASE_PATH || path.join(path.dirname(__dirname), 'data', 'portfolio.db')}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server and closing database...');
  server.close(() => {
    try {
      db.close();
      console.log('Database connection closed.');
    } catch {}
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

