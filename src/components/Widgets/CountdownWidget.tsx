import React, { useState, useEffect, useRef } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { useSoundEngine } from '../../hooks/useSoundEngine';

export const CountdownWidget: React.FC = () => {
  const { state, openModal } = useAmbient();
  const { countdownDurationSec, activeSound, soundVolume } = state;
  const { playCountdownChime } = useSoundEngine(activeSound, soundVolume);

  const [timeLeft, setTimeLeft] = useState(countdownDurationSec || 15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(countdownDurationSec || 15 * 60);
  }, [countdownDurationSec]);

  const toggleTimer = () => {
    setIsFinished(false);
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (timeLeft <= 0) {
        setTimeLeft(countdownDurationSec || 15 * 60);
      }
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(countdownDurationSec || 15 * 60);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            setIsRunning(false);
            setIsFinished(true);
            playCountdownChime();
            return 0;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, playCountdownChime]);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(mins).padStart(2, '0');
  const sStr = String(secs).padStart(2, '0');

  const formattedTime = hours > 0 ? `${hStr}:${mStr}:${sStr}` : `${mStr}:${sStr}`;

  return (
    <div
      className={`widget-chip countdown-widget ${isFinished ? 'finished' : ''}`}
      id="countdown-widget"
    >
      <span>⏳</span>
      <span className="countdown-timer" id="countdown-timer">
        {formattedTime}
      </span>
      <button className="pomodoro-btn" id="countdown-toggle-btn" onClick={toggleTimer}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className="pomodoro-btn" id="countdown-reset-btn" title="Reset Timer" onClick={resetTimer}>
        ↺
      </button>
      <button
        className="pomodoro-btn"
        id="countdown-edit-btn"
        title="Set Countdown Duration"
        onClick={() => openModal('countdown')}
      >
        ✏️
      </button>
    </div>
  );
};
