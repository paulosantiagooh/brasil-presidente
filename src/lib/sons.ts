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

export function tocar(som: Som) {
  if (typeof window === "undefined" || lerConfig().som === "desligado") return;
  try {
    contexto ??= new AudioContext();
    if (contexto.state === "suspended") void contexto.resume();
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
