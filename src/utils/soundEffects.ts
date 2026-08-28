/**
 * Web Audio API Synthesizer for Smart Board English Games
 * Generates realistic applause, crowd cheers, cartoon crying / wah-wah sounds, 
 * card flip sounds, and celebratory fanfares without external audio file dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy AudioContext initialization for browser autoplay policy
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Card flip click / pop sound
   */
  public playCardFlip() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Alkış ve Coşku Sesi (Realistic Crowd Applause & Triumphant Cheers)
   * Triggered when matching pairs correctly ("Soruyu bilince alkış olsun")
   */
  public playApplause() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.8; // seconds

    // 1. Synthesize Clapping Bursts using filtered white noise with randomized envelopes
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // White noise
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to sound like natural acoustic hand claps
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(1.8, now);

    // Dynamic clapping amplitude envelope with micro-pulses
    const clapGain = ctx.createGain();
    clapGain.gain.setValueAtTime(0.01, now);
    clapGain.gain.linearRampToValueAtTime(0.4, now + 0.15);

    // Micro tremolo/clap modulation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(14, now); // ~14 handclaps/sec density
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.25, now);
    lfo.connect(lfoGain.gain);

    clapGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(clapGain);
    clapGain.connect(ctx.destination);

    lfo.start(now);
    noise.start(now);
    lfo.stop(now + duration);
    noise.stop(now + duration);

    // 2. Play Victorious "Ta-da!" Chord in parallel
    const chordFrequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chordFrequencies.forEach((freq, idx) => {
      const chordOsc = ctx.createOscillator();
      const chordGain = ctx.createGain();

      chordOsc.type = 'triangle';
      const startTime = now + idx * 0.06;
      chordOsc.frequency.setValueAtTime(freq, startTime);

      chordGain.gain.setValueAtTime(0, startTime);
      chordGain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      chordGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

      chordOsc.connect(chordGain);
      chordGain.connect(ctx.destination);

      chordOsc.start(startTime);
      chordOsc.stop(startTime + 0.9);
    });
  }

  /**
   * Ağlama / Hata Sesi (Cartoon Crying / Wah-Wah Sad Sound)
   * Triggered when cards do not match ("Bilemeyince ağlama sesi olsun")
   */
  public playCrying() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Phase 1: Cartoon "Waaaaah! Waaaaah!" Crying with pitch bends & vibrato
    const cryPhrases = [
      { start: 0.0, baseFreq: 460, bendFreq: 330, length: 0.45 },
      { start: 0.48, baseFreq: 520, bendFreq: 290, length: 0.6 },
    ];

    cryPhrases.forEach((phrase) => {
      const osc = ctx.createOscillator();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      const gain = ctx.createGain();

      // Sound texture - saw/triangle for vocal crying mimicry
      osc.type = 'sawtooth';

      const phraseStart = now + phrase.start;
      osc.frequency.setValueAtTime(phrase.baseFreq, phraseStart);
      // Pitch drop crying slide
      osc.frequency.exponentialRampToValueAtTime(phrase.bendFreq, phraseStart + phrase.length);

      // Fast crying wobble (vibrato)
      vibrato.frequency.setValueAtTime(9.5, phraseStart);
      vibratoGain.gain.setValueAtTime(25, phraseStart);
      vibrato.connect(osc.frequency);

      // Low pass filter to make it sound muffled/nasal like real crying
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, phraseStart);

      gain.gain.setValueAtTime(0.01, phraseStart);
      gain.gain.linearRampToValueAtTime(0.28, phraseStart + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, phraseStart + phrase.length);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      vibrato.start(phraseStart);
      osc.start(phraseStart);
      vibrato.stop(phraseStart + phrase.length);
      osc.stop(phraseStart + phrase.length);
    });

    // Phase 2: Sad Descending Trombone Wah-wah-wah accompaniment
    const sadNotes = [
      { freq: 311.13, time: 0.05, duration: 0.22 }, // Eb4
      { freq: 293.66, time: 0.32, duration: 0.22 }, // D4
      { freq: 277.18, time: 0.60, duration: 0.25 }, // C#4
      { freq: 246.94, time: 0.90, duration: 0.55 }, // B3 slide down
    ];

    sadNotes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const noteStart = now + note.time;
      osc.frequency.setValueAtTime(note.freq, noteStart);
      if (note.time > 0.8) {
        osc.frequency.exponentialRampToValueAtTime(180, noteStart + note.duration);
      }

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + note.duration);
    });
  }

  /**
   * Combo / Streak Sparkling Chime
   */
  public playComboStreak(streakCount: number) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const baseNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    const count = Math.min(streakCount + 2, baseNotes.length);
    const now = ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const time = now + i * 0.08;
      osc.frequency.setValueAtTime(baseNotes[i], time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.4);
    }
  }

  /**
   * Grand Victory Fanfare on Game Complete
   */
  public playGrandVictory() {
    this.playApplause();
    setTimeout(() => {
      this.playApplause();
    }, 1200);
  }
}

export const sounds = new SoundEngine();
