import type { Campanha } from "./campanha";
import type { Candidato } from "./candidato";
import { ESTADOS } from "./estados";

// Aproximação do eleitorado de 2026, usada para transformar percentuais em votos.
const ELEITORES_NO_BRASIL = 156_000_000;
const APOIOS_POR_SEGUNDO_TURNO = 2;

export type VotosUf = {
  eleitores: number;
  comparecimento: number;
  abstencoes: number;
  brancos: number;
  nulos: number;
  votos: number[];
};

export type Turno = {
  numero: 1 | 2;
  participantes: number[];
  ufs: Record<string, VotosUf>;
};

export type Apoio = { indice: number; aceito: boolean };

export type Eleicao = {
  versao: 1;
  semente: number;
  fase: "apuracao-1" | "resultado-1" | "entre-turnos" | "apuracao-2" | "resultado";
  primeiro: Turno;
  segundo: Turno | null;
  finalistas: number[];
  apoios: Apoio[];
  debateFeito: boolean;
  forcaAntesDoDebate: number;
  vencedor: number | null;
};

export type TotalTurno = Omit<VotosUf, "votos"> & { votos: number[]; validos: number };

function sortear(e: { semente: number }) {
  e.semente = (e.semente + 0x6d2b79f5) | 0;
  let t = e.semente;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const entre = (e: { semente: number }, minimo: number, maximo: number) =>
  minimo + sortear(e) * (maximo - minimo);

function eleitoresDe(eleitorado: number) {
  const pesos = ESTADOS.reduce((soma, estado) => soma + estado.eleitorado, 0);
  return Math.round((eleitorado / pesos) * ELEITORES_NO_BRASIL);
}

function montarUf(
  e: { semente: number },
  eleitores: number,
  taxaComparecimento: number,
  brancosPct: number,
  nulosPct: number,
  partes: number[],
): VotosUf {
  const comparecimento = Math.round(eleitores * taxaComparecimento);
  const brancos = Math.round(comparecimento * brancosPct);
  const nulos = Math.round(comparecimento * nulosPct);
  const validos = comparecimento - brancos - nulos;
  const soma = partes.reduce((total, parte) => total + parte, 0);
  const votos = partes.map((parte) => Math.round((parte / soma) * validos));
  return { eleitores, comparecimento, abstencoes: eleitores - comparecimento, brancos, nulos, votos };
}

export function totalDoTurno(turno: Turno, ufs: string[] = ESTADOS.map((e) => e.uf)): TotalTurno {
  const candidatos = turno.ufs[ESTADOS[0].uf].votos.length;
  const total: TotalTurno = {
    eleitores: 0,
    comparecimento: 0,
    abstencoes: 0,
    brancos: 0,
    nulos: 0,
    validos: 0,
    votos: new Array<number>(candidatos).fill(0),
  };
  for (const uf of ufs) {
    const dados = turno.ufs[uf];
    total.eleitores += dados.eleitores;
    total.comparecimento += dados.comparecimento;
    total.abstencoes += dados.abstencoes;
    total.brancos += dados.brancos;
    total.nulos += dados.nulos;
    dados.votos.forEach((voto, i) => {
      total.votos[i] += voto;
      total.validos += voto;
    });
  }
  return total;
}

export function percentualValido(total: TotalTurno, indice: number) {
  return total.validos === 0 ? 0 : (total.votos[indice] / total.validos) * 100;
}

export function liderDaUf(dados: VotosUf) {
  return dados.votos.indexOf(Math.max(...dados.votos));
}

function forcaDaCampanha(c: Campanha) {
  const { popularidade, credibilidade, confianca } = c.indicadores;
  return popularidade + credibilidade + confianca;
}

export function iniciarEleicao(c: Campanha): Eleicao {
  const sorteio = { semente: c.semente };
  const ufs: Record<string, VotosUf> = {};
  for (const estado of ESTADOS) {
    const votos = c.votos[estado.uf];
    const decididos = votos.reduce((soma, voto) => soma + voto, 0);
    const indecisos = 100 - decididos;
    const ordenados = [...votos].sort((a, b) => b - a);
    const partes = votos.map((voto, i) => {
      // Parte dos indecisos migra para quem está na frente no estado, o "voto útil".
      const util = voto >= ordenados[1] ? 1.15 : 1;
      const rejeicao = i === 0 ? 0.8 + (50 - c.rejeicao[estado.uf]) / 100 : 1;
      const decisao = (voto / decididos) * indecisos * util * rejeicao;
      return (voto + decisao) * entre(sorteio, 0.94, 1.06);
    });
    ufs[estado.uf] = montarUf(
      sorteio,
      eleitoresDe(estado.eleitorado),
      entre(sorteio, 0.76, 0.82),
      entre(sorteio, 0.012, 0.022),
      entre(sorteio, 0.024, 0.042),
      partes,
    );
  }
  return {
    versao: 1,
    semente: sorteio.semente,
    fase: "apuracao-1",
    primeiro: { numero: 1, participantes: votosDe(c), ufs },
    segundo: null,
    finalistas: [],
    apoios: [],
    debateFeito: false,
    forcaAntesDoDebate: forcaDaCampanha(c),
    vencedor: null,
  };
}

function votosDe(c: Campanha) {
  return [0, ...c.rivais.map((_, i) => i + 1)];
}

export function concluirApuracao(original: Eleicao): Eleicao {
  const e = structuredClone(original);
  if (e.fase === "apuracao-1") {
    const total = totalDoTurno(e.primeiro);
    const ordem = e.primeiro.participantes
      .slice()
      .sort((a, b) => total.votos[b] - total.votos[a]);
    if (percentualValido(total, ordem[0]) > 50) {
      e.vencedor = ordem[0];
      e.fase = "resultado";
    } else {
      e.finalistas = ordem.slice(0, 2);
      e.fase = "resultado-1";
    }
  } else if (e.fase === "apuracao-2" && e.segundo) {
    const total = totalDoTurno(e.segundo);
    const [a, b] = e.finalistas;
    e.vencedor = total.votos[a] >= total.votos[b] ? a : b;
    e.fase = "resultado";
  }
  return e;
}

function posicoes(c: Campanha, candidato: Candidato) {
  return [candidato, ...c.rivais].map(({ economia, costumes }) => ({ economia, costumes }));
}

function distancia(
  a: { economia: number; costumes: number },
  b: { economia: number; costumes: number },
) {
  return Math.hypot(a.economia - b.economia, a.costumes - b.costumes);
}

export function jogadorNaDisputa(e: Eleicao) {
  return e.finalistas.includes(0);
}

export function eliminados(e: Eleicao) {
  return e.primeiro.participantes.filter((i) => !e.finalistas.includes(i));
}

export function apoiosRestantes(e: Eleicao) {
  return APOIOS_POR_SEGUNDO_TURNO - e.apoios.length;
}

// Na simulação, quem foi eliminado aceita quando está mais perto do jogador do que do adversário.
export function pedirApoio(original: Eleicao, c: Campanha, candidato: Candidato, indice: number) {
  const e = structuredClone(original);
  const lista = posicoes(c, candidato);
  const adversario = e.finalistas.find((i) => i !== 0) ?? 1;
  const paraJogador = distancia(lista[indice], lista[0]);
  const paraAdversario = distancia(lista[indice], lista[adversario]);
  const chance = 0.5 + (paraAdversario - paraJogador) / 80;
  e.apoios.push({ indice, aceito: sortear(e) < chance });
  return e;
}

export function comecarSegundoTurno(original: Eleicao): Eleicao {
  const e = structuredClone(original);
  e.fase = jogadorNaDisputa(e) ? "entre-turnos" : e.fase;
  return e;
}

export function votarSegundoTurno(original: Eleicao, c: Campanha, candidato: Candidato): Eleicao {
  const e = structuredClone(original);
  const lista = posicoes(c, candidato);
  const [a, b] = e.finalistas;
  const fora = eliminados(e);
  const participa = e.finalistas.includes(0);
  const debate = e.debateFeito ? (forcaDaCampanha(c) - e.forcaAntesDoDebate) * 0.08 : -1.5;
  const ufs: Record<string, VotosUf> = {};

  for (const estado of ESTADOS) {
    const primeiro = e.primeiro.ufs[estado.uf];
    let votosA = primeiro.votos[a];
    let votosB = primeiro.votos[b];
    for (const indice of fora) {
      // Parte de quem votou no eliminado não comparece ou anula.
      const eleitores = primeiro.votos[indice] * 0.85;
      let pesoA = 1 / (10 + distancia(lista[indice], lista[a]));
      let pesoB = 1 / (10 + distancia(lista[indice], lista[b]));
      if (e.apoios.some((apoio) => apoio.indice === indice && apoio.aceito)) {
        if (a === 0) pesoA *= 2;
        if (b === 0) pesoB *= 2;
      }
      votosA += eleitores * (pesoA / (pesoA + pesoB));
      votosB += eleitores * (pesoB / (pesoA + pesoB));
    }
    let parteA = (votosA / (votosA + votosB)) * 100;
    if (participa) {
      const vantagem = (40 - c.rejeicao[estado.uf]) * 0.05 + debate;
      parteA += a === 0 ? vantagem : -vantagem;
    }
    parteA = Math.min(95, Math.max(5, parteA + entre(e, -1.5, 1.5)));
    const partes = new Array<number>(primeiro.votos.length).fill(0);
    partes[a] = parteA;
    partes[b] = 100 - parteA;
    ufs[estado.uf] = montarUf(
      e,
      primeiro.eleitores,
      (primeiro.comparecimento / primeiro.eleitores) * entre(e, 0.97, 0.995),
      entre(e, 0.015, 0.026),
      entre(e, 0.03, 0.05),
      partes,
    );
  }

  e.segundo = { numero: 2, participantes: [a, b], ufs };
  e.fase = "apuracao-2";
  return e;
}
