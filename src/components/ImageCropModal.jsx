import React, { useState, useRef, useEffect } from 'react';
import {
  Crop,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Check,
  UploadCloud,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { uploadImage } from '../services/api';
import './ImageCropModal.css';

/**
 * ImageCropModal
 * High-performance, zero-dependency interactive canvas image cropper & compressor.
 * Features:
 *  - Drag-to-pan & wheel zoom
 *  - Aspect ratio presets: 1:1 (Square), 4:5 (Portrait), 16:9 (Landscape), Original
 *  - 90° rotation
 *  - Smart compression with quality selection & live savings estimation
 *  - Direct server upload to /api/upload
 */
export const ImageCropModal = ({
  isOpen,
  imageSrc,
  originalFileName = 'gallery-image.jpg',
  originalFileSize = 0,
  onClose,
  onUploadSuccess,
  defaultAspectRatio = '1:1',
  title = 'Crop & Compress Image',
}) => {
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [quality, setQuality] = useState(0.85);
  const [maxDimension, setMaxDimension] = useState(1600);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const imageElementRef = useRef(null);

  // Reset state when a new image is loaded or modal opens
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setErrorMsg('');
      setIsUploading(false);
      setUploadProgress('');

      const img = new Image();
      img.onload = () => {
        setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isUploading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUploading, onClose]);

  if (!isOpen || !imageSrc) return null;

  // Viewport container size (fixed design canvas)
  const VP_WIDTH = 560;
  const VP_HEIGHT = 380;

  // Compute Crop Frame Box dimensions based on aspect ratio
  const getCropFrameDimensions = () => {
    const maxBoxW = 440;
    const maxBoxH = 320;

    if (aspectRatio === '1:1') {
      const size = Math.min(maxBoxW, maxBoxH, 290);
      return { width: size, height: size };
    }
    if (aspectRatio === '4:5') {
      const h = maxBoxH;
      const w = Math.round(h * (4 / 5));
      return { width: w, height: h };
    }
    if (aspectRatio === '16:9') {
      const w = maxBoxW;
      const h = Math.round(w * (9 / 16));
      return { width: w, height: h };
    }
    // Original Aspect Ratio
    if (imgNaturalSize.width && imgNaturalSize.height) {
      const naturalRatio = imgNaturalSize.width / imgNaturalSize.height;
      if (naturalRatio >= 1) {
        const w = maxBoxW;
        const h = Math.round(w / naturalRatio);
        return { width: w, height: Math.min(h, maxBoxH) };
      } else {
        const h = maxBoxH;
        const w = Math.round(h * naturalRatio);
        return { width: Math.min(w, maxBoxW), height: h };
      }
    }
    return { width: 280, height: 280 };
  };

  const cropFrame = getCropFrameDimensions();

  // Compute base scale to cover the crop frame
  const computeBaseScale = () => {
    if (!imgNaturalSize.width || !imgNaturalSize.height) return 1;
    const isSideways = rotation % 180 !== 0;
    const effW = isSideways ? imgNaturalSize.height : imgNaturalSize.width;
    const effH = isSideways ? imgNaturalSize.width : imgNaturalSize.height;
    return Math.max(cropFrame.width / effW, cropFrame.height / effH);
  };

  const baseScale = computeBaseScale();
  const currentTotalScale = baseScale * zoom;

  // Drag Interactions
  const handlePointerDown = (e) => {
    if (isUploading) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(4, Math.max(1, +(prev + delta).toFixed(2))));
  };

  // Rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // Format bytes helper
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Estimate compressed file size
  const estimateCompressedSize = () => {
    if (!cropFrame.width || !cropFrame.height) return '~180 KB';
    const outW = Math.min(maxDimension, Math.round(cropFrame.width * 4));
    const outH = Math.round(outW * (cropFrame.height / cropFrame.width));
    const totalPixels = outW * outH;
    // JPEG typically takes 1.5 - 2.5 bits per pixel at 0.85 quality
    const estimatedBytes = Math.round(totalPixels * (quality * 0.28));
    return formatBytes(estimatedBytes);
  };

  // Execute Canvas Crop & Upload
  const handleCropAndUpload = async () => {
    if (!imageSrc || isUploading) return;

    try {
      setIsUploading(true);
      setUploadProgress('Cropping & compressing...');
      setErrorMsg('');

      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image for cropping'));
        img.src = imageSrc;
      });

      // Target output resolution (high DPI, up to maxDimension)
      const outW = Math.min(maxDimension, Math.round(cropFrame.width * 4));
      const outH = Math.round(outW * (cropFrame.height / cropFrame.width));

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }

      // Fill with smooth background in case of transparent PNGs
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, outW, outH);

      // Smooth interpolation for crisp retina scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const scaleMultiplier = outW / cropFrame.width;

      // Coordinate mapping: frame center on canvas
      ctx.translate(outW / 2, outH / 2);
      ctx.scale(scaleMultiplier, scaleMultiplier);
      ctx.translate(pan.x, pan.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(currentTotalScale, currentTotalScale);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      setUploadProgress('Compressing image file...');

      // Convert to compressed JPEG blob
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Compression failed'));
          },
          'image/jpeg',
          quality
        );
      });

      setUploadProgress('Uploading to portfolio server...');

      // Clean filename
      const baseName = (originalFileName || 'image')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '-');
      const finalFileName = `${baseName}-${Date.now()}.jpg`;

      const compressedFile = new File([blob], finalFileName, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // Upload via server API
      const result = await uploadImage(compressedFile);

      if (result && result.url) {
        setUploadProgress('Upload complete!');
        if (onUploadSuccess) {
          onUploadSuccess({
            url: result.url,
            filename: result.filename || finalFileName,
            size: blob.size,
            originalSize: originalFileSize,
          });
        }
        onClose();
      } else {
        throw new Error(result?.message || 'Server upload failed');
      }
    } catch (err) {
      console.error('Crop & Upload Error:', err);
      setErrorMsg(err.message || 'Failed to process and upload image');
      setIsUploading(false);
    }
  };

  return (
    <div className="crop-modal-overlay" onClick={() => !isUploading && onClose()}>
      <div
        className="crop-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="crop-modal-header">
          <div className="crop-modal-title-wrap">
            <div className="crop-icon-badge">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="crop-modal-title">{title}</h3>
              <p className="crop-modal-subtitle">
                {originalFileName} {originalFileSize > 0 && `• ${formatBytes(originalFileSize)}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="crop-close-btn"
            disabled={isUploading}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace */}
        <div className="crop-workspace">
          {/* Viewport Canvas */}
          <div
            ref={viewportRef}
            className="crop-viewport-container"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            title="Drag to reposition • Scroll to zoom"
          >
            {/* Image to be cropped */}
            <img
              ref={imageElementRef}
              src={imageSrc}
              alt="Crop Source"
              className="crop-image-element"
              style={{
                top: `${VP_HEIGHT / 2}px`,
                left: `${VP_WIDTH / 2}px`,
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${currentTotalScale})`,
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              }}
            />

            {/* Dark Mask with Crop Box Cutout */}
            <div
              className="crop-frame-box"
              style={{
                width: `${cropFrame.width}px`,
                height: `${cropFrame.height}px`,
              }}
            >
              {/* Rule of Thirds Grid Lines */}
              <div className="crop-grid-line-h1"></div>
              <div className="crop-grid-line-h2"></div>
              <div className="crop-grid-line-v1"></div>
              <div className="crop-grid-line-v2"></div>

              {/* Corner Accent Handles */}
              <div className="crop-corner crop-corner-tl"></div>
              <div className="crop-corner crop-corner-tr"></div>
              <div className="crop-corner crop-corner-bl"></div>
              <div className="crop-corner crop-corner-br"></div>
            </div>

            {/* Helper Hint */}
            <div className="crop-hint-badge">
              DRAG TO PAN • SCROLL TO ZOOM
            </div>
          </div>

          {/* Controls Row: Aspect Ratio + Zoom + Rotate */}
          <div className="crop-controls-row">
            {/* Aspect Ratio Switcher */}
            <div className="crop-ratio-group">
              <button
                type="button"
                className={`crop-ratio-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                onClick={() => setAspectRatio('1:1')}
              >
                1:1 Square
              </button>
              <button
                type="button"
                className={`crop-ratio-btn ${aspectRatio === '4:5' ? 'active' : ''}`}
                onClick={() => setAspectRatio('4:5')}
              >
                4:5 Portrait
              </button>
              <button
                type="button"
                className={`crop-ratio-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                onClick={() => setAspectRatio('16:9')}
              >
                16:9 Wide
              </button>
              <button
                type="button"
                className={`crop-ratio-btn ${aspectRatio === 'free' ? 'active' : ''}`}
                onClick={() => setAspectRatio('free')}
              >
                Original
              </button>
            </div>

            {/* Tool Actions */}
            <div className="crop-tool-actions">
              {/* Zoom Slider */}
              <div className="crop-zoom-slider-wrap">
                <ZoomOut
                  size={14}
                  className="cursor-pointer text-zinc-400 hover:text-white"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
                />
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="crop-zoom-slider"
                  title="Zoom Factor"
                />
                <ZoomIn
                  size={14}
                  className="cursor-pointer text-zinc-400 hover:text-white"
                  onClick={() => setZoom((z) => Math.min(4, +(z + 0.2).toFixed(2)))}
                />
              </div>

              {/* Rotate 90° */}
              <button
                type="button"
                onClick={handleRotate}
                className="crop-action-mini-btn"
                title="Rotate 90° Clockwise"
              >
                <RotateCw size={14} />
                <span>{rotation}°</span>
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="crop-action-mini-btn"
                title="Reset View"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Smart Compression Card */}
          <div className="crop-compression-card">
            <div className="crop-compression-info">
              <span className="compression-badge">
                <Sparkles size={12} />
                OPTIMIZED
              </span>
              <div className="compression-text">
                <span className="compression-label">Auto-Compress & Fast Delivery</span>
                <span className="compression-detail">
                  Est. Size: {estimateCompressedSize()} • Max {maxDimension}px • JPEG
                </span>
              </div>
            </div>

            <div className="crop-quality-select-wrap">
              <label className="crop-quality-label">Quality:</label>
              <select
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="crop-quality-select"
              >
                <option value={0.85}>85% (Optimal)</option>
                <option value={0.70}>70% (Compact)</option>
                <option value={0.95}>95% (High-Res)</option>
              </select>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2">
              <X size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="crop-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="crop-btn-cancel"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropAndUpload}
            className="crop-btn-upload"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="crop-spinner"></div>
                <span>{uploadProgress || 'PROCESSING...'}</span>
              </>
            ) : (
              <>
                <UploadCloud size={16} />
                <span>Crop & Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;

