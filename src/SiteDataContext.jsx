// src/SiteDataContext.jsx
// Central data store shared between Dashboard (write) and public pages (read)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProjects } from './services/api';
import { projects as fallbackProjects } from './projectsData';

const SiteDataContext = createContext(null);

export const useSiteData = () => {
    const ctx = useContext(SiteDataContext);
    if (!ctx) throw new Error('useSiteData must be used inside SiteDataProvider');
    return ctx;
};

// Helper: map raw API/fallback project → normalised shape
const mapProject = (p) => ({
    id: p.id,
    title: p.title,
    // public Work page uses `img`, Dashboard uses `thumbnail`
    img: p.thumbnail || p.img || '',
    thumbnail: p.thumbnail || p.img || '',
    category: p.category || (p.tags ? p.tags[0] : 'Project'),
    client: p.client || '',
    year: p.year || '',
    service: p.service || (p.tags ? p.tags.join(', ') : ''),
    topic: p.topic || p.title,
    description: p.description || '',
    tags: p.tags || (p.service ? p.service.split(',').map(s => s.trim()) : []),
    primaryImage: (p.images && p.images[0]) || (p.gallery && p.gallery[0]) || '',
    secondaryImage: (p.images && p.images[1]) || (p.gallery && p.gallery[1]) || '',
    images: p.images || p.gallery || [],
    // keep gallery alias for ProjectDetail compatibility
    gallery: p.images || p.gallery || [],
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
        'https://picsum.photos/id/1015/600/400',
        'https://picsum.photos/id/1039/600/400',
        'https://picsum.photos/id/1047/600/400',
    ]);

    // ─── Work Projects (shared live API data) ──────────────────────
    const [workProjects, setWorkProjects] = useState([]);

    const loadWorkProjects = async () => {
        let data = await fetchProjects();
        if (!data || data.length === 0) {
            data = fallbackProjects;
        }
        setWorkProjects(data.map(mapProject));
    };

    useEffect(() => {
        loadWorkProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SiteDataContext.Provider
            value={{
                // About
                aboutData,
                setAboutData,
                // Contact
                contactData,
                setContactData,
                // Gallery
                images,
                setImages,
                // Work
                workProjects,
                setWorkProjects,
                loadWorkProjects,
                mapProject,
            }}
        >
            {children}
        </SiteDataContext.Provider>
    );
};
