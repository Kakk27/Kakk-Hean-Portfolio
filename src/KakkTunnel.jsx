// src/KakkTunnel.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useSiteData } from "./SiteDataContext";
import { generateDefaultCards, getCardTransform, defaultImages } from "./utils/tunnelCards";
import SiteHeader from "./components/SiteHeader";
import "./KakkTunnel.css";

const KakkTunnel = ({ images: propImages }) => {
  const { images: contextImages, tunnelConfig } = useSiteData();
  const activeImages =
    (propImages && propImages.length > 0)
      ? propImages
      : (contextImages && contextImages.length > 0)
        ? contextImages
        : defaultImages;

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

  return (
    <div className="scene-container fx-page fx-home">
      <SiteHeader active="HOME" transparent />

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
    </div>
  );
};

export default KakkTunnel;
