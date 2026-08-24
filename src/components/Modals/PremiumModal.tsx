import React, { useState } from 'react';
import { useAmbient } from '../../context/AmbientContext';

export const PremiumModal: React.FC = () => {
  const { activeModal, closeModal, activateSubscription } = useAmbient();
  const [selectedPlan, setSelectedPlan] = useState<'3m' | '6m' | '1y'>('1y');

  if (activeModal !== 'premium') return null;

  const handleActivate = () => {
    activateSubscription(selectedPlan);
    closeModal();
    const planName =
      selectedPlan === '1y'
        ? '1 Year (₹450)'
        : selectedPlan === '6m'
        ? '6 Months (₹250)'
        : '3 Months (₹150)';
    alert(
      `🎉 Subscription Activated!\n\nYou're now subscribed to Ambient Premium on the ${planName} plan. All aesthetic themes, subscriber serif fonts, and soundscapes are unlocked!`
    );
  };

  return (
    <div
      className="modal-overlay active"
      id="premium-modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="settings-modal" style={{ maxWidth: '580px', textAlign: 'center' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ margin: '0 auto', color: '#f59e0b' }}>
            <span>✨</span> Ambient Premium Upgrade
          </h2>
          <button className="close-btn" onClick={closeModal} aria-label="Close Upgrade Modal">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.75rem 2rem' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Unlock all aesthetic themes (Sakura Drift, Sunset Glow, Zen Forest Mist, Nebula Dust, Kyoto Bamboo, Lavender Dream, Cozy Ember, Moonlight Cloud, Ocean Breeze), Web Audio Soundscapes, and Subscriber Fonts.
          </p>

          {/* Pricing Grid */}
          <div className="pricing-grid" id="pricing-grid">
            <div
              className={`pricing-card ${selectedPlan === '3m' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('3m')}
            >
              <span className="pricing-duration">3 Months</span>
              <div className="pricing-price">₹150</div>
              <span className="pricing-period">₹50 / month</span>
            </div>

            <div
              className={`pricing-card ${selectedPlan === '6m' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('6m')}
            >
              <span className="pricing-duration">6 Months</span>
              <div className="pricing-price">₹250</div>
              <span className="pricing-period">₹41.6 / month</span>
            </div>

            <div
              className={`pricing-card ${selectedPlan === '1y' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('1y')}
            >
              <span className="pricing-discount-badge">10% OFF</span>
              <span className="pricing-duration">1 Year</span>
              <div className="pricing-price">₹450</div>
              <span className="pricing-period">₹37.5 / month</span>
            </div>
          </div>

          <button
            className="action-btn"
            id="activate-subscription-btn"
            onClick={handleActivate}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              border: 'none',
              padding: '0.9rem',
              fontSize: '1rem',
            }}
          >
            🚀 Activate Subscription (Instant Demo Unlock)
          </button>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            🔒 Instant unlock • Cancel anytime • 100% Offline Capable
          </div>
        </div>
      </div>
    </div>
  );
};
