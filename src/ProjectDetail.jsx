import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from './projectsData';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const project = projects.find(p => p.id === projectId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="error-container">
                <h1>Project not found</h1>
                <Link to="/work">Back to Work</Link>
            </div>
        );
    }

    return (
        <motion.div
            className="project-detail-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="detail-header">
                <div className="logo" onClick={() => navigate('/')}>KAKKHEAN</div>
                <Link to="/work" className="back-link">CLOSE [X]</Link>
            </header>

            <main className="detail-content">
                <div className="detail-hero">
                    <motion.img
                        src={project.img}
                        alt={project.title}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                <div className="detail-info">
                    <div className="info-main">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {project.title}
                        </motion.h1>
                        <motion.p
                            className="description"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {project.description}
                        </motion.p>
                    </div>

                    <div className="info-sidebar">
                        <div className="info-item">
                            <span className="label">CLIENT</span>
                            <span className="value">{project.client}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">YEAR</span>
                            <span className="value">{project.year}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">SERVICES</span>
                            <div className="tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detail-gallery">
                    {project.gallery.map((img, index) => (
                        <motion.div
                            key={index}
                            className="gallery-item"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <img src={img} alt={`${project.title} gallery ${index}`} />
                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="detail-footer">
                <div className="next-project">
                    <span className="label">NEXT PROJECT</span>
                    {/* Simple logic for next project */}
                    {(() => {
                        const currentIndex = projects.findIndex(p => p.id === projectId);
                        const nextIndex = (currentIndex + 1) % projects.length;
                        const nextProject = projects[nextIndex];
                        return (
                            <Link to={`/work/${nextProject.id}`} className="next-link">
                                {nextProject.title} <span className="arrow"><ArrowUpRight size={40} strokeWidth={1.5} /></span>
                            </Link>
                        );
                    })()}
                </div>
            </footer>
        </motion.div>
    );
};

export default ProjectDetail;
