// src/AdminDevTunnel.jsx
// Admin 3D Development & Layout Studio for the Homepage Tunnel
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Save,
  Sliders,
  Maximize2,
  Move,
  Rotate3d,
  Camera,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowLeft,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';
import { useSiteData } from './SiteDataContext';
import { generateDefaultCards, getCardTransform, defaultImages } from './utils/tunnelCards';
import './KakkTunnel.css';
import './AdminDevTunnel.css';

const AdminDevTunnel = () => {
  const navigate = useNavigate();
  const { images: contextImages, tunnelConfig, saveTunnelConfig, resetTunnelConfig } = useSiteData();

  const activeImages = useMemo(() => {
    return contextImages && contextImages.length > 0 ? contextImages : defaultImages;
  }, [contextImages]);

  // Load existing saved configuration or generate defaults
  const [cards, setCards] = useState(() => {
    const defaults = generateDefaultCards(activeImages);
    if (tunnelConfig && Array.isArray(tunnelConfig.cards)) {
      return defaults.map((d, idx) => {
        const custom = tunnelConfig.cards.find((c) => c.id === d.id) || tunnelConfig.cards[idx];
        return custom ? { ...d, ...custom, img: d.img } : d;
      });
    }
    return defaults;
  });

  // Scene Camera Orbit State
  const [sceneCamera, setSceneCamera] = useState(() => ({
    rotateX: tunnelConfig?.scene?.rotateX ?? 0,
    rotateY: tunnelConfig?.scene?.rotateY ?? 0,
    z: tunnelConfig?.scene?.z ?? 400,
  }));

  // Selected Card ID (0 - 23)
  const [selectedCardId, setSelectedCardId] = useState(0);

  // Active Tool Mode: 'orbit' | 'move' | 'scale' | 'camera'
  const [activeTool, setActiveTool] = useState('orbit');

  // UI Visibility
  const [showHUD, setShowHUD] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const initialCardTransformRef = useRef(null);
  const initialSceneRef = useRef(null);
  const trackballRef = useRef(null);
  const isTrackballDraggingRef = useRef(false);

  const selectedCard = useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || cards[0];
  }, [cards, selectedCardId]);

  // Sync cards with active images if images change
  useEffect(() => {
    setCards((prev) =>
      prev.map((card, i) => ({
        ...card,
        img: activeImages[i % activeImages.length],
      }))
    );
  }, [activeImages]);

  // Update a single property on the selected card
  const updateSelectedCard = useCallback(
    (key, value) => {
      setCards((prev) =>
        prev.map((c) => (c.id === selectedCardId ? { ...c, [key]: value } : c))
      );
    },
    [selectedCardId]
  );

  // Update multiple properties at once
  const updateSelectedCardMulti = useCallback(
    (props) => {
      setCards((prev) =>
        prev.map((c) => (c.id === selectedCardId ? { ...c, ...props } : c))
      );
    },
    [selectedCardId]
  );

  // Reset current card to its default mathematical position
  const handleResetCard = () => {
    const defaults = generateDefaultCards(activeImages);
    const defaultCard = defaults.find((d) => d.id === selectedCardId);
    if (defaultCard) {
      setCards((prev) =>
        prev.map((c) => (c.id === selectedCardId ? { ...defaultCard } : c))
      );
    }
  };

  // Reset all cards to defaults
  const handleResetAll = async () => {
    if (window.confirm('Reset all 24 cards and camera to original tunnel layout?')) {
      const defaults = generateDefaultCards(activeImages);
      setCards(defaults);
      setSceneCamera({ rotateX: 0, rotateY: 0, z: 400 });
      if (resetTunnelConfig) {
        await resetTunnelConfig();
      }
    }
  };

  // Save layout to SQLite database
  const handleSaveToDatabase = async () => {
    setSaveStatus('saving');
    try {
      const payload = {
        cards: cards.map((c) => ({
          id: c.id,
          x: c.x,
          y: c.y,
          z: c.z,
          rotX: c.rotX,
          rotY: c.rotY,
          rotZ: c.rotZ,
          scale: c.scale,
          scaleX: c.scaleX,
          scaleY: c.scaleY,
          width: c.width,
          height: c.height,
        })),
        scene: sceneCamera,
        savedAt: new Date().toISOString(),
      };

      if (saveTunnelConfig) {
        await saveTunnelConfig(payload);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // Copy CSS transform to clipboard
  const handleCopyCSS = () => {
    if (!selectedCard) return;
    const transformStr = getCardTransform(selectedCard);
    navigator.clipboard.writeText(transformStr);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // ─── 3D VIEWPORT INTERACTION HANDLERS ─────────────────────────────────────

  const handlePointerDown = (e) => {
    // If clicking on UI element, don't initiate viewport drag
    if (e.target.closest('.dev-top-bar, .dev-inspector, .dev-bottom-carousel, .dev-btn')) {
      return;
    }

    isDraggingRef.current = true;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    initialCardTransformRef.current = { ...selectedCard };
    initialSceneRef.current = { ...sceneCamera };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;
    const initial = initialCardTransformRef.current;
    if (!initial) return;

    if (activeTool === 'orbit') {
      // 3D ORBIT TOOL: Dragging orbits pitch (rotX) and yaw (rotY) in 3 dimensions
      const sensitivity = 0.5;
      if (e.shiftKey) {
        // Shift + Drag turns Roll (rotZ)
        const newRotZ = Math.round(((initial.rotZ ?? 0) + dx * sensitivity) % 360);
        updateSelectedCard('rotZ', newRotZ);
      } else {
        const newRotY = Math.round(((initial.rotY ?? 0) + dx * sensitivity) % 360);
        const newRotX = Math.round(((initial.rotX ?? 0) - dy * sensitivity) % 360);
        updateSelectedCardMulti({ rotX: newRotX, rotY: newRotY });
      }
    } else if (activeTool === 'move') {
      // 3D MOVE TOOL: Dragging moves along X and Y; Shift + Drag moves in depth Z
      if (e.shiftKey) {
        const newZ = Math.round((initial.z ?? 0) - dy * 3);
        updateSelectedCard('z', newZ);
      } else {
        const newX = Number(((initial.x ?? 0) + dx * 0.15).toFixed(1));
        const newY = Number(((initial.y ?? 0) + dy * 0.15).toFixed(1));
        updateSelectedCardMulti({ x: newX, y: newY });
      }
    } else if (activeTool === 'scale') {
      // SCALE TOOL: Dragging vertically scales the card
      const scaleDelta = -dy * 0.005;
      const newScale = Number(Math.max(0.1, Math.min(4.0, (initial.scale ?? 1) + scaleDelta)).toFixed(2));
      updateSelectedCard('scale', newScale);
    } else if (activeTool === 'camera') {
      // CAMERA ORBIT TOOL: Dragging orbits the whole 3D tunnel view
      const newSceneRotY = Number((initialSceneRef.current.rotateY + dx * 0.25).toFixed(1));
      const newSceneRotX = Number((initialSceneRef.current.rotateX - dy * 0.25).toFixed(1));
      setSceneCamera((prev) => ({ ...prev, rotateX: newSceneRotX, rotateY: newSceneRotY }));
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    isTrackballDraggingRef.current = false;
  };

  // Mouse wheel adjusts Z depth or Camera Zoom
  const handleWheel = (e) => {
    if (activeTool === 'camera') {
      setSceneCamera((prev) => ({
        ...prev,
        z: Math.max(-500, Math.min(1500, prev.z - e.deltaY * 0.5)),
      }));
    } else {
      // Adjust selected card Z position
      updateSelectedCard('z', Math.round((selectedCard.z ?? 0) - e.deltaY * 0.5));
    }
  };

  // ─── 3D ORBIT TRACKBALL WIDGET HANDLERS ───────────────────────────────────

  const handleTrackballPointerDown = (e) => {
    e.stopPropagation();
    isTrackballDraggingRef.current = true;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    initialCardTransformRef.current = { ...selectedCard };
  };

  const handleTrackballPointerMove = (e) => {
    if (!isTrackballDraggingRef.current) return;
    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;
    const initial = initialCardTransformRef.current;
    if (!initial) return;

    const sensitivity = 0.8;
    if (e.shiftKey) {
      const newRotZ = Math.round(((initial.rotZ ?? 0) + dx * sensitivity) % 360);
      updateSelectedCard('rotZ', newRotZ);
    } else {
      const newRotY = Math.round(((initial.rotY ?? 0) + dx * sensitivity) % 360);
      const newRotX = Math.round(((initial.rotX ?? 0) - dy * sensitivity) % 360);
      updateSelectedCardMulti({ rotX: newRotX, rotY: newRotY });
    }
  };

  // Keyboard shortcut listener (H to toggle HUD, ESC to deselect/exit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'h' || e.key === 'H') {
        setShowHUD((prev) => !prev);
      } else if (e.key === '1') {
        setActiveTool('orbit');
      } else if (e.key === '2') {
        setActiveTool('move');
      } else if (e.key === '3') {
        setActiveTool('scale');
      } else if (e.key === '4') {
        setActiveTool('camera');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`admin-dev-container tool-${activeTool}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* ─── 3D TUNNEL SCENE ─── */}
      <motion.div
        className="motion-tunnel"
        animate={{
          rotateX: sceneCamera.rotateX,
          rotateY: sceneCamera.rotateY,
          z: sceneCamera.z,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 30 }}
      >
        <div className="grid-plane floor" />
        <div className="grid-plane ceiling" />
        <div className="grid-plane left" />
        <div className="grid-plane right" />

        {/* Center Branding Layer */}
        <div className="branding-layer">
          <h1 className="main-title">KAKKHEAN</h1>
          <span className="subtitle">DEV STUDIO</span>
        </div>

        {/* 24 3D Product Cards */}
        {cards.map((card) => {
          const isSelected = card.id === selectedCardId;
          const transformStr = getCardTransform(card);

          return (
            <div
              key={card.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCardId(card.id);
              }}
              className={`dev-product-card no-invert ${isSelected ? 'is-selected' : ''}`}
              style={{
                backgroundImage: `url(${card.img})`,
                transform: transformStr,
                width: card.width ? `${card.width}px` : '400px',
                height: card.height ? `${card.height}px` : '250px',
              }}
            >
              {isSelected && (
                <>
                  {/* Selection Tag */}
                  <div className="card-dev-tag">
                    <Compass size={11} />
                    CARD {card.id + 1 < 10 ? `0${card.id + 1}` : card.id + 1} // {card.side}
                  </div>

                  {/* Corner Handles */}
                  <div className="card-handle handle-tl" />
                  <div className="card-handle handle-tr" />
                  <div className="card-handle handle-bl" />
                  <div className="card-handle handle-br" />

                  {/* 3D Coordinate Axis Gizmo */}
                  <div className="card-gizmo-center">
                    <div className="gizmo-axis gizmo-axis-x" title="X Axis" />
                    <div className="gizmo-axis gizmo-axis-y" title="Y Axis" />
                    <div className="gizmo-axis gizmo-axis-z" title="Z Axis" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* ─── FLOATING TOP BAR ─── */}
      {showHUD && (
        <header className="dev-top-bar">
          <div className="dev-bar-left">
            <Link to="/admin" className="dev-btn" title="Back to Admin Dashboard">
              <ArrowLeft size={14} />
              DASHBOARD
            </Link>
            <div className="dev-badge">
              <span className="dev-badge-dot"></span>
              <span>ADMIN // 3D DEV STUDIO</span>
            </div>
          </div>

          {/* Active Tool Switcher */}
          <div className="dev-bar-center">
            <div className="tool-switcher">
              <button
                className={`tool-tab ${activeTool === 'orbit' ? 'active' : ''}`}
                onClick={() => setActiveTool('orbit')}
                title="Orbit Move: Drag in 3D to rotate orientation (Shortcut: 1)"
              >
                <Rotate3d size={14} />
                <span>ORBIT 3D</span>
              </button>
              <button
                className={`tool-tab ${activeTool === 'move' ? 'active' : ''}`}
                onClick={() => setActiveTool('move')}
                title="Translate: Drag X/Y, Shift+Drag Z (Shortcut: 2)"
              >
                <Move size={14} />
                <span>MOVE 3D</span>
              </button>
              <button
                className={`tool-tab ${activeTool === 'scale' ? 'active' : ''}`}
                onClick={() => setActiveTool('scale')}
                title="Scale: Drag up/down to resize (Shortcut: 3)"
              >
                <Maximize2 size={14} />
                <span>SCALE</span>
              </button>
              <button
                className={`tool-tab ${activeTool === 'camera' ? 'active' : ''}`}
                onClick={() => setActiveTool('camera')}
                title="Camera: Drag to orbit scene viewport (Shortcut: 4)"
              >
                <Camera size={14} />
                <span>CAMERA</span>
              </button>
            </div>
          </div>

          <div className="dev-bar-right">
            <button
              onClick={handleSaveToDatabase}
              className={`dev-btn dev-btn-primary ${saveStatus === 'saving' ? 'opacity-50' : ''}`}
            >
              <Save size={14} />
              <span>{saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED TO DB' : 'SAVE LAYOUT'}</span>
            </button>

            <Link to="/" target="_blank" className="dev-btn" title="Open live homepage in new tab">
              <Eye size={14} />
              LIVE SITE
            </Link>

            <button
              onClick={() => setShowHUD(false)}
              className="dev-btn"
              title="Hide UI (Press 'H' to show again)"
            >
              <EyeOff size={14} />
            </button>
          </div>
        </header>
      )}

      {/* Floating Toggle Pill when HUD is hidden */}
      {!showHUD && (
        <button
          onClick={() => setShowHUD(true)}
          style={{
            position: 'absolute',
            top: 30,
            right: 30,
            zIndex: 1000,
            background: '#ffffff',
            border: 'none',
            color: '#000000',
            padding: '10px 24px',
            borderRadius: '30px',
            fontFamily: "'Arial Black', sans-serif",
            fontSize: '11px',
            fontWeight: '900',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.7)',
          }}
        >
          <Eye size={16} />
          DEV HUD [H]
        </button>
      )}

      {/* ─── FLOATING INSPECTOR HUD ─── */}
      {showHUD && selectedCard && (
        <aside className="dev-inspector">
          {/* Header */}
          <div className="inspector-header">
            <div className="inspector-title">
              <Compass size={16} style={{ color: '#ffffff' }} />
              CARD {selectedCard.id + 1 < 10 ? `0${selectedCard.id + 1}` : selectedCard.id + 1} // {selectedCard.side}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleCopyCSS}
                className="dev-btn"
                style={{ padding: '6px 10px', fontSize: '10px' }}
                title="Copy CSS transform string"
              >
                {copySuccess ? <Check size={12} color="#ffffff" /> : <Copy size={12} />}
                <span>{copySuccess ? 'COPIED' : 'CSS'}</span>
              </button>
              <button
                onClick={handleResetCard}
                className="dev-btn"
                style={{ padding: '6px 10px', fontSize: '10px' }}
                title="Reset selected card"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* 3D ORBIT TRACKBALL GIZMO WIDGET */}
          <div className="orbit-trackball-wrapper">
            <div className="control-group-title" style={{ width: '100%' }}>
              <span>3D ORBIT MANIPULATOR</span>
              <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>
                {selectedCard.rotX}° / {selectedCard.rotY}° / {selectedCard.rotZ}°
              </span>
            </div>

            {/* Interactive 3D Orbit Sphere Widget */}
            <div
              ref={trackballRef}
              className="orbit-trackball-sphere"
              onPointerDown={handleTrackballPointerDown}
              onPointerMove={handleTrackballPointerMove}
              style={{
                transform: `rotateX(${-selectedCard.rotX}deg) rotateY(${selectedCard.rotY}deg) rotateZ(${selectedCard.rotZ}deg)`,
              }}
              title="Click & Drag to Orbit image in 3D (Shift+Drag for Roll)"
            >
              <div className="trackball-ring ring-x" title="Pitch (X-Axis)" />
              <div className="trackball-ring ring-y" title="Yaw (Y-Axis)" />
              <div className="trackball-ring ring-z" title="Roll (Z-Axis)" />
              <div className="trackball-center-dot" />
            </div>

            <div className="trackball-instructions">
              DRAG TRACKBALL OR SCENE TO ORBIT IN 3D<br />
              <span style={{ color: '#ffffff' }}>PITCH (X)</span> // <span style={{ color: '#cccccc' }}>YAW (Y)</span> // <span style={{ color: '#999999' }}>ROLL (Z)</span>
            </div>
          </div>

          {/* 3D ROTATION (ORBIT) SLIDERS */}
          <div className="control-group">
            <div className="control-group-title">
              <span>3D ROTATION // ORBIT</span>
              <button
                onClick={() => updateSelectedCardMulti({ rotX: 0, rotY: 0, rotZ: 0 })}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
              >
                RESET [0]
              </button>
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-x"></span> Pitch (Rot X)
                </span>
                <input
                  type="number"
                  className="slider-value-input"
                  value={selectedCard.rotX ?? 0}
                  onChange={(e) => updateSelectedCard('rotX', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={-180}
                max={180}
                value={selectedCard.rotX ?? 0}
                onChange={(e) => updateSelectedCard('rotX', Number(e.target.value))}
              />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-y"></span> Yaw (Rot Y)
                </span>
                <input
                  type="number"
                  className="slider-value-input"
                  value={selectedCard.rotY ?? 0}
                  onChange={(e) => updateSelectedCard('rotY', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={-180}
                max={180}
                value={selectedCard.rotY ?? 0}
                onChange={(e) => updateSelectedCard('rotY', Number(e.target.value))}
              />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-z"></span> Roll (Rot Z)
                </span>
                <input
                  type="number"
                  className="slider-value-input"
                  value={selectedCard.rotZ ?? 0}
                  onChange={(e) => updateSelectedCard('rotZ', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={-180}
                max={180}
                value={selectedCard.rotZ ?? 0}
                onChange={(e) => updateSelectedCard('rotZ', Number(e.target.value))}
              />
            </div>
          </div>

          {/* 3D TRANSLATION (MOVE) SLIDERS */}
          <div className="control-group">
            <div className="control-group-title">
              <span>3D Translation (Move)</span>
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-x"></span> Position X (vw)
                </span>
                <input
                  type="number"
                  step="0.5"
                  className="slider-value-input"
                  value={selectedCard.x ?? 0}
                  onChange={(e) => updateSelectedCard('x', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={-120}
                max={120}
                step={0.5}
                value={selectedCard.x ?? 0}
                onChange={(e) => updateSelectedCard('x', Number(e.target.value))}
              />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-y"></span> Position Y (vh)
                </span>
                <input
                  type="number"
                  step="0.5"
                  className="slider-value-input"
                  value={selectedCard.y ?? 0}
                  onChange={(e) => updateSelectedCard('y', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={-100}
                max={100}
                step={0.5}
                value={selectedCard.y ?? 0}
                onChange={(e) => updateSelectedCard('y', Number(e.target.value))}
              />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-z"></span> Depth Z (px)
                </span>
                <input
                  type="number"
                  step="10"
                  className="slider-value-input"
                  value={selectedCard.z ?? 0}
                  onChange={(e) => updateSelectedCard('z', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={-1200}
                max={800}
                step={10}
                value={selectedCard.z ?? 0}
                onChange={(e) => updateSelectedCard('z', Number(e.target.value))}
              />
            </div>
          </div>

          {/* SCALE CONTROLS */}
          <div className="control-group">
            <div className="control-group-title">
              <span>Scale & Dimensions</span>
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span className="slider-name">
                  <span className="axis-indicator-dot dot-scale"></span> Master Scale
                </span>
                <input
                  type="number"
                  step="0.05"
                  className="slider-value-input"
                  value={selectedCard.scale ?? 1}
                  onChange={(e) => updateSelectedCard('scale', Number(e.target.value))}
                />
              </div>
              <input
                type="range"
                className="slider-input"
                min={0.2}
                max={3.0}
                step={0.05}
                value={selectedCard.scale ?? 1}
                onChange={(e) => updateSelectedCard('scale', Number(e.target.value))}
              />
              <div className="preset-buttons-row">
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    className="preset-btn"
                    onClick={() => updateSelectedCard('scale', s)}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Width (px)</label>
                <input
                  type="number"
                  className="slider-value-input"
                  style={{ width: '100%', marginTop: '3px' }}
                  value={selectedCard.width ?? 400}
                  onChange={(e) => updateSelectedCard('width', Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Height (px)</label>
                <input
                  type="number"
                  className="slider-value-input"
                  style={{ width: '100%', marginTop: '3px' }}
                  value={selectedCard.height ?? 250}
                  onChange={(e) => updateSelectedCard('height', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Quick Apply to Wall / Global Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => {
                const targetSide = selectedCard.side;
                setCards((prev) =>
                  prev.map((c) =>
                    c.side === targetSide
                      ? {
                          ...c,
                          scale: selectedCard.scale,
                          width: selectedCard.width,
                          height: selectedCard.height,
                          rotZ: selectedCard.rotZ,
                        }
                      : c
                  )
                );
              }}
              className="dev-btn"
              style={{ justifyContent: 'center', fontSize: '10px', padding: '8px 12px' }}
            >
              APPLY SCALE TO {selectedCard.side} WALL
            </button>

            <button
              onClick={handleResetAll}
              className="dev-btn"
              style={{ justifyContent: 'center', fontSize: '10px', padding: '8px 12px', opacity: 0.7 }}
            >
              RESET ENTIRE TUNNEL [DEFAULT]
            </button>
          </div>
        </aside>
      )}

      {/* ─── BOTTOM CARD SELECTOR STRIP ─── */}
      {showHUD && (
        <footer className="dev-bottom-carousel">
          <button
            onClick={() => setSelectedCardId((prev) => (prev > 0 ? prev - 1 : cards.length - 1))}
            className="dev-btn"
            style={{ padding: '6px 10px' }}
            title="Previous card"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="cards-scroll-strip">
            {cards.map((card) => {
              const isSelected = card.id === selectedCardId;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`card-strip-item ${isSelected ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${card.img})` }}
                  title={`Card #${card.id + 1} (${card.side})`}
                />
              );
            })}
          </div>

          <button
            onClick={() => setSelectedCardId((prev) => (prev < cards.length - 1 ? prev + 1 : 0))}
            className="dev-btn"
            style={{ padding: '6px 10px' }}
            title="Next card"
          >
            <ChevronRight size={16} />
          </button>
        </footer>
      )}

      {/* Floating Instructions Hint */}
      {showHUD && (
        <div className="dev-mode-hint">
          {activeTool === 'orbit' && '🌀 Orbit Mode: Click & drag on card or trackball to rotate in 3D (Shift for Roll)'}
          {activeTool === 'move' && '✥ Move Mode: Drag to move X / Y (Shift+Drag to move depth Z)'}
          {activeTool === 'scale' && '⤢ Scale Mode: Drag vertically to scale the selected card'}
          {activeTool === 'camera' && '🎥 Camera Mode: Drag to orbit tunnel camera view (Wheel to zoom)'}
        </div>
      )}
    </div>
  );
};

export default AdminDevTunnel;

