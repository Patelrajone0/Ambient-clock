export type ThemeId =
  // Free Animated Themes
  | 'starfield'
  | 'rain'
  | 'synthwave'
  | 'matrix'
  | 'light'
  | 'aurora'
  // Premium Animated Themes
  | 'premium-sakura'
  | 'premium-sunset'
  | 'premium-mist'
  | 'premium-nebula'
  | 'premium-bamboo'
  | 'premium-lavender'
  | 'premium-cozy-fire'
  | 'premium-starlight-cloud'
  | 'premium-ocean-breeze'
  // Solid Themes
  | 'solid-black'
  | 'solid-midnight'
  | 'solid-charcoal'
  | 'solid-sage'
  | 'solid-plum'
  | 'solid-cream'
  | 'solid-ruby'
  | 'solid-ocean'
  | 'solid-custom';

export type FontId =
  | 'Cinzel'
  | 'Playfair Display'
  | 'Cormorant Garamond'
  | 'Bodoni Moda'
  | 'Prata'
  | 'Abril Fatface'
  | 'Marcellus'
  | 'Italiana'
  | 'DM Serif Display'
  | 'Fraunces'
  | 'Baskervville'
  | 'Philosopher'
  | 'Tenor Sans';

export type SoundType = 'off' | 'rain' | 'ocean' | 'pink';

export type ScreensaverSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

export type ScreensaverColorMode =
  | 'dim-white'
  | 'bright-white'
  | 'neon-cyan'
  | 'emerald'
  | 'hot-pink'
  | 'amber'
  | 'sunset'
  | 'theme-accent'
  | 'custom';

export interface AmbientState {
  theme: ThemeId;
  customSolidColor: string;
  clockFont: FontId;
  is24Hour: boolean;
  showSeconds: boolean;
  isNightstand: boolean;
  showQuote: boolean;
  showWeather: boolean;
  weatherCity: string;
  weatherUnit: 'C' | 'F';
  showPomodoro: boolean;
  pomodoroDurationSec: number;
  showCountdown: boolean;
  countdownDurationSec: number;
  showSoundscape: boolean;
  activeSound: SoundType;
  soundVolume: number;
  showWorldClock: boolean;
  worldCities: string[];
  screensaverTimeout: number; // 0 = off, or in minutes (e.g. 0.5, 2, 5, 10)
  screensaverShowDate: boolean;
  screensaverShowAmPm: boolean;
  screensaverFontSize: ScreensaverSize;
  screensaverColorMode: ScreensaverColorMode;
  screensaverCustomColor: string;
  isPremium: boolean;
  subscriptionPlan: '3m' | '6m' | '1y' | null;
}

export interface Quote {
  quote: string;
  author: string;
}

export interface WeatherData {
  temperature: number | null;
  weatherCode: number | null;
  cityName: string;
  icon: string;
  description: string;
  loading: boolean;
  error: boolean;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  previewBg: string;
  isPremium?: boolean;
  isSolid?: boolean;
}

export interface FontOption {
  id: FontId;
  name: string;
  specimen: string;
  fontFamily: string;
  isPremium?: boolean;
}
