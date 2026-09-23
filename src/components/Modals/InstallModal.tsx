import React, { useState } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { usePWAInstall, DevicePlatform } from '../../hooks/usePWAInstall';
import {
  Download,
  Share,
  PlusSquare,
  Monitor,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Zap,
  WifiOff,
  Maximize,
} from 'lucide-react';

export const InstallModal: React.FC = () => {
  const { activeModal, closeModal } = useAmbient();
  const { isInstalled, canPromptDirectly, platform, promptInstall } = usePWAInstall();

  // Selected tab defaults to current platform, or fallback to desktop/ios
  const [selectedTab, setSelectedTab] = useState<DevicePlatform>(() => {
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
    if (platform === 'mac') return 'mac';
    return 'windows';
  });

  const [installSuccess, setInstallSuccess] = useState(false);

  if (activeModal !== 'install') return null;

  const handleInstallClick = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
  };

  return (
    <div
      className="modal-overlay active"
      id="install-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="settings-modal install-modal" role="dialog" aria-labelledby="install-modal-title" style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="install-modal-badge">
              <Download size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="modal-title" id="install-modal-title" style={{ margin: 0 }}>
                Install Ambient App
              </h2>
              <p className="install-modal-subtitle">
                Add to your home screen or desktop for instant, distraction-free access
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={closeModal} aria-label="Close Install Modal">
            ✕
          </button>
        </div>

        <div className="modal-body install-modal-body">
          {/* Status Banner */}
          {isInstalled ? (
            <div className="install-status-box installed">
              <CheckCircle2 size={24} color="#34d399" />
              <div>
                <strong>Ambient is already installed!</strong>
                <p>You can launch it directly from your device's home screen, applications, or desktop.</p>
              </div>
            </div>
          ) : installSuccess ? (
            <div className="install-status-box installed">
              <CheckCircle2 size={24} color="#34d399" />
              <div>
                <strong>Installation Complete!</strong>
                <p>Ambient has been added to your device. Enjoy your distraction-free ambient clock!</p>
              </div>
            </div>
          ) : canPromptDirectly ? (
            <div className="install-quick-action">
              <div className="install-quick-content">
                <Sparkles size={20} color="#38bdf8" />
                <div>
                  <strong>Ready to Install in 1-Click</strong>
                  <p>Click below to add Ambient directly to your desktop or device.</p>
                </div>
              </div>
              <button
                className="action-btn install-cta-btn"
                id="one-click-install-btn"
                onClick={handleInstallClick}
              >
                <Download size={18} />
                Install Ambient Now
              </button>
            </div>
          ) : null}

          {/* Benefits Grid */}
          <div className="install-benefits-grid">
            <div className="install-benefit-item">
              <Maximize size={18} className="benefit-icon" />
              <div>
                <strong>True Full-Screen</strong>
                <span>No address bar, tabs, or bookmarks</span>
              </div>
            </div>
            <div className="install-benefit-item">
              <Zap size={18} className="benefit-icon" />
              <div>
                <strong>Instant Launch</strong>
                <span>One-tap from taskbar, dock, or home</span>
              </div>
            </div>
            <div className="install-benefit-item">
              <WifiOff size={18} className="benefit-icon" />
              <div>
                <strong>Works Offline</strong>
                <span>Keeps time and themes without WiFi</span>
              </div>
            </div>
          </div>

          {/* Platform Guide Tabs */}
          <div className="install-tabs-header">
            <span>Device Instructions:</span>
            <div className="install-tabs">
              <button
                className={`install-tab-btn ${selectedTab === 'windows' || selectedTab === 'chrome-desktop' ? 'active' : ''}`}
                onClick={() => setSelectedTab('windows')}
              >
                <Monitor size={15} /> Windows / Chrome
              </button>
              <button
                className={`install-tab-btn ${selectedTab === 'ios' ? 'active' : ''}`}
                onClick={() => setSelectedTab('ios')}
              >
                <Smartphone size={15} /> iPhone / iPad
              </button>
              <button
                className={`install-tab-btn ${selectedTab === 'android' ? 'active' : ''}`}
                onClick={() => setSelectedTab('android')}
              >
                <Smartphone size={15} /> Android
              </button>
              <button
                className={`install-tab-btn ${selectedTab === 'mac' ? 'active' : ''}`}
                onClick={() => setSelectedTab('mac')}
              >
                <Monitor size={15} /> Mac / Safari
              </button>
            </div>
          </div>

          {/* Platform Step-by-Step Instructions */}
          <div className="install-guide-box">
            {(selectedTab === 'windows' || selectedTab === 'chrome-desktop') && (
              <div className="guide-steps">
                <div className="guide-step">
                  <span className="step-num">1</span>
                  <div className="step-desc">
                    {canPromptDirectly ? (
                      <>
                        Click the <strong>"Install Ambient Now"</strong> button above, or look at the right edge of your browser URL bar for the <strong>Install</strong> icon ⊕.
                      </>
                    ) : (
                      <>
                        Look at the right side of the address bar for the <strong>Install App icon (⊕ or computer with arrow)</strong>.
                      </>
                    )}
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    Click <strong>"Install"</strong> in the browser prompt.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">3</span>
                  <div className="step-desc">
                    Ambient will open in its own clean window and be added to your <strong>Desktop & Taskbar</strong>!
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'ios' && (
              <div className="guide-steps">
                <div className="guide-step">
                  <span className="step-num">1</span>
                  <div className="step-desc">
                    Open Ambient in <strong>Safari</strong> on your iPhone or iPad.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    Tap the <strong>Share</strong> button <Share size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> in the bottom toolbar.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">3</span>
                  <div className="step-desc">
                    Scroll down and select <strong>"Add to Home Screen"</strong> <PlusSquare size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">4</span>
                  <div className="step-desc">
                    Tap <strong>"Add"</strong> in the top right. Ambient is now an app on your home screen!
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'android' && (
              <div className="guide-steps">
                <div className="guide-step">
                  <span className="step-num">1</span>
                  <div className="step-desc">
                    {canPromptDirectly ? (
                      <>
                        Tap the <strong>"Install Ambient Now"</strong> button above, or tap the menu in Chrome.
                      </>
                    ) : (
                      <>
                        In Chrome, tap the <strong>three dots (⋮)</strong> menu in the upper-right corner.
                      </>
                    )}
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">3</span>
                  <div className="step-desc">
                    Confirm by tapping <strong>Install</strong>. Ambient will appear in your app drawer and home screen.
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'mac' && (
              <div className="guide-steps">
                <div className="guide-step">
                  <span className="step-num">1</span>
                  <div className="step-desc">
                    In <strong>Safari</strong> on macOS Sonoma (or newer), click <strong>File</strong> in the top menu bar, or tap the <strong>Share</strong> button.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    Choose <strong>"Add to Dock..."</strong>.
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-num">3</span>
                  <div className="step-desc">
                    Click <strong>Add</strong>. Ambient will now open as an independent, distraction-free Mac app directly from your Dock.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="action-btn secondary-btn" onClick={closeModal} style={{ minWidth: '100px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
