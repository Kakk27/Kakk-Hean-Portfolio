// src/About.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';
import { useSiteData } from './SiteDataContext';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { footerColumns } from './components/siteNav';

const HERO_IMAGE = 'https://picsum.photos/id/433/2000/1100';

const GALLERY_IMAGES = [
  'https://picsum.photos/id/100/800/600',
  'https://picsum.photos/id/200/800/600',
  'https://picsum.photos/id/300/800/600',
  'https://picsum.photos/id/400/800/600',
];

// --- SCROLL ANIMATION COMPONENTS ---
const Word = ({ children, range, progress }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="about-word">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

const ScrollParagraph = ({ value }) => {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = value.split(' ');
  return (
    <p ref={element} className="fx-display-md about-bio-text">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const About = () => {
  const { aboutData, contactData } = useSiteData();
  const [logoClicks, setLogoClicks] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Five quick clicks on the wordmark opens the admin area (unchanged behaviour).
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (newCount === 5) {
      navigate('/admin');
      setLogoClicks(0);
    }

    timerRef.current = setTimeout(() => setLogoClicks(0), 2000);
  };

  return (
    <div className="fx-page about-page">
      <SiteHeader active="ABOUT" onLogoClick={handleLogoClick} />

      {/* Full-bleed hero: the photograph is the chrome, headline sits on the bottom edge */}
      <section className="fx-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="fx-container fx-hero-inner">
          <p className="fx-eyebrow">Visual perspective</p>
          <h1 className="fx-display-mega">{aboutData.title || 'About'}</h1>
        </div>
      </section>

      {/* Biography: label left, statement right (12-col editorial split) */}
      <section className="fx-section">
        <div className="fx-container about-bio">
          <p className="fx-eyebrow about-bio-label">Biography</p>
          <ScrollParagraph value={aboutData.bio} />
        </div>
      </section>

      {/* Facts row: spec-cell treatment */}
      <section className="about-facts-band">
        <div className="fx-container about-facts">
          <div className="about-fact">
            <span className="about-fact-value">{aboutData.location}</span>
            <span className="fx-eyebrow">Location</span>
          </div>
          <div className="about-fact">
            <span className="about-fact-value">{aboutData.availability}</span>
            <span className="fx-eyebrow">Availability</span>
          </div>
          <div className="about-fact">
            <a className="about-fact-value about-fact-link" href={`mailto:${aboutData.email}`}>
              {aboutData.email}
            </a>
            <span className="fx-eyebrow">Email</span>
          </div>
        </div>
      </section>

      {/* Photo grid: 4-up desktop, 2-up tablet, 1-up mobile */}
      <section className="fx-section">
        <div className="fx-container">
          <div className="about-grid">
            {GALLERY_IMAGES.map((src, index) => (
              <img key={src} src={src} className="about-card" alt={`Studio gallery ${index + 1}`} loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </section>

      {/* Pre-footer CTA band */}
      <section className="fx-cta">
        <div className="fx-container fx-cta-inner">
          <h2 className="fx-display-lg">Have a project in mind?</h2>
          <Link to="/contact" className="fx-btn fx-btn--primary">
            Get in touch
          </Link>
        </div>
      </section>

      <SiteFooter columns={footerColumns(contactData)} />
    </div>
  );
};

export default About;
