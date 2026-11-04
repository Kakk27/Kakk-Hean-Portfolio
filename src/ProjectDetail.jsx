import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './ProjectDetail.css';
import { useSiteData } from './SiteDataContext';
import SiteHeader from './components/SiteHeader';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const { workProjects } = useSiteData();

    // Try to find by id; fall back to slug match on title
    const project = workProjects.find(
        (p) => String(p.id) === projectId || p.title?.toLowerCase().replace(/\s+/g, '-') === projectId
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="fx-page detail-page">
                <SiteHeader active="WORK" />
                <div className="fx-container detail-missing">
                    <p className="fx-eyebrow">404</p>
                    <h1 className="fx-display-xl">Project not found</h1>
                    <Link to="/work" className="fx-btn fx-btn--outline">Back to work</Link>
                </div>
            </div>
        );
    }

    // Normalise gallery: prefer images[], fall back to gallery[]
    const galleryImages = (project.images?.length ? project.images : project.gallery ?? []).filter(
        (img) => img && (img.startsWith('http') || img.startsWith('data:'))
    );

    const tags = project.tags?.length
        ? project.tags
        : project.service
            ? project.service.split(',').map((s) => s.trim())
            : [];

    const currentIndex = workProjects.findIndex((p) => String(p.id) === String(project.id));
    const nextProject = workProjects.length > 1
        ? workProjects[(currentIndex + 1) % workProjects.length]
        : null;

    return (
        <motion.div
            className="fx-page detail-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <SiteHeader active="WORK" />

            {/* Full-bleed hero: photograph fills the band, title sits on the bottom edge */}
            <section className="fx-hero detail-hero">
                {project.img && (
                    <img
                        className="fx-hero-media"
                        src={project.img}
                        alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                )}
                <div className="fx-container fx-hero-inner">
                    <p className="fx-eyebrow">{project.client}</p>
                    <motion.h1
                        className="fx-display-mega detail-title"
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {project.title}
                    </motion.h1>
                </div>
            </section>

            <section className="fx-section">
                <div className="fx-container detail-info">
                    <motion.p
                        className="detail-description"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {project.description}
                    </motion.p>

                    <dl className="detail-specs">
                        <div className="detail-spec">
                            <dt className="fx-eyebrow">Client</dt>
                            <dd>{project.client}</dd>
                        </div>
                        <div className="detail-spec">
                            <dt className="fx-eyebrow">Year</dt>
                            <dd>{project.year}</dd>
                        </div>
                        {tags.length > 0 && (
                            <div className="detail-spec">
                                <dt className="fx-eyebrow">Services</dt>
                                <dd className="detail-tags">
                                    {tags.map((tag) => (
                                        <span key={tag} className="detail-badge">{tag}</span>
                                    ))}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </section>

            {galleryImages.length > 0 && (
                <section className="detail-gallery-band">
                    <div className="fx-container detail-gallery">
                        {galleryImages.map((img, index) => (
                            <motion.img
                                key={index}
                                className="detail-gallery-img"
                                src={img}
                                alt={`${project.title} gallery ${index + 1}`}
                                loading="lazy"
                                decoding="async"
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="fx-cta">
                <div className="fx-container detail-next">
                    <p className="fx-eyebrow">Next project</p>
                    {nextProject ? (
                        <Link to={`/work/${nextProject.id}`} className="fx-display-lg detail-next-link">
                            {nextProject.title}
                            <ArrowUpRight size={36} strokeWidth={1.5} aria-hidden="true" />
                        </Link>
                    ) : (
                        <Link to="/work" className="fx-display-lg detail-next-link">
                            All projects
                            <ArrowUpRight size={36} strokeWidth={1.5} aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default ProjectDetail;
