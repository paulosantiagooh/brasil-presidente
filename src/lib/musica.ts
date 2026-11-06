"use client";

import { lerConfig } from "./config";
import { audio, ruido } from "./sons";

export type NomeTrilha = "abertura" | "campanha" | "mandato" | "crise";

// Música original do jogo, composta nota por nota e tocada pelo navegador, sem arquivo de áudio.
type Nota = [passo: number, altura: number, duracao: number];
type Acorde = [baixo: number, notas: number[]];

const C: Acorde = [36, [60, 64, 67]];
const G: Acorde = [43, [59, 62, 67]];
const AM: Acorde = [45, [60, 64, 69]];
const F: Acorde = [41, [60, 65, 69]];
const DM: Acorde = [38, [62, 65, 69]];
const E: Acorde = [40, [59, 64, 68]];

const TEMA: Nota[][] = [
  [[0, 67, 3], [3, 67, 1], [4, 72, 4], [8, 76, 3], [11, 74, 1], [12, 72, 4]],
  [[0, 74, 3], [3, 74, 1], [4, 71, 4], [8, 67, 8]],
  [[0, 69, 3], [3, 69, 1], [4, 72, 4], [8, 76, 3], [11, 77, 1], [12, 76, 4]],
  [[0, 72, 3], [3, 69, 1], [4, 77, 4], [8, 76, 4], [12, 74, 4]],
  [[0, 76, 3], [3, 76, 1], [4, 79, 4], [8, 76, 3], [11, 72, 1], [12, 67, 4]],
  [[0, 69, 3], [3, 72, 1], [4, 77, 4], [8, 81, 4], [12, 79, 4]],
  [[0, 77, 2], [2, 76, 2], [4, 74, 4], [8, 79, 3], [11, 77, 1], [12, 74, 4]],
  [[0, 72, 6], [6, 67, 2], [8, 72, 8]],
  [[0, 76, 4], [4, 72, 2], [6, 76, 2], [8, 81, 8]],
  [[0, 77, 4], [4, 72, 2], [6, 77, 2], [8, 81, 4], [12, 79, 4]],
  [[0, 76, 4], [4, 72, 2], [6, 76, 2], [8, 79, 8]],
  [[0, 74, 2], [2, 76, 2], [4, 77, 2], [6, 79, 2], [8, 83, 4], [12, 79, 4]],
  [[0, 84, 4], [4, 83, 2], [6, 81, 2], [8, 76, 8]],
  [[0, 77, 4], [4, 76, 2], [6, 74, 2], [8, 81, 8]],
  [[0, 79, 3], [3, 79, 1], [4, 77, 2], [6, 76, 2], [8, 74, 4], [12, 71, 4]],
  [[0, 72, 4], [4, 76, 2], [6, 79, 2], [8, 84, 8]],
];
const HARMONIA_TEMA = [C, G, AM, F, C, F, G, C, AM, F, C, G, AM, DM, G, C];

const GABINETE: Nota[][] = [
  [[0, 76, 6], [6, 74, 2], [8, 72, 8]],
  [[0, 72, 6], [6, 74, 2], [8, 69, 8]],
  [[0, 67, 4], [4, 72, 4], [8, 76, 8]],
  [[0, 68, 6], [6, 71, 2], [8, 76, 8]],
  [[0, 81, 6], [6, 79, 2], [8, 76, 8]],
  [[0, 77, 6], [6, 76, 2], [8, 74, 8]],
  [[0, 72, 4], [4, 74, 4], [8, 77, 4], [12, 76, 4]],
  [[0, 76, 16]],
];
const HARMONIA_GABINETE = [AM, F, C, E, AM, DM, F, E];
const RAIZES_CRISE = [50, 50, 46, 45, 50, 50, 51, 45];

const TRILHAS: Record<NomeTrilha, { bpm: number; compassos: number }> = {
  abertura: { bpm: 76, compassos: 16 },
  campanha: { bpm: 118, compassos: 16 },
  mandato: { bpm: 88, compassos: 16 },
  crise: { bpm: 126, compassos: 8 },
};

type Saida = { ctx: BaseAudioContext; seco: AudioNode; sala: AudioNode };

const hz = (nota: number) => 440 * 2 ** ((nota - 69) / 12);

function envelope(ctx: BaseAudioContext, saida: AudioNode, t: number, volume: number, ataque: number, duracao: number, soltura: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(volume, t + ataque);
  g.gain.setValueAtTime(volume, t + Math.max(ataque, duracao));
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(ataque, duracao) + soltura);
  g.connect(saida);
  return g;
}

function osciladores(ctx: BaseAudioContext, destino: AudioNode, tipo: OscillatorType, nota: number, desafinar: number[], t: number, fim: number) {
  for (const cents of desafinar) {
    const o = ctx.createOscillator();
    o.type = tipo;
    o.frequency.value = hz(nota);
    o.detune.value = cents;
    o.connect(destino);
    o.start(t);
    o.stop(fim);
  }
}

function metal(s: Saida, t: number, nota: number, duracao: number, volume: number) {
  const { ctx } = s;
  const g = envelope(ctx, s.seco, t, volume, 0.025, duracao * 0.82, 0.12);
  const sala = ctx.createGain();
  sala.gain.value = 0.5;
  g.connect(sala).connect(s.sala);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.Q.value = 1;
  filtro.frequency.setValueAtTime(700, t);
  filtro.frequency.linearRampToValueAtTime(2300, t + 0.07);
  filtro.frequency.exponentialRampToValueAtTime(1300, t + Math.max(0.1, duracao));
  filtro.connect(g);
  osciladores(ctx, filtro, "sawtooth", nota, [-5, 5], t, t + duracao + 0.2);
}

function flauta(s: Saida, t: number, nota: number, duracao: number, volume: number) {
  const g = envelope(s.ctx, s.seco, t, volume, 0.04, duracao * 0.85, 0.1);
  g.connect(s.sala);
  osciladores(s.ctx, g, "triangle", nota, [0], t, t + duracao + 0.2);
}

function cordas(s: Saida, t: number, notas: number[], duracao: number, volume: number) {
  const { ctx } = s;
  const g = envelope(ctx, s.seco, t, volume, 0.28, duracao * 0.9, 0.45);
  g.connect(s.sala);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 1500;
  filtro.connect(g);
  for (const nota of notas) osciladores(ctx, filtro, "sawtooth", nota, [-7, 7], t, t + duracao + 0.6);
}

function curta(s: Saida, t: number, nota: number, tipo: OscillatorType, corte: number, duracao: number, volume: number) {
  const { ctx } = s;
  const g = envelope(ctx, s.seco, t, volume, 0.005, 0.01, duracao);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = corte;
  filtro.connect(g);
  osciladores(ctx, filtro, tipo, nota, [0], t, t + duracao + 0.05);
}

function baixo(s: Saida, t: number, nota: number, duracao: number, volume: number) {
  const g = envelope(s.ctx, s.seco, t, volume, 0.008, duracao * 0.7, 0.08);
  osciladores(s.ctx, g, "triangle", nota, [0], t, t + duracao + 0.12);
}

function tambor(s: Saida, t: number, de: number, ate: number, duracao: number, volume: number) {
  const { ctx } = s;
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(de, t);
  o.frequency.exponentialRampToValueAtTime(ate, t + duracao * 0.35);
  const g = envelope(ctx, s.seco, t, volume, 0.003, 0.01, duracao);
  g.connect(s.sala);
  o.connect(g);
  o.start(t);
  o.stop(t + duracao + 0.05);
}

function chiado(s: Saida, t: number, corte: number, duracao: number, volume: number) {
  const { ctx } = s;
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido(ctx);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "highpass";
  filtro.frequency.value = corte;
  const g = envelope(ctx, s.seco, t, volume, 0.002, 0.005, duracao);
  fonte.connect(filtro).connect(g);
  fonte.start(t, Math.random());
  fonte.stop(t + duracao + 0.05);
}

// Agenda um compasso de 16 passos a partir do instante `t`.
export function tocarCompasso(s: Saida, nome: NomeTrilha, indice: number, volta: number, t: number) {
  const { bpm } = TRILHAS[nome];
  const passo = 60 / bpm / 4;
  const quando = (p: number) => t + p * passo;
  const compasso = passo * 16;

  if (nome === "abertura") {
    const [raiz, notas] = HARMONIA_TEMA[indice];
    cordas(s, t, notas.map((n) => n - 12), compasso, 0.05);
    baixo(s, t, raiz + 12, compasso * 0.9, 0.12);
    for (const [p, nota, d] of TEMA[indice]) metal(s, quando(p), nota - 12, d * passo, 0.075);
    if (indice % 2 === 0) tambor(s, t, 110, 70, 0.9, 0.3);
    if (indice % 8 === 0) chiado(s, t, 6000, 1.6, 0.05);
    return;
  }

  if (nome === "campanha") {
    const [raiz, notas] = HARMONIA_TEMA[indice];
    const leve = volta % 2 === 1;
    for (const [p, nota, d] of TEMA[indice]) {
      if (leve) flauta(s, quando(p), nota + 12, d * passo, 0.07);
      else metal(s, quando(p), nota, d * passo, 0.08);
    }
    baixo(s, quando(0), raiz + 12, passo * 3, 0.17);
    baixo(s, quando(8), raiz + 19, passo * 3, 0.15);
    for (const p of [4, 12, 14]) for (const nota of notas) curta(s, quando(p), nota, "sawtooth", 1700, 0.13, 0.03);
    tambor(s, quando(4), 120, 58, 0.34, 0.3);
    tambor(s, quando(12), 105, 52, 0.42, 0.36);
    for (const p of [0, 3, 6, 8, 11, 14]) chiado(s, quando(p), 3400, 0.05, 0.05);
    for (let p = 0; p < 16; p += 2) chiado(s, quando(p), 1900, 0.06, p % 4 === 0 ? 0.035 : 0.018);
    if (indice === 0) chiado(s, t, 6000, 1.2, 0.05);
    return;
  }

  if (nome === "mandato") {
    const [raiz, notas] = HARMONIA_GABINETE[indice % 8];
    cordas(s, t, notas.map((n) => n - 12), compasso, 0.038);
    const figura = [0, 7, 12, 7, 0, 7, 12, 7];
    figura.forEach((salto, i) => curta(s, quando(i * 2), raiz + 12 + salto, "triangle", 1100, 0.2, i % 4 === 0 ? 0.13 : 0.09));
    if (indice % 4 === 0) tambor(s, t, 90, 62, 1, 0.24);
    if (indice < 8) for (const [p, nota, d] of GABINETE[indice]) metal(s, quando(p), nota - 12, d * passo, 0.05 + (volta % 2) * 0.008);
    else if (indice >= 12 && volta % 2 === 0) for (const [p, nota, d] of GABINETE[indice - 12]) flauta(s, quando(p), nota, d * passo, 0.05);
    return;
  }

  const raiz = RAIZES_CRISE[indice];
  [0, 0, 7, 0, 0, 3, 0, 7, 0, 0, 8, 0, 0, 3, 0, 7].forEach((salto, p) =>
    curta(s, quando(p), raiz - 12 + salto, "sawtooth", 720, 0.1, p % 4 === 0 ? 0.09 : 0.065),
  );
  tambor(s, t, 96, 58, 0.7, 0.34);
  tambor(s, quando(8), 96, 58, 0.6, 0.26);
  cordas(s, t, [raiz + 24, raiz + 27], compasso, 0.022);
  if (indice % 4 >= 2) {
    for (const p of [0, 3, 6]) {
      for (const salto of [12, 15, 19]) metal(s, quando(p), raiz + salto, passo * 1.6, 0.035);
    }
  }
  if (indice % 4 === 3) for (let p = 12; p < 16; p += 1) chiado(s, quando(p), 1800, 0.08, 0.03 + (p - 12) * 0.012);
}

// Eco de sala: dá corpo aos metais e às cordas.
export function criarSala(ctx: BaseAudioContext, saida: AudioNode) {
  const tamanho = Math.floor(ctx.sampleRate * 1.7);
  const impulso = ctx.createBuffer(2, tamanho, ctx.sampleRate);
  for (let canal = 0; canal < 2; canal += 1) {
    const dados = impulso.getChannelData(canal);
    for (let i = 0; i < tamanho; i += 1) dados[i] = (Math.random() * 2 - 1) * (1 - i / tamanho) ** 3;
  }
  const eco = ctx.createConvolver();
  eco.buffer = impulso;
  const volume = ctx.createGain();
  volume.gain.value = 0.32;
  eco.connect(volume).connect(saida);
  return eco;
}

export function criarMestre(ctx: BaseAudioContext) {
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -16;
  compressor.ratio.value = 4;
  compressor.connect(ctx.destination);
  return compressor;
}

const VOLUME = 0.62;
const ADIANTADO = 0.6;

type Tocando = { nome: NomeTrilha; barramento: GainNode; saida: Saida; indice: number; volta: number; proximo: number };

let pedida: NomeTrilha = "abertura";
let mestre: GainNode | null = null;
let tocando: Tocando | null = null;
let relogio = 0;
let preparado = false;
let abaixadas = 0;

function agendar() {
  const atual = tocando;
  if (!atual) return;
  const ctx = atual.saida.ctx;
  const { bpm, compassos } = TRILHAS[atual.nome];
  while (atual.proximo < ctx.currentTime + ADIANTADO) {
    tocarCompasso(atual.saida, atual.nome, atual.indice, atual.volta, atual.proximo);
    atual.proximo += (60 / bpm) * 4;
    atual.indice += 1;
    if (atual.indice >= compassos) {
      atual.indice = 0;
      atual.volta += 1;
    }
  }
}

function soltar(fim: Tocando) {
  const agora = fim.saida.ctx.currentTime;
  fim.barramento.gain.cancelScheduledValues(agora);
  fim.barramento.gain.setValueAtTime(fim.barramento.gain.value, agora);
  fim.barramento.gain.linearRampToValueAtTime(0, agora + 0.9);
  window.setTimeout(() => fim.barramento.disconnect(), 4000);
}

function iniciar(nome: NomeTrilha) {
  const ctx = audio();
  if (!ctx) return;
  if (!mestre) {
    mestre = ctx.createGain();
    mestre.gain.value = VOLUME;
    mestre.connect(criarMestre(ctx));
  }
  if (tocando) soltar(tocando);
  const barramento = ctx.createGain();
  const agora = ctx.currentTime;
  barramento.gain.setValueAtTime(0, agora);
  barramento.gain.linearRampToValueAtTime(1, agora + 1.2);
  barramento.connect(mestre);
  const saida = { ctx, seco: barramento, sala: criarSala(ctx, barramento) };
  tocando = { nome, barramento, saida, indice: 0, volta: 0, proximo: agora + 0.12 };
  agendar();
  if (!relogio) relogio = window.setInterval(agendar, 150);
}

export function pararMusica() {
  if (tocando) soltar(tocando);
  tocando = null;
  window.clearInterval(relogio);
  relogio = 0;
}

function podeTocar() {
  return lerConfig().musica !== "desligada" && document.visibilityState === "visible";
}

// O navegador só libera o áudio depois do primeiro toque da pessoa na tela.
function aoTocarNaTela() {
  liberado = true;
  window.removeEventListener("pointerdown", aoTocarNaTela);
  window.removeEventListener("keydown", aoTocarNaTela);
  atualizarMusica();
}

let liberado = false;

export function atualizarMusica() {
  if (!liberado) return;
  if (lerConfig().musica === "desligada") {
    pararMusica();
    return;
  }
  if (podeTocar() && tocando?.nome !== pedida) iniciar(pedida);
}

export function pedirTrilha(nome: NomeTrilha) {
  pedida = nome;
  if (!preparado) {
    preparado = true;
    window.addEventListener("pointerdown", aoTocarNaTela);
    window.addEventListener("keydown", aoTocarNaTela);
    // Com o jogo em segundo plano, a música para; ela volta junto com a tela.
    document.addEventListener("visibilitychange", () => {
      const ctx = audio(false);
      if (!ctx) return;
      if (document.visibilityState === "hidden") void ctx.suspend();
      else {
        void ctx.resume();
        atualizarMusica();
      }
    });
  }
  atualizarMusica();
}

// Durante uma cena a música fica mais baixa, para o som do acontecimento aparecer.
export function abaixarMusica() {
  let ativo = true;
  abaixadas += 1;
  ajustarVolume();
  return () => {
    if (!ativo) return;
    ativo = false;
    abaixadas -= 1;
    ajustarVolume();
  };
}

function ajustarVolume() {
  if (!mestre) return;
  const agora = mestre.context.currentTime;
  mestre.gain.cancelScheduledValues(agora);
  mestre.gain.setValueAtTime(mestre.gain.value, agora);
  mestre.gain.linearRampToValueAtTime(abaixadas > 0 ? VOLUME * 0.42 : VOLUME, agora + 0.4);
}
