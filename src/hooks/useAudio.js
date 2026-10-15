// src/hooks/useAudio.js
// Audio Engine supporting static asset lookup, ElevenLabs dynamic fallback, and Web Audio SFX
// Adheres strictly to audio_generation_pipeline (5).md specifications.

import { useRef, useCallback, useEffect } from 'react';
import { audioMap } from '../utils/audioMap.js';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from '../config/audio.config.js';

const blobCache = new Map();

export function useAudio(audioEnabled = true) {
  const currentAudioRef = useRef(null);
  const playingRef      = useRef(false);
  const narrateIdRef    = useRef(0);

  const stopAll = useCallback(() => {
    narrateIdRef.current++;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    playingRef.current = false;
  }, []);

  useEffect(() => {
    if (!audioEnabled) {
      narrateIdRef.current++;
      stopAll();
    }
  }, [audioEnabled, stopAll]);

  /**
   * getAudioUrl(text, style)
   * Priority: static audioMap (.mp3) -> memory cache -> ElevenLabs API -> null (silent fallback)
   */
  const getAudioUrl = useCallback(async (text, style = 'statement') => {
    if (!text) return null;

    // 1. Static audioMap match
    if (audioMap && audioMap[text]) return audioMap[text];

    // 2. In-memory blob cache
    const cacheKey = `${text}__${style}`;
    if (blobCache.has(cacheKey)) return blobCache.get(cacheKey);

    // 3. Dynamic generation via ElevenLabs API
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) return null; // No browser fallback, silent failure as per pipeline spec

    try {
      const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!res.ok) throw new Error(`ElevenLabs API status ${res.status}`);

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      blobCache.set(cacheKey, url);
      return url;
    } catch (err) {
      console.warn('[Audio Engine] Dynamic narration skipped:', err.message);
      return null;
    }
  }, []);

  const playSegment = useCallback(async (text, style, expectedId) => {
    if (!audioEnabled || narrateIdRef.current !== expectedId) return;
    const url = await getAudioUrl(text, style);
    if (!url || narrateIdRef.current !== expectedId) return;

    return new Promise((resolve) => {
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { currentAudioRef.current = null; resolve(); };
      audio.onerror = () => { currentAudioRef.current = null; resolve(); };
      audio.play().catch(() => resolve());
    });
  }, [audioEnabled, getAudioUrl]);

  /**
   * narrate(segments)
   * Sequentially plays narration segments with lookahead preloading of upcoming segments
   * to eliminate latency gaps between sentences.
   */
  const narrate = useCallback(async (segments) => {
    if (!segments || !segments.length || !audioEnabled) return;
    stopAll();
    const currentId = ++narrateIdRef.current;
    playingRef.current = true;

    for (let i = 0; i < segments.length; i++) {
      if (narrateIdRef.current !== currentId) break;
      const seg = segments[i];

      // Eagerly preload next segment while current segment plays
      if (i + 1 < segments.length) {
        getAudioUrl(segments[i + 1].text, segments[i + 1].style).catch(() => {});
      }

      await playSegment(seg.text, seg.style, currentId);
      if (narrateIdRef.current !== currentId) break;
      await new Promise(r => setTimeout(r, 120));
    }

    if (narrateIdRef.current === currentId) {
      playingRef.current = false;
    }
  }, [stopAll, playSegment, getAudioUrl, audioEnabled]);

  // Tone-based sound synthesizer for instant zero-latency feedback
  const playTone = useCallback((frequencies, durations) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let offset = 0;
      frequencies.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.22, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.2);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.2);
        offset += (durations[i] || 150) / 1000;
      });
    } catch { /* ignore WebAudio errors */ }
  }, [audioEnabled]);

  const sounds = {
    correct: () => playTone([880, 1100, 1320], [100, 100, 180]),
    wrong:   () => playTone([220, 180], [180, 200]),
    badge:   () => playTone([523, 659, 784, 1047], [90, 90, 90, 240]),
    streak:  () => playTone([440, 880, 1100], [70, 70, 180]),
    levelUp: () => playTone([523, 659, 784, 1047, 1319], [60, 60, 60, 60, 250]),
    click:   () => playTone([440], [50]),
    defeat:  () => playTone([300, 240, 180], [120, 120, 250]),
  };

  return {
    narrate,
    stopAll,
    sounds,
    getAudioUrl,
    say:       (text) => ({ text, style: 'statement' }),
    ask:       (text) => ({ text, style: 'question' }),
    cheer:     (text) => ({ text, style: 'celebration' }),
    emphasize: (text) => ({ text, style: 'emphasis' }),
    think:     (text) => ({ text, style: 'thinking' }),
    celebrate: (text) => ({ text, style: 'celebration' }),
    instruct:  (text) => ({ text, style: 'instruction' }),
    encourage: (text) => ({ text, style: 'encouragement' }),
  };
}

export default useAudio;
