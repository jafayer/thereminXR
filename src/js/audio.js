/**
 * Left hand distance from amplitude thing -> amplitude value
 * Distance from right hand -> pitch
 */

 export class ThereminAudio {
    constructor(audioContext, maxFrequency = 1046.50) {
      this.audioContext = audioContext;
      this.oscillator = audioContext.createOscillator();
      this.maxFrequency = maxFrequency;
  
      this.gainNode = audioContext.createGain();
  
      this.oscillator.type = "sine";
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(audioContext.destination);
  
      this.playing = false;
    }
  
    isPlaying() {
      return this.playing;
    }
  
    toggle() {
      if (this.isPlaying()) {
        this.oscillator.stop();
      } else {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = "sine";
        this.oscillator.connect(this.gainNode);
        this.oscillator.start();
      }
  
      this.playing = !this.playing;
    }
  
    setFrequency = (frequency) => {
      if (frequency === 0) {
        this.oscillator.frequency.value = 0;
      } else {

        const c2LowestNote = 130.81;
        const c6HighestNote = 1046.50;

        const scaleforC2toC6 = (frequency * (c6HighestNote - c2LowestNote)) + c2LowestNote;
        this.oscillator.frequency.exponentialRampToValueAtTime(
          scaleforC2toC6,
          this.audioContext.currentTime + 0.1
        );
      }
    };
  
    setGain = (gain) => {
      if (gain === 0) {
        this.gainNode.gain.value = 0;
      } else {
        this.gainNode.gain.exponentialRampToValueAtTime(
          gain,
          this.audioContext.currentTime + 0.1
        );
      }
    };
  
    setValues = (f, g) => {
      this.setFrequency(f);
      this.setGain(g);
    };
  
    setMaxFrequency = (f) => {
      this.maxFrequency = f;
    };
  
    getValues = () => {
      return {
        frequency: this.oscillator.frequency.value,
        gain: this.gainNode.gain.value,
      };
    };

    getFrequency = () => {
      return this.oscillator.frequency.value;
    }

    getGain = () => {
      return this.gainNode.gain.value;
    }
  
    getMaxFrequency = () => {
      return this.maxFrequency;
    };
  }