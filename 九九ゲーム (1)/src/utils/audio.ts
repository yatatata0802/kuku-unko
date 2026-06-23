// Sound and speech utilities for Kuku/Multiplication Game
// Safe wrapper around Web Audio API and Web Speech API

let audioCtx: AudioContext | null = null;
let isMuted = false;
let speechEnabled = true;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const toggleMute = (): boolean => {
  isMuted = !isMuted;
  localStorage.setItem('kuku_muted', isMuted ? 'true' : 'false');
  return isMuted;
};

export const isGameMuted = (): boolean => {
  return isMuted;
};

export const initializeMuteState = () => {
  try {
    const saved = localStorage.getItem('kuku_muted');
    isMuted = saved === 'true';
    const speechSaved = localStorage.getItem('kuku_speech_enabled');
    speechEnabled = speechSaved !== 'false';
  } catch (e) {
    console.error(e);
  }
};

export const toggleSpeech = (): boolean => {
  speechEnabled = !speechEnabled;
  localStorage.setItem('kuku_speech_enabled', speechEnabled ? 'true' : 'false');
  return speechEnabled;
};

export const isSpeechEnabled = (): boolean => {
  return speechEnabled;
};

// Play short pop/puni sound for UI interactions
export const playPopSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweep for pop sound
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

// Play sparkling correct sound
export const playCorrectSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gainNode.gain.setValueAtTime(0.12, start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, start + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    };

    // Arpeggio for correct chime
    playTone(523.25, now, 0.1); // C5
    playTone(659.25, now + 0.08, 0.1); // E5
    playTone(783.99, now + 0.16, 0.12); // G5
    playTone(1046.50, now + 0.24, 0.25); // C6
  } catch (e) {
    console.warn(e);
  }
};

// Play funny fart sound for mistake (child-friendly poop style!)
export const playWrongSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Sawtooth makes it buzzy and flatulent!
    osc.type = 'sawtooth';
    
    const now = ctx.currentTime;
    
    // Slide pitch way down
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(45, now + 0.4);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    // Dynamic bandpass filter to make it sound "muffled/funny/squishy"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(120, now + 0.4);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.5);
  } catch (e) {
    console.warn(e);
  }
};

// Play victory triumph tune
export const playVictorySound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number, type: 'sine' | 'triangle' = 'triangle') => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      gainNode.gain.setValueAtTime(0.12, start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, start + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    };

    // Celebratory victory fanfare
    playTone(523.25, now, 0.1); // C5
    playTone(523.25, now + 0.12, 0.1); // C5
    playTone(523.25, now + 0.24, 0.1); // C5
    playTone(523.25, now + 0.36, 0.2); // C5
    playTone(415.30, now + 0.58, 0.2); // Ab4
    playTone(466.16, now + 0.80, 0.2); // Bb4
    playTone(523.25, now + 1.02, 0.5, 'sine'); // C5 long sparkling note
  } catch (e) {
    console.warn(e);
  }
};

// Text-to-Speech specifically tuned for Japanese Chants
export const speakChant = (text: string) => {
  if (isMuted || !speechEnabled) return;
  try {
    if (!window.speechSynthesis) return;
    
    // Stop any running speech first
    window.speechSynthesis.cancel();

    // Standardize text representation slightly for better chant flow
    // Replace "が" on read aloud with a slightly paused reading
    let speechText = text
      .replace(/x/g, 'かける')
      .replace(/・/g, '')
      .replace(/が/g, '、が、');

    // Make sure 4, 7, 9 are read as Kuku traditional pronunciations (し, しち, く) in kuku context
    speechText = speechText
      .replace(/4のだん/g, 'しのだん')
      .replace(/7のだん/g, 'しちのだん')
      .replace(/9のだん/g, 'くのだん')
      .replace(/4かける/g, 'し かける')
      .replace(/7かける/g, 'しち かける')
      .replace(/9かける/g, 'く かける')
      .replace(/かける4/g, 'かける し')
      .replace(/かける7/g, 'かける しち')
      .replace(/かける9/g, 'かける く')
      .replace(/こたえは、4/g, 'こたえは、し')
      .replace(/こたえは、7/g, 'こたえは、しち')
      .replace(/こたえは、9/g, 'こたえは、く');

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'ja-JP';
    utterance.rate = 1.05; // Slightly faster to sound natural/cute
    utterance.pitch = 1.25; // High pitch like a kid/mascot

    // Force select a Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech failed', e);
  }
};
