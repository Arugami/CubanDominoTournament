/**
 * Sound Manager - Handles all game audio using Web Audio API
 * Generates procedural sounds for authentic Cuban domino experience
 */

class SoundManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isEnabled: boolean = true

  constructor() {
    // Initialize on first user interaction to comply with browser autoplay policies
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = 0.3 // Master volume
      this.masterGain.connect(this.audioContext.destination)
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      this.isEnabled = false
    }
  }

  private ensureContext() {
    if (!this.audioContext || !this.masterGain) {
      this.initialize()
    }

    // Resume context if it was suspended (browser autoplay policy)
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  /**
   * Play tile pickup sound - light tap with subtle wood resonance
   */
  playTilePickup() {
    if (!this.isEnabled) return
    this.ensureContext()
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime

    // Main tap sound - short click
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  /**
   * Play tile placement sound - satisfying slam with wooden table resonance
   */
  playTileSlam() {
    if (!this.isEnabled) return
    this.ensureContext()
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime

    // Impact sound - deep thud
    const osc1 = this.audioContext.createOscillator()
    const gain1 = this.audioContext.createGain()

    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(120, now)
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.15)

    gain1.gain.setValueAtTime(0.6, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc1.connect(gain1)
    gain1.connect(this.masterGain)

    // Wood resonance - higher harmonic
    const osc2 = this.audioContext.createOscillator()
    const gain2 = this.audioContext.createGain()

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(400, now)
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.2)

    gain2.gain.setValueAtTime(0.3, now)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc2.connect(gain2)
    gain2.connect(this.masterGain)

    // Add slight noise for texture
    const noise = this.audioContext.createBufferSource()
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.1
    }
    noise.buffer = noiseBuffer

    const noiseGain = this.audioContext.createGain()
    noiseGain.gain.setValueAtTime(0.2, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

    noise.connect(noiseGain)
    noiseGain.connect(this.masterGain)

    // Start all sounds
    osc1.start(now)
    osc1.stop(now + 0.15)
    osc2.start(now + 0.005)
    osc2.stop(now + 0.2)
    noise.start(now)
  }

  /**
   * Play invalid move sound - gentle error tone
   */
  playInvalidMove() {
    if (!this.isEnabled) return
    this.ensureContext()
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  /**
   * Play pass turn sound - soft confirmation
   */
  playPassTurn() {
    if (!this.isEnabled) return
    this.ensureContext()
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime

    // Two-tone chime
    const osc1 = this.audioContext.createOscillator()
    const gain1 = this.audioContext.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(440, now)

    gain1.gain.setValueAtTime(0.2, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc1.connect(gain1)
    gain1.connect(this.masterGain)

    const osc2 = this.audioContext.createOscillator()
    const gain2 = this.audioContext.createGain()

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(330, now + 0.1)

    gain2.gain.setValueAtTime(0.2, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    osc2.connect(gain2)
    gain2.connect(this.masterGain)

    osc1.start(now)
    osc1.stop(now + 0.2)
    osc2.start(now + 0.1)
    osc2.stop(now + 0.3)
  }

  /**
   * Play victory fanfare - triumphant celebration
   */
  playVictory() {
    if (!this.isEnabled) return
    this.ensureContext()
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime

    // Victory chord progression: C major -> G major -> C major (triumphant)
    const notes = [
      { freq: 523.25, start: 0, duration: 0.3 },    // C5
      { freq: 659.25, start: 0, duration: 0.3 },    // E5
      { freq: 783.99, start: 0, duration: 0.3 },    // G5
      { freq: 587.33, start: 0.35, duration: 0.3 }, // D5
      { freq: 783.99, start: 0.35, duration: 0.3 }, // G5
      { freq: 987.77, start: 0.35, duration: 0.3 }, // B5
      { freq: 523.25, start: 0.7, duration: 0.5 },  // C5
      { freq: 659.25, start: 0.7, duration: 0.5 },  // E5
      { freq: 1046.5, start: 0.7, duration: 0.5 },  // C6
    ]

    notes.forEach(note => {
      const osc = this.audioContext!.createOscillator()
      const gain = this.audioContext!.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(note.freq, now + note.start)

      gain.gain.setValueAtTime(0.15, now + note.start)
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration)

      osc.connect(gain)
      gain.connect(this.masterGain!)

      osc.start(now + note.start)
      osc.stop(now + note.start + note.duration)
    })
  }

  /**
   * Play tranque sound - dramatic blocked game effect
   */
  playTranque() {
    if (!this.isEnabled) return
    this.ensureContext()
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime

    // Dramatic descending tone
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.6)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.linearRampToValueAtTime(0.4, now + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.6)
  }

  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager()
