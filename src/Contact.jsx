// src/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import './Contact.css';
import './KakkTunnel.css';

const Contact = () => {
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
    <div className="contact-page">

      {/* --- PAGE CONTENT --- */}
      <div className="contact-logo">KAKKHEAN</div>
      <div className="contact-label">CONTACT</div>

      <h1 className="contact-hero">HELLO@KAKKHEAN.COM</h1>

      <form className="contact-form">
        <div className="form-row">
          <input type="text" placeholder="NAME" className="form-input" />
          <input type="email" placeholder="EMAIL" className="form-input" />
        </div>
        <textarea placeholder="MESSAGE" className="form-textarea"></textarea>
        <button type="submit" className="submit-btn">SUBMIT</button>
      </form>

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
                // On Contact Page, 'CONTACT' is the active item
                const isActive = item === 'CONTACT';
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

                // LINKING LOGIC
                if (item === 'HOME') {
                  return <Link to="/" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                if (item === 'ABOUT') {
                  return <Link to="/about" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                if (item === 'WORK') {
                  return <Link to="/work" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                // If clicking 'CONTACT', we are already here
                if (item === 'CONTACT') {
                  return <div key={item}>{content}</div>;
                }

                return <div key={item}>{content}</div>;
              })}

            </motion.div>

            {/* FIXED: Changed text to CLOSE to match logic */}
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

export default Contact;