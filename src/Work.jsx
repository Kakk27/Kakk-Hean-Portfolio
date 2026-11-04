import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './Work.css';
import { useSiteData } from './SiteDataContext';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { footerColumns } from './components/siteNav';

const Work = () => {
    const { workProjects, contactData } = useSiteData();

    return (
        <div className="fx-page work-page">
            <SiteHeader active="WORK" />

            <section className="fx-section--tight">
                <div className="fx-container work-intro">
                    <div className="work-intro-text">
                        <p className="fx-eyebrow">Work</p>
                        <h1 className="fx-display-xl">Selected projects</h1>
                    </div>
                    <p className="fx-eyebrow work-count">
                        {workProjects.length} {workProjects.length === 1 ? 'project' : 'projects'}
                    </p>
                </div>
            </section>

            <ul className="work-list">
                {workProjects.length > 0 ? (
                    workProjects.map((project, index) => (
                        <li key={project.id} className="work-item">
                            <Link to={`/work/${project.id}`} className="work-link">
                                <span className="work-index">{String(index + 1).padStart(2, '0')}</span>
                                <span className="work-client">{project.client}</span>
                                <span className="work-title">{project.title}</span>
                                <span className="work-year">{project.year}</span>
                                <ArrowUpRight className="work-arrow" size={24} strokeWidth={1.5} aria-hidden="true" />
                            </Link>
                            {project.img && (
                                <img
                                    src={project.img}
                                    className="work-thumb"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            )}
                        </li>
                    ))
                ) : (
                    <li className="work-empty">No projects found. Check the admin panel.</li>
                )}
            </ul>

            <SiteFooter columns={footerColumns(contactData)} />
        </div>
    );
};

export default Work;
