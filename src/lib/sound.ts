/**
 * EFFETS SONORES — Web Audio API native, aucun fichier audio.
 * --------------------------------------------------------
 * Tous les sons sont synthétisés à la volée (oscillateurs + bruit filtré),
 * volontairement courts et doux. Le contexte audio n'est créé qu'au premier son,
 * déclenché par un geste du joueur, ce qui respecte les règles d'autoplay des navigateurs.
 *
 * Préférence ON/OFF sauvegardée dans localStorage (clé « kaziboss.sound »).
 */
import { loadJSON, saveJSON } from './storage';

const STORAGE_KEY = 'sound';
const MASTER_VOLUME = 0.22;

let enabled = loadJSON<boolean>(STORAGE_KEY, true);
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
const listeners = new Set<(on: boolean) => void>();

export function isSoundOn(): boolean {
  return enabled;
}

export function setSoundOn(on: boolean): void {
  enabled = on;
  saveJSON(STORAGE_KEY, on);
  listeners.forEach((fn) => fn(on));
}

/** Pour synchroniser plusieurs composants (ex. bouton de la barre du haut). */
export function onSoundChange(fn: (on: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function audio(): AudioContext | null {
  if (!enabled || typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = MASTER_VOLUME;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOptions {
  freq: number;
  /** fréquence d'arrivée (glissando) */
  to?: number;
  start?: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
}

/** Une note avec enveloppe douce (attaque rapide, décroissance exponentielle). */
function tone(ac: AudioContext, { freq, to, start = 0, duration, type = 'sine', volume = 1, attack = 0.01 }: ToneOptions) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(master!);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function noise(ac: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.4), ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function safely(fn: (ac: AudioContext) => void) {
  const ac = audio();
  if (!ac || !master) return;
  try {
    fn(ac);
  } catch {
    /* un son raté ne doit jamais casser le jeu */
  }
}

/** Léger « whoosh » + clic quand une carte est glissée. */
export function playSwipe(): void {
  safely((ac) => {
    const t0 = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noise(ac);
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(600, t0);
    filter.frequency.exponentialRampToValueAtTime(2600, t0 + 0.22);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);
    src.connect(filter).connect(gain).connect(master!);
    src.start(t0);
    src.stop(t0 + 0.3);
    tone(ac, { freq: 1800, to: 1200, duration: 0.04, type: 'triangle', volume: 0.25, attack: 0.003 });
  });
}

/** Tintement positif : gain de KaziCoins, bonne réponse. */
export function playChime(): void {
  safely((ac) => {
    tone(ac, { freq: 1318.5, duration: 0.35, type: 'sine', volume: 0.45 }); // mi6
    tone(ac, { freq: 1975.5, start: 0.07, duration: 0.45, type: 'sine', volume: 0.35 }); // si6
    tone(ac, { freq: 2637, start: 0.07, duration: 0.25, type: 'triangle', volume: 0.08 });
  });
}

/** Petite fanfare montante : leçon terminée, mois réussi. */
export function playSuccess(): void {
  safely((ac) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(ac, { freq: f, start: i * 0.09, duration: 0.32, type: 'triangle', volume: 0.35 }),
    );
  });
}

/** Alerte grave et douce : une jauge passe sous 20 %. */
export function playAlert(): void {
  safely((ac) => {
    tone(ac, { freq: 220, duration: 0.28, type: 'sine', volume: 0.6, attack: 0.02 });
    tone(ac, { freq: 220, start: 0.32, duration: 0.34, type: 'sine', volume: 0.5, attack: 0.02 });
    tone(ac, { freq: 110, duration: 0.7, type: 'triangle', volume: 0.2, attack: 0.03 });
  });
}

/** Game over : descente grave, sans agressivité. */
export function playGameOver(): void {
  safely((ac) => {
    [392, 329.63, 261.63].forEach((f, i) =>
      tone(ac, { freq: f, start: i * 0.22, duration: 0.42, type: 'sine', volume: 0.5, attack: 0.02 }),
    );
    tone(ac, { freq: 130.81, to: 98, start: 0.6, duration: 0.9, type: 'triangle', volume: 0.3, attack: 0.04 });
  });
}
