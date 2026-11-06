"use client";

import { useMemo, useSyncExternalStore } from "react";
import { criarCampanha, type Campanha } from "./campanha";
import { percentualValido, totalDoTurno } from "./eleicao";
import { CANDIDATO_VAZIO, type Candidato } from "./candidato";
import type { Dificuldade } from "./config";
import { iniciarEleicao, type Eleicao } from "./eleicao";
import { criarGoverno, type Governo } from "./governo";
import { criarLoja } from "./loja";
import { criarDrama, criarMandato, registrarReeleicao, type Mandato } from "./mandato";

export type Partida = {
  versao: 1;
  id: string;
  nome: string;
  cenario: number;
  ciclo?: number;
  dificuldade: Dificuldade;
  etapa: "criacao-candidato" | "campanha" | "eleicao" | "governo" | "mandato";
  candidato?: Candidato;
  campanha?: Campanha;
  eleicao?: Eleicao;
  governo?: Governo;
  mandato?: Mandato;
  criadaEm: number;
  atualizadaEm: number;
};

// Partidas salvas antes das novidades do mandato ganham os campos que faltam.
function completar(partida: Partida): Partida {
  if (!partida.mandato) return partida;
  return {
    ...partida,
    mandato: {
      ...partida.mandato,
      limite: partida.mandato.limite ?? 48,
      cassado: partida.mandato.cassado ?? false,
      impeachmentMes: partida.mandato.impeachmentMes ?? 0,
      estataisNovas: partida.mandato.estataisNovas ?? [],
      drama: partida.mandato.drama ?? criarDrama(),
    },
  };
}

const loja = criarLoja<Partida[]>("bp:partidas", [], (bruto) =>
  Array.isArray(bruto) ? (bruto as Partida[]).map(completar) : [],
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
    cenario: 2026,
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

export function iniciarCampanha(id: string) {
  mudarPartida(id, (p) => ({
    campanha: criarCampanha(p.id, candidatoDaPartida(p), p.dificuldade),
  }));
}

export function atualizarCampanha(id: string, mudar: (campanha: Campanha) => Campanha) {
  mudarPartida(id, (p) => (p.campanha ? { campanha: mudar(p.campanha) } : {}));
}

export function irAsUrnas(id: string) {
  mudarPartida(id, (p) =>
    p.campanha ? { etapa: "eleicao", eleicao: iniciarEleicao(p.campanha) } : {},
  );
}

export function atualizarEleicao(id: string, mudar: (eleicao: Eleicao) => Eleicao) {
  mudarPartida(id, (p) => (p.eleicao ? { eleicao: mudar(p.eleicao) } : {}));
}

export function formarGoverno(id: string) {
  mudarPartida(id, (p) =>
    p.campanha && p.eleicao
      ? { etapa: "governo", governo: criarGoverno(candidatoDaPartida(p), p.campanha, p.eleicao) }
      : {},
  );
}

export function atualizarGoverno(id: string, mudar: (governo: Governo) => Governo) {
  mudarPartida(id, (p) => (p.governo ? { governo: mudar(p.governo) } : {}));
}

export function comecarMandato(id: string) {
  mudarPartida(id, (p) =>
    p.governo && p.campanha && p.eleicao
      ? {
          etapa: "mandato",
          mandato: criarMandato(
            { governo: p.governo, candidato: candidatoDaPartida(p) },
            p.campanha,
            p.eleicao,
          ),
        }
      : {},
  );
}

export function disputarReeleicao(id: string) {
  mudarPartida(id, (p) =>
    p.mandato
      ? {
          ciclo: 2,
          etapa: "campanha",
          eleicao: undefined,
          campanha: criarCampanha(p.id, candidatoDaPartida(p), p.dificuldade, { aprovacao: p.mandato.aprovacao }),
        }
      : {},
  );
}

export function concluirReeleicao(id: string) {
  mudarPartida(id, (p) => {
    if (!p.mandato || !p.eleicao) return {};
    const total = totalDoTurno(p.eleicao.segundo ?? p.eleicao.primeiro);
    return {
      etapa: "mandato",
      mandato: registrarReeleicao(p.mandato, percentualValido(total, 0), p.eleicao.vencedor === 0),
    };
  });
}

export function atualizarMandato(id: string, mudar: (mandato: Mandato) => Mandato) {
  mudarPartida(id, (p) => (p.mandato ? { mandato: mudar(p.mandato) } : {}));
}

export function apagarPartida(id: string) {
  loja.gravar(loja.ler().filter((p) => p.id !== id));
}

// Levar partidas para outro aparelho: um arquivo com tudo o que está salvo.
export function exportarPartidas() {
  return JSON.stringify({ jogo: "brasil-presidente", versao: 1, partidas: loja.ler() });
}

export function importarPartidas(texto: string) {
  const dados = JSON.parse(texto) as { jogo?: string; partidas?: Partida[] };
  if (dados.jogo !== "brasil-presidente" || !Array.isArray(dados.partidas)) {
    throw new Error("Arquivo inválido");
  }
  const validas = dados.partidas.filter((p) => typeof p.id === "string" && typeof p.nome === "string");
  const ids = new Set(validas.map((p) => p.id));
  loja.gravar([...loja.ler().filter((p) => !ids.has(p.id)), ...validas]);
  return validas.length;
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
