// Lightweight Web Audio API synthesizer for ambient background soundscapes and micro-sound effects.
// 100% self-contained, zero external asset dependencies, zero network requests.

type SoundType = 'rain' | 'whitenoise' | 'cosmic';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private activeType: SoundType | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playAmbient(type: SoundType, volume = 0.3): void {
    try {
      const ctx = this.initContext();
      this.stopAmbient();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(volume, 1)), ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.gainNode = masterGain;

      if (type === 'rain') {
        this.startRain(ctx, masterGain);
      } else if (type === 'whitenoise') {
        this.startWarmNoise(ctx, masterGain);
      } else if (type === 'cosmic') {
        this.startCosmicDrone(ctx, masterGain);
      }

      this.activeType = type;
      this.isPlaying = true;
    } catch {
      // Gracefully handle environments without Web Audio support
      this.isPlaying = false;
    }
  }

  public stopAmbient(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.currentSource) {
      try {
        if ('stop' in this.currentSource && typeof (this.currentSource as AudioScheduledSourceNode).stop === 'function') {
          (this.currentSource as AudioScheduledSourceNode).stop();
        }
        this.currentSource.disconnect();
      } catch {
        /* cleanup */
      }
      this.currentSource = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        /* cleanup */
      }
      this.gainNode = null;
    }
    this.isPlaying = false;
    this.activeType = null;
  }

  public setVolume(volume: number): void {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(volume, 1)), this.ctx.currentTime);
    }
  }

  public playChime(): void {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Two-note crystal chime (E5 -> B5)
      const frequencies = [659.25, 987.77];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch {
      /* Audio not supported or blocked */
    }
  }

  public playTick(): void {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      /* Audio not supported or blocked */
    }
  }

  private startWarmNoise(ctx: AudioContext, destination: AudioNode): void {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate gentle brown/warm noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to warm frequencies (soft lowpass)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    noise.connect(filter);
    filter.connect(destination);

    noise.start();
    this.currentSource = noise;
  }

  private startRain(ctx: AudioContext, destination: AudioNode): void {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate pink noise base
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Rain bandpass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);

    noise.connect(filter);
    filter.connect(destination);

    noise.start();
    this.currentSource = noise;
  }

  private startCosmicDrone(ctx: AudioContext, destination: AudioNode): void {
    // Ethereal chord triad with subtle detune (A2 110Hz, E3 164.8Hz, C#4 277.2Hz)
    const baseFreqs = [110, 164.81, 277.18];
    const groupGain = ctx.createGain();
    groupGain.gain.setValueAtTime(0.4, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);

    baseFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
    });

    filter.connect(groupGain);
    groupGain.connect(destination);
    this.currentSource = groupGain;
  }

  public getStatus(): { isPlaying: boolean; type: SoundType | null } {
    return { isPlaying: this.isPlaying, type: this.activeType };
  }
}

export const synth = new AudioSynthesizer();
