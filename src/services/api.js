// src/services/api.js
// Client API layer communicating with the Portfolio Database backend
import { fallbackProjects } from '../projectsData';

const API_BASE = '/api';

/**
 * Admin Authentication
 */
export const login = async (password) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }
      return data;
    }

    return {
      success: false,
      message: data.message || 'Invalid credentials. Please try again.',
    };
  } catch (error) {
    console.warn('Network error during login, attempting local validation fallback:', error);
    // Offline / Demo fallback
    if (password === 'karonahean123@HEAN' || password === 'admin122' || password === 'admin123') {
      return {
        success: true,
        token: `mock-offline-token-${Date.now()}`,
        user: { name: 'Kakk Hean', role: 'owner' },
      };
    }
    return { success: false, message: 'Unable to connect to the database server.' };
  }
};

/**
 * Projects API
 */
export const fetchProjects = async () => {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
  } catch (error) {
    console.warn('Using fallback projects (server offline or starting):', error.message);
    return fallbackProjects;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Project not found');
    return await res.json();
  } catch (error) {
    console.warn(`Fetch project ${id} error:`, error.message);
    return fallbackProjects.find((p) => p.id === id) || null;
  }
};

export const createProject = async (projectData) => {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create project');
    }

    return await res.json();
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update project');
    }

    return await res.json();
  } catch (error) {
    console.error('Update project error:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete project');
    }

    return await res.json();
  } catch (error) {
    console.error('Delete project error:', error);
    throw error;
  }
};

/**
 * Site Settings API (About, Contact, Gallery)
 */
export const fetchSiteData = async () => {
  try {
    const res = await fetch(`${API_BASE}/site-data`);
    if (!res.ok) throw new Error('Failed to fetch site data');
    return await res.json();
  } catch (error) {
    console.warn('Could not load site data from server:', error.message);
    return null;
  }
};

export const updateSiteData = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/site-data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Failed to update site settings');
    return await res.json();
  } catch (error) {
    console.error('Update site data error:', error);
    throw error;
  }
};

/**
 * Contact Message Submission
 */
export const submitContactMessage = async (name, email, message) => {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send message');
    }

    return await res.json();
  } catch (error) {
    console.error('Submit contact message error:', error);
    throw error;
  }
};

/**
 * Image Upload API
 * Uploads a file to the server and returns { success: true, url: '/uploads/filename.ext' }
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Image upload failed');
    }

    return await res.json();
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
