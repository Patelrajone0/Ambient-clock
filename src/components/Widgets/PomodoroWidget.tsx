import React, { useState, useEffect, useRef } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { useSoundEngine } from '../../hooks/useSoundEngine';

export const PomodoroWidget: React.FC = () => {
  const { state, openModal } = useAmbient();
  const { pomodoroDurationSec, activeSound, soundVolume } = state;
  const { playPomodoroChime } = useSoundEngine(activeSound, soundVolume);

  const [timeLeft, setTimeLeft] = useState(pomodoroDurationSec || 25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update timer when duration setting changes
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(pomodoroDurationSec || 25 * 60);
  }, [pomodoroDurationSec]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (timeLeft <= 0) {
        setTimeLeft(pomodoroDurationSec || 25 * 60);
      }
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroDurationSec || 25 * 60);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            setIsRunning(false);
            playPomodoroChime();
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
  }, [isRunning, playPomodoroChime]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="widget-chip pomodoro-widget" id="pomodoro-widget">
      <span>⏱️</span>
      <span className="pomodoro-timer" id="pomodoro-timer">
        {mins}:{secs}
      </span>
      <button className="pomodoro-btn" id="pomodoro-toggle-btn" onClick={toggleTimer}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className="pomodoro-btn" id="pomodoro-reset-btn" title="Reset Timer" onClick={resetTimer}>
        ↺
      </button>
      <button
        className="pomodoro-btn"
        id="pomodoro-edit-btn"
        title="Set Focus Duration"
        onClick={() => openModal('pomodoro')}
      >
        ✏️
      </button>
    </div>
  );
};
