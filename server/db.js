import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory and database file path
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'portfolio.db');

export const db = new DatabaseSync(DB_PATH);

// Optimize database performance with WAL mode
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      client TEXT,
      year TEXT,
      description TEXT,
      thumbnail TEXT,
      images TEXT,
      category TEXT,
      service TEXT,
      tags TEXT,
      topic TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  seedDefaultData();
};

// Seed portfolio projects if database is empty
const seedDefaultData = () => {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (countRow.count === 0) {
    console.log('🌱 Seeding initial portfolio projects into database...');

    const defaultProjects = [
      {
        id: 'skate-or-die',
        client: 'ZERO',
        title: 'SKATE OR DIE',
        thumbnail: 'https://images.unsplash.com/photo-1564245663738-958434771f8e?w=1200',
        description: 'A high-octane skateboarding campaign for ZERO, capturing the raw energy of urban street culture. This project involved multi-city shoots and a heavy emphasis on dynamic motion blur and gritty textures.',
        year: '2023',
        category: 'Creative Direction',
        service: 'Creative Direction, Photography, Motion',
        topic: 'SKATE OR DIE',
        tags: ['Creative Direction', 'Photography', 'Motion'],
        images: [
          'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800',
          'https://images.unsplash.com/photo-1520156584189-dd165846756d?w=800'
        ]
      },
      {
        id: 'bassman',
        client: 'FENDER',
        title: 'BASSMAN',
        thumbnail: 'https://images.unsplash.com/photo-1525926477800-7a3be5800fcb?w=1200',
        description: 'Celebrating the legacy of the Fender Bassman amplifier. We focused on the iconic design and the soulful sound that defined generations of music. The aesthetic is clean, minimalist, and timeless.',
        year: '2023',
        category: 'Branding',
        service: 'Branding, Studio, Sound Design',
        topic: 'BASSMAN',
        tags: ['Branding', 'Studio', 'Sound Design'],
        images: [
          'https://images.unsplash.com/photo-1550985543-f47f38aee65e?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ]
      },
      {
        id: 'come-rain-or-shine',
        client: 'REDBULL',
        title: 'COME RAIN OR SHINE',
        thumbnail: 'https://images.unsplash.com/photo-1627443152648-52b860b7301c?w=1200',
        description: 'An extreme sports documentary featuring athletes pushing their limits in the most challenging weather conditions. Rain, mud, and lightning served as the backdrop for this intense visual journey.',
        year: '2022',
        category: 'Documentary',
        service: 'Documentary, Action, Post-Production',
        topic: 'COME RAIN OR SHINE',
        tags: ['Documentary', 'Action', 'Post-Production'],
        images: [
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
        ]
      },
      {
        id: 'unleash-your-power',
        client: 'EVERLAST',
        title: 'UNLEASH YOUR POWER',
        thumbnail: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=1200',
        description: 'A powerful brand activation for Everlast, focusing on the mental and physical strength of boxing. High-contrast lighting and slow-motion shots highlight the impact and dedication of the sport.',
        year: '2022',
        category: 'Commercial',
        service: 'Commercial, Sports, VFX',
        topic: 'UNLEASH YOUR POWER',
        tags: ['Commercial', 'Sports', 'VFX'],
        images: [
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
          'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800'
        ]
      },
      {
        id: 'joga-bonito',
        client: 'NIKE',
        title: 'JOGA BONITO 5.0',
        thumbnail: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200',
        description: 'Reimagining the classic Nike Joga Bonito campaign for a new generation. We explored the beauty of the game through vibrant colors and fluid transitions, celebrating joy and skill on the pitch.',
        year: '2024',
        category: 'Campaign',
        service: 'Campaign, Fashion, Edit',
        topic: 'JOGA BONITO 5.0',
        tags: ['Campaign', 'Fashion', 'Edit'],
        images: [
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
          'https://images.unsplash.com/photo-1529900664417-0fd4bd366d60?w=800'
        ]
      },
      {
        id: 'inner-volume',
        client: 'SPOTIFY',
        title: 'TURN UP THE INNER VOLUME',
        thumbnail: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200',
        description: 'An immersive digital experience for Spotify, encouraging users to find their focus through music. The project featured abstract 3D animations synced to custom soundscapes.',
        year: '2024',
        category: 'Digital',
        service: 'Digital, UI/UX, Experimental',
        topic: 'TURN UP THE INNER VOLUME',
        tags: ['Digital', 'UI/UX', 'Experimental'],
        images: [
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
          'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800'
        ]
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO projects (id, title, client, year, description, thumbnail, images, category, service, tags, topic, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    defaultProjects.forEach((p, idx) => {
      insertStmt.run(
        p.id,
        p.title,
        p.client,
        p.year,
        p.description,
        p.thumbnail,
        JSON.stringify(p.images || []),
        p.category,
        p.service,
        JSON.stringify(p.tags || []),
        p.topic || p.title,
        idx,
        now,
        now
      );
    });

    console.log(`✅ Seeded ${defaultProjects.length} projects successfully.`);
  }

  // Seed default site settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get();
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
    `);
    const now = new Date().toISOString();

    insertSetting.run(
      'about',
      JSON.stringify({
        title: 'About The Studio',
        bio: 'With over 5 years of experience in digital design and engineering, I help businesses bring their vision to life through minimal design and efficient engineering. Our methodology focuses on clean typography, open space, and perfect motion.',
        location: 'Cambodia',
        availability: 'Active.24',
        email: 'hello@kakkhean.com'
      }),
      now
    );

    insertSetting.run(
      'contact',
      JSON.stringify({
        email: 'hello@kakkhean.com',
        phone: '+855 12 345 678',
        address: 'Phnom Penh, Cambodia',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/kakkfr_',
        linkedin: 'https://linkedin.com/in/'
      }),
      now
    );

    insertSetting.run(
      'gallery',
      JSON.stringify([
        'https://images.unsplash.com/photo-1564245663738-958434771f8e?w=800',
        'https://images.unsplash.com/photo-1525926477800-7a3be5800fcb?w=800',
        'https://images.unsplash.com/photo-1627443152648-52b860b7301c?w=800',
        'https://images.unsplash.com/photo-1549476464-37392f717541?w=800'
      ]),
      now
    );

    console.log('✅ Seeded default site settings.');
  }
};

// Database helper functions
export const getProjects = () => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all();
  return rows.map(formatProjectRow);
};

export const getProject = (id) => {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return row ? formatProjectRow(row) : null;
};

export const insertProject = (project) => {
  const id = project.id || `proj_${Date.now()}`;
  const now = new Date().toISOString();
  const images = Array.isArray(project.images) ? JSON.stringify(project.images) : (project.images || '[]');
  const tags = Array.isArray(project.tags) ? JSON.stringify(project.tags) : (project.tags || '[]');
  const thumbnail = project.thumbnail || project.img || '';

  const stmt = db.prepare(`
    INSERT INTO projects (id, title, client, year, description, thumbnail, images, category, service, tags, topic, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    project.title || 'Untitled Project',
    project.client || '',
    project.year || new Date().getFullYear().toString(),
    project.description || '',
    thumbnail,
    images,
    project.category || (project.tags && project.tags[0]) || 'Project',
    project.service || '',
    tags,
    project.topic || project.title || '',
    project.sort_order || 0,
    project.createdAt || now,
    now
  );

  return getProject(id);
};

export const updateProjectInDb = (id, project) => {
  const existing = getProject(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const title = project.title !== undefined ? project.title : existing.title;
  const client = project.client !== undefined ? project.client : existing.client;
  const year = project.year !== undefined ? project.year : existing.year;
  const description = project.description !== undefined ? project.description : existing.description;
  const thumbnail = project.thumbnail !== undefined ? project.thumbnail : (project.img !== undefined ? project.img : existing.thumbnail);
  const images = project.images !== undefined ? JSON.stringify(project.images) : JSON.stringify(existing.images);
  const category = project.category !== undefined ? project.category : existing.category;
  const service = project.service !== undefined ? project.service : existing.service;
  const tags = project.tags !== undefined ? JSON.stringify(project.tags) : JSON.stringify(existing.tags);
  const topic = project.topic !== undefined ? project.topic : existing.topic;
  const sortOrder = project.sort_order !== undefined ? project.sort_order : existing.sort_order;

  const stmt = db.prepare(`
    UPDATE projects
    SET title = ?, client = ?, year = ?, description = ?, thumbnail = ?, images = ?, category = ?, service = ?, tags = ?, topic = ?, sort_order = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(title, client, year, description, thumbnail, images, category, service, tags, topic, sortOrder, now, id);
  return getProject(id);
};

export const deleteProjectFromDb = (id) => {
  const existing = getProject(id);
  if (!existing) return false;

  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  stmt.run(id);
  return true;
};

export const getAllSiteSettings = () => {
  const rows = db.prepare('SELECT * FROM site_settings').all();
  const settings = {};
  rows.forEach((r) => {
    try {
      settings[r.key] = JSON.parse(r.value);
    } catch {
      settings[r.key] = r.value;
    }
  });
  return settings;
};

export const updateSiteSettingInDb = (key, value) => {
  const now = new Date().toISOString();
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

  const stmt = db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `);

  stmt.run(key, valueStr, now);
  return value;
};

export const insertMessage = (name, email, message) => {
  const id = `msg_${Date.now()}`;
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO messages (id, name, email, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, name, email, message, now);
  return { id, name, email, message, created_at: now };
};

export const getMessages = () => {
  return db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
};

const formatProjectRow = (row) => {
  let images = [];
  let tags = [];
  try {
    images = JSON.parse(row.images || '[]');
  } catch {
    images = [];
  }
  try {
    tags = JSON.parse(row.tags || '[]');
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    title: row.title,
    client: row.client,
    year: row.year,
    description: row.description,
    thumbnail: row.thumbnail,
    img: row.thumbnail, // Public alias
    images,
    gallery: images, // ProjectDetail alias
    category: row.category,
    service: row.service,
    tags,
    topic: row.topic,
    sort_order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// Initialize DB schema and default data immediately on load
initDatabase();

