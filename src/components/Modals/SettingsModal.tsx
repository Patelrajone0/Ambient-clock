import React, { useState } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import {
  ALL_FONTS,
  FREE_THEMES,
  PREMIUM_THEMES,
  SOLID_THEMES,
  WORLD_CITIES_OPTIONS,
} from '../../constants';
import { FontId, ScreensaverColorMode, ScreensaverSize, ThemeId } from '../../types';
import { AdSenseBanner } from '../AdSense/AdSenseBanner';

export const SettingsModal: React.FC = () => {
  const {
    state,
    updateState,
    setTheme,
    setFont,
    setNightstandMode,
    resetDefaults,
    activeModal,
    closeModal,
    openModal,
    startScreensaver,
  } = useAmbient();

  const [locating, setLocating] = useState(false);

  if (activeModal !== 'settings') return null;

  const handleThemeSelect = (themeId: ThemeId, isPremium?: boolean) => {
    if (isPremium && !state.isPremium) {
      openModal('premium');
      return;
    }
    setTheme(themeId);
  };

  const handleFontSelect = (fontId: FontId, isPremium?: boolean) => {
    if (isPremium && !state.isPremium) {
      openModal('premium');
      return;
    }
    setFont(fontId);
  };

  const handleCustomSolidColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ theme: 'solid-custom', customSolidColor: e.target.value });
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async pos => {
          setLocating(false);
          try {
            const geoRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
            );
            const geoData = await geoRes.json();
            const cityName =
              geoData.city || geoData.locality || geoData.principalSubdivision || 'Local Area';
            updateState({ weatherCity: cityName });
          } catch {
            updateState({ weatherCity: 'Local Area' });
          }
        },
        () => {
          setLocating(false);
          alert('Unable to detect location. Please check browser permissions or type your city.');
        },
        { timeout: 8000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleWorldCityChange = (index: number, val: string) => {
    const current = [...(state.worldCities || ['America/New_York', 'Europe/London', 'Asia/Tokyo'])];
    current[index] = val;
    updateState({ worldCities: current });
  };

  return (
    <div
      className="modal-overlay active"
      id="settings-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="settings-modal" role="dialog" aria-labelledby="modal-heading">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-heading">
            <span>⚙️</span> Ambient Preferences
          </h2>
          <button className="close-btn" onClick={closeModal} aria-label="Close Settings">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Animated Background Themes */}
          <div className="setting-group">
            <div className="setting-title">Animated Background Themes</div>
            <div className="themes-grid" id="themes-grid">
              {FREE_THEMES.map(theme => (
                <div
                  key={theme.id}
                  className={`theme-card ${state.theme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div className="theme-preview" style={{ background: theme.previewBg }} />
                  <span className="theme-name">{theme.name}</span>
                </div>
              ))}
            </div>

            {/* Premium Soft & Aesthetic Themes */}
            <div
              className="setting-title"
              style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center' }}
            >
              <span>✨ Premium Soft & Aesthetic Themes</span>
              <span
                className="premium-badge"
                id="premium-status-badge"
                style={{
                  background: state.isPremium
                    ? 'linear-gradient(135deg, #10b981, #3b82f6)'
                    : 'linear-gradient(135deg, #f59e0b, #ec4899)',
                  cursor: 'pointer',
                }}
                onClick={() => openModal('premium')}
              >
                {state.isPremium ? '✨ PREMIUM ACTIVE' : 'PRICING PLANS'}
              </span>
            </div>

            <div className="themes-grid" id="premium-themes-grid">
              {PREMIUM_THEMES.map(theme => (
                <div
                  key={theme.id}
                  className={`theme-card ${state.theme === theme.id ? 'active' : ''} ${
                    !state.isPremium ? 'locked' : ''
                  }`}
                  onClick={() => handleThemeSelect(theme.id, theme.isPremium)}
                >
                  <div className="theme-preview" style={{ background: theme.previewBg }} />
                  <span className="theme-name">{theme.name}</span>
                </div>
              ))}
            </div>

            {/* Solid Color Themes */}
            <div className="setting-title" style={{ marginTop: '1.25rem' }}>
              Solid Color Themes
            </div>
            <div className="themes-grid" id="solid-themes-grid">
              {SOLID_THEMES.map(theme => (
                <div
                  key={theme.id}
                  className={`theme-card ${state.theme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div
                    className="theme-preview"
                    style={{
                      background: theme.previewBg,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <span className="theme-name">{theme.name}</span>
                </div>
              ))}
            </div>

            {/* Custom Solid Color Picker */}
            <div className="setting-row" style={{ marginTop: '0.75rem' }}>
              <div className="setting-label">
                <span>Custom Solid Color</span>
                <span className="setting-sublabel">Pick any custom background color</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="color"
                  id="custom-color-picker"
                  value={state.customSolidColor || '#0f172a'}
                  onChange={handleCustomSolidColor}
                  style={{
                    width: '48px',
                    height: '38px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'none',
                    padding: '2px',
                  }}
                />
                <button
                  className="action-btn secondary-btn"
                  onClick={() => setTheme('solid-custom')}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                >
                  Set Color
                </button>
              </div>
            </div>
          </div>

          {/* Clock & Typography Settings */}
          <div className="setting-group">
            <div className="setting-title">Display & Typography</div>

            <div
              className="setting-row"
              style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}
            >
              <div className="setting-label">
                <span>Clock Display Typeface</span>
                <span className="setting-sublabel">
                  Select a serif font with live specimen preview
                </span>
              </div>

              <div className="fonts-grid" id="fonts-grid" style={{ width: '100%' }}>
                {ALL_FONTS.map(font => (
                  <div
                    key={font.id}
                    className={`font-card ${state.clockFont === font.id ? 'active' : ''} ${
                      font.isPremium && !state.isPremium ? 'locked' : ''
                    }`}
                    onClick={() => handleFontSelect(font.id, font.isPremium)}
                  >
                    <div className="font-specimen" style={{ fontFamily: font.fontFamily }}>
                      {font.specimen}
                    </div>
                    <span className="font-name">{font.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="setting-row" style={{ marginTop: '1rem' }}>
              <div className="setting-label">24-Hour Format</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-24h"
                  checked={state.is24Hour}
                  onChange={e => updateState({ is24Hour: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">Show Seconds</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-seconds"
                  checked={state.showSeconds}
                  onChange={e => updateState({ showSeconds: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>
          </div>

          {/* Widgets Settings */}
          <div className="setting-group">
            <div className="setting-title">Widgets Bar</div>

            <div className="setting-row">
              <div className="setting-label">Ambient Rotating Quote</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-quote-widget"
                  checked={state.showQuote}
                  onChange={e => updateState({ showQuote: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">Weather Chip Widget</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-weather-widget"
                  checked={state.showWeather}
                  onChange={e => updateState({ showWeather: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Weather Location & Units</span>
                <span className="setting-sublabel">
                  Enter any city worldwide or detect location
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <input
                  type="text"
                  id="weather-city-input"
                  className="input-field"
                  placeholder="City Name"
                  value={state.weatherCity}
                  onChange={e => updateState({ weatherCity: e.target.value })}
                  style={{ width: '120px' }}
                />
                <button
                  className="action-btn secondary-btn"
                  id="weather-locate-btn"
                  title="Detect Current Location"
                  onClick={handleGeolocate}
                  style={{ padding: '0.55rem 0.7rem', fontSize: '0.9rem' }}
                >
                  {locating ? '⏳' : '📍'}
                </button>
                <select
                  id="weather-unit-select"
                  className="select-field"
                  value={state.weatherUnit}
                  onChange={e => updateState({ weatherUnit: e.target.value as 'C' | 'F' })}
                  style={{ width: '65px' }}
                >
                  <option value="C">°C</option>
                  <option value="F">°F</option>
                </select>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-label">Pomodoro / Focus Timer</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-pomodoro-widget"
                  checked={state.showPomodoro}
                  onChange={e => updateState({ showPomodoro: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">Custom Countdown Timer</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-countdown-widget"
                  checked={state.showCountdown}
                  onChange={e => updateState({ showCountdown: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">Ambient Soundscape Chip</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-soundscape-widget"
                  checked={state.showSoundscape}
                  onChange={e => updateState({ showSoundscape: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">World Clock Multi-Timezone</div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-worldclock-widget"
                  checked={state.showWorldClock}
                  onChange={e => updateState({ showWorldClock: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <span>World Clock Cities</span>
                <span className="setting-sublabel">Select 3 global cities to display</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[0, 1, 2].map(idx => (
                  <select
                    key={idx}
                    className="select-field"
                    value={state.worldCities?.[idx] || WORLD_CITIES_OPTIONS[idx].value}
                    onChange={e => handleWorldCityChange(idx, e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    {WORLD_CITIES_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          </div>

          {/* Nightstand / Sleep Mode Settings */}
          <div className="setting-group">
            <div className="setting-title">Nightstand / Sleep Mode (N)</div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Ultra-Dim Red Light Mode</span>
                <span className="setting-sublabel">
                  Soft red night vision (#ef4444), hides seconds & stops canvas CPU usage
                </span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-nightstand-mode"
                  checked={state.isNightstand}
                  onChange={e => setNightstandMode(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>

          {/* Screensaver Settings */}
          <div className="setting-group">
            <div className="setting-title">OLED Screensaver Customization</div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Auto-Trigger Timeout</span>
                <span className="setting-sublabel">Inactivity delay before screensaver</span>
              </div>
              <select
                id="screensaver-timeout-select"
                className="select-field"
                value={String(state.screensaverTimeout)}
                onChange={e => updateState({ screensaverTimeout: parseFloat(e.target.value) })}
              >
                <option value="0">Off (Manual Only)</option>
                <option value="0.5">30 Seconds</option>
                <option value="2">2 Minutes</option>
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Display Date, Day & Year</span>
                <span className="setting-sublabel">Show full date below screensaver clock</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-screensaver-date"
                  checked={state.screensaverShowDate}
                  onChange={e => updateState({ screensaverShowDate: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Display AM / PM Badge</span>
                <span className="setting-sublabel">Show AM/PM badge in screensaver mode</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="toggle-screensaver-ampm"
                  checked={state.screensaverShowAmPm}
                  onChange={e => updateState({ screensaverShowAmPm: e.target.checked })}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Screensaver Time Size</span>
                <span className="setting-sublabel">Adjust readout font scale</span>
              </div>
              <select
                id="screensaver-size-select"
                className="select-field"
                value={state.screensaverFontSize || 'medium'}
                onChange={e =>
                  updateState({ screensaverFontSize: e.target.value as ScreensaverSize })
                }
              >
                <option value="small">Small</option>
                <option value="medium">Medium (Default)</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
                <option value="full">Maximum Fullscreen (Screen Fit)</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <span>Screensaver Time Color</span>
                <span className="setting-sublabel">Choose a color for the drifting clock</span>
              </div>
              <select
                id="screensaver-color-select"
                className="select-field"
                value={state.screensaverColorMode || 'dim-white'}
                onChange={e =>
                  updateState({ screensaverColorMode: e.target.value as ScreensaverColorMode })
                }
              >
                <option value="bright-white">Bright Clear White ⚪</option>
                <option value="dim-white">Ambient Dim White</option>
                <option value="neon-cyan">Neon Cyan</option>
                <option value="emerald">Emerald Green</option>
                <option value="hot-pink">Hot Pink</option>
                <option value="amber">Amber Gold</option>
                <option value="sunset">Sunset Coral</option>
                <option value="theme-accent">Active Theme Accent</option>
                <option value="custom">Custom Color...</option>
              </select>
            </div>

            {state.screensaverColorMode === 'custom' && (
              <div className="setting-row" id="screensaver-custom-color-row">
                <div className="setting-label">Custom Screensaver Color</div>
                <input
                  type="color"
                  id="screensaver-custom-color-picker"
                  value={state.screensaverCustomColor || '#38bdf8'}
                  onChange={e => updateState({ screensaverCustomColor: e.target.value })}
                  style={{
                    width: '48px',
                    height: '38px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'none',
                    padding: '2px',
                  }}
                />
              </div>
            )}

            <div className="setting-row" style={{ marginTop: '0.5rem' }}>
              <button
                className="action-btn"
                id="start-screensaver-btn"
                onClick={() => {
                  closeModal();
                  startScreensaver();
                }}
                style={{ width: '100%' }}
              >
                <span>🌙</span> Launch Screensaver Now
              </button>
            </div>
          </div>

          {/* Reset All Settings */}
          <div className="setting-group" style={{ marginTop: '0.5rem' }}>
            <button
              className="action-btn secondary-btn"
              id="reset-defaults-btn"
              onClick={() => {
                if (window.confirm('Reset all preferences to clean defaults?')) {
                  resetDefaults();
                }
              }}
              style={{
                width: '100%',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#f87171',
              }}
            >
              🔄 Turn Off All Settings & Reset to Clean Default
            </button>
          </div>

          {/* Google AdSense Banner Container */}
          <div className="setting-group" id="adsense-banner" style={{ marginTop: '0.5rem' }}>
            <div className="setting-title">Sponsored Announcement</div>
            <AdSenseBanner adClient="ca-pub-7606917595989618" adSlot="1234567890" />
          </div>
        </div>
      </div>
    </div>
  );
};
