// src/utils/tunnelCards.js
// Utility functions for generating and managing 3D tunnel product card layouts

export const TUNNEL_WIDTH = 60;
export const TUNNEL_HEIGHT = 40;
export const DEFAULT_NUM_CARDS = 24;

export const defaultImages = [
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1039/600/400",
  "https://picsum.photos/id/1047/600/400",
  "https://picsum.photos/id/1057/600/400",
  "https://picsum.photos/id/106/600/400",
  "https://picsum.photos/id/193/600/400",
];

/**
 * Generate the default 24 tunnel cards arranged across 4 tunnel walls
 */
export const generateDefaultCards = (activeImages = []) => {
  const images = activeImages && activeImages.length > 0 ? activeImages : defaultImages;
  const cardsPerSide = DEFAULT_NUM_CARDS / 4; // 6 per side
  const sideNames = ['LEFT', 'RIGHT', 'TOP', 'BOTTOM'];

  return Array.from({ length: DEFAULT_NUM_CARDS }).map((_, i) => {
    const sideIndex = Math.floor(i / cardsPerSide);
    const indexOnSide = i % cardsPerSide;
    const z = 400 - indexOnSide * 200; // Evenly spaced in depth
    let x = 0;
    let y = 0;
    let rotX = 0;
    let rotY = 0;

    if (sideIndex === 0) {
      // LEFT WALL
      x = -TUNNEL_WIDTH;
      y = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_HEIGHT / cardsPerSide);
      rotY = 90;
      rotX = 0;
    } else if (sideIndex === 1) {
      // RIGHT WALL
      x = TUNNEL_WIDTH;
      y = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_HEIGHT / cardsPerSide);
      rotY = -90;
      rotX = 0;
    } else if (sideIndex === 2) {
      // TOP CEILING
      x = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_WIDTH / cardsPerSide);
      y = -TUNNEL_HEIGHT;
      rotY = 0;
      rotX = -90;
    } else {
      // BOTTOM FLOOR
      x = (indexOnSide - cardsPerSide / 2 + 0.5) * (TUNNEL_WIDTH / cardsPerSide);
      y = TUNNEL_HEIGHT;
      rotY = 0;
      rotX = 90;
    }

    return {
      id: i,
      side: sideNames[sideIndex],
      indexOnSide,
      img: images[i % images.length],
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      z: Math.round(z),
      rotX: Math.round(rotX),
      rotY: Math.round(rotY),
      rotZ: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      width: 400,
      height: 250,
      opacity: 1,
    };
  });
};

/**
 * Format a card's 3D CSS transform string
 */
export const getCardTransform = (card) => {
  const x = card.x ?? 0;
  const y = card.y ?? 0;
  const z = card.z ?? 0;
  const rotX = card.rotX ?? 0;
  const rotY = card.rotY ?? 0;
  const rotZ = card.rotZ ?? 0;
  const scale = card.scale ?? 1;
  const scaleX = (card.scaleX ?? 1) * scale;
  const scaleY = (card.scaleY ?? 1) * scale;

  return `translate(-50%, -50%) translate3d(${x}vw, ${y}vh, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scaleX}, ${scaleY})`;
};

