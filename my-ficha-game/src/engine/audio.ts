/**
 * SoundManager - Procedural Audio Engine for MyFicha
 * Uses Web Audio API to generate sounds without external assets.
 */

class SoundManager {
    private context: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        // Initialize on first user interaction to comply with browser autoplay policies
        if (typeof window !== 'undefined') {
            window.addEventListener('click', () => this.init(), { once: true });
            window.addEventListener('keydown', () => this.init(), { once: true });
        }
    }

    private init() {
        if (!this.context) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.context = new AudioContextClass();
            }
        } else if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Play a short, crisp "tick" sound for UI interactions/selection
     */
    public playClick() {
        if (this.isMuted || !this.context) return;
        this.init(); // Ensure context is ready

        const t = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        // High pitched short blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

        // Envelope
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.start(t);
        osc.stop(t + 0.05);
    }

    /**
     * Play a heavy "thud" with noise for tile placement
     */
    public playSlam() {
        if (this.isMuted || !this.context) return;
        this.init();

        const t = this.context.currentTime;

        // 1. The "Thud" (Low frequency impact)
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.start(t);
        osc.stop(t + 0.15);

        // 2. The "Clack" (High frequency noise burst)
        const bufferSize = this.context.sampleRate * 0.1; // 0.1 seconds
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.context.createGain();

        // Filter the noise to sound more like plastic/bone
        const filter = this.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.context.destination);

        noiseGain.gain.setValueAtTime(0.4, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

        noise.start(t);
    }

    /**
     * Play a hollow "woodblock" sound for passing
     */
    public playPass() {
        if (this.isMuted || !this.context) return;
        this.init();

        const t = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        // Woodblock-ish sound (sine wave with quick decay)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.start(t);
        osc.stop(t + 0.1);
    }

    /**
     * Play a victory fanfare (Major triad arpeggio)
     */
    public playVictory() {
        if (this.isMuted || !this.context) return;
        this.init();

        const t = this.context.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major (C5, E5, G5, C6)

        notes.forEach((freq, i) => {
            const osc = this.context!.createOscillator();
            const gain = this.context!.createGain();

            osc.connect(gain);
            gain.connect(this.context!.destination);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = t + (i * 0.1);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }
}

export const soundManager = new SoundManager();
