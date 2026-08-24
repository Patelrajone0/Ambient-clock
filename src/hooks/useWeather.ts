import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';

export function useWeather(cityName: string, unit: 'C' | 'F') {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    weatherCode: null,
    cityName: cityName || 'San Francisco',
    icon: '🌤️',
    description: 'Loading...',
    loading: false,
    error: false,
  });

  const getWeatherInfoFromCode = (code: number) => {
    if (code === 0) return { icon: '☀️', description: 'Clear Sky' };
    if (code >= 1 && code <= 3) return { icon: '🌤️', description: 'Partly Cloudy' };
    if (code === 45 || code === 48) return { icon: '🌫️', description: 'Foggy' };
    if (code >= 51 && code <= 55) return { icon: '🌧️', description: 'Drizzle' };
    if (code >= 61 && code <= 65) return { icon: '🌧️', description: 'Rain' };
    if (code >= 71 && code <= 77) return { icon: '❄️', description: 'Snow' };
    if (code >= 80 && code <= 82) return { icon: '🌦️', description: 'Showers' };
    if (code >= 95) return { icon: '🌩️', description: 'Thunderstorm' };
    return { icon: '🌤️', description: 'Fair' };
  };

  const fetchWeatherForCity = useCallback(async (city: string) => {
    if (!city || city.trim() === '') city = 'San Francisco';
    setWeather(prev => ({ ...prev, loading: true, error: false }));

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setWeather(prev => ({
          ...prev,
          cityName: city,
          temperature: null,
          icon: '❓',
          description: 'City not found',
          loading: false,
          error: true,
        }));
        return;
      }

      const location = geoData.results[0];
      const lat = location.latitude;
      const lon = location.longitude;
      const displayName = location.name;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        setWeather(prev => ({ ...prev, loading: false, error: true }));
        return;
      }

      const { temperature, weathercode } = weatherData.current_weather;
      let finalTemp = temperature;
      if (unit === 'F') {
        finalTemp = (temperature * 9) / 5 + 32;
      }

      const weatherInfo = getWeatherInfoFromCode(weathercode);

      setWeather({
        temperature: Math.round(finalTemp),
        weatherCode: weathercode,
        cityName: displayName,
        icon: weatherInfo.icon,
        description: weatherInfo.description,
        loading: false,
        error: false,
      });
    } catch (err) {
      console.warn('Weather fetch error:', err);
      setWeather(prev => ({
        ...prev,
        icon: '⚠️',
        description: 'Offline',
        loading: false,
        error: true,
      }));
    }
  }, [unit]);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setWeather(prev => ({ ...prev, loading: true, error: false }));
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        setWeather(prev => ({ ...prev, loading: false, error: true }));
        return;
      }

      const { temperature, weathercode } = weatherData.current_weather;
      let finalTemp = temperature;
      if (unit === 'F') {
        finalTemp = (temperature * 9) / 5 + 32;
      }

      let detectedCity = 'Local Area';
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const geoData = await geoRes.json();
        detectedCity = geoData.city || geoData.locality || geoData.principalSubdivision || 'Local Area';
      } catch {}

      const weatherInfo = getWeatherInfoFromCode(weathercode);

      setWeather({
        temperature: Math.round(finalTemp),
        weatherCode: weathercode,
        cityName: detectedCity,
        icon: weatherInfo.icon,
        description: weatherInfo.description,
        loading: false,
        error: false,
      });

      return detectedCity;
    } catch (err) {
      console.warn('Geolocation weather fetch error:', err);
      setWeather(prev => ({ ...prev, loading: false, error: true }));
    }
  }, [unit]);

  useEffect(() => {
    fetchWeatherForCity(cityName);
  }, [cityName, unit, fetchWeatherForCity]);

  return {
    weather,
    fetchWeatherForCity,
    fetchWeatherByCoords,
  };
}
