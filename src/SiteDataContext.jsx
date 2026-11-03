// src/SiteDataContext.jsx
// Central data store shared between Dashboard (write) and public pages (read)
// Backed by SQLite database via REST API
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProjects, fetchSiteData, updateSiteData, deleteProject } from './services/api';
import { fallbackProjects } from './projectsData';

const SiteDataContext = createContext(null);

export const useSiteData = () => {
    const ctx = useContext(SiteDataContext);
    if (!ctx) throw new Error('useSiteData must be used inside SiteDataProvider');
    return ctx;
};

// Helper: map raw API/fallback project → normalised shape
export const mapProject = (p) => ({
    id: p.id,
    title: p.title || 'Untitled Project',
    img: p.thumbnail || p.img || '',
    thumbnail: p.thumbnail || p.img || '',
    category: p.category || (p.tags && p.tags[0]) || 'Project',
    client: p.client || '',
    year: p.year || new Date().getFullYear().toString(),
    service: p.service || (p.tags ? p.tags.join(', ') : ''),
    topic: p.topic || p.title || '',
    description: p.description || '',
    tags: Array.isArray(p.tags) ? p.tags : (p.service ? p.service.split(',').map(s => s.trim()) : []),
    primaryImage: (p.images && p.images[0]) || (p.gallery && p.gallery[0]) || '',
    secondaryImage: (p.images && p.images[1]) || (p.gallery && p.gallery[1]) || '',
    images: Array.isArray(p.images) && p.images.length ? p.images : (Array.isArray(p.gallery) ? p.gallery : []),
    gallery: Array.isArray(p.images) && p.images.length ? p.images : (Array.isArray(p.gallery) ? p.gallery : []),
});

export const SiteDataProvider = ({ children }) => {
    // ─── About Data ────────────────────────────────────────────────
    const [aboutData, setAboutData] = useState({
        title: 'About The Studio',
        bio: 'With over 5 years of experience in digital design and engineering, I help businesses bring their vision to life through minimal design and efficient engineering. Our methodology focuses on clean typography, open space, and perfect motion.',
        location: 'Cambodia',
        availability: 'Active.24',
        email: 'hello@kakkhean.com',
    });

    // ─── Contact Data ──────────────────────────────────────────────
    const [contactData, setContactData] = useState({
        email: 'hello@kakkhean.com',
        phone: '+855 12 345 678',
        address: 'Phnom Penh, Cambodia',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/kakkfr_',
        linkedin: 'https://linkedin.com/in/',
    });

    // ─── Gallery / Hero Images ─────────────────────────────────────
    const [images, setImages] = useState([
        'https://images.unsplash.com/photo-1564245663738-958434771f8e?w=800',
        'https://images.unsplash.com/photo-1525926477800-7a3be5800fcb?w=800',
        'https://images.unsplash.com/photo-1627443152648-52b860b7301c?w=800',
        'https://images.unsplash.com/photo-1549476464-37392f717541?w=800'
    ]);

    // ─── 3D Tunnel Config (Admin Dev Studio) ──────────────────────
    const [tunnelConfig, setTunnelConfig] = useState(null);

    // ─── Work Projects ─────────────────────────────────────────────
    const [workProjects, setWorkProjects] = useState(() => fallbackProjects.map(mapProject));
    const [isLoading, setIsLoading] = useState(true);

    const loadWorkProjects = useCallback(async () => {
        try {
            const data = await fetchProjects();
            if (data && data.length > 0) {
                setWorkProjects(data.map(mapProject));
            }
        } catch (err) {
            console.error('Failed to load projects:', err);
        }
    }, []);

    const loadSiteSettings = useCallback(async () => {
        try {
            const settings = await fetchSiteData();
            if (settings) {
                if (settings.about && Object.keys(settings.about).length > 0) {
                    setAboutData(prev => ({ ...prev, ...settings.about }));
                }
                if (settings.contact && Object.keys(settings.contact).length > 0) {
                    setContactData(prev => ({ ...prev, ...settings.contact }));
                }
                if (Array.isArray(settings.gallery) && settings.gallery.length > 0) {
                    setImages(settings.gallery);
                }
                if (settings.tunnelConfig) {
                    setTunnelConfig(settings.tunnelConfig);
                }
            }
        } catch (err) {
            console.error('Failed to load site settings:', err);
        }
    }, []);

    // Save and sync settings with database
    const saveAboutData = async (newAbout) => {
        setAboutData(newAbout);
        try {
            await updateSiteData({ key: 'about', value: newAbout });
        } catch (err) {
            console.error('Failed to persist about data to database:', err);
        }
    };

    const saveContactData = async (newContact) => {
        setContactData(newContact);
        try {
            await updateSiteData({ key: 'contact', value: newContact });
        } catch (err) {
            console.error('Failed to persist contact data to database:', err);
        }
    };

    const saveImages = async (newImages) => {
        setImages(newImages);
        try {
            await updateSiteData({ key: 'gallery', value: newImages });
        } catch (err) {
            console.error('Failed to persist gallery to database:', err);
        }
    };

    const saveTunnelConfig = async (newConfig) => {
        setTunnelConfig(newConfig);
        try {
            await updateSiteData({ key: 'tunnelConfig', value: newConfig });
            return true;
        } catch (err) {
            console.error('Failed to persist tunnel config to database:', err);
            throw err;
        }
    };

    const resetTunnelConfig = async () => {
        setTunnelConfig(null);
        try {
            await updateSiteData({ key: 'tunnelConfig', value: null });
            return true;
        } catch (err) {
            console.error('Failed to reset tunnel config in database:', err);
            throw err;
        }
    };

    const deleteWorkProject = async (id) => {
        try {
            await deleteProject(id);
            setWorkProjects(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (err) {
            console.error('Failed to delete project:', err);
            throw err;
        }
    };

    useEffect(() => {
        Promise.all([loadWorkProjects(), loadSiteSettings()]).finally(() => {
            setIsLoading(false);
        });
    }, [loadWorkProjects, loadSiteSettings]);

    return (
        <SiteDataContext.Provider
            value={{
                isLoading,
                // About
                aboutData,
                setAboutData,
                saveAboutData,
                // Contact
                contactData,
                setContactData,
                saveContactData,
                // Gallery
                images,
                setImages,
                saveImages,
                // 3D Tunnel Config
                tunnelConfig,
                setTunnelConfig,
                saveTunnelConfig,
                resetTunnelConfig,
                // Work
                workProjects,
                setWorkProjects,
                loadWorkProjects,
                deleteWorkProject,
                mapProject,
            }}
        >
            {children}
        </SiteDataContext.Provider>
    );
};
