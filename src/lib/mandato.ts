import type { Campanha } from "./campanha";
import type { Candidato } from "./candidato";
import type { TipoCena } from "./cenas";
import { CARTA_RUAS, CARTAS, COMENTARIOS, CONQUISTAS, METAS_BASE, PERSONAGENS, TITULOS_LEGADO, USUARIOS, type Carta } from "./drama";
import type { Eleicao } from "./eleicao";
import { dadosDoVice, extremosOpostos, MOTIVO_EXTREMOS } from "./candidato";
import { AREAS, atributosDe, calcularBalanco, MINISTERIOS, custoDoOrcamento, estimarVotos, posicaoDoPartidoNoCongresso, reacoesDosPartidos, ministeriosAtivos, pastasDoPartido, pessoaPorId, TETO_ORCAMENTO, votarIndicacao, votarProposta, type Casa, type Governo } from "./governo";
import { POLITICOS, semAcento, type Pessoa } from "./pessoas";
import { noEstado } from "./estados";
import { CRISES, desfechoDaCrise, NOME_DESFECHO } from "./crises";
import { montarDialogo, type IdDialogo } from "./dialogos";
import { INDICADOR_DA_PASTA, PRAZO_DA_META, type MetaDoMinistro } from "./metas-ministros";
import {
  AFRONTAR_STF,
  DECISOES_DO_STF,
  GLO,
  INTERVENCAO,
  LIMITE_PROGRAMAS,
  PASSOS_DO_GOLPE,
  PROGRAMAS_ECONOMICOS,
  PROJETOS_DO_CONGRESSO,
  type DecisaoDoSTF,
  type ProjetoDoCongresso,
} from "./poderes";
import {
  ACOES_DIPLOMATICAS,
  AREAS_MEDIDA,
  ESTATAIS,
  DEFESAS_IMPEACHMENT,
  EVENTO_MESA,
  EVENTOS_MANDATO,
  GRUPOS_SOCIAIS,
  INSTRUMENTOS,
  MESES_DA_MESA,
  MODELOS_OBRA,
  OBJETIVOS_MEDIDA,
  OBRAS_REAIS,
  PARCEIROS,
  PROGRAMAS_SEGURANCA,
  PROJETOS_MANDATO,
  TONS_PRONUNCIAMENTO,
  STF,
  VAGAS,
  type Efeito,
  type EventoMandato,
  type OpcaoIndicacao,
  type Vaga,
} from "./mandato-dados";

export const MESES = 48;
export const ACOES_POR_MES = 4;
export const LIMITE_OBRAS = 12;

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
  controle: "estatal" | "capital-aberto" | "privatizada" | "fundida";
  gestao: "politica" | "tecnica";
  presidente: string | null;
  vaga?: boolean;
};

export type Nomeacao = { nome: string; tipo: "ministerio" | "estatal" | "indicacao"; id: string };

export type Registro = {
  mes: number; aprovacao: number; pib: number; ipca: number; selic: number; desemprego: number; divida: number; dolar: number;
};

export type Comentario = { usuario: string; texto: string };

export type MetaAtiva = { id: string; texto: string; premio: string; prazo: number };

export type Drama = {
  flags: string[];
  agenda: { id: string; mes: number }[];
  vistas: string[];
  pressao: number;
  metas: MetaAtiva[];
  metasFeitas: string[];
  metasFalhas: string[];
  conquistas: string[];
  novidade: string | null;
  feed: (Comentario & { mes: number })[];
  manchete: { titulo: string; subtitulo: string } | null;
  urgentesOk: number;
  finais: number;
};

export function criarDrama(): Drama {
  return {
    flags: [], agenda: [], vistas: [], pressao: 30, metas: [], metasFeitas: [], metasFalhas: [],
    conquistas: [], novidade: null, feed: [], manchete: null, urgentesOk: 0, finais: 0,
  };
}

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
  novaEstatal?: string;
  fusao?: { de: string; para: string };
  programaId?: string;
};

export type Concessoes = { emendas: number; cargos: number; texto: number; lideres?: string[] };

export type ResultadoVoto = { aprovado: boolean; camara: Casa; senado: Casa | null };

export type Pendencia =
  | { tipo: "evento"; evento: EventoMandato }
  | { tipo: "impeachment" }
  | { tipo: "carta"; carta: Carta }
  | { tipo: "carta-resposta"; quem: string; resposta: string; mudancas: { texto: string; bom: boolean; sobe?: boolean }[]; comentarios: Comentario[] }
  | { tipo: "votacao"; proposta: PropostaEmVoto; concessoes: Concessoes; resultado: ResultadoVoto | null }
  | { tipo: "indicacao"; vaga: Vaga }
  | { tipo: "resultado-indicacao"; titulo: string; texto: string; sim: number; nao: number }
  | { tipo: "sancao"; projeto: ProjetoDoCongresso }
  | { tipo: "stf"; decisao: DecisaoDoSTF }
  | { tipo: "golpe"; passo: number; chance: number }
  | { tipo: "crise" }
  | { tipo: "dialogo"; id: IdDialogo; contexto: string | null }
  | { tipo: "data-civica"; data: "independencia" | "bandeira" }
  | { tipo: "meta-ministro"; ministerio: string; texto: string }
  | { tipo: "crise-resultado"; titulo: string; texto: string; antes: number; depois: number; reacoes: { quem: string; texto: string }[]; desfecho: Desfecho | null; saiu: string | null }
  | { tipo: "resultado"; sobretitulo: string; titulo: string; texto: string; cena: TipoCena; placar?: { rotulo: string; sim: number; nao: number }[] };

export type ProgramaAtivo = { id: string; nome: string; inicio: number; fim: number };

export type CriseAtiva = { id: string; fase: number; gravidade: number; proxima: number; ignorados: Record<string, number> };

export type Desfecho = "contida" | "arrastada" | "desastre";

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
  mps: { mes: number; medidaId: number; titulo: string; economia: number; efeito: Efeito; programaId?: string }[];
  resumoMes: { mes: number; aprovacao: number; pib: number; ipca: number; desemprego: number; motivos?: Motivo[] } | null;
  limite: number;
  cassado: boolean;
  impeachmentMes: number;
  estataisNovas: { id: string; nome: string; listada: boolean; valor: number }[];
  drama: Drama;
  pessoaReal?: boolean;
  nomeacao?: Nomeacao | null;
  cena?: TipoCena | null;
  programas?: ProgramaAtivo[];
  vetos?: { id: string; mes: number; parcial: boolean }[];
  projetosDoCongresso?: string[];
  golpe?: "fracassou" | "venceu" | null;
  crise?: CriseAtiva | null;
  crises?: { id: string; nome: string; desfecho: Desfecho; mes: number }[];
  proximaCrise?: number;
  posses?: number[];
  metasMinistros?: MetaDoMinistro[];
  metasBatidas?: number;
  decisoes?: Decisao[];
};

// Cada decisão fica registrada com o que mudou na hora e o que ainda vai chegar.
export type Decisao = { mes: number; texto: string; mudancas: Record<string, number>; futuro: string | null };
export type Motivo = { indicador: string; texto: string; valor: number };

export const INDICADORES_DA_DECISAO: { chave: string; nome: string; menor: boolean; casas: number }[] = [
  { chave: "aprovacao", nome: "Aprovação", menor: false, casas: 1 },
  { chave: "congresso", nome: "Congresso", menor: false, casas: 1 },
  { chave: "e.pib", nome: "PIB", menor: false, casas: 2 },
  { chave: "e.ipca", nome: "Inflação", menor: true, casas: 2 },
  { chave: "e.desemprego", nome: "Desemprego", menor: true, casas: 2 },
];

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
      pib: 1.8, ipca: 5.2, selic: 13.5, dolar: 5.34, desemprego: 6, divida: 80, primario: -0.2, carga: 0,
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
    limite: MESES,
    cassado: false,
    impeachmentMes: 0,
    estataisNovas: [],
    drama: criarDrama(),
    pessoaReal: Boolean(contexto.candidato.pessoaReal),
  };
  preencherMetas(m);
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
    } else if (chave === "pressao") m.drama.pressao = limitar(m.drama.pressao + valor);
    else if (chave === "aprovacao") m.aprovacao = limitar(m.aprovacao + valor);
    else if (chave === "congresso") m.congresso = limitar(m.congresso + valor);
  }
}

const PREMIOS: Record<string, Efeito> = {
  inflacao: { aprovacao: 4 }, desemprego: { aprovacao: 4 }, pib: { aprovacao: 4 }, selic: { "e.confianca": 5 },
  aprovacao: { congresso: 5 }, obras: { aprovacao: 3 }, leis: { congresso: 5 }, pobreza: { aprovacao: 4 },
  diplomacia: { "e.exportacoes": 8 }, saude: { aprovacao: 3 },
};

const META_CUMPRIDA: Record<string, (m: Mandato) => boolean> = {
  inflacao: (m) => m.economia.ipca < 4,
  desemprego: (m) => m.economia.desemprego < 5.5,
  pib: (m) => m.economia.pib > 2.5,
  selic: (m) => m.economia.selic < 11,
  aprovacao: (m) => m.aprovacao >= 60,
  obras: (m) => m.obras.filter((o) => o.situacao === "concluida").length >= 2,
  leis: (m) => m.votacoes.filter((v) => v.aprovado).length >= 3,
  pobreza: (m) => m.economia.pobreza < 21,
  diplomacia: (m) => Object.values(m.relacoes).some((r) => r >= 85),
  saude: (m) => m.sociedade.saude >= 60,
};

function preencherMetas(m: Mandato) {
  const d = m.drama;
  const livres = METAS_BASE.filter(
    (meta) => !d.metasFeitas.includes(meta.id) && !d.metasFalhas.includes(meta.id) && !d.metas.some((a) => a.id === meta.id),
  );
  while (d.metas.length < 3 && livres.length > 0) {
    const [meta] = livres.splice(Math.floor(sortear(m) * livres.length), 1);
    d.metas.push({ id: meta.id, texto: meta.texto, premio: meta.premio, prazo: m.mes + meta.meses });
  }
}

function conquistar(m: Mandato, id: string) {
  if (m.drama.conquistas.includes(id)) return;
  m.drama.conquistas.push(id);
  const conquista = CONQUISTAS.find((c) => c.id === id);
  if (conquista) m.drama.novidade = `Conquista: ${conquista.nome}`;
}

function avaliarMetas(m: Mandato) {
  const d = m.drama;
  for (const meta of [...d.metas]) {
    if (META_CUMPRIDA[meta.id]?.(m)) {
      d.metas = d.metas.filter((a) => a.id !== meta.id);
      d.metasFeitas.push(meta.id);
      aplicar(m, PREMIOS[meta.id] ?? {});
      d.novidade = `Missão cumprida: ${meta.texto}. ${meta.premio}`;
    } else if (m.mes >= meta.prazo) {
      d.metas = d.metas.filter((a) => a.id !== meta.id);
      d.metasFalhas.push(meta.id);
      aplicar(m, { aprovacao: -2 });
      d.novidade = `Missão perdida: ${meta.texto}. Aprovação -2`;
    }
  }
  preencherMetas(m);

  if (m.votacoes.some((v) => v.aprovado)) conquistar(m, "primeira-lei");
  if (m.votacoes.some((v) => v.aprovado && v.camara.necessarios === 308)) conquistar(m, "emenda");
  if (d.urgentesOk >= 5) conquistar(m, "sangue-frio");
  if (d.metasFeitas.length >= 3) conquistar(m, "tres-metas");
  if (m.aprovacao >= 60) conquistar(m, "acima-de-60");
  if (m.aprovacao < 25) conquistar(m, "abaixo-de-25");
  if (m.obras.filter((o) => o.situacao === "concluida").length >= 5) conquistar(m, "pedreiro");
  if (Object.values(m.relacoes).filter((r) => r >= 85).length >= 3) conquistar(m, "diplomata");
  if (d.finais >= 4) conquistar(m, "historias");
}

function comentar(m: Mandato, tom: "bom" | "ruim" | "neutro", quantidade: number) {
  const novos: Comentario[] = [];
  for (let i = 0; i < quantidade; i++) {
    const lista = COMENTARIOS[tom];
    novos.push({
      usuario: USUARIOS[Math.floor(sortear(m) * USUARIOS.length)],
      texto: lista[Math.floor(sortear(m) * lista.length)],
    });
  }
  m.drama.feed = [...novos.map((n) => ({ ...n, mes: m.mes })), ...m.drama.feed].slice(0, 12);
  return novos;
}

function gerarManchete(m: Mandato, anterior: Registro) {
  const queda = m.aprovacao - anterior.aprovacao;
  const e = m.economia;
  const opcoes: { titulo: string; subtitulo: string; peso: number }[] = [
    { titulo: "Governo derrete nas pesquisas", subtitulo: `Aprovação cai para ${Math.round(m.aprovacao)}%, e aliados começam a se afastar`, peso: queda <= -2 ? -queda * 3 : 0 },
    { titulo: "Popularidade do governo dispara", subtitulo: `Aprovação sobe para ${Math.round(m.aprovacao)}%`, peso: queda >= 2 ? queda * 3 : 0 },
    { titulo: "Inflação assusta famílias", subtitulo: `IPCA em ${e.ipca.toFixed(1).replace(".", ",")}%, e o carrinho do mercado encolhe`, peso: (e.ipca - 5) * 2 },
    { titulo: "Dólar bate recorde do mandato", subtitulo: `Moeda americana chega a R$ ${e.dolar.toFixed(2).replace(".", ",")}`, peso: (e.dolar - 6) * 3 },
    { titulo: "Economia acelera e surpreende", subtitulo: `PIB cresce ${e.pib.toFixed(1).replace(".", ",")}%`, peso: (e.pib - 2.4) * 3 },
    { titulo: "Desemprego preocupa o Planalto", subtitulo: `Taxa chega a ${e.desemprego.toFixed(1).replace(".", ",")}%`, peso: (e.desemprego - 7) * 3 },
    { titulo: "Ruas fervem contra o governo", subtitulo: "Temperatura política sobe, e o Palácio teme novos protestos", peso: (m.drama.pressao - 55) / 5 },
    { titulo: "Brasília ferve nos bastidores", subtitulo: "Líderes negociam, ministros disputam espaço e ninguém dorme", peso: 0.3 },
  ];
  const melhor = opcoes.sort((a, b) => b.peso - a.peso)[0];
  m.drama.manchete = { titulo: melhor.titulo, subtitulo: melhor.subtitulo };
}

function escolherCarta(m: Mandato): Carta | null {
  const d = m.drama;
  const devida = d.agenda.find((a) => a.mes <= m.mes);
  if (devida) {
    d.agenda = d.agenda.filter((a) => a !== devida);
    return CARTAS.find((c) => c.id === devida.id) ?? null;
  }
  const livres = CARTAS.filter(
    (c) =>
      !c.somenteAgendada &&
      !(m.pessoaReal && c.sensivel) &&
      !d.flags.includes(`saiu-${c.quem}`) &&
      !d.vistas.includes(c.id) &&
      (c.requer ?? []).every((f) => d.flags.includes(f)) &&
      !(c.bloqueia ?? []).some((f) => d.flags.includes(f)),
  );
  if (livres.length > 0) return livres[Math.floor(sortear(m) * livres.length)];
  // Acabaram as novidades: os dilemas do dia a dia podem voltar, mas as histórias não se repetem.
  const repetiveis = CARTAS.filter(
    (c) => !c.capitulo && !c.urgente && !d.flags.includes(`saiu-${c.quem}`) && !(c.bloqueia ?? []).some((f) => d.flags.includes(f)) && c.id !== d.vistas.at(-1),
  );
  return repetiveis.length > 0 ? repetiveis[Math.floor(sortear(m) * repetiveis.length)] : null;
}

const NOME_EFEITO: Record<string, { nome: string; invertido?: boolean }> = {
  aprovacao: { nome: "Aprovação" },
  congresso: { nome: "Relação com o Congresso" },
  pressao: { nome: "Clima nas ruas", invertido: true },
  "e.confianca": { nome: "Confiança do mercado" },
  "e.dolar": { nome: "Dólar", invertido: true },
  "e.primario": { nome: "Contas públicas" },
  "e.divida": { nome: "Dívida", invertido: true },
  "e.ipca": { nome: "Inflação", invertido: true },
  "e.pib": { nome: "Crescimento" },
  "e.reservas": { nome: "Reservas" },
  "e.pobreza": { nome: "Combate à pobreza", invertido: true },
  "e.investimento": { nome: "Investimentos" },
  "e.exportacoes": { nome: "Exportações" },
  "s.confianca": { nome: "Confiança nas instituições" },
  "s.saude": { nome: "Saúde" },
  "s.educacao": { nome: "Educação" },
  "s.ambiente": { nome: "Meio ambiente" },
  "p.crime": { nome: "Combate ao crime", invertido: true },
  "p.fronteiras": { nome: "Fronteiras" },
  "p.homicidios": { nome: "Homicídios", invertido: true },
  "p.roubos": { nome: "Roubos", invertido: true },
  "p.prisional": { nome: "Lotação dos presídios", invertido: true },
  "e.carga": { nome: "Impostos", invertido: true },
  "e.desemprego": { nome: "Desemprego", invertido: true },
  "e.desigualdade": { nome: "Desigualdade", invertido: true },
};

export function resumirEfeito(efeito: Efeito) {
  return Object.entries(efeito)
    .filter(([chave, valor]) => valor !== 0 && (NOME_EFEITO[chave] || chave.startsWith("r.")))
    .map(([chave, valor]) => {
      const dados = NOME_EFEITO[chave] ?? { nome: `Relação com ${chave.slice(2)}` };
      return { texto: dados.nome, bom: dados.invertido ? valor < 0 : valor > 0, sobe: valor > 0 };
    });
}

export function responderCarta(original: Mandato, opcao: number | null): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "carta") return m;
  const { carta } = m.pendencia;
  const d = m.drama;
  const escolhida = opcao === null ? carta.semResposta ?? carta.opcoes[0] : carta.opcoes[opcao];
  const extras = escolhida as { define?: string[]; depois?: { id: string; meses: number } };
  aplicar(m, escolhida.efeito);
  d.vistas.push(carta.id);
  d.flags.push(...(extras.define ?? []));
  if (extras.depois) d.agenda.push({ id: extras.depois.id, mes: m.mes + extras.depois.meses });
  if (carta.urgente && opcao !== null) d.urgentesOk += 1;
  if (carta.capitulo?.includes("final")) d.finais += 1;

  const mudancas = resumirEfeito(escolhida.efeito);
  const boas = mudancas.filter((x) => x.bom).length;
  const tom = boas * 2 > mudancas.length ? "bom" : boas * 2 < mudancas.length ? "ruim" : "neutro";
  noticiar(m, `${carta.titulo}: ${escolhida.resposta}`);
  m.pendencia = {
    tipo: "carta-resposta",
    quem: carta.quem,
    resposta: escolhida.resposta,
    mudancas,
    comentarios: comentar(m, tom, 2),
  };
  return m;
}

export function notaDoGoverno(m: Mandato, melhoraram: number, total: number) {
  if (m.golpe === "venceu") return { pontos: 0, nota: "F", titulo: "Ditador: o país pagou a conta" };
  if (m.golpe === "fracassou") return { pontos: 0, nota: "F", titulo: "Golpista derrotado pela democracia" };
  const pontos = Math.round(
    limitar(
      (melhoraram / Math.max(1, total)) * 35 + m.aprovacao * 0.45 + m.drama.metasFeitas.length * 3 +
        m.drama.conquistas.length * 1.5 - (m.cassado ? 25 : 0),
    ),
  );
  const faixa = TITULOS_LEGADO.find((t) => pontos >= t.minimo) ?? TITULOS_LEGADO[TITULOS_LEGADO.length - 1];
  return { pontos, nota: faixa.nota, titulo: faixa.titulo };
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
    "e.primario": -0.04 * objetivo.custo * peso,
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
  | { tipo: "estatal-criar"; nome: string }
  | { tipo: "estatal-fundir"; de: string; para: string }
  | { tipo: "reforma"; id: string; ministerio: string; nome: string; tecnico: boolean }
  | { tipo: "diplomacia"; parceiro: string; acao: string }
  | { tipo: "seguranca"; id: string }
  | { tipo: "divida"; acao: "alongar" | "amortizar" | "emitir" }
  | { tipo: "programa"; id: string }
  | { tipo: "programa-encerrar"; id: string }
  | { tipo: "intervencao"; uf: string }
  | { tipo: "glo"; uf: string }
  | { tipo: "golpe" }
  | { tipo: "meta-cobrar"; ministerio: string };

function bonusDoCongresso(m: Mandato) {
  return (m.congresso - 50) / 250;
}

function votar(m: Mandato, c: Contexto, proposta: { economia: number; camara: number | null; senado: number | null }, extra = 0, porPartido: Record<string, number> = {}) {
  const resultado = votarProposta({ ...c.governo, semente: m.semente }, c.candidato, proposta, bonusDoCongresso(m) + extra, porPartido);
  m.semente = resultado.semente;
  return resultado;
}

export function obrasAtivas(m: Mandato) {
  return m.obras.filter((o) => o.situacao === "andamento" || o.situacao === "suspensa");
}

export function podeIniciarObra(m: Mandato) {
  return obrasAtivas(m).length < LIMITE_OBRAS;
}

// Quem tem mandato fixo (STF, PGR e Banco Central) não pode ser nomeado para outro cargo.
export function nomesComMandato(m: Mandato) {
  const nomes = new Set<string>();
  const aposentados = new Set(VAGAS.filter((v) => v.sai && v.mes <= m.mes).map((v) => v.sai));
  for (const ministro of STF) if (!aposentados.has(ministro.nome)) nomes.add(ministro.nome);
  const ultimoPorCargo = new Set<string>();
  for (const indicado of m.indicados) {
    if (!indicado.aprovado) continue;
    if (indicado.vaga.startsWith("stf-")) nomes.add(indicado.nome);
    else if (!ultimoPorCargo.has(indicado.cargo)) {
      ultimoPorCargo.add(indicado.cargo);
      nomes.add(indicado.nome);
    }
  }
  return nomes;
}

// Pessoas que podem ser nomeadas agora: fora ficam a chapa e quem tem mandato fixo.
export function disponiveis(m: Mandato, contexto: Contexto) {
  const fora = nomesComMandato(m);
  const vice = dadosDoVice(contexto.candidato)?.nome;
  return POLITICOS.filter(
    (p) => !fora.has(p.nome) && p.nome !== vice && p.nome !== contexto.candidato.nomeUrna && !extremosOpostos(contexto.candidato.partidoSigla, p.sigla),
  );
}

// Motivo para recusar um nome escrito à mão.
export function nomeImpedido(m: Mandato, contexto: Contexto, nome: string) {
  const alvo = semAcento(nome.trim());
  if (alvo === semAcento(contexto.candidato.nomeUrna)) return "Você não pode nomear a si mesmo.";
  if (alvo === semAcento(dadosDoVice(contexto.candidato)?.nome ?? "")) return "Quem é vice não pode ocupar outro cargo.";
  if ([...nomesComMandato(m)].some((n) => semAcento(n) === alvo)) return "Essa pessoa já tem um mandato fixo.";
  const real = POLITICOS.find((p) => semAcento(p.nome) === alvo);
  if (real && extremosOpostos(contexto.candidato.partidoSigla, real.sigla)) return MOTIVO_EXTREMOS;
  return null;
}

export function ondeEsta(m: Mandato, g: Governo, nome: string) {
  const alvo = semAcento(nome);
  const pasta = ministeriosAtivos(g).find((p) => semAcento(pessoaPorId(g.ministros[p.id])?.nome ?? "") === alvo);
  if (pasta) return pasta.nome;
  const estatal = listaEstatais(m).find((e) => semAcento(m.estatais[e.id]?.presidente ?? "") === alvo);
  return estatal ? `presidência: ${estatal.nome}` : null;
}

// Depois de uma nomeação, a pessoa sai de qualquer outro cargo, e a vaga fica aberta.
export function resolverNomeacao(governo: Governo, original: Mandato) {
  const nomeacao = original.nomeacao;
  if (!nomeacao) return { governo, mandato: original };
  const m = structuredClone(original);
  const g = structuredClone(governo);
  const alvo = semAcento(nomeacao.nome);
  for (const pasta of Object.keys(g.ministros)) {
    const mesmoCargo = nomeacao.tipo === "ministerio" && pasta === nomeacao.id;
    if (!mesmoCargo && semAcento(pessoaPorId(g.ministros[pasta])?.nome ?? "") === alvo) {
      g.ministros[pasta] = null;
      noticiar(m, `${nomeacao.nome} deixa o ministério, e a pasta fica vaga.`);
    }
  }
  for (const estatal of listaEstatais(m)) {
    const situacao = m.estatais[estatal.id];
    const mesmoCargo = nomeacao.tipo === "estatal" && estatal.id === nomeacao.id;
    if (!mesmoCargo && semAcento(situacao.presidente ?? "") === alvo) {
      situacao.presidente = null;
      situacao.vaga = true;
      noticiar(m, `${nomeacao.nome} deixa a presidência da ${estatal.nome}.`);
    }
  }
  m.nomeacao = null;
  return { governo: g, mandato: m };
}

// Partidas antigas podem ter a mesma pessoa em dois cargos: o cargo repetido da estatal fica vago.
export function limparRepetidos(g: Governo, m: Mandato): Mandato {
  const vistos = new Set(ministeriosAtivos(g).map((p) => semAcento(pessoaPorId(g.ministros[p.id])?.nome ?? "")));
  const estatais = { ...m.estatais };
  let mudou = false;
  for (const [id, situacao] of Object.entries(m.estatais)) {
    if (!situacao.presidente || situacao.gestao === "tecnica") continue;
    const nome = semAcento(situacao.presidente);
    if (vistos.has(nome)) {
      estatais[id] = { ...situacao, presidente: null, vaga: true };
      mudou = true;
    }
    vistos.add(nome);
  }
  return mudou ? { ...m, estatais } : m;
}

export type VagaAberta = { tipo: "ministerio" | "estatal"; id: string; nome: string };

export function vagasAbertas(m: Mandato, g: Governo): VagaAberta[] {
  const pastas = ministeriosAtivos(g)
    .filter((p) => !g.ministros[p.id])
    .map((p): VagaAberta => ({ tipo: "ministerio", id: p.id, nome: p.nome }));
  const empresas = listaEstatais(m)
    .filter((e) => m.estatais[e.id].vaga && m.estatais[e.id].controle !== "privatizada" && m.estatais[e.id].controle !== "fundida")
    .map((e): VagaAberta => ({ tipo: "estatal", id: e.id, nome: e.nome }));
  return [...pastas, ...empresas];
}

// Preencher uma vaga aberta é obrigatório e não gasta ação.
// Um nome técnico do jogo pertence só àquele cargo, então não tira ninguém de outro lugar.
export function preencherVaga(original: Mandato, vaga: VagaAberta, nome: string, tecnico: boolean, ficticio = false): Mandato {
  const m = structuredClone(original);
  if (vaga.tipo === "estatal") {
    m.estatais[vaga.id].presidente = nome;
    m.estatais[vaga.id].vaga = false;
    m.estatais[vaga.id].gestao = tecnico ? "tecnica" : "politica";
  }
  if (!ficticio) m.nomeacao = { nome, tipo: vaga.tipo, id: vaga.id };
  noticiar(m, `${nome} assume: ${vaga.nome}.`);
  return m;
}

export function listaEstatais(m: Mandato) {
  return [...ESTATAIS, ...m.estataisNovas];
}

function abrirVotacao(m: Mandato, proposta: PropostaEmVoto) {
  m.pendencia = { tipo: "votacao", proposta, concessoes: { emendas: 0, cargos: 0, texto: 0 }, resultado: null };
  m.fase = "pendencia";
}

const LIMITE_CONCESSOES = 2;

function bonusDasConcessoes(c: Concessoes) {
  return c.emendas * 0.03 + c.cargos * 0.03 + c.texto * 0.04;
}

// Cada líder atendido pessoalmente puxa a bancada dele para o lado do governo.
export const LIMITE_LIDERES = 3;
// Oposição cede pouco num acordo; independentes cedem mais.
const BONUS_DO_LIDER = { base: 0.08, independente: 0.1, oposicao: 0.04 };

function porPartidoDasConcessoes(c: Concessoes, contexto: Contexto): Record<string, number> {
  return Object.fromEntries(
    (c.lideres ?? []).map((sigla) => [sigla, BONUS_DO_LIDER[posicaoDoPartidoNoCongresso(contexto.governo, contexto.candidato, sigla)]]),
  );
}

export function estimativaDeVotos(m: Mandato, contexto: Contexto) {
  if (m.pendencia?.tipo !== "votacao") return null;
  const { proposta, concessoes } = m.pendencia;
  return estimarVotos(contexto.governo, contexto.candidato, proposta, bonusDoCongresso(m) + bonusDasConcessoes(concessoes), porPartidoDasConcessoes(concessoes, contexto));
}

export function reacoesAProposta(m: Mandato, contexto: Contexto) {
  if (m.pendencia?.tipo !== "votacao") return [];
  const { proposta, concessoes } = m.pendencia;
  return reacoesDosPartidos(contexto.governo, contexto.candidato, proposta, bonusDoCongresso(m) + bonusDasConcessoes(concessoes), porPartidoDasConcessoes(concessoes, contexto));
}

export function negociarComLider(original: Mandato, contexto: Contexto, sigla: string): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "votacao" || m.pendencia.resultado) return m;
  if (extremosOpostos(contexto.candidato.partidoSigla, sigla)) return m;
  const lideres = m.pendencia.concessoes.lideres ?? [];
  if (lideres.includes(sigla) || lideres.length >= LIMITE_LIDERES) return m;
  m.pendencia.concessoes.lideres = [...lideres, sigla];
  // O acordo com o líder sai em verbas para as bases do partido.
  aplicar(m, { "e.primario": -0.03, "s.confianca": -0.5 });
  noticiar(m, `O presidente recebe o líder do ${sigla} no Planalto.`);
  return m;
}

export function negociar(original: Mandato, tipo: "emendas" | "cargos" | "texto"): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "votacao" || m.pendencia.resultado) return m;
  if (m.pendencia.concessoes[tipo] < LIMITE_CONCESSOES) m.pendencia.concessoes[tipo] += 1;
  return m;
}

export function colocarEmVotacao(original: Mandato, contexto: Contexto): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "votacao" || m.pendencia.resultado) return m;
  const { proposta, concessoes } = m.pendencia;
  const resultado = votar(m, contexto, proposta, bonusDasConcessoes(concessoes), porPartidoDasConcessoes(concessoes, contexto));
  m.pendencia.resultado = { aprovado: resultado.aprovado, camara: resultado.camara, senado: resultado.senado };
  m.votacoes.unshift({ mes: m.mes, projeto: proposta.nome, aprovado: resultado.aprovado, camara: resultado.camara, senado: resultado.senado });
  aplicar(m, { "e.primario": -0.025 * concessoes.emendas, "s.confianca": -concessoes.cargos });

  const registro = m.medidas.find((medida) => medida.id === proposta.medidaId);
  if (registro) registro.situacao = resultado.aprovado ? "Aprovada" : "Rejeitada";

  if (resultado.aprovado) {
    const fator = Math.pow(0.8, concessoes.texto);
    const efeito = Object.fromEntries(Object.entries(proposta.efeito).map(([k, v]) => [k, v * fator]));
    if (proposta.projetoId) m.projetosAprovados.push(proposta.projetoId);
    if (proposta.programaId) {
      iniciarPrograma(m, proposta.programaId);
      noticiar(m, `Começa a valer: ${proposta.nome}.`);
    }
    if (proposta.estatal) m.estatais[proposta.estatal.id].controle = proposta.estatal.controle;
    if (proposta.fusao) m.estatais[proposta.fusao.de].controle = "fundida";
    if (proposta.novaEstatal) {
      const id = `nova-${m.estataisNovas.length + 1}`;
      m.estataisNovas.push({ id, nome: proposta.novaEstatal, listada: false, valor: 0.05 });
      m.estatais[id] = { controle: "estatal", gestao: "politica", presidente: null };
    }
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

const CENA_DA_ACAO: Partial<Record<Acao["tipo"], TipoCena>> = {
  obra: "obra",
  "obra-real": "obra",
  diplomacia: "aviao",
  seguranca: "policia",
  pronunciamento: "imprensa",
  reforma: "assinatura",
  "estatal-presidente": "assinatura",
  programa: "alta",
  intervencao: "tanques",
  glo: "tanques",
};

export function executar(original: Mandato, contexto: Contexto, acao: Acao): Mandato {
  const novo = fazerAcao(original, contexto, acao);
  return novo.acoes < original.acoes ? { ...novo, cena: CENA_DA_ACAO[acao.tipo] ?? null } : novo;
}

function fazerAcao(original: Mandato, contexto: Contexto, acao: Acao): Mandato {
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
    const dados = listaEstatais(m).find((e) => e.id === acao.id);
    const estatal = m.estatais[acao.id];
    if (!dados || !estatal) return m;
    estatal.presidente = acao.nome;
    estatal.vaga = false;
    estatal.gestao = acao.tecnico ? "tecnica" : "politica";
    m.nomeacao = { nome: acao.nome, tipo: "estatal", id: acao.id };
    aplicar(m, acao.tecnico ? { "e.confianca": 1, congresso: -1 } : { "e.confianca": -1.5, congresso: 2 });
    noticiar(m, `${acao.nome} assume a presidência: ${dados.nome}.`);
  }

  if (acao.tipo === "estatal-criar") {
    abrirVotacao(m, {
      nome: `Criar a estatal ${acao.nome}`, tipo: "Projeto de lei", economia: 25, camara: null, senado: null,
      atraso: 0, efeito: { "e.primario": -0.05, "e.confianca": -1.5, aprovacao: 0.5 }, novaEstatal: acao.nome,
    });
  }

  if (acao.tipo === "estatal-fundir") {
    const lista = listaEstatais(m);
    const de = lista.find((e) => e.id === acao.de);
    const para = lista.find((e) => e.id === acao.para);
    if (!de || !para || de.id === para.id) return m;
    abrirVotacao(m, {
      nome: `Fundir ${de.nome} com ${para.nome}`, tipo: "Projeto de lei", economia: 62, camara: null, senado: null,
      atraso: 0, efeito: { "e.primario": 0.03, "e.confianca": 1, aprovacao: -0.5 }, fusao: { de: de.id, para: para.id },
    });
  }

  if (acao.tipo === "reforma") {
    aplicar(m, acao.tecnico ? { congresso: -1 } : { congresso: 1 });
    m.gestao = limitar(m.gestao + (acao.tecnico ? 1 : -0.5));
    m.nomeacao = { nome: acao.nome, tipo: "ministerio", id: acao.id };
    noticiar(m, `Reforma ministerial: ${acao.nome} assume ${acao.ministerio}.`);
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
    const dados = listaEstatais(m).find((e) => e.id === acao.id);
    const estatal = m.estatais[acao.id];
    if (!dados || !estatal) return m;
    if (estatal.controle === "privatizada" || estatal.controle === "fundida") return m;
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

  if (acao.tipo === "programa") {
    const programa = PROGRAMAS_ECONOMICOS.find((p) => p.id === acao.id);
    const ativos = m.programas ?? [];
    if (!programa || ativos.some((p) => p.id === programa.id) || ativos.length >= LIMITE_PROGRAMAS) return m;
    if (programa.instrumento === "Projeto de lei") {
      abrirVotacao(m, {
        nome: programa.nome, tipo: programa.instrumento, economia: programa.economia, camara: null, senado: null,
        atraso: 0, efeito: programa.anuncio, programaId: programa.id,
      });
    } else {
      iniciarPrograma(m, programa.id);
      aplicar(m, programa.anuncio);
      if (programa.instrumento === "Medida provisória") {
        m.mps.push({ mes: m.mes + 4, medidaId: 0, titulo: programa.nome, economia: programa.economia, efeito: programa.anuncio, programaId: programa.id });
      }
      noticiar(m, `${programa.instrumento === "Decreto" ? "Decreto assinado" : "Medida provisória publicada"}: ${programa.nome}.`);
    }
  }

  if (acao.tipo === "programa-encerrar") {
    const ativo = (m.programas ?? []).find((p) => p.id === acao.id);
    if (!ativo) return m;
    m.programas = (m.programas ?? []).filter((p) => p.id !== acao.id);
    noticiar(m, `Governo encerra antes do prazo: ${ativo.nome}.`);
  }

  if (acao.tipo === "intervencao") {
    abrirVotacao(m, {
      nome: `Intervenção federal na segurança ${noEstado(acao.uf)}`, tipo: "Decreto de intervenção", economia: 65,
      camara: null, senado: null, atraso: 2, efeito: INTERVENCAO,
    });
  }

  if (acao.tipo === "glo") {
    m.pendentes.push({ mes: m.mes + 1, efeito: GLO, texto: `Tropas encerram a operação de garantia da lei e da ordem ${noEstado(acao.uf)}.` });
    aplicar(m, { aprovacao: 0.5 });
    noticiar(m, `Decreto de garantia da lei e da ordem: Forças Armadas nas ruas ${noEstado(acao.uf)} por 30 dias.`);
  }

  if (acao.tipo === "golpe") {
    if (m.pessoaReal) return m;
    const chance = 0.06 + Math.max(0, m.aprovacao - 40) / 400 + (m.drama.pressao > 60 ? 0.03 : 0);
    m.pendencia = { tipo: "golpe", passo: 0, chance };
    m.fase = "pendencia";
  }

  if (acao.tipo === "meta-cobrar") {
    const meta = (m.metasMinistros ?? []).find((item) => item.ministerio === acao.ministerio);
    const indicador = INDICADOR_DA_PASTA[acao.ministerio];
    if (!meta || !indicador) return m;
    meta.cobrancas += 1;
    empurrar(m, indicador.chave, ((meta.alvo - meta.inicial) / meta.prazo) * 1.5);
    const pasta = MINISTERIOS.find((p) => p.id === acao.ministerio)?.nome ?? "pasta";
    if (meta.cobrancas >= 3) {
      aplicar(m, { congresso: -1.5 });
      noticiar(m, `Pressão demais: a equipe de ${pasta} reclama das cobranças do Planalto.`);
    } else {
      noticiar(m, `O presidente cobra resultados de ${pasta}.`);
    }
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

function iniciarPrograma(m: Mandato, id: string) {
  const programa = PROGRAMAS_ECONOMICOS.find((p) => p.id === id);
  if (!programa) return;
  m.programas = [...(m.programas ?? []).filter((p) => p.id !== id), { id, nome: programa.nome, inicio: m.mes, fim: m.mes + programa.meses }];
}

// Soma o efeito, por mês, de todos os programas econômicos em vigor.
export function efeitoDosProgramas(m: Mandato) {
  const soma = { pib: 0, ipca: 0, selic: 0, desemprego: 0, primario: 0 };
  for (const ativo of m.programas ?? []) {
    const p = PROGRAMAS_ECONOMICOS.find((item) => item.id === ativo.id);
    if (!p) continue;
    soma.pib += p.pib ?? 0;
    soma.ipca += p.ipca ?? 0;
    soma.selic += p.selic ?? 0;
    soma.desemprego += p.desemprego ?? 0;
    soma.primario += p.primario ?? 0;
  }
  // Programas demais ao mesmo tempo disputam o mesmo dinheiro e a mesma mão de obra: cada um rende menos.
  const fator = 1 / (1 + 0.2 * Math.max(0, (m.programas ?? []).length - 1));
  return {
    pib: soma.pib * fator,
    ipca: soma.ipca * fator,
    selic: soma.selic * fator,
    desemprego: soma.desemprego * fator * 0.7,
    primario: soma.primario,
  };
}

function nivel(m: Mandato, area: string) {
  return m.orcamento[area] ?? 3;
}

function simularMes(m: Mandato) {
  const e = m.economia;
  const s = m.sociedade;
  const p = m.seguranca;
  // Passar do limite pesa mais do que a folga ajuda.
  const saldo = (custoDoOrcamentoDoMandato(m) - TETO_ORCAMENTO) / 100;
  const excesso = saldo > 0 ? saldo : saldo * 0.2;
  const obrasEmExecucao = m.obras.filter((o) => o.situacao === "andamento" && o.contrato).length;
  const programas = efeitoDosProgramas(m);

  // Crescimento, inflação e juros andam devagar: as decisões demoram a aparecer.
  const pibAlvo = 2 + (e.confianca - 50) * 0.03 - (e.selic - 9) * 0.12 + obrasEmExecucao * 0.06 + (e.investimento - 17) * 0.15 - e.carga * 0.15 + programas.pib;
  e.pib = aproximar(e.pib, pibAlvo, 0.12) + ruido(m, 0.12);
  const ipcaAlvo = 3.5 + (e.pib - 2) * 0.5 + (e.dolar - 5.3) * 0.6 - (e.selic - 10) * 0.25 + excesso * 0.5 + programas.ipca;
  e.ipca = limitar(aproximar(e.ipca, ipcaAlvo, 0.1) + ruido(m, 0.08), -1, 40);
  // O Banco Central decide sozinho, a cada dois meses, para levar a inflação à meta.
  if (m.mes % 2 === 0) {
    const selicAlvo = 9 + (e.ipca - 3) * 1.5 + programas.selic;
    e.selic = limitar(Math.round(aproximar(e.selic, selicAlvo, 0.2) * 4) / 4, 2, 30);
  }
  e.dolar = limitar(e.dolar * (1 + (e.ipca - 3.5) * 0.001 - (e.confianca - 50) * 0.0004 + (e.primario < -1.5 ? 0.002 : 0) + ruido(m, 0.008)), 3, 12);
  // Perto do pleno emprego, cada ponto a menos custa muito mais.
  let variacaoDoEmprego = -(e.pib - 2) * 0.03 + programas.desemprego;
  if (variacaoDoEmprego < 0 && e.desemprego < 5.5) variacaoDoEmprego *= Math.max(0.12, (e.desemprego - 3.6) / 1.9);
  e.desemprego = limitar(e.desemprego + variacaoDoEmprego + ruido(m, 0.04), 3, 20);
  const primarioAlvo = -0.2 - excesso * 1.2 + e.carga * 0.3 + (e.pib - 2) * 0.1 - custoAnualDasObras(m) * 0.007 + programas.primario;
  e.primario = aproximar(e.primario, primarioAlvo, 0.08);
  e.divida = limitar(e.divida + ((e.selic - e.ipca - e.pib) * 0.55 - e.primario) / 12, 20, 200);
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
  m.cena = null;
  const anterior = m.historico[m.historico.length - 1];

  for (const mp of m.mps.filter((item) => item.mes <= m.mes)) {
    const resultado = votar(m, contexto, { economia: mp.economia, camara: null, senado: null });
    const registro = m.medidas.find((medida) => medida.id === mp.medidaId);
    if (resultado.aprovado) {
      if (registro) registro.situacao = "Convertida em lei";
      noticiar(m, `Congresso converte em lei: ${mp.titulo}.`);
    } else {
      if (registro) registro.situacao = "Derrubada pelo Congresso";
      if (mp.programaId) m.programas = (m.programas ?? []).filter((p) => p.id !== mp.programaId);
      aplicar(m, Object.fromEntries(Object.entries(mp.efeito).map(([k, v]) => [k, -v])));
      aplicar(m, { congresso: -2 });
      noticiar(m, `Congresso derruba a medida provisória: ${mp.titulo}.`);
    }
  }
  m.mps = m.mps.filter((item) => item.mes > m.mes);

  // Motivos do mês: as decisões já registradas e os efeitos que chegaram agora.
  const motivos: Motivo[] = [];
  for (const decisao of (m.decisoes ?? []).filter((d) => d.mes === m.mes)) {
    for (const [indicador, valor] of Object.entries(decisao.mudancas)) motivos.push({ indicador, texto: decisao.texto, valor });
  }
  for (const item of m.pendentes.filter((p) => p.mes <= m.mes)) {
    const antes = fotografar(m);
    aplicar(m, item.efeito);
    noticiar(m, item.texto);
    for (const [indicador, valor] of Object.entries(diferenca(antes, fotografar(m)))) motivos.push({ indicador, texto: item.texto, valor });
  }
  m.pendentes = m.pendentes.filter((p) => p.mes > m.mes);

  for (const ativo of (m.programas ?? []).filter((p) => p.fim <= m.mes)) noticiar(m, `Terminou o prazo do programa: ${ativo.nome}.`);
  m.programas = (m.programas ?? []).filter((p) => p.fim > m.mes);

  avancarObras(m);
  simularMes(m);
  const metaPerdida = avancarMetas(m, contexto);
  const d = m.drama;
  d.pressao = limitar(
    d.pressao + (46 - m.aprovacao) * 0.09 + Math.max(0, m.economia.ipca - 5) * 0.5 + Math.max(0, m.economia.desemprego - 7) * 0.5 - 0.5,
  );
  d.novidade = null;
  m.aprovacao = Math.round(m.aprovacao * 10) / 10;
  m.historico.push(registrar(m));
  avaliarMetas(m);
  gerarManchete(m, anterior);
  comentar(m, m.aprovacao >= anterior.aprovacao ? "bom" : "ruim", 1);
  m.resumoMes = {
    mes: m.mes,
    aprovacao: m.aprovacao - anterior.aprovacao,
    pib: m.economia.pib - anterior.pib,
    ipca: m.economia.ipca - anterior.ipca,
    desemprego: m.economia.desemprego - anterior.desemprego,
  };
  // O que as decisões não explicam vem da própria economia e do desgaste de governar.
  const total: Record<string, number> = {
    aprovacao: m.resumoMes.aprovacao,
    "e.pib": m.resumoMes.pib,
    "e.ipca": m.resumoMes.ipca,
    "e.desemprego": m.resumoMes.desemprego,
  };
  const RESTO: Record<string, string> = {
    aprovacao: "Economia e desgaste natural do governo",
    "e.pib": "Juros, confiança e investimentos",
    "e.ipca": "Juros, dólar e demanda",
    "e.desemprego": "Ritmo da economia",
  };
  for (const [indicador, valor] of Object.entries(total)) {
    const explicado = motivos.filter((mo) => mo.indicador === indicador).reduce((soma, mo) => soma + mo.valor, 0);
    const resto = valor - explicado;
    if (Math.abs(resto) >= (indicador === "aprovacao" ? 0.3 : 0.03)) motivos.push({ indicador, texto: RESTO[indicador], valor: resto });
  }
  m.resumoMes.motivos = motivos
    .filter((mo) => mo.indicador in total)
    .sort((a, b) => Math.abs(b.valor) / (b.indicador === "aprovacao" ? 10 : 1) - Math.abs(a.valor) / (a.indicador === "aprovacao" ? 10 : 1))
    .slice(0, 5);

  if (m.mes >= m.limite) {
    // Crise ainda aberta no último mês: o desfecho é o que estiver na mesa.
    const aberta = criseAtual(m);
    if (aberta && m.crise) {
      const desfecho = desfechoDaCrise(m.crise.gravidade);
      m.crises = [...(m.crises ?? []), { id: aberta.id, nome: aberta.nome, desfecho, mes: m.mes }];
      m.crise = null;
    }
    m.fase = "fim";
    return m;
  }

  m.mes += 1;
  m.acoes = ACOES_POR_MES;

  if (metaPerdida) {
    const pasta = MINISTERIOS.find((p) => p.id === metaPerdida.ministerio)?.nome ?? "pasta";
    m.gestao = limitar(m.gestao - (metaPerdida.ousada ? 2 : 3));
    aplicar(m, { aprovacao: -1 });
    m.pendencia = {
      tipo: "meta-ministro",
      ministerio: metaPerdida.ministerio,
      texto: `O prazo de 12 meses acabou e a pasta não chegou à meta de ${(INDICADOR_DA_PASTA[metaPerdida.ministerio].nome.charAt(0).toLowerCase() + INDICADOR_DA_PASTA[metaPerdida.ministerio].nome.slice(1))}.`,
    };
    m.fase = "pendencia";
    return m;
  }
  const afrontas = d.flags.filter((f) => f === "afronta-stf").length;
  const crise = (m.aprovacao < 22 && m.congresso < 42) || (afrontas >= 2 && m.congresso < 50 && m.aprovacao < 40);
  if (crise && m.mes - m.impeachmentMes > 12 && m.mes > 6) {
    m.impeachmentMes = m.mes;
    m.pendencia = { tipo: "impeachment" };
    m.fase = "pendencia";
    return m;
  }

  const reaberta = m.vagasReabertas.find((v) => v.mes === m.mes);
  const vaga = reaberta ? VAGAS.find((v) => v.id === reaberta.id) : VAGAS.find((v) => v.mes === m.mes);
  m.vagasReabertas = m.vagasReabertas.filter((v) => v.mes > m.mes);
  if (vaga) {
    m.pendencia = { tipo: "indicacao", vaga };
    m.fase = "pendencia";
    return m;
  }
  const veto = (m.vetos ?? []).find((v) => v.mes <= m.mes);
  if (veto) {
    sessaoDoVeto(m, veto);
    return m;
  }
  // Gabinete de crise: uma crise grande, em três meses seguidos.
  if (m.crise && m.mes >= m.crise.proxima) {
    m.pendencia = { tipo: "crise" };
    m.fase = "pendencia";
    return m;
  }
  const vividas = m.crises ?? [];
  const novas = CRISES.filter((c) => !vividas.some((v) => v.id === c.id));
  if (!m.crise && novas.length > 0 && m.mes >= (m.proximaCrise ?? 7) && m.mes + 3 <= m.limite && sortear(m) < 0.3) {
    const crise = novas[Math.floor(sortear(m) * novas.length)];
    // Quem saiu mal da última crise começa a próxima com menos crédito.
    const ultima = vividas.at(-1)?.desfecho;
    const gravidade = 50 + (ultima === "desastre" ? 10 : ultima === "contida" ? -8 : 0);
    m.crise = { id: crise.id, fase: 0, gravidade, proxima: m.mes, ignorados: {} };
    m.pendencia = { tipo: "crise" };
    m.fase = "pendencia";
    return m;
  }
  if (d.pressao >= 78) {
    d.pressao -= 15;
    m.pendencia = { tipo: "carta", carta: CARTA_RUAS };
    m.fase = "pendencia";
    return m;
  }
  if (MESES_DA_MESA.includes(m.mes)) {
    m.pendencia = { tipo: "evento", evento: EVENTO_MESA };
    m.fase = "pendencia";
    return m;
  }
  // Datas cívicas: 7 de Setembro e Dia da Bandeira, uma vez por ano.
  const mesDoAno = ((m.mes - 1) % 12) + 1;
  if (mesDoAno === 9 || mesDoAno === 11) {
    m.pendencia = { tipo: "data-civica", data: mesDoAno === 9 ? "independencia" : "bandeira" };
    m.fase = "pendencia";
    return m;
  }
  // Cenas com diálogo: cada uma aparece uma vez por mandato, quando faz sentido.
  const dialogo = proximoDialogo(m);
  if (dialogo) {
    d.flags.push(`dialogo-${dialogo.id}`);
    m.pendencia = { tipo: "dialogo", ...dialogo };
    m.fase = "pendencia";
    return m;
  }
  // O Congresso também legisla: de vez em quando, um projeto chega para sanção ou veto.
  const vistosDoCongresso = m.projetosDoCongresso ?? [];
  const projetosNovos = PROJETOS_DO_CONGRESSO.filter((p) => !vistosDoCongresso.includes(p.id));
  if (m.mes > 2 && projetosNovos.length > 0 && sortear(m) < 0.2) {
    const projeto = projetosNovos[Math.floor(sortear(m) * projetosNovos.length)];
    m.projetosDoCongresso = [...vistosDoCongresso, projeto.id];
    m.pendencia = { tipo: "sancao", projeto };
    m.fase = "pendencia";
    return m;
  }
  if (m.mes > 3 && sortear(m) < 0.12) {
    const livres = DECISOES_DO_STF.filter((s) => !m.eventosVistos.includes(s.id));
    if (livres.length > 0) {
      const decisao = livres[Math.floor(sortear(m) * livres.length)];
      m.eventosVistos.push(decisao.id);
      m.pendencia = { tipo: "stf", decisao };
      m.fase = "pendencia";
      return m;
    }
  }
  // Quase todo mês alguém bate à sua porta com um problema.
  if (d.agenda.some((a) => a.mes <= m.mes) || sortear(m) < 0.72) {
    const carta = escolherCarta(m);
    if (carta) {
      m.pendencia = { tipo: "carta", carta };
      m.fase = "pendencia";
      return m;
    }
  }
  if (sortear(m) < 0.5) {
    const livres = EVENTOS_MANDATO.filter((e) => !m.eventosVistos.slice(-6).includes(e.id));
    const evento = livres[Math.floor(sortear(m) * livres.length)];
    m.eventosVistos.push(evento.id);
    m.pendencia = { tipo: "evento", evento };
    m.fase = "pendencia";
  }
  return m;
}

function mostrarResultado(m: Mandato, resultado: Omit<Extract<Pendencia, { tipo: "resultado" }>, "tipo">) {
  m.pendencia = { tipo: "resultado", ...resultado };
  m.fase = "pendencia";
}

// Sancionar, vetar uma parte ou vetar tudo. O veto volta ao Congresso, que pode derrubá-lo.
export function sancionar(original: Mandato, escolha: "sancionar" | "parcial" | "vetar"): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "sancao") return m;
  const { projeto } = m.pendencia;
  if (escolha === "sancionar") {
    aplicar(m, projeto.sancionar);
    aplicar(m, { congresso: 1 + projeto.interesse * 2 });
    noticiar(m, `Presidente sanciona: ${projeto.nome}.`);
  } else {
    const parcial = escolha === "parcial";
    if (parcial) aplicar(m, Object.fromEntries(Object.entries(projeto.sancionar).map(([k, v]) => [k, v / 2])));
    const peso = parcial ? 0.5 : 1;
    aplicar(m, {
      congresso: -(2 + projeto.interesse * 5) * peso,
      aprovacao: (projeto.popular > 0.5 ? -(projeto.popular - 0.5) * 8 : (0.5 - projeto.popular) * 4) * peso,
    });
    m.vetos = [...(m.vetos ?? []), { id: projeto.id, mes: m.mes + 2, parcial }];
    noticiar(m, `Presidente veta ${parcial ? "parte do projeto" : "o projeto"}: ${projeto.nome}. O Congresso vai analisar o veto.`);
  }
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

function sessaoDoVeto(m: Mandato, veto: { id: string; mes: number; parcial: boolean }) {
  m.vetos = (m.vetos ?? []).filter((v) => v !== veto);
  const projeto = PROJETOS_DO_CONGRESSO.find((p) => p.id === veto.id);
  if (!projeto) return;
  const chance = (0.2 + projeto.interesse * 0.35 + projeto.popular * 0.15 + (50 - m.congresso) / 120) * (veto.parcial ? 0.75 : 1);
  const forca = chance + (sortear(m) - 0.5) * 0.35;
  const deputados = Math.round(Math.min(513, Math.max(0, 513 * (0.22 + forca * 0.5))));
  const senadores = Math.round(Math.min(81, Math.max(0, 81 * (0.22 + forca * 0.5) + (sortear(m) - 0.5) * 6)));
  const derrubado = deputados >= 257 && senadores >= 41;
  if (derrubado) {
    const parte = veto.parcial ? 0.5 : 1;
    aplicar(m, Object.fromEntries(Object.entries(projeto.sancionar).map(([k, v]) => [k, v * parte])));
    aplicar(m, { congresso: -2, aprovacao: -1 });
    noticiar(m, `Congresso derruba o veto: ${projeto.nome} vira lei.`);
  } else {
    aplicar(m, { congresso: 1 });
    noticiar(m, `Veto mantido: ${projeto.nome}.`);
  }
  mostrarResultado(m, {
    sobretitulo: "Sessão do Congresso · Análise do veto",
    titulo: derrubado ? "O Congresso derrubou o seu veto" : "O seu veto foi mantido",
    texto: `${projeto.nome}. Para derrubar um veto são precisos 257 deputados e 41 senadores.`,
    cena: derrubado ? "rejeitado" : "aprovado",
    placar: [
      { rotulo: "Deputados pela derrubada", sim: deputados, nao: 513 - deputados },
      { rotulo: "Senadores pela derrubada", sim: senadores, nao: 81 - senadores },
    ],
  });
}

export function decidirSobreSTF(original: Mandato, escolha: "cumprir" | "recorrer" | "afrontar"): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "stf") return m;
  const { decisao } = m.pendencia;
  if (escolha === "cumprir") {
    aplicar(m, decisao.cumprir);
    noticiar(m, `Governo cumpre a decisão: ${decisao.titulo}.`);
  } else if (escolha === "recorrer") {
    // O recurso pode mudar parte da decisão, mas no fim o governo cumpre o que o plenário decidir.
    const venceu = sortear(m) < 0.35;
    aplicar(m, venceu ? decisao.recorrer : decisao.cumprir);
    noticiar(m, venceu ? `Recurso do governo ameniza a decisão: ${decisao.titulo}.` : `STF mantém a decisão: ${decisao.titulo}.`);
  } else {
    aplicar(m, AFRONTAR_STF);
    m.drama.flags.push("afronta-stf");
    noticiar(m, "Crise entre os Poderes: o governo diz que não vai cumprir a decisão do STF.");
  }
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

// A tentativa de golpe tem dois momentos. No fim, quase sempre fracassa, e o mandato acaba.
export function avancarGolpe(original: Mandato, opcao: number | "recuar"): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "golpe") return m;
  if (opcao === "recuar") {
    aplicar(m, { "s.confianca": -4, aprovacao: -3, congresso: -5 });
    noticiar(m, "O presidente recua. A reunião com os comandantes vira escândalo.");
    m.drama.flags.push("afronta-stf");
    m.pendencia = null;
    m.fase = "gestao";
    return m;
  }
  const passo = PASSOS_DO_GOLPE[m.pendencia.passo];
  const escolha = passo.opcoes[opcao] ?? passo.opcoes[0];
  aplicar(m, escolha.efeito);
  const chance = Math.max(0.01, Math.min(0.3, m.pendencia.chance + escolha.chance));
  if (m.pendencia.passo + 1 < PASSOS_DO_GOLPE.length) {
    m.pendencia = { tipo: "golpe", passo: m.pendencia.passo + 1, chance };
    return m;
  }
  if (sortear(m) < chance) {
    m.golpe = "venceu";
    aplicar(m, { "e.confianca": -35, "e.dolar": 2.5, "s.confianca": -40, aprovacao: -15, pressao: 30 });
    for (const parceiro of Object.keys(m.relacoes)) m.relacoes[parceiro] = limitar(m.relacoes[parceiro] - 30);
    noticiar(m, "Ruptura institucional: o Brasil está sob um regime de exceção.");
    mostrarResultado(m, {
      sobretitulo: "Ruptura institucional",
      titulo: "O golpe foi adiante",
      texto:
        "Tanques nas ruas, Congresso fechado e o país isolado. Sanções chegam de todos os lados, o dinheiro foge e a história já começou a escrever o seu nome do lado errado. A partida termina aqui.",
      cena: "tanques",
    });
  } else {
    m.golpe = "fracassou";
    m.cassado = true;
    aplicar(m, { "s.confianca": 6, aprovacao: -20 });
    noticiar(m, "A tentativa de golpe fracassa. O presidente é afastado.");
    mostrarResultado(m, {
      sobretitulo: "A democracia resistiu",
      titulo: "A tentativa de golpe fracassou",
      texto:
        "Os comandantes recusaram a ordem. O Congresso afastou você no mesmo dia, e o caso foi para a Justiça como crime contra o Estado Democrático de Direito.",
      cena: "tribunal",
    });
  }
  return m;
}

function fotografar(m: Mandato) {
  return Object.fromEntries(INDICADORES_DA_DECISAO.map((i) => [i.chave, lerIndicador(m, i.chave)]));
}

function diferenca(antes: Record<string, number>, depois: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(depois)
      .map(([chave, valor]) => [chave, valor - (antes[chave] ?? valor)] as const)
      .filter(([chave, valor]) => Math.abs(valor) >= (chave === "aprovacao" || chave === "congresso" ? 0.2 : 0.02)),
  );
}

// Chamado depois de toda mudança feita pelo jogador dentro do mesmo mês: o fechamento do mês tem resumo próprio.
export function registrarDecisao(antes: Mandato, depois: Mandato): Mandato {
  if (depois.mes !== antes.mes || depois.fase === "fim") return depois;
  const nova = depois.noticias[0];
  const velha = antes.noticias[0];
  if (!nova || (velha && nova.texto === velha.texto && nova.mes === velha.mes)) return depois;
  const mudancas = diferenca(fotografar(antes), fotografar(depois));
  let futuro: string | null = null;
  const novosPendentes = depois.pendentes.filter((p) => !antes.pendentes.some((a) => a.texto === p.texto && a.mes === p.mes));
  const novosProgramas = (depois.programas ?? []).filter((p) => !(antes.programas ?? []).some((a) => a.id === p.id));
  if (novosPendentes.length > 0) futuro = `Mais efeitos em cerca de ${Math.min(...novosPendentes.map((p) => p.mes - depois.mes))} meses.`;
  else if (novosProgramas.length > 0) futuro = `Age todo mês até ${nomeDoMes(novosProgramas[0].fim)}.`;
  else if ((depois.vetos ?? []).length > (antes.vetos ?? []).length) futuro = "O Congresso analisa o veto em 2 meses.";
  const decisao: Decisao = { mes: depois.mes, texto: nova.texto, mudancas, futuro };
  return { ...depois, decisoes: [decisao, ...(depois.decisoes ?? [])].slice(0, 80) };
}

// Reações simples, só a partir do que mudou.
export function reacoesDaDecisao(d: Decisao) {
  const saldo = INDICADORES_DA_DECISAO.reduce((soma, i) => {
    const valor = d.mudancas[i.chave] ?? 0;
    const peso = i.chave === "aprovacao" || i.chave === "congresso" ? 0.2 : 3;
    return soma + (i.menor ? -valor : valor) * peso;
  }, 0);
  const aprovacao = d.mudancas.aprovacao ?? 0;
  const congresso = d.mudancas.congresso ?? 0;
  return {
    imprensa: saldo > 0.15 ? "elogia" : saldo < -0.15 ? "critica" : "observa",
    populacao: aprovacao > 0.2 ? "gostou" : aprovacao < -0.2 ? "reprovou" : "indiferente",
    partidos: congresso > 0.2 ? "satisfeitos" : congresso < -0.2 ? "irritados" : "neutros",
  };
}

export function lerIndicador(m: Mandato, chave: string) {
  if (chave === "aprovacao") return m.aprovacao;
  if (chave === "congresso") return m.congresso;
  if (chave === "relacoes") {
    const valores = Object.values(m.relacoes);
    return valores.reduce((soma, v) => soma + v, 0) / Math.max(1, valores.length);
  }
  const [grupo, campo] = chave.split(".");
  if (grupo === "e") return m.economia[campo as keyof Economia];
  if (grupo === "s") return m.sociedade[campo as keyof Sociedade];
  return m.seguranca[campo as keyof Seguranca];
}

function empurrar(m: Mandato, chave: string, valor: number) {
  if (chave === "relacoes") {
    for (const parceiro of Object.keys(m.relacoes)) m.relacoes[parceiro] = limitar(m.relacoes[parceiro] + valor);
    return;
  }
  aplicar(m, { [chave]: valor });
}

// Dar uma meta não gasta ação: o ministro passa a trabalhar por ela até o prazo.
export function darMeta(original: Mandato, ministerio: string, ousada: boolean): Mandato {
  const indicador = INDICADOR_DA_PASTA[ministerio];
  if (!indicador || (original.metasMinistros ?? []).some((meta) => meta.ministerio === ministerio)) return original;
  const m = structuredClone(original);
  const inicial = lerIndicador(m, indicador.chave);
  const passo = ousada ? indicador.ousada : indicador.realista;
  const meta: MetaDoMinistro = {
    ministerio, inicial, alvo: inicial + (indicador.menor ? -passo : passo), inicio: m.mes, prazo: PRAZO_DA_META, ousada, cobrancas: 0,
  };
  m.metasMinistros = [...(m.metasMinistros ?? []), meta];
  const pasta = MINISTERIOS.find((p) => p.id === ministerio)?.nome ?? "pasta";
  noticiar(m, `Meta ${ousada ? "ousada" : "definida"} para ${pasta}: ${(indicador.nome.charAt(0).toLowerCase() + indicador.nome.slice(1))} em 12 meses.`);
  return m;
}

export function metaCumprida(m: Mandato, meta: MetaDoMinistro) {
  const indicador = INDICADOR_DA_PASTA[meta.ministerio];
  const atual = lerIndicador(m, indicador.chave);
  return indicador.menor ? atual <= meta.alvo : atual >= meta.alvo;
}

// A cada mês, quem tem meta trabalha por ela. Ministro mais competente rende mais.
function avancarMetas(m: Mandato, contexto: Contexto) {
  let falhou: MetaDoMinistro | null = null;
  for (const meta of m.metasMinistros ?? []) {
    const indicador = INDICADOR_DA_PASTA[meta.ministerio];
    const pessoa = pessoaPorId(contexto.governo.ministros[meta.ministerio]);
    if (!indicador || !pessoa) continue;
    const competencia = atributosDe(pessoa, contexto.candidato).competencia / 70;
    empurrar(m, indicador.chave, ((meta.alvo - meta.inicial) / meta.prazo) * (meta.ousada ? 0.55 : 0.7) * competencia);
  }
  for (const meta of [...(m.metasMinistros ?? [])]) {
    if (meta.inicio + meta.prazo > m.mes) continue;
    const pasta = MINISTERIOS.find((p) => p.id === meta.ministerio)?.nome ?? "pasta";
    if (metaCumprida(m, meta)) {
      m.metasMinistros = (m.metasMinistros ?? []).filter((item) => item !== meta);
      m.metasBatidas = (m.metasBatidas ?? 0) + 1;
      m.gestao = limitar(m.gestao + (meta.ousada ? 5 : 3));
      aplicar(m, { aprovacao: meta.ousada ? 2 : 1 });
      noticiar(m, `Meta cumprida: ${pasta} entregou o resultado.`);
      if (m.metasBatidas >= 3) conquistar(m, "equipe-afinada");
    } else if (!falhou) {
      falhou = meta;
    }
  }
  return falhou;
}

export function resolverMetaPerdida(original: Mandato, escolha: "manter" | "demitir"): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "meta-ministro") return m;
  const { ministerio } = m.pendencia;
  const pasta = MINISTERIOS.find((p) => p.id === ministerio)?.nome ?? "pasta";
  m.metasMinistros = (m.metasMinistros ?? []).filter((meta) => meta.ministerio !== ministerio);
  if (escolha === "manter") {
    m.gestao = limitar(m.gestao - 2);
    noticiar(m, `O presidente mantém o comando de ${pasta}, apesar da meta perdida.`);
  } else {
    aplicar(m, { aprovacao: 1, congresso: -2 });
    noticiar(m, `Demissão: o presidente troca o comando de ${pasta}.`);
  }
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

export const DATAS_CIVICAS: Record<"independencia" | "bandeira", { titulo: string; texto: string; cena: TipoCena; opcoes: { texto: string; efeito: Efeito }[] }> = {
  independencia: {
    titulo: "7 de Setembro",
    texto: "Dia da Independência. Tropas, escolas e bandas desfilam na Esplanada, e o país espera o presidente.",
    cena: "desfile" as TipoCena,
    opcoes: [
      { texto: "Desfilar em carro aberto e acenar para o povo.", efeito: { aprovacao: 1.5, pressao: 2 } },
      { texto: "Assistir da tribuna e fazer um discurso curto de união.", efeito: { aprovacao: 0.5, pressao: -3, "s.confianca": 1 } },
      { texto: "Mandar o vice no seu lugar.", efeito: { aprovacao: -1 } },
    ],
  },
  bandeira: {
    titulo: "Dia da Bandeira",
    texto: "19 de novembro. A Bandeira é hasteada em todo o país, e o Planalto prepara a cerimônia.",
    cena: "hasteamento" as TipoCena,
    opcoes: [
      { texto: "Hastear a Bandeira ao lado de estudantes de escolas públicas.", efeito: { aprovacao: 0.8, "s.educacao": 0.5 } },
      { texto: "Fazer uma cerimônia simples no Planalto.", efeito: { "s.confianca": 0.5 } },
      { texto: "Enviar um ministro em seu lugar.", efeito: { aprovacao: -0.5 } },
    ],
  },
};

export function responderDataCivica(original: Mandato, opcao: number): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "data-civica") return m;
  const data = DATAS_CIVICAS[m.pendencia.data];
  const escolha = data.opcoes[opcao] ?? data.opcoes[0];
  aplicar(m, escolha.efeito);
  noticiar(m, `${data.titulo}: ${escolha.texto.charAt(0).toLowerCase()}${escolha.texto.slice(1)}`);
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

function proximoDialogo(m: Mandato): { id: IdDialogo; contexto: string | null } | null {
  const visto = (id: IdDialogo) => m.drama.flags.includes(`dialogo-${id}`);
  if (!visto("reuniao") && m.mes >= 4) return { id: "reuniao", contexto: null };
  const recente = (m.decisoes ?? []).find((d) => d.mes === m.mes - 1);
  if (!visto("entrevista") && m.mes >= 6 && recente) return { id: "entrevista", contexto: recente.texto };
  const ultimaCrise = (m.crises ?? []).at(-1);
  if (!visto("pronunciamento") && (ultimaCrise || m.drama.pressao >= 65)) {
    return {
      id: "pronunciamento",
      contexto: ultimaCrise
        ? `O país ainda sente os efeitos da crise: ${ultimaCrise.nome.toLowerCase()}.`
        : "As ruas estão tensas, e a temperatura política subiu nas últimas semanas.",
    };
  }
  return null;
}

export function responderDialogo(original: Mandato, opcao: number): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "dialogo") return m;
  const dialogo = montarDialogo(m.pendencia.id, m.pendencia.contexto);
  const escolha = dialogo.opcoes[opcao] ?? dialogo.opcoes[0];
  aplicar(m, escolha.efeito);
  noticiar(m, `${dialogo.titulo} (${escolha.texto.replace(/\.$/, "")})`);
  m.pendencia = null;
  m.fase = "gestao";
  return m;
}

export function criseAtual(m: Mandato) {
  return m.crise ? CRISES.find((c) => c.id === m.crise?.id) ?? null : null;
}

// Assessores que pediram demissão não aparecem mais no gabinete de crise.
export function conselhosDaFase(m: Mandato) {
  const crise = criseAtual(m);
  if (!crise || !m.crise) return [];
  const fase = crise.fases[m.crise.fase];
  const todos = fase.conselhos.map((conselho, indice) => ({ conselho, indice }));
  const presentes = todos.filter(({ conselho }) => !m.drama.flags.includes(`saiu-${conselho.quem}`));
  return presentes.length >= 2 ? presentes : todos;
}

export function decidirCrise(original: Mandato, indice: number | null): Mandato {
  const m = structuredClone(original);
  const crise = criseAtual(m);
  if (m.pendencia?.tipo !== "crise" || !crise || !m.crise) return m;
  const ativa = m.crise;
  const fase = crise.fases[ativa.fase];
  const presentes = conselhosDaFase(m).map((c) => c.conselho);
  const antes = ativa.gravidade;
  const reacoes: { quem: string; texto: string }[] = [];
  let texto: string;
  // Toda crise piora um pouco sozinha de um mês para o outro.
  ativa.gravidade += 4;
  if (indice === null) {
    ativa.gravidade += 16;
    aplicar(m, { aprovacao: -3 });
    texto = "O tempo acabou sem uma decisão. Cada área agiu por conta própria, e a crise piorou.";
    for (const conselho of presentes.slice(0, 2)) reacoes.push({ quem: conselho.quem, texto: "Ninguém deu a ordem. Fizemos o que deu." });
    for (const conselho of presentes) ativa.ignorados[conselho.quem] = (ativa.ignorados[conselho.quem] ?? 0) + 1;
  } else {
    const escolhido = fase.conselhos[indice] ?? presentes[0];
    aplicar(m, escolhido.efeito);
    ativa.gravidade += escolhido.gravidade + ruido(m, 4);
    texto = `Você seguiu o plano de ${PERSONAGENS[escolhido.quem]?.nome ?? "um assessor"}: ${escolhido.plano.charAt(0).toLowerCase()}${escolhido.plano.slice(1)}`;
    reacoes.push({ quem: escolhido.quem, texto: "Deixa comigo, presidente." });
    for (const conselho of presentes.filter((c) => c !== escolhido)) {
      ativa.ignorados[conselho.quem] = (ativa.ignorados[conselho.quem] ?? 0) + 1;
      reacoes.push({ quem: conselho.quem, texto: conselho.ignorado });
    }
  }
  ativa.gravidade = limitar(Math.round(ativa.gravidade));
  noticiar(m, `Gabinete de crise (${crise.nome}): ${fase.titulo.toLowerCase()}.`);

  // Quem é ignorado em todas as fases pede demissão, e as histórias dele acabam.
  let saiu: string | null = null;
  for (const [quem, vezes] of Object.entries(ativa.ignorados)) {
    if (vezes >= 3 && !m.drama.flags.includes(`saiu-${quem}`) && !saiu) {
      saiu = quem;
      m.drama.flags.push(`saiu-${quem}`);
      aplicar(m, { pressao: 3 });
      noticiar(m, `${PERSONAGENS[quem]?.nome ?? "Um assessor"} pede demissão e deixa o governo.`);
    }
  }

  let desfecho: Desfecho | null = null;
  if (ativa.fase + 1 >= crise.fases.length) {
    desfecho = desfechoDaCrise(ativa.gravidade);
    aplicar(m, crise.desfechos[desfecho]);
    m.crises = [...(m.crises ?? []), { id: crise.id, nome: crise.nome, desfecho, mes: m.mes }];
    m.crise = null;
    m.proximaCrise = m.mes + 9;
    if (desfecho === "contida") conquistar(m, "crise-contida");
    noticiar(m, `${crise.nome}: ${crise.textos[desfecho]}`);
  } else {
    ativa.fase += 1;
    ativa.proxima = m.mes + 1;
  }
  m.pendencia = {
    tipo: "crise-resultado",
    titulo: desfecho ? NOME_DESFECHO[desfecho] : fase.titulo,
    texto: desfecho ? `${texto} ${crise.textos[desfecho]}` : `${texto} A crise continua no próximo mês.`,
    antes,
    depois: ativa.gravidade,
    reacoes,
    desfecho,
    saiu,
  };
  return m;
}

export function marcarPosse(original: Mandato): Mandato {
  return { ...original, posses: [...(original.posses ?? []), original.mes] };
}

export function precisaDePosse(m: Mandato) {
  return (m.mes === 1 || m.mes === 49) && m.fase === "gestao" && !(m.posses ?? []).includes(m.mes) && m.acoes === ACOES_POR_MES;
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
    m.nomeacao = { nome: escolhido.nome, tipo: "indicacao", id: vaga.id };
    noticiar(m, `Senado aprova ${escolhido.nome}: ${vaga.cargo}.`);
  } else {
    aplicar(m, { congresso: -5, aprovacao: -1 });
    noticiar(m, `Senado rejeita ${escolhido.nome}: ${vaga.cargo}.`);
    // A vaga volta depois de três meses, tempo de reorganizar a base no Senado.
    if (m.mes + 3 <= m.limite) m.vagasReabertas.push({ id: vaga.id, mes: m.mes + 3 });
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
  m.fase = m.cassado || m.golpe ? "fim" : "gestao";
  return m;
}

// Para barrar o impeachment, o governo precisa de 172 deputados ou, no Senado, de 28 senadores.
export function defenderImpeachment(original: Mandato, contexto: Contexto, defesa: string): Mandato {
  const m = structuredClone(original);
  if (m.pendencia?.tipo !== "impeachment") return m;
  const escolha = DEFESAS_IMPEACHMENT.find((d) => d.id === defesa) ?? DEFESAS_IMPEACHMENT[0];
  aplicar(m, escolha.efeito);
  // Com o governo impopular, a base se desfaz: parlamentar não quer afundar junto.
  const apoio = escolha.bonus - Math.max(0, 35 - m.aprovacao) * 0.012;
  const camara = votar(m, contexto, { economia: 50, camara: 172, senado: 0 }, apoio).camara;
  if (camara.aprovado) {
    aplicar(m, { congresso: 2 });
    conquistar(m, "sobreviveu");
    noticiar(m, "A Câmara barra o pedido de impeachment.");
    m.pendencia = {
      tipo: "resultado-indicacao",
      titulo: "O impeachment foi barrado na Câmara",
      texto: "Votos do governo contra a abertura do processo. O governo precisava de 172",
      sim: camara.sim,
      nao: camara.nao,
    };
    return m;
  }
  const senado = votar(m, contexto, { economia: 50, camara: 0, senado: 28 }, apoio).senado;
  const sobreviveu = Boolean(senado?.aprovado);
  m.cassado = !sobreviveu;
  if (sobreviveu) conquistar(m, "sobreviveu");
  noticiar(m, sobreviveu ? "O Senado absolve o governo no impeachment." : "O Senado aprova o impeachment.");
  m.pendencia = {
    tipo: "resultado-indicacao",
    titulo: sobreviveu ? "O Senado salvou o seu mandato" : "O seu mandato foi cassado",
    texto: "Votos do governo no Senado. O governo precisava de 28",
    sim: senado?.sim ?? 0,
    nao: senado?.nao ?? 0,
  };
  return m;
}

export function registrarReeleicao(original: Mandato, votos: number, venceu: boolean): Mandato {
  const m = structuredClone(original);
  m.reeleicao = { votos, venceu };
  if (venceu) {
    m.limite = MESES * 2;
    m.mes += 1;
    m.acoes = ACOES_POR_MES;
    m.fase = "gestao";
    noticiar(m, `Reeleição: o segundo mandato começa com ${Math.round(m.aprovacao)}% de aprovação.`);
  }
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
