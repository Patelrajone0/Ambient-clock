import React, { useState, useEffect } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Sparkles } from 'lucide-react';

const DISMISS_KEY = 'ambient_install_banner_dismissed';

export const InstallBanner: React.FC = () => {
  const { openModal } = useAmbient();
  const { isInstalled, canPromptDirectly, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If already installed, never show banner
    if (isInstalled) return;

    // Check if dismissed before
    const isDismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    if (isDismissed) return;

    // Show after slight delay to allow smooth page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  if (!isVisible || isInstalled) return null;

  const handleInstallClick = async () => {
    if (canPromptDirectly) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setIsVisible(false);
        return;
      }
    }
    // If no direct prompt or guide needed, open install modal
    openModal('install');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {}
  };

  return (
    <div className="install-floating-banner" id="pwa-install-banner">
      <div className="install-banner-inner">
        <div className="install-banner-icon">
          <Sparkles size={16} className="text-cyan" />
        </div>
        <div className="install-banner-text">
          <span className="install-banner-title">Install Ambient as App</span>
          <span className="install-banner-desc">No browser bars, instant launch from your desktop or home screen</span>
        </div>
        <div className="install-banner-actions">
          <button
            className="install-banner-btn"
            id="install-banner-action-btn"
            onClick={handleInstallClick}
          >
            <Download size={14} />
            Install
          </button>
          <button
            className="install-banner-close"
            id="install-banner-dismiss-btn"
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
