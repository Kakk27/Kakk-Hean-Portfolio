// src/KakkTunnel.jsx
import React, { useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "./SiteDataContext";
import { generateDefaultCards, getCardTransform, defaultImages } from "./utils/tunnelCards";
import "./KakkTunnel.css";

const KakkTunnel = ({ images: propImages }) => {
  const { images: contextImages, tunnelConfig } = useSiteData();
  const activeImages =
    (propImages && propImages.length > 0)
      ? propImages
      : (contextImages && contextImages.length > 0)
        ? contextImages
        : defaultImages;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const cards = useMemo(() => {
    const defaults = generateDefaultCards(activeImages);
    if (!tunnelConfig || !Array.isArray(tunnelConfig.cards)) {
      return defaults;
    }
    return defaults.map((d, idx) => {
      const custom = tunnelConfig.cards.find(c => c.id === d.id) || tunnelConfig.cards[idx];
      return custom ? { ...d, ...custom, img: d.img } : d;
    });
  }, [activeImages, tunnelConfig]);

  const sceneTransform = useMemo(() => {
    return {
      rotateX: tunnelConfig?.scene?.rotateX ?? 0,
      rotateY: tunnelConfig?.scene?.rotateY ?? 0,
      z: tunnelConfig?.scene?.z ?? 400
    };
  }, [tunnelConfig]);

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
    <div className="scene-container">

      {/* --- 3D SCENE --- */}
      <motion.div
        className="motion-tunnel"
        animate={sceneTransform}
        transition={{ type: "spring", stiffness: 40, damping: 40 }}
      >
        <div className="grid-plane floor" />
        <div className="grid-plane ceiling" />
        <div className="grid-plane left" />
        <div className="grid-plane right" />
        <div className="branding-layer">
          <h1 className="main-title">KAKKHEAN</h1>
          <span className="subtitle">PORTFOLIO</span>
        </div>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="product-card no-invert"
            style={{
              backgroundImage: `url(${card.img})`,
              transform: getCardTransform(card),
              width: card.width ? `${card.width}px` : undefined,
              height: card.height ? `${card.height}px` : undefined,
            }}
          />
        ))}
      </motion.div>

      {/* --- MENU BUTTON --- */}
      {!isMenuOpen && (
        <button className="nav-btn menu-trigger" onClick={() => setIsMenuOpen(true)}>MENU</button>
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
                const isActive = item === 'HOME';
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
                if (item === 'CONTACT') {
                  return <Link to="/contact" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                if (item === 'ABOUT') {
                  return <Link to="/about" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                if (item === 'WORK') {
                  return <Link to="/work" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                if (item === 'HOME') {
                  return <Link to="/" key={item} style={{ textDecoration: 'none' }}>{content}</Link>;
                }

                // Default
                return <div key={item}>{content}</div>;
              })}

            </motion.div>
            <button className="nav-btn close-trigger" onClick={() => setIsMenuOpen(false)}>CLOSE</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KakkTunnel;
