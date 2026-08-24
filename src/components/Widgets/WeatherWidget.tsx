import React from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { useWeather } from '../../hooks/useWeather';

export const WeatherWidget: React.FC = () => {
  const { state, openModal } = useAmbient();
  const { weatherCity, weatherUnit } = state;
  const { weather } = useWeather(weatherCity, weatherUnit);

  return (
    <div
      className="widget-chip weather-widget"
      id="weather-widget"
      onClick={() => openModal('settings')}
      style={{ cursor: 'pointer' }}
      title="Click to configure Weather in Settings"
    >
      <span className="weather-icon" id="weather-icon">
        {weather.icon}
      </span>
      <div className="weather-details">
        <span className="weather-temp" id="weather-temp">
          {weather.loading
            ? '...'
            : weather.error
            ? 'Offline'
            : `${weather.temperature}°${weatherUnit}`}
        </span>
        <span className="weather-city" id="weather-city">
          {weather.cityName}
        </span>
      </div>
    </div>
  );
};
