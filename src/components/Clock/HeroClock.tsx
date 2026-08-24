import React, { useState, useEffect } from 'react';
import { useAmbient } from '../../context/AmbientContext';

export const HeroClock: React.FC = () => {
  const { state } = useAmbient();
  const { is24Hour, showSeconds } = state;

  const [time, setTime] = useState({
    timeStr: '12:00',
    seconds: '00',
    ampm: 'PM',
    dateStr: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      let ampm = '';
      if (!is24Hour) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
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

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  return (
    <main className="clock-container">
      <div className="clock-display" id="clock-display" aria-label="Current Time">
        <span id="clock-time">{time.timeStr}</span>
        {showSeconds && (
          <span id="clock-seconds" className="clock-seconds">
            {time.seconds}
          </span>
        )}
        {!is24Hour && (
          <span id="clock-ampm" className="clock-ampm">
            {time.ampm}
          </span>
        )}
      </div>
      <div className="date-display" id="date-display">
        {time.dateStr}
      </div>
    </main>
  );
};
