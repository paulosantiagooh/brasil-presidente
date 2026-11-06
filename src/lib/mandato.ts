import type { Campanha } from "./campanha";
import type { Candidato } from "./candidato";
import type { Eleicao } from "./eleicao";
import type { Pessoa } from "./pessoas";
import { AREAS, calcularBalanco, custoDoOrcamento, estimarVotos, pastasDoPartido, TETO_ORCAMENTO, votarIndicacao, votarProposta, type Casa, type Governo } from "./governo";
import {
  ACOES_DIPLOMATICAS,
  AREAS_MEDIDA,
  ESTATAIS,
  EVENTOS_MANDATO,
  GRUPOS_SOCIAIS,
  INSTRUMENTOS,
  MODELOS_OBRA,
  OBJETIVOS_MEDIDA,
  OBRAS_REAIS,
  PARCEIROS,
  PROGRAMAS_SEGURANCA,
  PROJETOS_MANDATO,
  TONS_PRONUNCIAMENTO,
  VAGAS,
  type Efeito,
  type EventoMandato,
  type OpcaoIndicacao,
  type Vaga,
} from "./mandato-dados";

export const MESES = 48;
export const ACOES_POR_MES = 3;
const LIMITE_OBRAS = 8;

const NOME_MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// O mês 0 é o registro da posse, antes do primeiro mês de governo.
export function nomeDoMes(mes: number) {
  if (mes === 0) return "posse";
  return `${NOME_MES[(mes - 1) % 12]}/${2027 + Math.floor((mes - 1) / 12)}`;
}

// Ponto de partida inspirado em novembro de 2026 (Focus: Selic, IPCA, PIB e dólar). Demais valores são estimativas.
export type Economia = {
  pib: number; ipca: number; selic: number; dolar: number; desemprego: number; divida: number;
  primario: number; carga: number; renda: number; investimento: number; exportacoes: number;
  reservas: number; confianca: number; pobreza: number; desigualdade: number; informalidade: number;
};

export type Sociedade = {
  saude: number; educacao: number; seguranca: number; qualidade: number; confianca: number; ambiente: number;
};

export type Seguranca = {
  homicidios: number; roubos: number; crime: number; trafico: number; mulher: number;
  prisional: number; eficiencia: number; defesa: number; fronteiras: number;
};

export type Obra = {
  id: string;
  nome: string;
  categoria: string;
  uf: string;
  custo: number;
  meses: number;
  execucao: number;
  licenca: boolean;
  contrato: boolean;
  situacao: "andamento" | "suspensa" | "concluida" | "cancelada";
  real: boolean;
  dataBase?: string;
  efeito: Efeito;
};

export type SituacaoEstatal = {
  controle: "estatal" | "capital-aberto" | "privatizada";
  gestao: "politica" | "tecnica";
  presidente: string | null;
};

export type Registro = {
  mes: number; aprovacao: number; pib: number; ipca: number; selic: number; desemprego: number; divida: number; dolar: number;
};

export type PropostaEmVoto = {
  nome: string;
  tipo: string;
  economia: number;
  camara: number | null;
  senado: number | null;
  atraso: number;
  efeito: Efeito;
  projetoId?: string;
  medidaId?: number;
  estatal?: { id: string; controle: "capital-aberto" | "privatizada" };
};

export type Concessoes = { emendas: number; cargos: number; texto: number };

export type ResultadoVoto = { aprovado: boolean; camara: Casa; senado: Casa | null };

export type Pendencia =
  | { tipo: "evento"; evento: EventoMandato }
  | { tipo: "votacao"; proposta: PropostaEmVoto; concessoes: Concessoes; resultado: ResultadoVoto | null }
  | { tipo: "indicacao"; vaga: Vaga }
  | { tipo: "resultado-indicacao"; titulo: string; texto: string; sim: number; nao: number };

export type Mandato = {
  versao: 1;
  semente: number;
  mes: number;
  acoes: number;
  fase: "gestao" | "pendencia" | "fim";
  economia: Economia;
  sociedade: Sociedade;
  seguranca: Seguranca;
  aprovacao: number;
  congresso: number;
  gestao: number;
  grupos: Record<string, number>;
  obras: Obra[];
  estatais: Record<string, SituacaoEstatal>;
  relacoes: Record<string, number>;
  orcamento: Record<string, number>;
  projetosAprovados: string[];
  votacoes: { mes: number; projeto: string; aprovado: boolean; camara: Casa; senado: Casa | null }[];
  indicados: { vaga: string; cargo: string; nome: string; mes: number; aprovado: boolean }[];
  pendentes: { mes: number; efeito: Efeito; texto: string }[];
  pendencia: Pendencia | null;
  noticias: { mes: number; texto: string }[];
  historico: Registro[];
  eventosVistos: string[];
  reeleicao: { votos: number; venceu: boolean } | null;
  inicio: { economia: Economia; sociedade: Sociedade; seguranca: Seguranca; aprovacao: number; congresso: number };
  vagasReabertas: { id: string; mes: number }[];
  medidas: { id: number; mes: number; titulo: string; descricao: string; instrumento: string; situacao: string }[];
  mps: { mes: number; medidaId: number; titulo: string; economia: number; efeito: Efeito }[];
  resumoMes: { mes: number; aprovacao: number; pib: number; ipca: number; desemprego: number } | null;
};

export type Contexto = { governo: Governo; candidato: Candidato };

const limitar = (valor: number, minimo = 0, maximo = 100) => Math.min(maximo, Math.max(minimo, valor));
const aproximar = (atual: number, alvo: number, passo: number) => atual + (alvo - atual) * passo;

function sortear(m: Mandato) {
  m.semente = (m.semente + 0x6d2b79f5) | 0;
  let t = m.semente;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const ruido = (m: Mandato, margem: number) => (sortear(m) * 2 - 1) * margem;

function noticiar(m: Mandato, texto: string) {
  m.noticias.unshift({ mes: m.mes, texto });
  m.noticias.length = Math.min(m.noticias.length, 60);
}

function registrar(m: Mandato): Registro {
  const { pib, ipca, selic, desemprego, divida, dolar } = m.economia;
  return { mes: m.mes, aprovacao: m.aprovacao, pib, ipca, selic, desemprego, divida, dolar };
}

export function criarMandato(contexto: Contexto, campanha: Campanha, eleicao: Eleicao): Mandato {
  const balanco = calcularBalanco(contexto.governo, contexto.candidato, eleicao);
  const m: Mandato = {
    versao: 1,
    semente: contexto.governo.semente,
    mes: 1,
    acoes: ACOES_POR_MES,
    fase: "gestao",
    economia: {
      pib: 1.8, ipca: 5.2, selic: 13.5, dolar: 5.34, desemprego: 6, divida: 80, primario: -0.5, carga: 0,
      renda: 100, investimento: 17, exportacoes: 340, reservas: 350, confianca: 50 + (balanco.credibilidade - 50) * 0.4,
      pobreza: 23, desigualdade: 0.5, informalidade: 38,
    },
    sociedade: { saude: 50, educacao: 48, seguranca: 42, qualidade: 52, confianca: 45, ambiente: 50 },
    seguranca: { homicidios: 20, roubos: 100, crime: 60, trafico: 60, mulher: 100, prisional: 140, eficiencia: 50, defesa: 55, fronteiras: 50 },
    aprovacao: balanco.aprovacao,
    congresso: 50 + (balanco.governabilidade - 50) * 0.3,
    gestao: balanco.gestao,
    grupos: Object.fromEntries(GRUPOS_SOCIAIS.map((g) => [g, 0])),
    obras: [],
    estatais: Object.fromEntries(
      ESTATAIS.map((e) => [e.id, { controle: e.listada ? "capital-aberto" : "estatal", gestao: "politica", presidente: null } as SituacaoEstatal]),
    ),
    relacoes: Object.fromEntries(PARCEIROS.map((p) => [p, 60])),
    orcamento: { ...contexto.governo.orcamento },
    projetosAprovados: [],
    votacoes: [],
    indicados: [],
    pendentes: [],
    pendencia: null,
    noticias: [],
    historico: [],
    eventosVistos: [],
    reeleicao: null,
    inicio: {} as Mandato["inicio"],
    vagasReabertas: [],
    medidas: [],
    mps: [],
    resumoMes: null,
  };
  m.inicio = structuredClone({
    economia: m.economia,
    sociedade: m.sociedade,
    seguranca: m.seguranca,
    aprovacao: m.aprovacao,
    congresso: m.congresso,
  });
  m.historico.push({ ...registrar(m), mes: 0 });
  noticiar(m, `Posse: o governo começa com ${m.aprovacao}% de aprovação.`);
  void campanha;
  return m;
}

const RELACAO_POR_APELIDO: Record<string, string> = { EUA: "Estados Unidos" };

function aplicar(m: Mandato, efeito: Efeito) {
  for (const [chave, valor] of Object.entries(efeito)) {
    const [grupo, ...resto] = chave.split(".");
    const campo = resto.join(".");
    if (grupo === "e") m.economia[campo as keyof Economia] += valor;
    else if (grupo === "s") m.sociedade[campo as keyof Sociedade] = limitar(m.sociedade[campo as keyof Sociedade] + valor);
    else if (grupo === "p") m.seguranca[campo as keyof Seguranca] = Math.max(0, m.seguranca[campo as keyof Seguranca] + valor);
    else if (grupo === "r") {
      const parceiro = RELACAO_POR_APELIDO[campo] ?? campo;
      m.relacoes[parceiro] = limitar((m.relacoes[parceiro] ?? 60) + valor);
    } else if (chave === "aprovacao") m.aprovacao = limitar(m.aprovacao + valor);
    else if (chave === "congresso") m.congresso = limitar(m.congresso + valor);
  }
}

export type Medida = {
  titulo: string;
  descricao: string;
  instrumento: string;
  area: string;
  objetivo: string;
  intensidade: number;
};

export function calcularMedida(medida: Medida) {
  const area = AREAS_MEDIDA.find((a) => a.id === medida.area) ?? AREAS_MEDIDA[0];
  const objetivo = OBJETIVOS_MEDIDA.find((o) => o.id === medida.objetivo) ?? OBJETIVOS_MEDIDA[0];
  const instrumento = INSTRUMENTOS.find((i) => i.id === medida.instrumento) ?? INSTRUMENTOS[2];
  const peso = medida.intensidade * instrumento.forca;
  const efeito: Efeito = {
    [area.campo]: area.escala * objetivo.ganho * peso,
    "e.primario": -0.06 * objetivo.custo * peso,
    aprovacao: objetivo.aprovacao * peso,
    "e.confianca": objetivo.confianca * medida.intensidade,
  };
  return { efeito, area, objetivo, instrumento };
}

export type Acao =
  | { tipo: "projeto"; id: string }
  | { tipo: "obra"; modelo: string; uf: string }
  | { tipo: "obra-real"; id: string }
  | { tipo: "obra-mudar"; id: string; para: "suspender" | "retomar" | "cancelar" | "ampliar" }
  | { tipo: "estatal"; id: string; acao: "privatizar" | "abrir-capital" }
  | { tipo: "estatal-presidente"; id: string; nome: string; tecnico: boolean }
  | { tipo: "medida"; medida: Medida }
  | { tipo: "pronunciamento"; tom: string; texto: string }
  | { tipo: "diplomacia"; parceiro: string; acao: string }
  | { tipo: "seguranca"; id: string }
  | { tipo: "divida"; acao: "alongar" | "amortizar" | "emitir" };

function bonusDoCongresso(m: Mandato) {
  return (m.congresso - 50) / 250;
}

function votar(m: Mandato, c: Contexto, proposta: { economia: number; camara: number | null; senado: number | null }, extra = 0) {
  const resultado = votarProposta({ ...c.governo, semente: m.semente }, c.candidato, proposta, bonusDoCongresso(m) + extra);
  m.semente = resultado.semente;
  return resultado;
}

export function obrasAtivas(m: Mandato) {
  return m.obras.filter((o) => o.situacao === "andamento" || o.situacao === "suspensa");
}

export function podeIniciarObra(m: Mandato) {
  return obrasAtivas(m).length < LIMITE_OBRAS;
}

function abrirVotacao(m: Mandato, proposta: PropostaEmVoto) {
  m.pendencia = { tipo: "votacao", proposta, concessoes: { emendas: 0, cargos: 0, texto: 0 }, resultado: null };
  m.fase = "pendencia";
}

const LIMITE_CONCESSOES = 2;

function bonusDasConcessoes(c: Concessoes) {
  return c.emendas * 0.03 + c.cargos * 0.03 + c.texto * 0.04;
}

export function estimativaDeVotos(m: Mandato, contexto: Contexto) {
  if (m.pendencia?.tipo !== "votacao") return null;
  const { proposta, concessoes } = m.pendencia;
  return estimarVotos(contexto.governo, contexto.candidato, proposta, bonusDoCongresso(m) + bonusDasConcessoes(concessoes));
}

export function negociar(original: Mandato, tipo: keyof Concessoes): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "votacao" || m.pendencia.resultado) return m;
  if (m.pendencia.concessoes[tipo] < LIMITE_CONCESSOES) m.pendencia.concessoes[tipo] += 1;
  return m;
}

export function colocarEmVotacao(original: Mandato, contexto: Contexto): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "votacao" || m.pendencia.resultado) return m;
  const { proposta, concessoes } = m.pendencia;
  const resultado = votar(m, contexto, proposta, bonusDasConcessoes(concessoes));
  m.pendencia.resultado = { aprovado: resultado.aprovado, camara: resultado.camara, senado: resultado.senado };
  m.votacoes.unshift({ mes: m.mes, projeto: proposta.nome, aprovado: resultado.aprovado, camara: resultado.camara, senado: resultado.senado });
  aplicar(m, { "e.primario": -0.04 * concessoes.emendas, "s.confianca": -concessoes.cargos });

  const registro = m.medidas.find((medida) => medida.id === proposta.medidaId);
  if (registro) registro.situacao = resultado.aprovado ? "Aprovada" : "Rejeitada";

  if (resultado.aprovado) {
    const fator = Math.pow(0.8, concessoes.texto);
    const efeito = Object.fromEntries(Object.entries(proposta.efeito).map(([k, v]) => [k, v * fator]));
    if (proposta.projetoId) m.projetosAprovados.push(proposta.projetoId);
    if (proposta.estatal) m.estatais[proposta.estatal.id].controle = proposta.estatal.controle;
    aplicar(m, { congresso: 1 });
    if (proposta.atraso > 0) {
      m.pendentes.push({ mes: m.mes + proposta.atraso, efeito, texto: `Os efeitos de "${proposta.nome}" chegaram.` });
      noticiar(m, `Congresso aprova: ${proposta.nome}. Os efeitos devem aparecer em cerca de ${proposta.atraso} meses.`);
    } else {
      aplicar(m, efeito);
      noticiar(m, `Congresso aprova: ${proposta.nome}.`);
    }
  } else {
    aplicar(m, { congresso: -3, aprovacao: -0.5 });
    noticiar(m, `Derrota no Congresso: ${proposta.nome}.`);
  }
  return m;
}

export function executar(original: Mandato, contexto: Contexto, acao: Acao): Mandato {
  const m = structuredClone(original);
  if (m.acoes <= 0 || m.fase !== "gestao") return m;

  if (acao.tipo === "projeto") {
    const projeto = PROJETOS_MANDATO.find((p) => p.id === acao.id);
    if (!projeto || m.projetosAprovados.includes(projeto.id)) return m;
    abrirVotacao(m, {
      nome: projeto.nome, tipo: projeto.tipo, economia: projeto.economia, camara: projeto.camara,
      senado: projeto.senado, atraso: projeto.atraso, efeito: projeto.efeito, projetoId: projeto.id,
    });
  }

  if (acao.tipo === "medida") {
    const { efeito, instrumento } = calcularMedida(acao.medida);
    const { titulo, descricao } = acao.medida;
    const id = m.medidas.length + 1;
    const economia = OBJETIVOS_MEDIDA.find((o) => o.id === acao.medida.objetivo)?.economia ?? 50;
    const registro = { id, mes: m.mes, titulo, descricao, instrumento: instrumento.nome, situacao: "Em andamento" };
    m.medidas.unshift(registro);
    if (instrumento.id === "decreto") {
      // Decreto amplo tem mais chance de parar na Justiça.
      if (sortear(m) < acao.medida.intensidade * 0.12) {
        registro.situacao = "Suspensa pelo STF";
        aplicar(m, { aprovacao: -0.5, "s.confianca": -1 });
        noticiar(m, `STF suspende o decreto: ${titulo}.`);
      } else {
        registro.situacao = "Em vigor";
        m.pendentes.push({ mes: m.mes + instrumento.atraso, efeito, texto: `O decreto "${titulo}" começa a dar resultado.` });
        noticiar(m, `Decreto assinado: ${titulo}.`);
      }
    } else if (instrumento.id === "mp") {
      registro.situacao = "Em vigor, aguardando o Congresso";
      aplicar(m, efeito);
      m.mps.push({ mes: m.mes + 4, medidaId: id, titulo, economia, efeito });
      noticiar(m, `Medida provisória publicada: ${titulo}.`);
    } else {
      abrirVotacao(m, {
        nome: titulo, tipo: instrumento.nome, economia, camara: instrumento.camara, senado: instrumento.senado,
        atraso: instrumento.atraso, efeito, medidaId: id,
      });
    }
  }

  if (acao.tipo === "pronunciamento") {
    const tom = TONS_PRONUNCIAMENTO.find((t) => t.id === acao.tom) ?? TONS_PRONUNCIAMENTO[0];
    aplicar(m, tom.efeito);
    noticiar(m, acao.texto.trim() ? `Pronunciamento: "${acao.texto.trim()}"` : `Pronunciamento em rede nacional: ${tom.nome.toLowerCase()}.`);
  }

  if (acao.tipo === "estatal-presidente") {
    const dados = ESTATAIS.find((e) => e.id === acao.id);
    const estatal = m.estatais[acao.id];
    if (!dados || !estatal) return m;
    estatal.presidente = acao.nome;
    estatal.gestao = acao.tecnico ? "tecnica" : "politica";
    aplicar(m, acao.tecnico ? { "e.confianca": 1, congresso: -1 } : { "e.confianca": -1.5, congresso: 2 });
    noticiar(m, `${acao.nome} assume a presidência: ${dados.nome}.`);
  }

  if (acao.tipo === "obra") {
    const modelo = MODELOS_OBRA.find((o) => o.id === acao.modelo);
    if (!modelo || !podeIniciarObra(m)) return m;
    m.obras.push({
      id: `obra-${m.mes}-${m.obras.length}`, nome: `${modelo.nome} (${acao.uf})`, categoria: modelo.categoria,
      uf: acao.uf, custo: modelo.custo, meses: modelo.meses, execucao: 0, licenca: false, contrato: false,
      situacao: "andamento", real: false, efeito: modelo.efeito,
    });
    noticiar(m, `Governo lança: ${modelo.nome} (${acao.uf}).`);
  }

  if (acao.tipo === "obra-real") {
    const real = OBRAS_REAIS.find((o) => o.id === acao.id);
    if (!real || !podeIniciarObra(m) || m.obras.some((o) => o.id === real.id)) return m;
    m.obras.push({
      id: real.id, nome: real.nome, categoria: real.categoria, uf: real.uf, custo: real.custo, meses: real.meses,
      execucao: real.execucao, licenca: real.licenca, contrato: real.execucao > 0, situacao: "andamento",
      real: true, dataBase: real.dataBase, efeito: real.efeito,
    });
    noticiar(m, `Governo prioriza: ${real.nome}.`);
  }

  if (acao.tipo === "obra-mudar") {
    const obra = m.obras.find((o) => o.id === acao.id);
    if (!obra) return m;
    if (acao.para === "suspender") obra.situacao = "suspensa";
    if (acao.para === "retomar") obra.situacao = "andamento";
    if (acao.para === "cancelar") {
      obra.situacao = "cancelada";
      aplicar(m, { aprovacao: -0.5 });
    }
    if (acao.para === "ampliar") {
      obra.custo *= 1.25;
      obra.meses += 6;
      obra.efeito = Object.fromEntries(Object.entries(obra.efeito).map(([k, v]) => [k, v * 1.4]));
    }
    noticiar(m, `Obra: ${obra.nome} (${acao.para}).`);
  }

  if (acao.tipo === "estatal") {
    const dados = ESTATAIS.find((e) => e.id === acao.id);
    const estatal = m.estatais[acao.id];
    if (!dados || !estatal) return m;
    if (estatal.controle === "privatizada") return m;
    const privatizar = acao.acao === "privatizar";
    const parte = privatizar ? dados.valor : dados.valor * 0.3;
    abrirVotacao(m, {
      nome: privatizar ? `Privatização: ${dados.nome}` : `Abertura de capital: ${dados.nome}`,
      tipo: "Projeto de lei", economia: 82, camara: null, senado: null, atraso: 0,
      efeito: { "e.divida": -parte, "e.confianca": 2, aprovacao: privatizar ? -2 : -0.5 },
      estatal: { id: dados.id, controle: privatizar ? "privatizada" : "capital-aberto" },
    });
  }

  if (acao.tipo === "diplomacia") {
    const item = ACOES_DIPLOMATICAS.find((a) => a.id === acao.acao);
    if (!item) return m;
    m.relacoes[acao.parceiro] = limitar(m.relacoes[acao.parceiro] + item.relacao);
    if (acao.parceiro === "Estados Unidos") m.relacoes.China = limitar(m.relacoes.China - 2);
    if (acao.parceiro === "China") m.relacoes["Estados Unidos"] = limitar(m.relacoes["Estados Unidos"] - 2);
    aplicar(m, item.efeito);
    noticiar(m, `${item.nome} com ${acao.parceiro}.`);
  }

  if (acao.tipo === "seguranca") {
    const programa = PROGRAMAS_SEGURANCA.find((p) => p.id === acao.id);
    if (!programa) return m;
    m.pendentes.push({ mes: m.mes + 4, efeito: programa.efeito, texto: `Primeiros resultados: ${programa.nome}.` });
    noticiar(m, `Lançado: ${programa.nome}.`);
  }

  if (acao.tipo === "divida") {
    if (acao.acao === "alongar") {
      aplicar(m, { "e.confianca": 2, "e.primario": -0.02 });
      noticiar(m, "Tesouro alonga o prazo da dívida.");
    }
    if (acao.acao === "amortizar") {
      aplicar(m, { "e.divida": -0.3, "e.primario": -0.1, "e.confianca": 1 });
      noticiar(m, "Tesouro antecipa o pagamento de parte da dívida.");
    }
    if (acao.acao === "emitir") {
      aplicar(m, { "e.divida": 0.4, "e.primario": 0.1, "e.confianca": -1 });
      noticiar(m, "Tesouro emite novos títulos para reforçar o caixa.");
    }
  }

  m.acoes -= 1;
  return m;
}

export function custoAnualDasObras(m: Mandato) {
  return m.obras
    .filter((o) => o.situacao === "andamento" && o.licenca)
    .reduce((soma, o) => soma + (o.custo / o.meses) * 12, 0);
}

function avancarObras(m: Mandato) {
  for (const obra of m.obras) {
    if (obra.situacao !== "andamento") continue;
    if (!obra.licenca) {
      if (sortear(m) < 0.18) {
        obra.licenca = true;
        noticiar(m, `Licença liberada: ${obra.nome}.`);
      }
      continue;
    }
    if (!obra.contrato) {
      if (sortear(m) < 0.3) {
        obra.contrato = true;
        noticiar(m, `Contrato assinado: ${obra.nome}.`);
      }
      continue;
    }
    obra.execucao = Math.min(100, obra.execucao + (100 / obra.meses) * (0.75 + sortear(m) * 0.4));
    if (sortear(m) < 0.012) noticiar(m, `Fiscalização aponta atraso em ${obra.nome}.`);
    if (obra.execucao >= 100) {
      obra.situacao = "concluida";
      aplicar(m, { ...obra.efeito, aprovacao: (obra.efeito.aprovacao ?? 0) + 0.5 });
      noticiar(m, `Obra entregue: ${obra.nome}.`);
    }
  }
}

function nivel(m: Mandato, area: string) {
  return m.orcamento[area] ?? 3;
}

function simularMes(m: Mandato) {
  const e = m.economia;
  const s = m.sociedade;
  const p = m.seguranca;
  const excesso = (custoDoOrcamentoDoMandato(m) - TETO_ORCAMENTO) / 100;
  const obrasEmExecucao = m.obras.filter((o) => o.situacao === "andamento" && o.contrato).length;

  // Crescimento, inflação e juros andam devagar: as decisões demoram a aparecer.
  const pibAlvo = 2 + (e.confianca - 50) * 0.03 - (e.selic - 9) * 0.12 + obrasEmExecucao * 0.06 + (e.investimento - 17) * 0.15 - e.carga * 0.15;
  e.pib = aproximar(e.pib, pibAlvo, 0.12) + ruido(m, 0.12);
  const ipcaAlvo = 3.5 + (e.pib - 2) * 0.5 + (e.dolar - 5.3) * 0.6 - (e.selic - 10) * 0.25 + excesso * 0.5;
  e.ipca = limitar(aproximar(e.ipca, ipcaAlvo, 0.1) + ruido(m, 0.08), -1, 40);
  // O Banco Central decide sozinho, a cada dois meses, para levar a inflação à meta.
  if (m.mes % 2 === 0) {
    const selicAlvo = 9 + (e.ipca - 3) * 1.5;
    e.selic = limitar(Math.round(aproximar(e.selic, selicAlvo, 0.2) * 4) / 4, 2, 30);
  }
  e.dolar = limitar(e.dolar * (1 + (e.ipca - 3.5) * 0.001 - (e.confianca - 50) * 0.0004 + (e.primario < -1.5 ? 0.002 : 0) + ruido(m, 0.008)), 3, 12);
  e.desemprego = limitar(e.desemprego - (e.pib - 2) * 0.03 + ruido(m, 0.04), 3, 20);
  const primarioAlvo = -0.5 - excesso * 1.2 + e.carga * 0.3 + (e.pib - 2) * 0.1 - custoAnualDasObras(m) * 0.012;
  e.primario = aproximar(e.primario, primarioAlvo, 0.08);
  e.divida = limitar(e.divida + ((e.selic - e.ipca - e.pib) * 0.8 - e.primario) / 12, 20, 200);
  const confiancaAlvo = 50 + e.primario * 6 - Math.max(0, e.divida - 85) * 0.8 - Math.max(0, e.ipca - 5) * 3;
  e.confianca = limitar(aproximar(e.confianca, confiancaAlvo, 0.06));
  e.renda *= 1 + (e.pib - 1) * 0.0008;
  e.investimento = limitar(aproximar(e.investimento, 15.5 + (e.confianca - 50) * 0.05, 0.02), 10, 28);
  e.exportacoes *= 1 + (e.dolar - 5) * 0.0004 + 0.002;
  e.reservas = limitar(e.reservas + (e.confianca - 50) * 0.05, 100, 600);
  e.pobreza = limitar(e.pobreza - (nivel(m, "social") - 3) * 0.04 - (e.pib - 2) * 0.02 + (e.desemprego - 6) * 0.02, 2, 50);
  e.desigualdade = limitar(e.desigualdade - (nivel(m, "social") - 3) * 0.0004, 0.35, 0.65);
  e.informalidade = limitar(e.informalidade + (e.desemprego - 6) * 0.01, 25, 55);

  const gestao = (m.gestao - 60) * 0.1;
  s.saude = limitar(aproximar(s.saude, 35 + nivel(m, "saude") * 8 + gestao, 0.03));
  s.educacao = limitar(aproximar(s.educacao, 33 + nivel(m, "educacao") * 8 + gestao, 0.025));
  s.ambiente = limitar(aproximar(s.ambiente, 38 + nivel(m, "ambiente") * 6, 0.02));
  p.homicidios = limitar(p.homicidios + (3 - nivel(m, "seguranca")) * 0.01 + (p.crime - 55) * 0.001 - (p.eficiencia - 50) * 0.001, 5, 40);
  p.roubos = limitar(p.roubos + (e.desemprego - 6) * 0.08 - (p.eficiencia - 50) * 0.02, 40, 180, );
  p.eficiencia = limitar(aproximar(p.eficiencia, 38 + nivel(m, "seguranca") * 6, 0.02));
  p.defesa = limitar(aproximar(p.defesa, 40 + nivel(m, "defesa") * 6, 0.02));
  s.seguranca = limitar(100 - p.homicidios * 2 - p.crime * 0.25);
  s.qualidade = limitar(aproximar(s.qualidade, (s.saude + s.educacao + s.seguranca) / 3 + (e.renda - 100) * 0.4 + 8 - e.pobreza * 0.3, 0.03));
  const emOrcamento = (nivel(m, "social") + nivel(m, "saude") + nivel(m, "educacao") - 9) * 0.8;

  const aprovacaoAlvo =
    42 + (e.pib - 2) * 3 - (e.ipca - 4.5) * 2.5 - (e.desemprego - 6) * 1.5 + (s.qualidade - 50) * 0.4 + emOrcamento;
  // O desgaste natural do governo pesa a cada ano.
  m.aprovacao = limitar(aproximar(m.aprovacao, aprovacaoAlvo, 0.1) - 0.08 + ruido(m, 0.4));
  m.congresso = limitar(aproximar(m.congresso, 45 + (m.aprovacao - 40) * 0.4, 0.04));

  m.grupos["Trabalhadores"] = (6 - e.desemprego) * 1.5 + (nivel(m, "social") - 3) * 2;
  m.grupos["Classe média"] = (4.5 - e.ipca) * 2;
  m.grupos["Empresários"] = (e.confianca - 50) * 0.6 - e.carga * 3;
  m.grupos["Agronegócio"] = (nivel(m, "agricultura") - 3) * 3 + (e.dolar - 5.3) * 2;
  m.grupos["Evangélicos"] = (s.seguranca - 45) * 0.2;
  m.grupos["Jovens"] = (s.educacao - 50) * 0.4 + (6 - e.desemprego) * 1.2;
  m.grupos["Servidores"] = (nivel(m, "educacao") + nivel(m, "saude") - 6) * 2;
}

export function custoDoOrcamentoDoMandato(m: Mandato) {
  return AREAS.reduce((soma, area) => soma + area.custo * (m.orcamento[area.id] ?? 3), 0);
}

export function aprovacaoDoGrupo(m: Mandato, grupo: string) {
  return Math.round(limitar(m.aprovacao + (m.grupos[grupo] ?? 0)));
}

export function encerrarMes(original: Mandato, contexto: Contexto): Mandato {
  const m = structuredClone(original);
  if (m.fase !== "gestao") return m;
  const anterior = m.historico[m.historico.length - 1];

  for (const mp of m.mps.filter((item) => item.mes <= m.mes)) {
    const resultado = votar(m, contexto, { economia: mp.economia, camara: null, senado: null });
    const registro = m.medidas.find((medida) => medida.id === mp.medidaId);
    if (resultado.aprovado) {
      if (registro) registro.situacao = "Convertida em lei";
      noticiar(m, `Congresso converte em lei: ${mp.titulo}.`);
    } else {
      if (registro) registro.situacao = "Derrubada pelo Congresso";
      aplicar(m, Object.fromEntries(Object.entries(mp.efeito).map(([k, v]) => [k, -v])));
      aplicar(m, { congresso: -2 });
      noticiar(m, `Congresso derruba a medida provisória: ${mp.titulo}.`);
    }
  }
  m.mps = m.mps.filter((item) => item.mes > m.mes);

  for (const item of m.pendentes.filter((p) => p.mes <= m.mes)) {
    aplicar(m, item.efeito);
    noticiar(m, item.texto);
  }
  m.pendentes = m.pendentes.filter((p) => p.mes > m.mes);

  avancarObras(m);
  simularMes(m);
  m.aprovacao = Math.round(m.aprovacao * 10) / 10;
  m.historico.push(registrar(m));
  m.resumoMes = {
    mes: m.mes,
    aprovacao: m.aprovacao - anterior.aprovacao,
    pib: m.economia.pib - anterior.pib,
    ipca: m.economia.ipca - anterior.ipca,
    desemprego: m.economia.desemprego - anterior.desemprego,
  };

  if (m.mes >= MESES) {
    const votos = limitar(31 + m.aprovacao * 0.42 + ruido(m, 3), 20, 75);
    m.reeleicao = { votos, venceu: votos > 50 };
    m.fase = "fim";
    return m;
  }

  m.mes += 1;
  m.acoes = ACOES_POR_MES;

  const reaberta = m.vagasReabertas.find((v) => v.mes === m.mes);
  const vaga = reaberta ? VAGAS.find((v) => v.id === reaberta.id) : VAGAS.find((v) => v.mes === m.mes);
  m.vagasReabertas = m.vagasReabertas.filter((v) => v.mes > m.mes);
  if (vaga) {
    m.pendencia = { tipo: "indicacao", vaga };
    m.fase = "pendencia";
    return m;
  }
  if (sortear(m) < 0.3) {
    const livres = EVENTOS_MANDATO.filter((e) => !m.eventosVistos.slice(-6).includes(e.id));
    const evento = livres[Math.floor(sortear(m) * livres.length)];
    m.eventosVistos.push(evento.id);
    m.pendencia = { tipo: "evento", evento };
    m.fase = "pendencia";
  }
  return m;
}

export function responderEvento(original: Mandato, opcao: number): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "evento") return m;
  const { evento } = m.pendencia;
  aplicar(m, evento.opcoes[opcao].efeito);
  noticiar(m, `${evento.titulo}: ${evento.opcoes[opcao].texto}`);
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

// Político indicado agrada a base, mas pesa na confiança nas instituições.
export function indicacaoPolitica(pessoa: Pessoa, contexto: Contexto): OpcaoIndicacao {
  const naBase = pessoa.sigla ? pastasDoPartido(contexto.governo, pessoa.sigla).length > 0 : false;
  return {
    nome: pessoa.nome,
    perfil: pessoa.cargo,
    bonus: naBase ? 0.04 : 0,
    efeito: { "s.confianca": -2, congresso: 1 },
  };
}

export function indicacaoLivre(nome: string): OpcaoIndicacao {
  return { nome, perfil: "Nome escolhido pelo presidente.", bonus: 0, efeito: {} };
}

export function indicar(original: Mandato, contexto: Contexto, escolhido: OpcaoIndicacao): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "indicacao") return m;
  const { vaga } = m.pendencia;
  const resultado = votarIndicacao(
    { ...contexto.governo, semente: m.semente },
    contexto.candidato,
    bonusDoCongresso(m) + escolhido.bonus,
  );
  m.semente = resultado.semente;
  const { senado } = resultado;
  m.indicados.unshift({ vaga: vaga.id, cargo: vaga.cargo, nome: escolhido.nome, mes: m.mes, aprovado: senado.aprovado });
  if (senado.aprovado) {
    aplicar(m, escolhido.efeito);
    noticiar(m, `Senado aprova ${escolhido.nome}: ${vaga.cargo}.`);
  } else {
    aplicar(m, { congresso: -5, aprovacao: -1 });
    noticiar(m, `Senado rejeita ${escolhido.nome}: ${vaga.cargo}.`);
    if (m.mes < MESES) m.vagasReabertas.push({ id: vaga.id, mes: m.mes + 1 });
  }
  m.pendencia = {
    tipo: "resultado-indicacao",
    titulo: senado.aprovado ? `Senado aprova ${escolhido.nome}` : `Senado rejeita ${escolhido.nome}`,
    texto: vaga.cargo,
    sim: senado.sim,
    nao: senado.nao,
  };
  return m;
}

export function fecharPendencia(original: Mandato): Mandato {
  const m = structuredClone(original);
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

export function orcamentoAberto(m: Mandato) {
  return m.mes % 12 === 1;
}

export function mudarOrcamento(original: Mandato, area: string, valor: number): Mandato {
  const m = structuredClone(original);
  if (orcamentoAberto(m)) m.orcamento[area] = valor;
  return m;
}

export function custoInicial(g: Governo) {
  return custoDoOrcamento(g);
}

export type Promessa = { texto: string; cumprida: boolean };

const METAS_DE_PROMESSA: Record<string, (m: Mandato) => boolean> = {
  "Ampliar o atendimento do SUS": (m) => m.sociedade.saude >= 60,
  "Escola em tempo integral": (m) => m.projetosAprovados.includes("tempo-integral") || m.sociedade.educacao >= 60,
  "Plano nacional contra o crime organizado": (m) => m.seguranca.crime <= 50,
  "Programa de geração de empregos": (m) => m.economia.desemprego <= 5.5,
  "Reduzir impostos sobre o consumo": (m) => m.projetosAprovados.includes("reduzir-consumo"),
  "Reforçar a transferência de renda": (m) => m.projetosAprovados.includes("renda"),
  "Transição energética e proteção da Amazônia": (m) => m.projetosAprovados.includes("transicao"),
  "Grande plano de obras": (m) => m.obras.filter((o) => o.situacao === "concluida").length >= 3,
};

export function promessasDoMandato(m: Mandato, campanha: Campanha): Promessa[] {
  return campanha.promessas.map((texto) => ({ texto, cumprida: METAS_DE_PROMESSA[texto]?.(m) ?? false }));
}
