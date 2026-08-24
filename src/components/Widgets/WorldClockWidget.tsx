import React, { useState, useEffect } from 'react';
import { useAmbient } from '../../context/AmbientContext';

export const WorldClockWidget: React.FC = () => {
  const { state, openModal } = useAmbient();
  const { worldCities, is24Hour } = state;
  const [cityTimes, setCityTimes] = useState<{ cityCode: string; timeStr: string }[]>([]);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const cities = worldCities || ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

      const times = cities
        .map(timeZone => {
          try {
            const timeStr = now.toLocaleTimeString('en-US', {
              timeZone,
              hour: 'numeric',
              minute: '2-digit',
              hour12: !is24Hour,
            });
            const parts = timeZone.split('/');
            const cityName = parts[1] ? parts[1].replace('_', ' ') : timeZone;
            const cityCode = cityName.substring(0, 3).toUpperCase();
            return { cityCode, timeStr };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as { cityCode: string; timeStr: string }[];

      setCityTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 5000);
    return () => clearInterval(interval);
  }, [worldCities, is24Hour]);

  return (
    <div
      className="widget-chip worldclock-widget"
      id="worldclock-widget"
      onClick={() => openModal('settings')}
      style={{ cursor: 'pointer' }}
      title="Click to configure World Cities in Settings"
    >
      <span>🌍</span>
      <div
        id="worldclock-times"
        style={{ display: 'flex', gap: '0.6rem', fontSize: '0.82rem', fontWeight: 500 }}
      >
        {cityTimes.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span style={{ opacity: 0.35, margin: '0 0.15rem' }}>|</span>}
            <span>
              <strong>{item.cityCode}</strong> {item.timeStr}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
