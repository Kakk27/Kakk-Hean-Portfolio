import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { projects } from './projectsData';
import './Work.css';
import './KakkTunnel.css';

const Work = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    // Animation Variants
    const menuVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const unequalRectPath = "M5,10 Q50,2 95,10 Q98,30 95,50 Q50,58 5,50 Q2,30 5,10 Z";
    const menuItems = ['WORK', 'CONTACT', 'ABOUT', 'HOME'];

    return (
        <div className="work-container">
            {/* HEADER - Top */}
            <header>
                <div className="work-logo">KAKKHEAN</div>
                <div className="work-label">WORK</div>
            </header>

            {/* LIST - Middle (Grows to fill space) */}
            <ul className="work-list">
                {projects.map((project) => (
                    <li key={project.id} className="work-item">
                        <Link to={`/work/${project.id}`} className="work-link">
                            <span className="project-name">
                                <span className="client">{project.client}</span>
                                <span className="title">{project.title}</span>
                            </span>
                            <span className="arrow">↗</span>
                        </Link>
                        <img src={project.img} className="thumbnail" alt={`${project.client} project`} />
                    </li>
                ))}
            </ul>

            {/* FOOTER - Bottom */}
            <div className="contact-footer">
                <div className="footer-col">
                    5905 WILSHIRE BLVD, LOS ANGELES, CA 90036<br />
                    UNITED STATES OF AMERICA<br /><br />
                    KAKKHEAN PORTFOLIO
                </div>
                <div className="footer-col">
                    TWITTER<br />
                    INSTAGRAM<br />
                    LINKEDIN
                </div>
                <div className="footer-col">
                    HELLO@KAKKHEAN.COM<br />
                    +2 8733-2200<br /><br />
                    SAY HELLO
                </div>
                <div className="footer-col">
                    CRAFTED BY<br />
                    ANDRE LACERDA<br /><br />
                    FOLLOW ME
                </div>
            </div>

            <div className="marquee-wrapper">
                <div className="marquee-content">
                    <span className="marquee-item">CRAFTED BY KAKKHEAN PORTFOLIO</span>
                    <span className="marquee-item">CRAFTED BY KAKKHEAN PORTFOLIO</span>
                    <span className="marquee-item">CRAFTED BY KAKKHEAN PORTFOLIO</span>
                    <span className="marquee-item">CRAFTED BY KAKKHEAN PORTFOLIO</span>
                    <span className="marquee-item">CRAFTED BY KAKKHEAN PORTFOLIO</span>
                    <span className="marquee-item">CRAFTED BY KAKKHEAN PORTFOLIO</span>
                </div>
            </div>

            {/* --- MENU BUTTON --- */}
            {!isMenuOpen && (
                <button
                    className="nav-btn menu-trigger"
                    onClick={() => setIsMenuOpen(true)}
                    style={{ position: 'fixed', bottom: '55px', zIndex: 100 }}
                >
                    MENU
                </button>
            )}

            {/* --- MENU OVERLAY --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="menu-overlay"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div className="menu-links-container" variants={containerVariants} initial="hidden" animate="visible">

                            {menuItems.map((item) => {
                                const isActive = item === 'WORK';
                                const isHovered = hoveredLink === item;

                                let wrapperClassName = "menu-link-wrapper";
                                if (hoveredLink && !isHovered) wrapperClassName += " dimmed";

                                let linkClassName = "menu-link";
                                if (isActive) linkClassName += " active";

                                const content = (
                                    <div className={wrapperClassName}>
                                        {isActive && (
                                            <svg className="active-border-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
                                                <path d={unequalRectPath} vectorEffect="non-scaling-stroke" />
                                            </svg>
                                        )}
                                        <motion.h2
                                            className={linkClassName}
                                            variants={itemVariants}
                                            onMouseEnter={() => setHoveredLink(item)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                        >
                                            {item}
                                        </motion.h2>
                                    </div>
                                );

                                if (item === 'HOME') return <Link to="/" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                                if (item === 'CONTACT') return <Link to="/contact" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                                if (item === 'ABOUT') return <Link to="/about" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;

                                return <div key={item}>{content}</div>;
                            })}

                        </motion.div>

                        {/* Close Button */}
                        <button
                            className="nav-btn close-trigger"
                            onClick={() => setIsMenuOpen(false)}
                            style={{ position: 'fixed', bottom: '55px', zIndex: 100 }}
                        >
                            CLOSE
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Work;