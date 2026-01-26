// src/KakkTunnel.jsx
import React, { useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import "./KakkTunnel.css";

// Fallback images
const defaultImages = [
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1039/600/400",
  "https://picsum.photos/id/1047/600/400",
  "https://picsum.photos/id/1057/600/400",
  "https://picsum.photos/id/106/600/400",
  "https://picsum.photos/id/193/600/400",
];

const TUNNEL_WIDTH = 60;
const TUNNEL_HEIGHT = 40;

const KakkTunnel = ({ images }) => {
  const activeImages = images && images.length > 0 ? images : defaultImages;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleMouseMove = (e) => {
    if (isMenuOpen) return;
    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ rotateY: xNorm * 5, rotateX: yNorm * -5 });
  };

  const cards = useMemo(() => {
    const numCards = 24;
    const cardsPerSide = numCards / 4; // 6 per side
    return Array.from({ length: numCards }).map((_, i) => {
      const side = Math.floor(i / cardsPerSide);
      const indexOnSide = i % cardsPerSide;
      const z = 400 - indexOnSide * 200; // Evenly spaced in depth
      let x, y, rotY, rotX;

      if (side === 0) { // LEFT
        x = -TUNNEL_WIDTH;
        y = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_HEIGHT / cardsPerSide);
        rotY = 90; rotX = 0;
      } else if (side === 1) { // RIGHT
        x = TUNNEL_WIDTH;
        y = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_HEIGHT / cardsPerSide);
        rotY = -90; rotX = 0;
      } else if (side === 2) { // TOP
        x = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_WIDTH / cardsPerSide);
        y = -TUNNEL_HEIGHT;
        rotY = 0; rotX = -90;
      } else { // BOTTOM
        x = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_WIDTH / cardsPerSide);
        y = TUNNEL_HEIGHT;
        rotY = 0; rotX = 90;
      }

      return {
        id: i,
        img: activeImages[i % activeImages.length],
        x, y, z, rotX, rotY
      };
    });
  }, [activeImages]);

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
    <div className="scene-container" onMouseMove={handleMouseMove}>

      {/* --- 3D SCENE --- */}
      <motion.div
        className="motion-tunnel"
        animate={{
          rotateX: isMenuOpen ? 0 : mousePos.rotateX,
          rotateY: isMenuOpen ? 0 : mousePos.rotateY,
          z: 400
        }}
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
              transform: `translate(-50%, -50%) translate3d(${card.x}vw, ${card.y}vh, ${card.z}px) rotateX(${card.rotX}deg) rotateY(${card.rotY}deg)`,
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
