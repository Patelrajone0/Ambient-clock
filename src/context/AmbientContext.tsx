import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AmbientState, FontId, ThemeId } from '../types';
import { DEFAULT_STATE } from '../constants';

export type ModalType = 'settings' | 'premium' | 'countdown' | 'pomodoro' | 'install' | null;

interface AmbientContextType {
  state: AmbientState;
  updateState: (updates: Partial<AmbientState>) => void;
  resetDefaults: () => void;
  setTheme: (theme: ThemeId) => void;
  setFont: (font: FontId) => void;
  setNightstandMode: (enabled: boolean) => void;
  activateSubscription: (plan: '3m' | '6m' | '1y') => void;
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  isScreensaverActive: boolean;
  startScreensaver: () => void;
  exitScreensaver: () => void;
  toggleFullscreen: () => void;
}

const AmbientContext = createContext<AmbientContextType | undefined>(undefined);

const STORAGE_KEY = 'ambient_config';

export const AmbientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AmbientState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
    return DEFAULT_STATE;
  });

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isScreensaverActive, setIsScreensaverActive] = useState<boolean>(false);

  // Synchronize state changes to LocalStorage
  const updateState = useCallback((updates: Partial<AmbientState>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to LocalStorage:', e);
      }
      return next;
    });
  }, []);

  const resetDefaults = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
    } catch (e) {}
  }, []);

  const setTheme = useCallback((theme: ThemeId) => {
    updateState({ theme });
  }, [updateState]);

  const setFont = useCallback((clockFont: FontId) => {
    updateState({ clockFont });
  }, [updateState]);

  const setNightstandMode = useCallback((enabled: boolean) => {
    updateState({ isNightstand: enabled });
  }, [updateState]);

  const activateSubscription = useCallback((plan: '3m' | '6m' | '1y') => {
    updateState({ isPremium: true, subscriptionPlan: plan });
  }, [updateState]);

  const openModal = useCallback((modal: ModalType) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const startScreensaver = useCallback(() => {
    setIsScreensaverActive(true);
  }, []);

  const exitScreensaver = useCallback(() => {
    setIsScreensaverActive(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  // Apply Theme, Font, and Nightstand classes to document
  useEffect(() => {
    document.body.setAttribute('data-theme', state.theme);
    document.documentElement.style.setProperty('--font-clock', `'${state.clockFont}', serif`);

    // Nightstand mode class
    document.body.classList.toggle('nightstand-mode', state.isNightstand);
    document.body.classList.toggle('screensaver-active', isScreensaverActive);

    // Custom solid color luminance handling
    if (state.theme === 'solid-custom') {
      const hexColor = state.customSolidColor || '#0f172a';
      document.body.style.setProperty('--bg-color', hexColor);
      document.body.style.background = hexColor;

      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      if (luminance > 0.5) {
        document.body.style.setProperty('--text-main', '#1e293b');
        document.body.style.setProperty('--text-muted', 'rgba(30, 41, 59, 0.75)');
        document.body.style.setProperty('--text-dim', 'rgba(30, 41, 59, 0.45)');
        document.body.style.setProperty('--accent-color', '#2563eb');
        document.body.style.setProperty('--accent-glow', 'rgba(37, 99, 235, 0.35)');
        document.body.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.85)');
        document.body.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.12)');
      } else {
        document.body.style.setProperty('--text-main', '#f8fafc');
        document.body.style.setProperty('--text-muted', 'rgba(248, 250, 252, 0.75)');
        document.body.style.setProperty('--text-dim', 'rgba(248, 250, 252, 0.35)');
        document.body.style.setProperty('--accent-color', '#818cf8');
        document.body.style.setProperty('--accent-glow', 'rgba(129, 140, 248, 0.4)');
        document.body.style.setProperty('--glass-bg', 'rgba(20, 20, 30, 0.8)');
        document.body.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.15)');
      }
    } else {
      document.body.style.removeProperty('--bg-color');
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('background-color');
      document.body.style.removeProperty('--text-main');
      document.body.style.removeProperty('--text-muted');
      document.body.style.removeProperty('--text-dim');
      document.body.style.removeProperty('--accent-color');
      document.body.style.removeProperty('--accent-glow');
      document.body.style.removeProperty('--glass-bg');
      document.body.style.removeProperty('--glass-border');
    }
  }, [state.theme, state.clockFont, state.isNightstand, state.customSolidColor, isScreensaverActive]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
        return;
      }
      if (e.key === 'Escape') {
        closeModal();
        exitScreensaver();
      } else if (e.key === 's' || e.key === 'S') {
        openModal('settings');
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'z' || e.key === 'Z') {
        startScreensaver();
      } else if (e.key === 'n' || e.key === 'N') {
        setNightstandMode(!state.isNightstand);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, exitScreensaver, openModal, setNightstandMode, state.isNightstand, startScreensaver, toggleFullscreen]);

  // Screensaver Auto-Inactivity Timer
  useEffect(() => {
    if (state.screensaverTimeout <= 0 || isScreensaverActive) return;

    const timeoutMs = state.screensaverTimeout * 60 * 1000;
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        startScreensaver();
      }, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [state.screensaverTimeout, isScreensaverActive, startScreensaver]);

  return (
    <AmbientContext.Provider
      value={{
        state,
        updateState,
        resetDefaults,
        setTheme,
        setFont,
        setNightstandMode,
        activateSubscription,
        activeModal,
        openModal,
        closeModal,
        isScreensaverActive,
        startScreensaver,
        exitScreensaver,
        toggleFullscreen,
      }}
    >
      {children}
    </AmbientContext.Provider>
  );
};

export const useAmbient = () => {
  const context = useContext(AmbientContext);
  if (!context) {
    throw new Error('useAmbient must be used within an AmbientProvider');
  }
  return context;
};
