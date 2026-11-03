// Game sounds synthesized with Web Audio, so there are no files to download. The audio engine is created
// on the first shot, which is always a click, so browsers allow it to play.

type Sound = "targetHit" | "nameHit" | "medkit" | "refill";

const VOLUME = 0.22;
const MUTE_KEY = "sfx-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let muted: boolean | null = null; // read from storage on first use
let played = false; // the mute button appears once something has tried to play

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
}

export function isMuted() {
    if (muted === null) {
        try {
            muted = localStorage.getItem(MUTE_KEY) === "1";
        } catch {
            muted = false;
        }
    }
    return muted;
}

export function setMuted(value: boolean) {
    muted = value;
    try {
        localStorage.setItem(MUTE_KEY, value ? "1" : "0");
    } catch {}
    emit();
}

export function hasPlayed() {
    return played;
}

function audio() {
    if (!ctx) {
        if (typeof AudioContext === "undefined") return null;
        ctx = new AudioContext();
        master = ctx.createGain();
        master.gain.value = VOLUME;
        master.connect(ctx.destination);
        noise = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
}

// A pitched blip that fades out, optionally sliding from one pitch to another.
function tone(c: AudioContext, type: OscillatorType, from: number, to: number, start: number, dur: number, gain: number) {
    const osc = c.createOscillator();
    const env = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + dur);
    env.gain.setValueAtTime(gain, start);
    env.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(env).connect(master!);
    osc.start(start);
    osc.stop(start + dur + 0.02);
}

// A filtered burst of noise: the body of a shot or a crack.
function burst(c: AudioContext, filter: BiquadFilterType, freq: number, start: number, dur: number, gain: number) {
    const src = c.createBufferSource();
    const f = c.createBiquadFilter();
    const env = c.createGain();
    src.buffer = noise;
    f.type = filter;
    f.frequency.value = freq;
    f.Q.value = 0.7;
    // A few ms of attack keeps the noise from clicking on, which makes it read as a soft "pfft".
    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(gain, start + 0.004);
    env.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(f).connect(env).connect(master!);
    src.start(start);
    src.stop(start + dur + 0.02);
}

// Suppressed pistol: a muffled puff of air, a soft low thump, and the slide's mechanical click.
function shot(c: AudioContext, t: number) {
    burst(c, "lowpass", 900, t, 0.09, 1);
    tone(c, "sine", 120, 55, t, 0.07, 0.45);
    burst(c, "highpass", 4000, t + 0.025, 0.02, 0.3);
}

// `step` is used by the refill: each segment plays a slightly higher blip.
export function play(sound: Sound, step = 0) {
    if (!played) {
        played = true;
        emit();
    }
    if (isMuted()) return;
    const c = audio();
    if (!c) return;
    const t = c.currentTime;

    switch (sound) {
        case "targetHit":
            shot(c, t);
            tone(c, "triangle", 2200, 2200, t + 0.04, 0.035, 0.2); // hit marker tick
            burst(c, "highpass", 3000, t + 0.06, 0.05, 0.35); // target cracks
            break;
        case "nameHit":
            shot(c, t);
            tone(c, "triangle", 700, 400, t + 0.04, 0.06, 0.4); // duller thud on the "enemy"
            break;
        case "medkit":
            [523, 659, 784].forEach((f, i) => tone(c, "sine", f, f, t + i * 0.08, 0.18, 0.35));
            break;
        case "refill":
            tone(c, "sine", 600 + step * 60, 600 + step * 60, t, 0.04, 0.12);
            break;
    }
}
