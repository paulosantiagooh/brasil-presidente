import type { Campanha } from "./campanha";
import { dadosDoVice, PARTIDOS, partidoDoCandidato, siglaDoVice, type Candidato } from "./candidato";
import { percentualValido, totalDoTurno, type Eleicao } from "./eleicao";
import { politicoPorId, POLITICOS, type Pessoa, type TipoPessoa } from "./pessoas";

export type { Pessoa };

export const DEPUTADOS = 513;
export const SENADORES = 81;

type Bancada = { deputados: number; senadores: number };

// Câmara eleita em 2026 e projeção do Senado para 2027.
const BANCADAS_2026: Record<string, Bancada> = {
  PL: { deputados: 121, senadores: 28 },
  PT: { deputados: 70, senadores: 9 },
  UNIÃO: { deputados: 46, senadores: 5 },
  PSD: { deputados: 43, senadores: 5 },
  PP: { deputados: 41, senadores: 6 },
  Republicanos: { deputados: 41, senadores: 6 },
  MDB: { deputados: 36, senadores: 8 },
  PODE: { deputados: 27, senadores: 2 },
  PSB: { deputados: 15, senadores: 4 },
  PSOL: { deputados: 14, senadores: 0 },
  PSDB: { deputados: 11, senadores: 2 },
  PCdoB: { deputados: 11, senadores: 0 },
  NOVO: { deputados: 10, senadores: 3 },
  PV: { deputados: 7, senadores: 0 },
  PDT: { deputados: 6, senadores: 1 },
  Avante: { deputados: 5, senadores: 0 },
  PRD: { deputados: 5, senadores: 0 },
  Solidariedade: { deputados: 2, senadores: 0 },
  REDE: { deputados: 1, senadores: 1 },
  MISSÃO: { deputados: 1, senadores: 0 },
  "Sem partido": { deputados: 0, senadores: 1 },
};

export type Ministerio = {
  id: string;
  nome: string;
  essencial: boolean;
  peso: number;
  tecnico: string;
  opcional?: boolean;
};

// Quem aparece como técnico é fictício.
export const MINISTERIOS: Ministerio[] = [
  { id: "casa-civil", nome: "Casa Civil", essencial: true, peso: 3, tecnico: "Marta Vieira Assunção" },
  { id: "fazenda", nome: "Fazenda", essencial: true, peso: 3, tecnico: "Henrique Salles Barros" },
  { id: "saude", nome: "Saúde", essencial: true, peso: 2, tecnico: "Dra. Lívia Andrade Reis" },
  { id: "educacao", nome: "Educação", essencial: true, peso: 2, tecnico: "Prof. Ivo Tavares Mota" },
  { id: "justica", nome: "Justiça e Segurança Pública", essencial: true, peso: 2, tecnico: "Dra. Teresa Lima Quadros" },
  { id: "defesa", nome: "Defesa", essencial: true, peso: 1, tecnico: "Almir Rocha Fontana" },
  { id: "relacoes-exteriores", nome: "Relações Exteriores", essencial: true, peso: 1, tecnico: "Embaixadora Helena Prado Luz" },
  { id: "planejamento", nome: "Planejamento e Orçamento", essencial: false, peso: 2, tecnico: "Sérgio Paiva Nogueira" },
  { id: "infraestrutura", nome: "Infraestrutura", essencial: false, peso: 2, tecnico: "Eng. Paula Cardoso Melo" },
  { id: "agricultura", nome: "Agricultura", essencial: false, peso: 1, tecnico: "Vicente Brito Sampaio" },
  { id: "ambiente", nome: "Meio Ambiente", essencial: false, peso: 1, tecnico: "Dra. Nara Coelho Dantas" },
  { id: "social", nome: "Desenvolvimento Social", essencial: false, peso: 1, tecnico: "Rita Moraes Cavalcante" },
  { id: "ciencia", nome: "Ciência e Tecnologia", essencial: false, peso: 1, tecnico: "Prof. Otto Ribas Teles" },
  { id: "cultura", nome: "Cultura", essencial: false, peso: 1, tecnico: "Clara Neves Pacheco", opcional: true },
  { id: "cidades", nome: "Cidades", essencial: false, peso: 1, tecnico: "Eng. Murilo Dias Falcão", opcional: true },
  { id: "pesca", nome: "Pesca", essencial: false, peso: 1, tecnico: "Dalva Lopes Castro", opcional: true },
];

export type AtributosMinistro = {
  competencia: number;
  popularidade: number;
  fidelidade: number;
  negociacao: number;
  eficiencia: number;
  confiabilidade: number;
};

export const NOME_ATRIBUTO_MINISTRO: Record<keyof AtributosMinistro, string> = {
  competencia: "Competência",
  popularidade: "Popularidade",
  fidelidade: "Fidelidade",
  negociacao: "Negociação",
  eficiencia: "Eficiência",
  confiabilidade: "Confiabilidade",
};

// Os números vêm do tipo de cargo, iguais para todos do grupo: não avaliam a pessoa.
const BASE_POR_TIPO: Record<TipoPessoa, Omit<AtributosMinistro, "fidelidade">> = {
  governo: { competencia: 70, popularidade: 60, negociacao: 60, eficiencia: 65, confiabilidade: 60 },
  senado: { competencia: 60, popularidade: 55, negociacao: 75, eficiencia: 55, confiabilidade: 60 },
  deputado: { competencia: 55, popularidade: 50, negociacao: 70, eficiencia: 50, confiabilidade: 60 },
  politico: { competencia: 60, popularidade: 55, negociacao: 65, eficiencia: 55, confiabilidade: 60 },
  tecnico: { competencia: 85, popularidade: 30, negociacao: 35, eficiencia: 80, confiabilidade: 80 },
};

export const AREAS = [
  { id: "saude", nome: "Saúde", custo: 40, piso: 2 },
  { id: "educacao", nome: "Educação", custo: 35, piso: 2 },
  { id: "social", nome: "Desenvolvimento social", custo: 35, piso: 1 },
  { id: "infraestrutura", nome: "Infraestrutura", custo: 30, piso: 1 },
  { id: "defesa", nome: "Defesa", custo: 15, piso: 1 },
  { id: "transporte", nome: "Transporte", custo: 15, piso: 1 },
  { id: "seguranca", nome: "Segurança", custo: 12, piso: 1 },
  { id: "agricultura", nome: "Agricultura", custo: 8, piso: 1 },
  { id: "ciencia", nome: "Ciência e tecnologia", custo: 6, piso: 1 },
  { id: "ambiente", nome: "Meio ambiente", custo: 5, piso: 1 },
  { id: "cultura", nome: "Cultura", custo: 2, piso: 1 },
];

export const NOME_NIVEL = ["", "Mínima", "Reduzida", "Intermediária", "Elevada", "Máxima planejada"];

// Valores ilustrativos do jogo, em R$ bilhões.
export const TETO_ORCAMENTO = Math.round(AREAS.reduce((soma, area) => soma + area.custo * 3, 0) * 1.25);

type EfeitoGoverno = { aprovacao?: number; credibilidade?: number; governabilidade?: number };

export type Decisao = {
  id: string;
  tema: string;
  texto: string;
  opcoes: { texto: string; efeito: EfeitoGoverno }[];
};

export const DECISOES: Decisao[] = [
  {
    id: "salario-minimo",
    tema: "Economia",
    texto: "Qual será o reajuste do salário mínimo no primeiro ano?",
    opcoes: [
      { texto: "Aumento acima da inflação.", efeito: { aprovacao: 4, credibilidade: -3 } },
      { texto: "Reposição da inflação, para preservar as contas.", efeito: { aprovacao: -2, credibilidade: 4 } },
      { texto: "Aumento moderado, com regra para os próximos anos.", efeito: { aprovacao: 1, credibilidade: 1 } },
    ],
  },
  {
    id: "primeira-viagem",
    tema: "Política externa",
    texto: "Para onde vai a primeira viagem internacional do governo?",
    opcoes: [
      { texto: "Argentina e Mercosul, para reforçar a região.", efeito: { aprovacao: 1, credibilidade: 1 } },
      { texto: "Grandes parceiros comerciais, para buscar investimentos.", efeito: { credibilidade: 2 } },
      { texto: "Adiar viagens e focar nos problemas internos.", efeito: { aprovacao: 2, credibilidade: -1 } },
    ],
  },
  {
    id: "relacao-congresso",
    tema: "Congresso",
    texto: "Qual será o tom da relação com o Congresso nos primeiros meses?",
    opcoes: [
      { texto: "Negociar projeto a projeto, abrindo espaço aos líderes.", efeito: { governabilidade: 5, aprovacao: -1 } },
      { texto: "Levar as pautas direto à população para pressionar os parlamentares.", efeito: { aprovacao: 3, governabilidade: -5 } },
      { texto: "Dividir o poder: dar mais espaço aos partidos no governo.", efeito: { governabilidade: 7, credibilidade: -2, aprovacao: -2 } },
    ],
  },
];

export type Projeto = {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  economia: number;
  camara: number | null;
  senado: number | null;
  efeito: EfeitoGoverno;
};

export const PROJETOS: Projeto[] = [
  {
    id: "programa-social",
    nome: "Programa nacional de renda e emprego",
    descricao: "Projeto de lei. Basta a maioria dos parlamentares presentes.",
    tipo: "Projeto de lei",
    economia: 35,
    camara: null,
    senado: null,
    efeito: { aprovacao: 5, credibilidade: -1 },
  },
  {
    id: "regra-fiscal",
    nome: "Nova regra fiscal",
    descricao: "Lei complementar. Precisa de 257 deputados e 41 senadores.",
    tipo: "Lei complementar",
    economia: 70,
    camara: 257,
    senado: 41,
    efeito: { credibilidade: 7, aprovacao: 1 },
  },
  {
    id: "reforma-administrativa",
    nome: "Reforma administrativa",
    descricao: "Emenda à Constituição. Precisa de 308 deputados e 49 senadores.",
    tipo: "Emenda à Constituição",
    economia: 72,
    camara: 308,
    senado: 49,
    efeito: { credibilidade: 9, aprovacao: 2, governabilidade: 3 },
  },
];

export type VotoPartido = { sigla: string; sim: number; nao: number };

export type Casa = { sim: number; nao: number; necessarios: number | null; aprovado: boolean; partidos: VotoPartido[] };

export type Votacao = { projeto: string; camara: Casa; senado: Casa | null; aprovado: boolean };

export type Governo = {
  versao: 1;
  semente: number;
  passo: number;
  ministros: Record<string, string | null>;
  situacao: Record<string, string>;
  orcamento: Record<string, number>;
  decisoes: Record<string, number>;
  bancadas: Record<string, Bancada>;
  adversario: string | null;
  projeto: string | null;
  votacao: Votacao | null;
};

export const PASSOS_GOVERNO = ["Ministérios", "Congresso", "Orçamento", "Decisões", "Votação", "Balanço"];

function sortear(g: { semente: number }) {
  g.semente = (g.semente + 0x6d2b79f5) | 0;
  let t = g.semente;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const limitar = (valor: number, minimo = 0, maximo = 100) =>
  Math.min(maximo, Math.max(minimo, valor));

function retirarCadeiras(bancadas: Record<string, Bancada>, casa: keyof Bancada, quantidade: number, protegido: string) {
  for (let vez = 0; vez < quantidade; vez++) {
    const maior = Object.keys(bancadas)
      .filter((sigla) => sigla !== protegido)
      .sort((a, b) => bancadas[b][casa] - bancadas[a][casa])[0];
    bancadas[maior][casa] -= 1;
  }
}

// O Congresso do jogo é o eleito em 2026. Só um partido criado pelo jogador ganha cadeiras.
function montarBancadas(candidato: Candidato) {
  const bancadas = structuredClone(BANCADAS_2026);
  const sigla = partidoDoCandidato(candidato)?.sigla ?? "Sem partido";
  if (bancadas[sigla]) return bancadas;
  bancadas[sigla] = { deputados: 12, senadores: 2 };
  retirarCadeiras(bancadas, "deputados", 12, sigla);
  retirarCadeiras(bancadas, "senadores", 2, sigla);
  return bancadas;
}

export function criarGoverno(candidato: Candidato, campanha: Campanha, eleicao: Eleicao): Governo {
  const finalistas = eleicao.finalistas.filter((i) => i !== 0);
  const adversario = finalistas.length > 0 ? campanha.rivais[finalistas[0] - 1].sigla : null;
  const ministros: Record<string, string | null> = {};
  const situacao: Record<string, string> = {};
  for (const ministerio of MINISTERIOS) {
    situacao[ministerio.id] = ministerio.opcional ? "extinto" : "ativo";
    ministros[ministerio.id] = null;
  }
  return {
    versao: 1,
    semente: eleicao.semente,
    passo: 0,
    ministros,
    situacao,
    orcamento: Object.fromEntries(AREAS.map((area) => [area.id, 3])),
    decisoes: {},
    bancadas: montarBancadas(candidato),
    adversario,
    projeto: null,
    votacao: null,
  };
}

export function ministeriosAtivos(g: Governo) {
  return MINISTERIOS.filter((m) => g.situacao[m.id] === "ativo");
}

function tecnicoDe(ministerio: Ministerio): Pessoa {
  return {
    id: `tecnico-${ministerio.id}`,
    nome: ministerio.tecnico,
    sigla: null,
    uf: "DF",
    cargo: "Técnico sem partido (personagem fictício).",
    tipo: "tecnico",
  };
}

export function pessoaPorId(id: string | null): Pessoa | null {
  if (!id) return null;
  const politico = politicoPorId(id);
  if (politico) return politico;
  const ministerio = MINISTERIOS.find((m) => `tecnico-${m.id}` === id);
  return ministerio ? tecnicoDe(ministerio) : null;
}

// Quem está na chapa, enfrentou o jogador no segundo turno ou tem mandato fixo não entra no ministério.
// Com `trocar`, quem já é ministro aparece na lista: ao assumir aqui, deixa a outra pasta vaga.
export function candidatosAoMinisterio(
  g: Governo,
  c: Candidato,
  ministerio: Ministerio,
  nomesFora: string[],
  trocar = false,
) {
  const ocupados = new Set(
    Object.entries(g.ministros)
      .filter(([id, pessoa]) => pessoa && id !== ministerio.id)
      .map(([, pessoa]) => pessoa),
  );
  const vice = dadosDoVice(c)?.nome;
  const politicos = POLITICOS.filter(
    (p) => (trocar || !ocupados.has(p.id)) && p.nome !== vice && p.nome !== c.nomeUrna && !nomesFora.includes(p.nome),
  );
  return [tecnicoDe(ministerio), ...politicos];
}

export function pastaDaPessoa(g: Governo, pessoaId: string) {
  const id = Object.keys(g.ministros).find((m) => g.ministros[m] === pessoaId);
  return MINISTERIOS.find((m) => m.id === id) ?? null;
}

function posicaoDoPartido(sigla: string, c: Candidato) {
  const proprio = partidoDoCandidato(c);
  if (proprio?.sigla === sigla) return proprio;
  return PARTIDOS.find((p) => p.sigla === sigla) ?? { economia: 50, costumes: 50 };
}

function distanciaDoPresidente(sigla: string, c: Candidato) {
  const posicao = posicaoDoPartido(sigla, c);
  return Math.hypot(posicao.economia - c.economia, posicao.costumes - c.costumes);
}

export function atributosDe(pessoa: Pessoa, c: Candidato): AtributosMinistro {
  const proprio = partidoDoCandidato(c)?.sigla;
  const vice = siglaDoVice(c);
  let fidelidade = 75;
  if (pessoa.sigla === proprio) fidelidade = 90;
  else if (pessoa.sigla === vice) fidelidade = 80;
  else if (pessoa.sigla) fidelidade = Math.round(limitar(80 - distanciaDoPresidente(pessoa.sigla, c) * 0.6, 20, 80));
  return { ...BASE_POR_TIPO[pessoa.tipo], fidelidade };
}

export type Posicao = "base" | "independente" | "oposicao";

export const NOME_POSICAO: Record<Posicao, string> = {
  base: "Base do governo",
  independente: "Independentes",
  oposicao: "Oposição",
};

export function pastasDoPartido(g: Governo, sigla: string) {
  return ministeriosAtivos(g).filter((m) => pessoaPorId(g.ministros[m.id])?.sigla === sigla);
}

export function posicaoDoPartidoNoCongresso(g: Governo, c: Candidato, sigla: string): Posicao {
  const proprio = partidoDoCandidato(c)?.sigla;
  const vice = siglaDoVice(c);
  if (sigla === proprio || sigla === vice || pastasDoPartido(g, sigla).length > 0) return "base";
  if (sigla === g.adversario) return "oposicao";
  if (sigla === "Sem partido") return "independente";
  return distanciaDoPresidente(sigla, c) < 30 ? "independente" : "oposicao";
}

const CHANCE_DE_APOIO: Record<Posicao, number> = { base: 0.86, independente: 0.5, oposicao: 0.14 };

function chanceDoPartido(g: Governo, c: Candidato, sigla: string) {
  const posicao = posicaoDoPartidoNoCongresso(g, c, sigla);
  if (posicao !== "base") return CHANCE_DE_APOIO[posicao];
  const chapa = [partidoDoCandidato(c)?.sigla, siglaDoVice(c)];
  if (chapa.includes(sigla)) return CHANCE_DE_APOIO.base;
  // Bancada grande com pasta pequena entrega menos votos, e partido distante também.
  const peso = pastasDoPartido(g, sigla).reduce((soma, m) => soma + m.peso, 0);
  const satisfacao = Math.min(1, peso / Math.max(1, g.bancadas[sigla].deputados / 30));
  const distancia = distanciaDoPresidente(sigla, c) / 150;
  return limitar(CHANCE_DE_APOIO.base * (0.6 + 0.4 * satisfacao) - distancia, 0, 1);
}

export function resumoDoCongresso(g: Governo, c: Candidato) {
  const partidos = Object.entries(g.bancadas)
    .filter(([, b]) => b.deputados + b.senadores > 0)
    .map(([sigla, bancada]) => ({
      sigla,
      ...bancada,
      posicao: posicaoDoPartidoNoCongresso(g, c, sigla),
      pastas: pastasDoPartido(g, sigla).length,
    }))
    .sort((a, b) => b.deputados - a.deputados);
  const contar = (casa: keyof Bancada, posicao: Posicao) =>
    partidos.filter((p) => p.posicao === posicao).reduce((soma, p) => soma + p[casa], 0);
  const provaveis = (casa: keyof Bancada) =>
    Math.round(partidos.reduce((soma, p) => soma + p[casa] * chanceDoPartido(g, c, p.sigla), 0));
  return {
    partidos,
    deputados: { base: contar("deputados", "base"), independente: contar("deputados", "independente"), oposicao: contar("deputados", "oposicao") },
    senadores: { base: contar("senadores", "base"), independente: contar("senadores", "independente"), oposicao: contar("senadores", "oposicao") },
    provaveis: { deputados: provaveis("deputados"), senadores: provaveis("senadores") },
  };
}

export function custoDoOrcamento(g: Governo) {
  return AREAS.reduce((soma, area) => soma + area.custo * g.orcamento[area.id], 0);
}

type Proposta = { economia: number; camara: number | null; senado: number | null };

// A relação com o Congresso ao longo do mandato soma ou tira chance de apoio em todos os partidos.
export function votarProposta(original: Governo, c: Candidato, proposta: Proposta, bonus: number) {
  const g = structuredClone(original);
  const camara = votarNaCasa(g, c, proposta, "deputados", proposta.camara, bonus);
  const senado = camara.aprovado ? votarNaCasa(g, c, proposta, "senadores", proposta.senado, bonus) : null;
  return { semente: g.semente, camara, senado, aprovado: Boolean(senado?.aprovado) };
}

// Indicações passam por voto secreto no Senado: maioria absoluta, 41 votos, com menos fidelidade.
export function votarIndicacao(original: Governo, c: Candidato, bonus: number) {
  const g = structuredClone(original);
  const senado = votarNaCasa(g, c, { economia: 50, camara: null, senado: 41 }, "senadores", 41, bonus - 0.11);
  return { semente: g.semente, senado };
}

function votarNaCasa(g: Governo, c: Candidato, projeto: Proposta, casa: keyof Bancada, necessarios: number | null, bonus = 0): Casa {
  const partidos: VotoPartido[] = [];
  let sim = 0;
  let nao = 0;
  for (const [sigla, bancada] of Object.entries(g.bancadas)) {
    if (bancada[casa] === 0) continue;
    const posicao = posicaoDoPartido(sigla, c);
    const afinidade = (1 - Math.abs(posicao.economia - projeto.economia) / 50) * 0.1;
    const chance = limitar(chanceDoPartido(g, c, sigla) + afinidade + bonus + (sortear(g) - 0.5) * 0.16, 0, 1);
    const presentes = Math.round(bancada[casa] * 0.95);
    const favoraveis = Math.round(presentes * chance);
    partidos.push({ sigla, sim: favoraveis, nao: presentes - favoraveis });
    sim += favoraveis;
    nao += presentes - favoraveis;
  }
  partidos.sort((a, b) => b.sim + b.nao - (a.sim + a.nao));
  return { sim, nao, necessarios, aprovado: necessarios === null ? sim > nao : sim >= necessarios, partidos };
}

// Previsão sem sorteio, usada na negociação antes do plenário.
export function estimarVotos(g: Governo, c: Candidato, proposta: Proposta, bonus: number) {
  const contar = (casa: keyof Bancada) =>
    Math.round(
      Object.entries(g.bancadas).reduce((soma, [sigla, bancada]) => {
        const posicao = posicaoDoPartido(sigla, c);
        const afinidade = (1 - Math.abs(posicao.economia - proposta.economia) / 50) * 0.1;
        return soma + bancada[casa] * 0.95 * limitar(chanceDoPartido(g, c, sigla) + afinidade + bonus, 0, 1);
      }, 0),
    );
  return { deputados: contar("deputados"), senadores: contar("senadores") };
}

export function votarProjeto(original: Governo, c: Candidato): Governo {
  const g = structuredClone(original);
  const projeto = PROJETOS.find((p) => p.id === g.projeto);
  if (!projeto) return g;
  const camara = votarNaCasa(g, c, projeto, "deputados", projeto.camara);
  const senado = camara.aprovado ? votarNaCasa(g, c, projeto, "senadores", projeto.senado) : null;
  g.votacao = { projeto: projeto.id, camara, senado, aprovado: Boolean(senado?.aprovado) };
  return g;
}

const PREFERENCIA_NA_SUGESTAO: Record<TipoPessoa, number> = { governo: 0, politico: 1, senado: 2, deputado: 3, tecnico: 4 };

export function preencherMinisterio(original: Governo, c: Candidato, nomesFora: string[]): Governo {
  const g = structuredClone(original);
  const ordenados = ministeriosAtivos(g).sort((a, b) => b.peso - a.peso);
  const deputados = (sigla: string | null) => (sigla ? (g.bancadas[sigla]?.deputados ?? 0) : 0);
  for (const ministerio of ordenados) {
    if (g.ministros[ministerio.id]) continue;
    const opcoes = candidatosAoMinisterio(g, c, ministerio, nomesFora);
    // Uma coalizão: primeiro os partidos sem pasta, das maiores bancadas às menores.
    const politicos = opcoes
      .filter(
        (p) =>
          p.sigla && p.sigla !== g.adversario && distanciaDoPresidente(p.sigla, c) < 65,
      )
      .sort(
        (a, b) =>
          pastasDoPartido(g, a.sigla as string).length - pastasDoPartido(g, b.sigla as string).length ||
          deputados(b.sigla) - deputados(a.sigla) ||
          PREFERENCIA_NA_SUGESTAO[a.tipo] - PREFERENCIA_NA_SUGESTAO[b.tipo],
      );
    const tecnica = ministerio.id === "fazenda" || ministerio.id === "defesa" || ministerio.id === "relacoes-exteriores";
    g.ministros[ministerio.id] = (tecnica ? opcoes[0] : (politicos[0] ?? opcoes[0])).id;
  }
  return g;
}

export function errosDoPassoGoverno(g: Governo, passo: number) {
  const erros: string[] = [];
  if (passo === 0) {
    const vagos = ministeriosAtivos(g).filter((m) => !g.ministros[m.id]);
    if (vagos.length > 0) erros.push(`Falta escolher ${vagos.length === 1 ? "1 ministério" : `${vagos.length} ministérios`}.`);
  }
  if (passo === 3 && DECISOES.some((d) => g.decisoes[d.id] === undefined)) {
    erros.push("Responda às três decisões.");
  }
  if (passo === 4 && !g.votacao) erros.push("Envie um projeto ao Congresso.");
  return erros;
}

export type Balanco = {
  aprovacao: number;
  credibilidade: number;
  governabilidade: number;
  gestao: number;
};

export function calcularBalanco(g: Governo, c: Candidato, eleicao: Eleicao): Balanco {
  const turno = eleicao.segundo ?? eleicao.primeiro;
  const votos = percentualValido(totalDoTurno(turno), 0);
  const ativos = ministeriosAtivos(g);
  const pesos = ativos.reduce((soma, m) => soma + m.peso, 0);
  const media = (nome: keyof AtributosMinistro) =>
    ativos.reduce((soma, m) => {
      const pessoa = pessoaPorId(g.ministros[m.id]);
      return soma + (pessoa ? atributosDe(pessoa, c)[nome] : 0) * m.peso;
    }, 0) / pesos;

  const resumo = resumoDoCongresso(g, c);
  const excesso = Math.max(0, custoDoOrcamento(g) - TETO_ORCAMENTO);
  const folga = Math.max(0, TETO_ORCAMENTO - custoDoOrcamento(g));
  const balanco = {
    aprovacao: 42 + (votos - 50) * 0.5 + media("popularidade") * 0.08,
    credibilidade: 35 + media("confiabilidade") * 0.3 - excesso * 0.2 + Math.min(folga, 80) * 0.05,
    governabilidade: (resumo.provaveis.deputados / DEPUTADOS) * 100,
    gestao: media("competencia") * 0.6 + media("eficiencia") * 0.4,
  };

  for (const decisao of DECISOES) {
    const escolha = g.decisoes[decisao.id];
    if (escolha === undefined) continue;
    for (const [nome, valor] of Object.entries(decisao.opcoes[escolha].efeito)) {
      balanco[nome as keyof EfeitoGoverno] += valor;
    }
  }
  const projeto = PROJETOS.find((p) => p.id === g.votacao?.projeto);
  if (projeto && g.votacao) {
    if (g.votacao.aprovado) {
      for (const [nome, valor] of Object.entries(projeto.efeito)) {
        balanco[nome as keyof EfeitoGoverno] += valor;
      }
    } else {
      balanco.governabilidade -= 5;
      balanco.credibilidade -= 3;
    }
  }
  return {
    aprovacao: Math.round(limitar(balanco.aprovacao)),
    credibilidade: Math.round(limitar(balanco.credibilidade)),
    governabilidade: Math.round(limitar(balanco.governabilidade)),
    gestao: Math.round(limitar(balanco.gestao)),
  };
}
