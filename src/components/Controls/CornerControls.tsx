import React, { useState, useEffect, useRef } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { Maximize2, Moon, MoonStar, Settings } from 'lucide-react';

export const CornerControls: React.FC = () => {
  const {
    state,
    setNightstandMode,
    startScreensaver,
    openModal,
    toggleFullscreen,
  } = useAmbient();
  const { isNightstand } = state;

  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 4000);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, handleActivity));

    handleActivity();

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      events.forEach(evt => window.removeEventListener(evt, handleActivity));
    };
  }, []);

  return (
    <div
      className={`corner-controls ${isIdle ? 'idle-hidden' : ''}`}
      id="corner-controls"
    >
      {/* Fullscreen Button (Bottom-Left) */}
      <button
        className="corner-btn"
        id="fullscreen-btn"
        title="Toggle Fullscreen (F)"
        aria-label="Toggle Fullscreen"
        onClick={toggleFullscreen}
      >
        <Maximize2 size={20} />
      </button>

      {/* Right Corner Controls Group */}
      <div className="corner-controls-right" style={{ display: 'flex', gap: '0.75rem', pointerEvents: 'auto' }}>
        {/* Nightstand / Sleep Mode Button (N) */}
        <button
          className={`corner-btn ${isNightstand ? 'active' : ''}`}
          id="nightstand-btn"
          title={isNightstand ? 'Nightstand Mode ON (N)' : 'Nightstand / Sleep Mode (N)'}
          aria-label="Nightstand Mode"
          onClick={() => setNightstandMode(!isNightstand)}
        >
          <MoonStar size={20} />
        </button>

        {/* Instant Screensaver Button (Z) */}
        <button
          className="corner-btn"
          id="quick-screensaver-btn"
          title="Instant Screensaver (Z)"
          aria-label="Instant Screensaver"
          onClick={startScreensaver}
        >
          <Moon size={20} />
        </button>

        {/* Settings Gear Button (S) */}
        <button
          className="corner-btn"
          id="settings-btn"
          title="Settings (S)"
          aria-label="Settings"
          onClick={() => openModal('settings')}
        >
          <Settings size={22} />
        </button>
      </div>
    </div>
  );
};
