"use client";

import { lerConfig } from "./config";

export type Som = "urgente" | "tique" | "bom" | "ruim" | "martelo" | "vitoria" | "derrota" | "conquista";

type Nota = { f: number; t: number; d: number; tipo?: OscillatorType; v?: number };

// Sons sintetizados no navegador: o jogo não precisa baixar nenhum arquivo de áudio.
const NOTAS: Record<Som, Nota[]> = {
  urgente: [
    { f: 880, t: 0, d: 0.14, tipo: "square", v: 0.05 },
    { f: 660, t: 0.18, d: 0.14, tipo: "square", v: 0.05 },
    { f: 880, t: 0.36, d: 0.14, tipo: "square", v: 0.05 },
    { f: 660, t: 0.54, d: 0.18, tipo: "square", v: 0.05 },
  ],
  tique: [{ f: 1200, t: 0, d: 0.04, tipo: "square", v: 0.03 }],
  bom: [
    { f: 523, t: 0, d: 0.12 },
    { f: 784, t: 0.1, d: 0.18 },
  ],
  ruim: [
    { f: 300, t: 0, d: 0.16, tipo: "sawtooth", v: 0.05 },
    { f: 200, t: 0.14, d: 0.24, tipo: "sawtooth", v: 0.05 },
  ],
  martelo: [
    { f: 140, t: 0, d: 0.09, tipo: "square", v: 0.1 },
    { f: 110, t: 0.16, d: 0.12, tipo: "square", v: 0.1 },
  ],
  vitoria: [
    { f: 523, t: 0, d: 0.16 },
    { f: 659, t: 0.15, d: 0.16 },
    { f: 784, t: 0.3, d: 0.16 },
    { f: 1047, t: 0.45, d: 0.42 },
  ],
  derrota: [
    { f: 392, t: 0, d: 0.28, tipo: "triangle" },
    { f: 330, t: 0.26, d: 0.28, tipo: "triangle" },
    { f: 262, t: 0.52, d: 0.5, tipo: "triangle" },
  ],
  conquista: [
    { f: 784, t: 0, d: 0.1 },
    { f: 988, t: 0.09, d: 0.1 },
    { f: 1319, t: 0.18, d: 0.26 },
  ],
};

let contexto: AudioContext | null = null;

// Um só motor de áudio para o jogo inteiro. Com `criar` falso, só devolve o que já existe.
export function audio(criar = true) {
  if (typeof window === "undefined") return null;
  try {
    if (!contexto && criar) contexto = new AudioContext();
    if (criar && contexto?.state === "suspended") void contexto.resume();
    return contexto;
  } catch {
    return null;
  }
}

const ruidos = new WeakMap<BaseAudioContext, AudioBuffer>();

export function ruido(ctx: BaseAudioContext) {
  const pronto = ruidos.get(ctx);
  if (pronto) return pronto;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < dados.length; i += 1) dados[i] = Math.random() * 2 - 1;
  ruidos.set(ctx, buffer);
  return buffer;
}

export type Ambiente = "multidao" | "aplausos" | "chuva" | "sirene" | "flashes" | "fogos" | "vento" | "motor" | "bip" | "telefone" | "batidas" | "obra";

type Ligar = (ctx: AudioContext, saida: GainNode, t: number) => void;

function chiar(ctx: AudioContext, saida: AudioNode, t: number, duracao: number, tipo: BiquadFilterType, corte: number, volume: number, ataque = 0.005) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido(ctx);
  fonte.loop = true;
  const filtro = ctx.createBiquadFilter();
  filtro.type = tipo;
  filtro.frequency.value = corte;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(volume, t + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  fonte.connect(filtro).connect(g).connect(saida);
  fonte.start(t, Math.random());
  fonte.stop(t + duracao + 0.05);
  return filtro;
}

function apitar(ctx: AudioContext, saida: AudioNode, t: number, duracao: number, de: number, ate: number, volume: number, tipo: OscillatorType = "sine") {
  const o = ctx.createOscillator();
  o.type = tipo;
  o.frequency.setValueAtTime(de, t);
  o.frequency.exponentialRampToValueAtTime(ate, t + duracao);
  const g = ctx.createGain();
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  o.connect(g).connect(saida);
  o.start(t);
  o.stop(t + duracao + 0.02);
}

const AMBIENTES: Record<Ambiente, Ligar> = {
  multidao(ctx, saida, t) {
    chiar(ctx, saida, t, 5, "bandpass", 650, 0.5, 0.7);
    chiar(ctx, saida, t, 5, "bandpass", 1500, 0.2, 1);
    for (let i = 0; i < 7; i += 1) apitar(ctx, saida, t + 0.5 + i * 0.62, 0.3, 380 + (i % 3) * 60, 330, 0.018, "sawtooth");
  },
  aplausos(ctx, saida, t) {
    for (let i = 0; i < 90; i += 1) chiar(ctx, saida, t + Math.random() * 4.5, 0.08, "highpass", 1400, 0.09);
  },
  chuva(ctx, saida, t) {
    chiar(ctx, saida, t, 5, "bandpass", 2600, 0.24, 0.5);
    chiar(ctx, saida, t + 1.4, 2.2, "lowpass", 140, 1.5, 0.03);
  },
  sirene(ctx, saida, t) {
    for (let i = 0; i < 9; i += 1) apitar(ctx, saida, t + i * 0.5, 0.48, i % 2 ? 960 : 660, i % 2 ? 660 : 960, 0.035);
  },
  flashes(ctx, saida, t) {
    for (let i = 0; i < 14; i += 1) chiar(ctx, saida, t + Math.random() * 4.7, 0.05, "highpass", 3500, 0.12);
  },
  fogos(ctx, saida, t) {
    for (let i = 0; i < 7; i += 1) {
      const quando = t + i * 0.56;
      apitar(ctx, saida, quando, 0.45, 500, 1700, 0.012);
      chiar(ctx, saida, quando + 0.5, 0.7, "lowpass", 300, 0.9, 0.01);
      chiar(ctx, saida, quando + 0.55, 0.9, "highpass", 3000, 0.06, 0.05);
    }
  },
  vento(ctx, saida, t) {
    const filtro = chiar(ctx, saida, t, 5, "bandpass", 300, 0.5, 1);
    filtro.frequency.linearRampToValueAtTime(900, t + 2.5);
    filtro.frequency.linearRampToValueAtTime(340, t + 5);
  },
  motor(ctx, saida, t) {
    chiar(ctx, saida, t, 5, "lowpass", 240, 0.8, 0.8);
    apitar(ctx, saida, t, 4.8, 58, 46, 0.05, "sawtooth");
  },
  bip(ctx, saida, t) {
    for (let i = 0; i < 6; i += 1) apitar(ctx, saida, t + 0.3 + i * 0.5, 0.09, 1250, 1250, 0.03, "square");
    for (let i = 0; i < 4; i += 1) apitar(ctx, saida, t + 3.3 + i * 0.16, i === 3 ? 0.5 : 0.1, 1040, 1040, 0.03, "square");
  },
  telefone(ctx, saida, t) {
    for (let i = 0; i < 3; i += 1) {
      for (let k = 0; k < 14; k += 1) apitar(ctx, saida, t + i * 1.7 + k * 0.06, 0.05, k % 2 ? 1250 : 980, k % 2 ? 1250 : 980, 0.018, "square");
    }
  },
  batidas(ctx, saida, t) {
    for (let i = 0; i < 6; i += 1) {
      apitar(ctx, saida, t + i * 0.62, 0.22, 74, 44, 0.3);
      apitar(ctx, saida, t + i * 0.62 + 0.2, 0.2, 62, 40, 0.2);
    }
  },
  obra(ctx, saida, t) {
    chiar(ctx, saida, t, 5, "lowpass", 260, 0.5, 0.5);
    for (let i = 0; i < 18; i += 1) apitar(ctx, saida, t + i * 0.27, 0.05, 1900, 1200, 0.02, "square");
  },
};

// Som de 5 segundos para acompanhar uma cena. Devolve a função que corta o som antes do fim.
export function ambiente(tipo: Ambiente) {
  const ctx = lerConfig().som === "desligado" ? null : audio();
  if (!ctx) return () => {};
  try {
    const saida = ctx.createGain();
    saida.gain.value = 0.3;
    saida.connect(ctx.destination);
    AMBIENTES[tipo](ctx, saida, ctx.currentTime + 0.03);
    return () => {
      const agora = ctx.currentTime;
      saida.gain.setValueAtTime(saida.gain.value, agora);
      saida.gain.linearRampToValueAtTime(0, agora + 0.2);
      window.setTimeout(() => saida.disconnect(), 300);
    };
  } catch {
    return () => {};
  }
}

export function tocar(som: Som) {
  if (typeof window === "undefined" || lerConfig().som === "desligado") return;
  try {
    const contexto = audio();
    if (!contexto) return;
    const agora = contexto.currentTime;
    for (const nota of NOTAS[som]) {
      const oscilador = contexto.createOscillator();
      const volume = contexto.createGain();
      oscilador.type = nota.tipo ?? "sine";
      oscilador.frequency.value = nota.f;
      volume.gain.setValueAtTime(nota.v ?? 0.08, agora + nota.t);
      volume.gain.exponentialRampToValueAtTime(0.0001, agora + nota.t + nota.d);
      oscilador.connect(volume).connect(contexto.destination);
      oscilador.start(agora + nota.t);
      oscilador.stop(agora + nota.t + nota.d + 0.02);
    }
  } catch {
    // Sem som neste navegador: o jogo continua normalmente.
  }
}
