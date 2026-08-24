import React, { useState, useEffect } from 'react';
import { useAmbient } from '../../context/AmbientContext';

export const ScreensaverOverlay: React.FC = () => {
  const { state, isScreensaverActive, exitScreensaver } = useAmbient();
  const {
    is24Hour,
    showSeconds,
    screensaverFontSize,
    screensaverColorMode,
    screensaverCustomColor,
    screensaverShowDate,
    screensaverShowAmPm,
  } = state;

  const [time, setTime] = useState({
    timeStr: '12:00',
    seconds: '00',
    ampm: 'PM',
    dateStr: '',
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Update screensaver clock
  useEffect(() => {
    if (!isScreensaverActive) return;

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      let ampm = '';
      if (!is24Hour) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
      }

      const formattedHours = String(hours).padStart(is24Hour ? 2 : 1, '0');
      const timeStr = `${formattedHours}:${minutes}`;

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      const dateStr = now.toLocaleDateString(undefined, options);

      setTime({ timeStr, seconds, ampm, dateStr });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [isScreensaverActive, is24Hour]);

  // Anti-burn-in drift every 30 seconds
  useEffect(() => {
    if (!isScreensaverActive) return;

    setOffset({ x: 0, y: 0 });
    const driftInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;
      setOffset({ x: offsetX, y: offsetY });
    }, 30000);

    return () => clearInterval(driftInterval);
  }, [isScreensaverActive]);

  // Wake on activity
  useEffect(() => {
    if (!isScreensaverActive) return;

    const handleActivity = () => {
      exitScreensaver();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, handleActivity));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleActivity));
    };
  }, [isScreensaverActive, exitScreensaver]);

  // Compute color & glow
  let colorVal = 'rgba(255, 255, 255, 0.45)';
  let shadowVal = '0 0 25px rgba(255, 255, 255, 0.15)';

  switch (screensaverColorMode) {
    case 'bright-white':
      colorVal = '#ffffff';
      shadowVal = '0 0 35px rgba(255, 255, 255, 0.8)';
      break;
    case 'neon-cyan':
      colorVal = '#38bdf8';
      shadowVal = '0 0 30px rgba(56, 189, 248, 0.45)';
      break;
    case 'emerald':
      colorVal = '#34d399';
      shadowVal = '0 0 30px rgba(52, 211, 153, 0.45)';
      break;
    case 'hot-pink':
      colorVal = '#ff007f';
      shadowVal = '0 0 30px rgba(255, 0, 127, 0.45)';
      break;
    case 'amber':
      colorVal = '#fbbf24';
      shadowVal = '0 0 30px rgba(251, 191, 36, 0.45)';
      break;
    case 'sunset':
      colorVal = '#f87171';
      shadowVal = '0 0 30px rgba(248, 113, 113, 0.45)';
      break;
    case 'theme-accent':
      colorVal = 'var(--accent-color)';
      shadowVal = '0 0 30px var(--accent-glow)';
      break;
    case 'custom':
      colorVal = screensaverCustomColor || '#38bdf8';
      shadowVal = `0 0 30px ${colorVal}`;
      break;
    default:
      colorVal = 'rgba(255, 255, 255, 0.45)';
      shadowVal = '0 0 25px rgba(255, 255, 255, 0.15)';
      break;
  }

  const clockStyle = {
    color: colorVal,
    textShadow: shadowVal,
  };

  return (
    <div
      id="screensaver-overlay"
      className={isScreensaverActive ? 'active' : ''}
      onClick={exitScreensaver}
    >
      <div
        id="screensaver-clock-container"
        className={`screensaver-size-${screensaverFontSize || 'medium'}`}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <div
          className="clock-display screensaver-hero-clock"
          id="screensaver-hero-clock"
          style={clockStyle}
        >
          <span id="screensaver-time">{time.timeStr}</span>
          {showSeconds && (
            <span id="screensaver-seconds" className="clock-seconds">
              {time.seconds}
            </span>
          )}
          {!is24Hour && screensaverShowAmPm && (
            <span id="screensaver-ampm" className="clock-ampm">
              {time.ampm}
            </span>
          )}
        </div>
        {screensaverShowDate && (
          <div
            className="date-display screensaver-date-display"
            id="screensaver-date"
            style={{ ...clockStyle, display: 'block' }}
          >
            {time.dateStr}
          </div>
        )}
      </div>
    </div>
  );
};
