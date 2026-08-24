import React from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { SoundType } from '../../types';

export const SoundscapeWidget: React.FC = () => {
  const { state, updateState, openModal } = useAmbient();
  const { activeSound, soundVolume, isPremium } = state;

  const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sound = e.target.value as SoundType;
    if (sound !== 'off' && !isPremium) {
      openModal('premium');
      return;
    }
    updateState({ activeSound: sound });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    updateState({ soundVolume: volume });
  };

  return (
    <div className="widget-chip soundscape-widget" id="soundscape-widget">
      <span id="soundscape-icon">🎧</span>
      <select
        id="soundscape-select"
        className="select-field"
        value={activeSound}
        onChange={handleSoundChange}
        style={{
          padding: '0.25rem 0.4rem',
          fontSize: '0.8rem',
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        <option value="off">Sounds Off</option>
        <option value="rain">Gentle Rain 🌧️</option>
        <option value="ocean">Ocean Surf 🌊</option>
        <option value="pink">Pink Focus 🧠</option>
      </select>
      <input
        type="range"
        id="soundscape-volume"
        min="0"
        max="1"
        step="0.05"
        value={soundVolume}
        onChange={handleVolumeChange}
        title="Audio Volume"
        style={{ width: '50px', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
      />
    </div>
  );
};
