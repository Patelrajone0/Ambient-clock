import React from 'react';
import { AmbientProvider } from './context/AmbientContext';
import { CanvasBackground } from './components/Canvas/CanvasBackground';
import { HeroClock } from './components/Clock/HeroClock';
import { WidgetsBar } from './components/Widgets/WidgetsBar';
import { CornerControls } from './components/Controls/CornerControls';
import { ScreensaverOverlay } from './components/Screensaver/ScreensaverOverlay';
import { SettingsModal } from './components/Modals/SettingsModal';
import { PremiumModal } from './components/Modals/PremiumModal';
import { CountdownEditModal } from './components/Modals/CountdownEditModal';
import { InstallModal } from './components/Modals/InstallModal';

const AmbientApp: React.FC = () => {
  return (
    <>
      {/* Background Animated Themes Canvas & Scanline */}
      <CanvasBackground />

      {/* Main Viewport Overlay */}
      <div id="app-container">
        {/* Centered Digital Clock & Date Display */}
        <HeroClock />

        {/* Widgets Bar */}
        <WidgetsBar />
      </div>

      {/* Floating Corner Controls */}
      <CornerControls />

      {/* Pure Black OLED Screensaver Overlay */}
      <ScreensaverOverlay />

      {/* Modals */}
      <SettingsModal />
      <PremiumModal />
      <CountdownEditModal />
      <InstallModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AmbientProvider>
      <AmbientApp />
    </AmbientProvider>
  );
};

export default App;
