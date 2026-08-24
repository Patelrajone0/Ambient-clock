import React from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { QuoteWidget } from './QuoteWidget';
import { WeatherWidget } from './WeatherWidget';
import { PomodoroWidget } from './PomodoroWidget';
import { CountdownWidget } from './CountdownWidget';
import { SoundscapeWidget } from './SoundscapeWidget';
import { WorldClockWidget } from './WorldClockWidget';

export const WidgetsBar: React.FC = () => {
  const { state } = useAmbient();
  const {
    showQuote,
    showWeather,
    showPomodoro,
    showCountdown,
    showSoundscape,
    showWorldClock,
  } = state;

  return (
    <div className="widgets-wrapper" id="widgets-wrapper">
      {showQuote && <QuoteWidget />}
      {showWeather && <WeatherWidget />}
      {showPomodoro && <PomodoroWidget />}
      {showCountdown && <CountdownWidget />}
      {showSoundscape && <SoundscapeWidget />}
      {showWorldClock && <WorldClockWidget />}
    </div>
  );
};
