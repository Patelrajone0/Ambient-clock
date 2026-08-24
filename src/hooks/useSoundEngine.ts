import { useEffect, useRef } from 'react';
import { SoundType } from '../types';

export function useSoundEngine(activeSound: SoundType, volume: number) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const lfoNodeRef = useRef<OscillatorNode | null>(null);

  const initContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopSound = () => {
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch {}
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    if (lfoNodeRef.current) {
      try { lfoNodeRef.current.stop(); } catch {}
      lfoNodeRef.current.disconnect();
      lfoNodeRef.current = null;
    }
  };

  const createWhiteNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const playSound = (type: SoundType, vol: number) => {
    const ctx = initContext();
    stopSound();

    if (type === 'off') return;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
    gainNodeRef.current = gainNode;

    const noiseBuffer = createWhiteNoiseBuffer(ctx);
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    noiseNodeRef.current = noiseNode;

    if (type === 'rain') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filterNodeRef.current = filter;

      noiseNode.connect(filter);
      filter.connect(gainNode);
    } else if (type === 'ocean') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filterNodeRef.current = filter;

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(300, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      lfoNodeRef.current = lfo;

      noiseNode.connect(filter);
      filter.connect(gainNode);
    } else if (type === 'pink') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filterNodeRef.current = filter;

      noiseNode.connect(filter);
      filter.connect(gainNode);
    }

    gainNode.connect(ctx.destination);
    noiseNode.start();
  };

  // Play Pomodoro finished chime
  const playPomodoroChime = () => {
    try {
      const ctx = initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  // Play Countdown finished chord chime
  const playCountdownChime = () => {
    try {
      const ctx = initContext();
      const now = ctx.currentTime;

      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      playNote(659.25, now, 0.4);       // E5
      playNote(783.99, now + 0.2, 0.4); // G5
      playNote(1046.50, now + 0.4, 0.8);// C6
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  useEffect(() => {
    if (activeSound !== 'off') {
      playSound(activeSound, volume);
    } else {
      stopSound();
    }
    return () => {
      stopSound();
    };
  }, [activeSound]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.3, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  return {
    playPomodoroChime,
    playCountdownChime,
  };
}
