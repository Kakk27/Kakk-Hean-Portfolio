// src/About.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import './About.css';
import './KakkTunnel.css'; // Shared Menu Styles
import { useSiteData } from './SiteDataContext';

// --- SCROLL ANIMATION COMPONENTS ---
const Word = ({ children, range, progress }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginRight: '0.25em' }}>
      <motion.span style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

const ScrollParagraph = ({ value, isBold = false }) => {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start 0.9', 'start 0.25']
  });

  const words = value.split(" ");
  return (
    <p
      ref={element}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontWeight: isBold ? 'bold' : 'normal'
      }}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return <Word key={i} range={[start, end]} progress={scrollYProgress}>{word}</Word>;
      })}
    </p>
  );
};

const About = () => {
  const { aboutData } = useSiteData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (newCount === 5) {
      navigate('/admin');
      setLogoClicks(0);
    }

    timerRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 2000);
  };

  const text1 = aboutData.bio;

  // Images for the sliding top gallery
  const galleryImages = [
    "https://picsum.photos/id/100/400/300",
    "https://picsum.photos/id/200/400/300",
    "https://picsum.photos/id/300/400/300",
    "https://picsum.photos/id/400/400/300",
  ];

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
    <div className="about-page">

      {/* Header */}
      <div className="about-logo" onClick={handleLogoClick} style={{ cursor: 'pointer', userSelect: 'none' }}>KAKKHEAN</div>
      <div className="about-label">ABOUT US</div>

      {/* --- SLIDING GALLERY --- */}
      <div className="about-gallery-wrapper">
        <div className="gallery-track">
          {[...galleryImages, ...galleryImages].map((src, index) => (
            <img
              key={index}
              src={src}
              className="gallery-thumb"
              alt={`gallery-${index}`}
            />
          ))}
        </div>
      </div>

      {/* Massive Scrolling Text */}
      <div className="big-marquee-wrapper">
        <div className="big-marquee-text">
          VISUAL PERSPECTIVE <span className="highlight">AN UNUSUAL PERSPECTIVE</span> VISUAL PERSPECTIVE <span className="highlight">AN UNUSUAL PERSPECTIVE</span> &nbsp;
          VISUAL PERSPECTIVE <span className="highlight">AN UNUSUAL PERSPECTIVE</span> VISUAL PERSPECTIVE <span className="highlight">AN UNUSUAL PERSPECTIVE</span>
        </div>
      </div>

      {/* Description Block */}
      <div className="about-description">
        <ScrollParagraph value={text1} isBold={true} />
      </div>

      {/* Bottom Hero Image */}
      <div className="bottom-hero" style={{ backgroundImage: 'url(https://picsum.photos/id/433/1200/600)' }}></div>

      {/* Footer Section */}
      <div className="about-footer">
        <div className="about-footer-col">
          {aboutData.location.toUpperCase()}<br />
          LOCAL STUDIO<br /><br />
          KAKKHEAN PORTFOLIO
        </div>
        <div className="about-footer-col">
          TWITTER<br />
          INSTAGRAM<br />
          LINKEDIN
        </div>
        <div className="about-footer-col">
          {aboutData.email.toUpperCase()}<br />
          {aboutData.availability.toUpperCase()}<br /><br />
          SAY HELLO
        </div>
        <div className="about-footer-col">
          CRAFTED BY<br />
          ANDRE LACERDA<br /><br />
          FOLLOW ME
        </div>
      </div>

      {/* Scrolling Marquee Bar */}
      <div className="marquee-wrapper">
        <div className="marquee-content">
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
                const isActive = item === 'ABOUT';
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
                if (item === 'WORK') return <Link to="/work" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;

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

export default About;