"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CANDIDATO_VAZIO, type Candidato } from "./candidato";
import type { Dificuldade } from "./config";
import { criarLoja } from "./loja";

export type Partida = {
  versao: 1;
  id: string;
  nome: string;
  cenario: 2030;
  dificuldade: Dificuldade;
  etapa: "criacao-candidato" | "campanha";
  candidato?: Candidato;
  criadaEm: number;
  atualizadaEm: number;
};

const loja = criarLoja<Partida[]>("bp:partidas", [], (bruto) =>
  Array.isArray(bruto) ? (bruto as Partida[]) : [],
);

// A partida jogada por último vem primeiro.
export function usePartidas() {
  const partidas = useSyncExternalStore(loja.assinar, loja.ler, () => loja.vazio);
  return useMemo(
    () => [...partidas].sort((a, b) => b.atualizadaEm - a.atualizadaEm),
    [partidas],
  );
}

function proximoNumero(partidas: Partida[]) {
  const numeros = partidas.map((p) => Number(p.nome.match(/\d+$/)?.[0] ?? 0));
  return Math.max(0, ...numeros) + 1;
}

export function criarPartida(dificuldade: Dificuldade) {
  const partidas = loja.ler();
  const agora = Date.now();
  const partida: Partida = {
    versao: 1,
    id: agora.toString(36) + Math.random().toString(36).slice(2, 8),
    nome: `Partida ${proximoNumero(partidas)}`,
    cenario: 2030,
    dificuldade,
    etapa: "criacao-candidato",
    criadaEm: agora,
    atualizadaEm: agora,
  };
  loja.gravar([...partidas, partida]);
  return partida;
}

export function marcarComoJogada(id: string) {
  loja.gravar(
    loja.ler().map((p) => (p.id === id ? { ...p, atualizadaEm: Date.now() } : p)),
  );
}

export function candidatoDaPartida(partida: Partida): Candidato {
  return { ...CANDIDATO_VAZIO, ...partida.candidato };
}

function mudarPartida(id: string, mudar: (partida: Partida) => Partial<Partida>) {
  loja.gravar(
    loja
      .ler()
      .map((p) => (p.id === id ? { ...p, ...mudar(p), atualizadaEm: Date.now() } : p)),
  );
}

// Cada mudança na ficha já fica salva, sem botão de salvar.
export function atualizarCandidato(id: string, mudanca: Partial<Candidato>) {
  mudarPartida(id, (p) => ({ candidato: { ...candidatoDaPartida(p), ...mudanca } }));
}

export function confirmarCandidatura(id: string) {
  mudarPartida(id, () => ({ etapa: "campanha" }));
}

export function apagarPartida(id: string) {
  loja.gravar(loja.ler().filter((p) => p.id !== id));
}

export function apagarTodasAsPartidas() {
  loja.gravar([]);
}

const formatoData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatarData(momento: number) {
  return formatoData.format(momento).replace(",", " às");
}
