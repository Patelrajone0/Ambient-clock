import { AmbientState, FontOption, Quote, ThemeOption } from '../types';

export const DEFAULT_STATE: AmbientState = {
  theme: 'solid-black',
  customSolidColor: '#0f172a',
  clockFont: 'Cinzel',
  is24Hour: false,
  showSeconds: true,
  isNightstand: false,
  showQuote: false,
  showWeather: false,
  weatherCity: 'San Francisco',
  weatherUnit: 'F',
  showPomodoro: false,
  pomodoroDurationSec: 25 * 60,
  showCountdown: false,
  countdownDurationSec: 15 * 60,
  showSoundscape: false,
  activeSound: 'off',
  soundVolume: 0.5,
  showWorldClock: false,
  worldCities: ['America/New_York', 'Europe/London', 'Asia/Tokyo'],
  screensaverTimeout: 0,
  screensaverShowDate: false,
  screensaverShowAmPm: true,
  screensaverFontSize: 'medium',
  screensaverColorMode: 'dim-white',
  screensaverCustomColor: '#38bdf8',
  isPremium: false,
  subscriptionPlan: null,
};

export const QUOTES: Quote[] = [
  { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { quote: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { quote: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { quote: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { quote: "Deep focus is the doorway to creative genius.", author: "Cal Newport" },
  { quote: "Time is a created thing. To say 'I don't have time' is to say 'I don't want to'.", author: "Lao Tzu" },
  { quote: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
  { quote: "Be present in all things and thankful for all things.", author: "Maya Angelou" },
  { quote: "Silence is a source of great strength.", author: "Lao Tzu" },
  { quote: "Flow with whatever may happen, and let your mind be free.", author: "Zhuangzi" },
];

export const FREE_THEMES: ThemeOption[] = [
  { id: 'starfield', name: 'Starfield', previewBg: 'linear-gradient(135deg, #030712, #1e1b4b)' },
  { id: 'rain', name: 'Falling Rain', previewBg: 'linear-gradient(135deg, #0b1320, #1e293b)' },
  { id: 'synthwave', name: 'Synthwave Grid', previewBg: 'linear-gradient(135deg, #130024, #ff007f)' },
  { id: 'matrix', name: 'Matrix Scanlines', previewBg: 'linear-gradient(135deg, #020d06, #00ff66)' },
  { id: 'light', name: 'Minimal Light', previewBg: 'linear-gradient(135deg, #f7f5f0, #e07a5f)' },
  { id: 'aurora', name: 'Aurora Borealis', previewBg: 'linear-gradient(135deg, #060919, #10b981)' },
];

export const PREMIUM_THEMES: ThemeOption[] = [
  { id: 'premium-sakura', name: 'Sakura Drift', previewBg: 'linear-gradient(135deg, #1a1126, #f472b6)', isPremium: true },
  { id: 'premium-sunset', name: 'Sunset Glow', previewBg: 'linear-gradient(135deg, #1c0d18, #fbbf24)', isPremium: true },
  { id: 'premium-mist', name: 'Zen Forest Mist', previewBg: 'linear-gradient(135deg, #071510, #2dd4bf)', isPremium: true },
  { id: 'premium-nebula', name: 'Nebula Dust', previewBg: 'linear-gradient(135deg, #0a091c, #c084fc)', isPremium: true },
  { id: 'premium-bamboo', name: 'Bamboo Grove 🎋', previewBg: 'linear-gradient(135deg, #06180f, #10b981)', isPremium: true },
  { id: 'premium-lavender', name: 'Lavender Dream 🪻', previewBg: 'linear-gradient(135deg, #130f24, #a855f7)', isPremium: true },
  { id: 'premium-cozy-fire', name: 'Cozy Ember 🔥', previewBg: 'linear-gradient(135deg, #1f0b08, #f97316)', isPremium: true },
  { id: 'premium-starlight-cloud', name: 'Moonlight Cloud ☁️', previewBg: 'linear-gradient(135deg, #070e20, #38bdf8)', isPremium: true },
  { id: 'premium-ocean-breeze', name: 'Ocean Breeze 🌊', previewBg: 'linear-gradient(135deg, #041a24, #06b6d4)', isPremium: true },
];

export const SOLID_THEMES: ThemeOption[] = [
  { id: 'solid-black', name: 'Pitch Black', previewBg: '#000000', isSolid: true },
  { id: 'solid-midnight', name: 'Midnight Blue', previewBg: '#0a192f', isSolid: true },
  { id: 'solid-charcoal', name: 'Warm Charcoal', previewBg: '#18181b', isSolid: true },
  { id: 'solid-sage', name: 'Forest Sage', previewBg: '#08291b', isSolid: true },
  { id: 'solid-plum', name: 'Royal Plum', previewBg: '#2a0a38', isSolid: true },
  { id: 'solid-cream', name: 'Soft Cream', previewBg: '#f5f4ef', isSolid: true },
];

export const ALL_FONTS: FontOption[] = [
  // Free
  { id: 'Cinzel', name: 'Cinzel', specimen: '12:45', fontFamily: "'Cinzel', serif" },
  { id: 'Playfair Display', name: 'Playfair', specimen: '12:45', fontFamily: "'Playfair Display', serif" },
  { id: 'Cormorant Garamond', name: 'Cormorant', specimen: '12:45', fontFamily: "'Cormorant Garamond', serif" },
  { id: 'Bodoni Moda', name: 'Bodoni', specimen: '12:45', fontFamily: "'Bodoni Moda', serif" },
  // Premium
  { id: 'Prata', name: 'Prata ✨', specimen: '12:45', fontFamily: "'Prata', serif", isPremium: true },
  { id: 'Abril Fatface', name: 'Abril ✨', specimen: '12:45', fontFamily: "'Abril Fatface', serif", isPremium: true },
  { id: 'Marcellus', name: 'Marcellus ✨', specimen: '12:45', fontFamily: "'Marcellus', serif", isPremium: true },
  { id: 'Italiana', name: 'Italiana ✨', specimen: '12:45', fontFamily: "'Italiana', serif", isPremium: true },
  { id: 'DM Serif Display', name: 'DM Serif ✨', specimen: '12:45', fontFamily: "'DM Serif Display', serif", isPremium: true },
  { id: 'Fraunces', name: 'Fraunces ✨', specimen: '12:45', fontFamily: "'Fraunces', serif", isPremium: true },
  { id: 'Baskervville', name: 'Baskerville ✨', specimen: '12:45', fontFamily: "'Baskervville', serif", isPremium: true },
  { id: 'Philosopher', name: 'Philosopher ✨', specimen: '12:45', fontFamily: "'Philosopher', sans-serif", isPremium: true },
  { id: 'Tenor Sans', name: 'Tenor Sans ✨', specimen: '12:45', fontFamily: "'Tenor Sans', sans-serif", isPremium: true },
];

export const WORLD_CITIES_OPTIONS = [
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'America/Los_Angeles', label: 'San Francisco (PST)' },
];

export const COUNTDOWN_PRESETS = [
  { label: '5 Min', seconds: 300 },
  { label: '15 Min', seconds: 900 },
  { label: '30 Min', seconds: 1800 },
  { label: '45 Min', seconds: 2700 },
  { label: '1 Hour', seconds: 3600 },
  { label: '2 Hours', seconds: 7200 },
  { label: '4 Hours', seconds: 14400 },
];
