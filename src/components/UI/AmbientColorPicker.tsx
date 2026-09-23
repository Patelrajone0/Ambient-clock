import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette, Check, Palette, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface AmbientColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onApply?: (color: string) => void;
  isActiveTheme?: boolean;
  label?: string;
  sublabel?: string;
  applyButtonText?: string;
}

// Color conversion helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  if (isNaN(num) || c.length !== 6) {
    return { r: 15, g: 23, b: 42 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`.toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

const PRESET_PALETTES = [
  { name: 'Midnight Slate', hex: '#0F172A' },
  { name: 'Deep Space', hex: '#020617' },
  { name: 'Royal Indigo', hex: '#1E1B4B' },
  { name: 'Plum Velvet', hex: '#3B0764' },
  { name: 'Dark Forest', hex: '#064E3B' },
  { name: 'Matte Carbon', hex: '#18181B' },
  { name: 'Deep Abyss', hex: '#0C4A6E' },
  { name: 'Cyber Neon Cyan', hex: '#06B6D4' },
  { name: 'Electric Violet', hex: '#8B5CF6' },
  { name: 'Sunset Glow', hex: '#F97316' },
  { name: 'Rose Coral', hex: '#F43F5E' },
  { name: 'Warm Cream', hex: '#FEF3C7' },
];

export const AmbientColorPicker: React.FC<AmbientColorPickerProps> = ({
  color,
  onChange,
  onApply,
  isActiveTheme = false,
  label = 'Custom Solid Color',
  sublabel = 'Pick any custom background color',
  applyButtonText = 'Apply Color',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color.toUpperCase());
  const [hsv, setHsv] = useState(() => {
    const rgb = hexToRgb(color);
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  });
  const [rgbVals, setRgbVals] = useState(() => hexToRgb(color));
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);

  const satAreaRef = useRef<HTMLDivElement>(null);
  const isDraggingSat = useRef(false);

  useEffect(() => {
    setIsEyeDropperSupported('EyeDropper' in window);
  }, []);

  // Sync internal state when external color prop changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    setRgbVals(rgb);
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
    setHexInput(color.toUpperCase());
  }, [color]);

  const updateFromHsv = useCallback(
    (newHsv: { h: number; s: number; v: number }) => {
      setHsv(newHsv);
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      setRgbVals(rgb);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHexInput(hex);
      onChange(hex);
    },
    [onChange]
  );

  const handleSatPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingSat.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    handleSatPointerMove(e);
  };

  const handleSatPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSat.current || !satAreaRef.current) return;
    const rect = satAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    updateFromHsv({ ...hsv, s, v });
  };

  const handleSatPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingSat.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = parseInt(e.target.value, 10);
    updateFromHsv({ ...hsv, h });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim().toUpperCase();
    if (!val.startsWith('#')) val = '#' + val;
    setHexInput(val);

    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const rgb = hexToRgb(val);
      setRgbVals(rgb);
      setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
      onChange(val);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: string) => {
    const num = Math.max(0, Math.min(255, parseInt(val, 10) || 0));
    const nextRgb = { ...rgbVals, [channel]: num };
    setRgbVals(nextRgb);
    const hex = rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
    setHexInput(hex);
    setHsv(rgbToHsv(nextRgb.r, nextRgb.g, nextRgb.b));
    onChange(hex);
  };

  const handlePresetClick = (presetHex: string) => {
    const rgb = hexToRgb(presetHex);
    setRgbVals(rgb);
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
    setHexInput(presetHex.toUpperCase());
    onChange(presetHex);
    if (onApply) onApply(presetHex);
  };

  const handleEyeDropper = async () => {
    if (!('EyeDropper' in window)) return;
    try {
      const EyeDropperConstructor = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const eyeDropper = new EyeDropperConstructor();
      const result = await eyeDropper.open();
      if (result?.sRGBHex) {
        handlePresetClick(result.sRGBHex);
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="ambient-color-picker-container">
      {/* Trigger Row */}
      <div className="ambient-color-trigger-row">
        <div className="setting-label">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{label}</span>
            {isActiveTheme && (
              <span className="ambient-active-badge">
                <Check size={11} strokeWidth={3} /> Active
              </span>
            )}
          </div>
          {sublabel && <span className="setting-sublabel">{sublabel}</span>}
        </div>

        <div className="ambient-color-actions">
          {/* Swatch Preview Button */}
          <button
            type="button"
            className="ambient-swatch-btn"
            onClick={() => setIsOpen(!isOpen)}
            title="Toggle Ambient Color Studio"
            style={{
              '--current-color': color,
            } as React.CSSProperties}
          >
            <span
              className="ambient-swatch-circle"
              style={{ backgroundColor: color }}
            />
            <span className="ambient-hex-code">{color.toUpperCase()}</span>
            {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {/* Quick Apply Button */}
          {onApply && (
            <button
              type="button"
              className={`action-btn ${isActiveTheme ? 'primary-btn' : 'secondary-btn'}`}
              onClick={() => onApply(color)}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              {applyButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Dark Glassmorphic Studio Panel */}
      {isOpen && (
        <div className="ambient-color-studio-panel">
          <div className="ambient-studio-header">
            <div className="ambient-studio-title">
              <Palette size={16} className="ambient-studio-icon" />
              <span>Ambient Color Studio</span>
            </div>
            <div className="ambient-studio-header-actions">
              {isEyeDropperSupported && (
                <button
                  type="button"
                  className="ambient-tool-btn"
                  onClick={handleEyeDropper}
                  title="Sample color from screen"
                >
                  <Pipette size={14} />
                  <span>Pick from Screen</span>
                </button>
              )}
            </div>
          </div>

          {/* 2D Saturation / Value Gradient Canvas Area */}
          <div
            ref={satAreaRef}
            className="ambient-sat-area"
            style={{
              backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
            }}
            onPointerDown={handleSatPointerDown}
            onPointerMove={handleSatPointerMove}
            onPointerUp={handleSatPointerUp}
          >
            {/* White to transparent horizontal gradient */}
            <div className="ambient-sat-white-overlay" />
            {/* Transparent to black vertical gradient */}
            <div className="ambient-sat-black-overlay" />

            {/* Draggable reticle handle */}
            <div
              className="ambient-sat-pointer"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
                backgroundColor: color,
              }}
            />
          </div>

          {/* Hue Rainbow Slider */}
          <div className="ambient-hue-track-container">
            <input
              type="range"
              min="0"
              max="360"
              value={hsv.h}
              onChange={handleHueChange}
              className="ambient-hue-slider"
              aria-label="Hue Slider"
            />
          </div>

          {/* Inputs Row: Live Swatch + HEX + RGB */}
          <div className="ambient-inputs-row">
            <div
              className="ambient-live-preview-box"
              style={{ backgroundColor: color }}
              title={`Current: ${color.toUpperCase()}`}
            />

            {/* Hex Input */}
            <div className="ambient-input-group hex-group">
              <label htmlFor="ambient-hex-val">HEX</label>
              <input
                id="ambient-hex-val"
                type="text"
                maxLength={7}
                value={hexInput}
                onChange={handleHexInputChange}
                className="ambient-dark-input hex-input"
              />
            </div>

            {/* RGB Inputs */}
            <div className="ambient-input-group rgb-group">
              <label htmlFor="ambient-r-val">R</label>
              <input
                id="ambient-r-val"
                type="number"
                min="0"
                max="255"
                value={rgbVals.r}
                onChange={e => handleRgbChange('r', e.target.value)}
                className="ambient-dark-input rgb-input"
              />
            </div>

            <div className="ambient-input-group rgb-group">
              <label htmlFor="ambient-g-val">G</label>
              <input
                id="ambient-g-val"
                type="number"
                min="0"
                max="255"
                value={rgbVals.g}
                onChange={e => handleRgbChange('g', e.target.value)}
                className="ambient-dark-input rgb-input"
              />
            </div>

            <div className="ambient-input-group rgb-group">
              <label htmlFor="ambient-b-val">B</label>
              <input
                id="ambient-b-val"
                type="number"
                min="0"
                max="255"
                value={rgbVals.b}
                onChange={e => handleRgbChange('b', e.target.value)}
                className="ambient-dark-input rgb-input"
              />
            </div>
          </div>

          {/* Curated Ambient Presets */}
          <div className="ambient-presets-section">
            <div className="ambient-presets-label">
              <Sparkles size={13} />
              <span>Curated Ambient Palettes</span>
            </div>
            <div className="ambient-presets-grid">
              {PRESET_PALETTES.map(preset => {
                const isSelected = color.toUpperCase() === preset.hex.toUpperCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    className={`ambient-preset-chip ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: preset.hex }}
                    onClick={() => handlePresetClick(preset.hex)}
                    title={`${preset.name} (${preset.hex})`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} className="preset-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          {onApply && (
            <div className="ambient-studio-footer">
              <button
                type="button"
                className="ambient-apply-full-btn"
                onClick={() => {
                  onApply(color);
                  setIsOpen(false);
                }}
              >
                <Check size={16} />
                <span>Apply as Active Theme</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
