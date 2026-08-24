import React, { useState, useEffect } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { COUNTDOWN_PRESETS } from '../../constants';

export const CountdownEditModal: React.FC = () => {
  const { state, updateState, activeModal, closeModal } = useAmbient();
  const isPomodoro = activeModal === 'pomodoro';
  const isCountdown = activeModal === 'countdown';

  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(15);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!isPomodoro && !isCountdown) return;

    const totalSec = isPomodoro
      ? state.pomodoroDurationSec || 25 * 60
      : state.countdownDurationSec || 15 * 60;

    setHours(Math.floor(totalSec / 3600));
    setMins(Math.floor((totalSec % 3600) / 60));
    setSecs(totalSec % 60);
  }, [isPomodoro, isCountdown, state.pomodoroDurationSec, state.countdownDurationSec]);

  if (!isPomodoro && !isCountdown) return null;

  const handleApply = (_startImmediately: boolean = false) => {
    let h = Math.min(Math.max(hours || 0, 0), 24);
    let m = Math.min(Math.max(mins || 0, 0), 60);
    let s = Math.min(Math.max(secs || 0, 0), 60);

    let total = h * 3600 + m * 60 + s;
    if (total > 86400) total = 86400;
    if (total <= 0) total = 60;

    if (isPomodoro) {
      updateState({ pomodoroDurationSec: total });
    } else {
      updateState({ countdownDurationSec: total });
    }

    closeModal();
  };

  const handlePreset = (seconds: number) => {
    setHours(Math.floor(seconds / 3600));
    setMins(Math.floor((seconds % 3600) / 60));
    setSecs(seconds % 60);
  };

  return (
    <div
      className="modal-overlay active"
      id="countdown-modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="settings-modal" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>
            <span>{isPomodoro ? '⏱️' : '⏳'}</span>{' '}
            {isPomodoro ? 'Set Focus Duration' : 'Set Countdown Timer'}
          </h2>
          <button className="close-btn" onClick={closeModal} aria-label="Close Countdown Settings">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem 1.75rem', gap: '1.25rem' }}>
          {/* Quick Presets */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent-color)',
                display: 'block',
                marginBottom: '0.6rem',
              }}
            >
              Quick Presets
            </label>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {COUNTDOWN_PRESETS.map(preset => (
                <button
                  key={preset.seconds}
                  className="preset-pill-btn"
                  onClick={() => handlePreset(preset.seconds)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent-color)',
                display: 'block',
                marginBottom: '0.6rem',
              }}
            >
              Custom Duration (Max 24 Hours)
            </label>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="number"
                  className="input-field"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={e => setHours(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '70px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    padding: '0.4rem',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.35rem',
                    fontWeight: 600,
                  }}
                >
                  HOURS (0-24)
                </span>
              </div>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--accent-color)',
                  marginTop: '-1rem',
                }}
              >
                :
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="number"
                  className="input-field"
                  min="0"
                  max="60"
                  value={mins}
                  onChange={e => setMins(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '70px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    padding: '0.4rem',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.35rem',
                    fontWeight: 600,
                  }}
                >
                  MINS (0-60)
                </span>
              </div>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--accent-color)',
                  marginTop: '-1rem',
                }}
              >
                :
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="number"
                  className="input-field"
                  min="0"
                  max="60"
                  value={secs}
                  onChange={e => setSecs(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '70px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    padding: '0.4rem',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.35rem',
                    fontWeight: 600,
                  }}
                >
                  SECS (0-60)
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              className="action-btn"
              onClick={() => handleApply(true)}
              style={{ flex: 1 }}
            >
              Save Duration
            </button>
            <button
              className="action-btn secondary-btn"
              onClick={closeModal}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
