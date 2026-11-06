import type { Campanha } from "./campanha";
import { dadosDoVice, PARTIDOS, partidoDoCandidato, VICES, type Candidato } from "./candidato";
import { percentualValido, totalDoTurno, type Eleicao } from "./eleicao";

export const DEPUTADOS = 513;
export const SENADORES = 81;

type Bancada = { deputados: number; senadores: number };

// Câmara eleita em 2026 e projeção do Senado para 2027. Serve de base para o Congresso simulado.
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

export type TipoPessoa = "governo" | "senado" | "politico" | "tecnico";

export type Pessoa = {
  id: string;
  nome: string;
  sigla: string | null;
  uf: string;
  cargo: string;
  tipo: TipoPessoa;
};

const eleito = (estado: string) => `Eleito em 2026 para o governo ${estado}.`;
const eleita = (estado: string) => `Eleita em 2026 para o governo ${estado}.`;

// Políticos reais, com cargo e partido conferidos em novembro de 2026, em um cenário hipotético.
export const POLITICOS: Pessoa[] = [
  { id: "tarcisio", nome: "Tarcísio de Freitas", sigla: "Republicanos", uf: "SP", cargo: eleito("de São Paulo"), tipo: "governo" },
  { id: "cleitinho", nome: "Cleitinho Azevedo", sigla: "Republicanos", uf: "MG", cargo: eleito("de Minas Gerais"), tipo: "governo" },
  { id: "pazolini", nome: "Lorenzo Pazolini", sigla: "Republicanos", uf: "ES", cargo: eleito("do Espírito Santo"), tipo: "governo" },
  { id: "pivetta", nome: "Otaviano Pivetta", sigla: "Republicanos", uf: "MT", cargo: eleito("de Mato Grosso"), tipo: "governo" },
  { id: "moro", nome: "Sérgio Moro", sigla: "PL", uf: "PR", cargo: eleito("do Paraná"), tipo: "governo" },
  { id: "zucco", nome: "Zucco", sigla: "PL", uf: "RS", cargo: eleito("do Rio Grande do Sul"), tipo: "governo" },
  { id: "jorginho", nome: "Jorginho Mello", sigla: "PL", uf: "SC", cargo: eleito("de Santa Catarina"), tipo: "governo" },
  { id: "marcos-rogerio", nome: "Marcos Rogério", sigla: "PL", uf: "RO", cargo: eleito("de Rondônia"), tipo: "governo" },
  { id: "raquel", nome: "Raquel Lyra", sigla: "PSD", uf: "PE", cargo: eleita("de Pernambuco"), tipo: "governo" },
  { id: "braide", nome: "Eduardo Braide", sigla: "PSD", uf: "MA", cargo: eleito("do Maranhão"), tipo: "governo" },
  { id: "mitidieri", nome: "Fábio Mitidieri", sigla: "PSD", uf: "SE", cargo: eleito("de Sergipe"), tipo: "governo" },
  { id: "omar", nome: "Omar Aziz", sigla: "PSD", uf: "AM", cargo: eleito("do Amazonas"), tipo: "governo" },
  { id: "riedel", nome: "Eduardo Riedel", sigla: "PP", uf: "MS", cargo: eleito("de Mato Grosso do Sul"), tipo: "governo" },
  { id: "lucas-ribeiro", nome: "Lucas Ribeiro", sigla: "PP", uf: "PB", cargo: eleito("da Paraíba"), tipo: "governo" },
  { id: "mailza", nome: "Mailza Assis", sigla: "PP", uf: "AC", cargo: eleita("do Acre"), tipo: "governo" },
  { id: "celina", nome: "Celina Leão", sigla: "PP", uf: "DF", cargo: eleita("do Distrito Federal"), tipo: "governo" },
  { id: "jeronimo", nome: "Jerônimo Rodrigues", sigla: "PT", uf: "BA", cargo: eleito("da Bahia"), tipo: "governo" },
  { id: "elmano", nome: "Elmano de Freitas", sigla: "PT", uf: "CE", cargo: eleito("do Ceará"), tipo: "governo" },
  { id: "fonteles", nome: "Rafael Fonteles", sigla: "PT", uf: "PI", cargo: eleito("do Piauí"), tipo: "governo" },
  { id: "vilela", nome: "Daniel Vilela", sigla: "MDB", uf: "GO", cargo: eleito("de Goiás"), tipo: "governo" },
  { id: "daniel-santos", nome: "Dr. Daniel Santos", sigla: "PODE", uf: "PA", cargo: eleito("do Pará"), tipo: "governo" },
  { id: "jhc", nome: "JHC", sigla: "PSDB", uf: "AL", cargo: eleito("de Alagoas"), tipo: "governo" },
  { id: "michelle", nome: "Michelle Bolsonaro", sigla: "PL", uf: "DF", cargo: "Eleita em 2026 para o Senado pelo Distrito Federal.", tipo: "senado" },
  { id: "bia-kicis", nome: "Bia Kicis", sigla: "PL", uf: "DF", cargo: "Eleita em 2026 para o Senado pelo Distrito Federal.", tipo: "senado" },
  { id: "lira", nome: "Arthur Lira", sigla: "PP", uf: "AL", cargo: "Eleito em 2026 para o Senado por Alagoas.", tipo: "senado" },
  { id: "alckmin", nome: "Geraldo Alckmin", sigla: "PSB", uf: "SP", cargo: "Vice-presidente da República.", tipo: "politico" },
  { id: "haddad", nome: "Fernando Haddad", sigla: "PT", uf: "SP", cargo: "Filiado ao PT.", tipo: "politico" },
  { id: "camilo", nome: "Camilo Santana", sigla: "PT", uf: "CE", cargo: "Filiado ao PT.", tipo: "politico" },
  { id: "boulos", nome: "Guilherme Boulos", sigla: "PSOL", uf: "SP", cargo: "Filiado ao PSOL.", tipo: "politico" },
  { id: "tabata", nome: "Tabata Amaral", sigla: "PSB", uf: "SP", cargo: "Filiada ao PSB.", tipo: "politico" },
  { id: "paes", nome: "Eduardo Paes", sigla: "PSD", uf: "RJ", cargo: "Disputou o governo do Rio de Janeiro em 2026.", tipo: "politico" },
  { id: "dorinha", nome: "Professora Dorinha", sigla: "UNIÃO", uf: "TO", cargo: "Disputou o governo do Tocantins em 2026.", tipo: "politico" },
  { id: "caiado", nome: "Ronaldo Caiado", sigla: "PSD", uf: "GO", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "zema", nome: "Romeu Zema", sigla: "NOVO", uf: "MG", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "renan", nome: "Renan Santos", sigla: "MISSÃO", uf: "SP", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "flavio", nome: "Flávio Bolsonaro", sigla: "PL", uf: "RJ", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
];

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
export const TETO_ORCAMENTO = AREAS.reduce((soma, area) => soma + area.custo * 3, 0);

type EfeitoGoverno = { aprovacao?: number; credibilidade?: number; governabilidade?: number };

export type Decisao = {
  id: string;
  tema: string;
  texto: string;
  opcoes: [{ texto: string; efeito: EfeitoGoverno }, { texto: string; efeito: EfeitoGoverno }];
};

export const DECISOES: Decisao[] = [
  {
    id: "salario-minimo",
    tema: "Economia",
    texto: "Qual será o reajuste do salário mínimo no primeiro ano?",
    opcoes: [
      { texto: "Aumento acima da inflação.", efeito: { aprovacao: 4, credibilidade: -3 } },
      { texto: "Reposição da inflação, para preservar as contas.", efeito: { aprovacao: -2, credibilidade: 4 } },
    ],
  },
  {
    id: "primeira-viagem",
    tema: "Política externa",
    texto: "Para onde vai a primeira viagem internacional do governo?",
    opcoes: [
      { texto: "Argentina e Mercosul, para reforçar a região.", efeito: { aprovacao: 1, credibilidade: 1 } },
      { texto: "Grandes parceiros comerciais, para buscar investimentos.", efeito: { credibilidade: 2 } },
    ],
  },
  {
    id: "relacao-congresso",
    tema: "Congresso",
    texto: "Qual será o tom da relação com o Congresso nos primeiros meses?",
    opcoes: [
      { texto: "Negociar projeto a projeto, abrindo espaço aos líderes.", efeito: { governabilidade: 5, aprovacao: -1 } },
      { texto: "Levar as pautas direto à população para pressionar os parlamentares.", efeito: { aprovacao: 3, governabilidade: -5 } },
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

function retirarCadeiras(bancadas: Record<string, Bancada>, casa: keyof Bancada, quantidade: number, protegidos: string[]) {
  for (let vez = 0; vez < quantidade; vez++) {
    const maior = Object.keys(bancadas)
      .filter((sigla) => !protegidos.includes(sigla))
      .sort((a, b) => bancadas[b][casa] - bancadas[a][casa])[0];
    bancadas[maior][casa] -= 1;
  }
}

// O Congresso do jogo parte do real e muda com a vitória da chapa.
function montarBancadas(candidato: Candidato) {
  const bancadas = structuredClone(BANCADAS_2026);
  const partido = partidoDoCandidato(candidato);
  const vice = VICES.find((v) => v.id === candidato.viceId)?.sigla;
  const sigla = partido?.sigla ?? "Sem partido";
  bancadas[sigla] ??= { deputados: 0, senadores: 0 };

  const ganhoDeputados = Math.max(12, Math.round(bancadas[sigla].deputados * 0.2));
  const ganhoSenadores = Math.max(2, Math.round(bancadas[sigla].senadores * 0.2));
  const protegidos = [sigla, ...(vice ? [vice] : [])];
  bancadas[sigla].deputados += ganhoDeputados;
  bancadas[sigla].senadores += ganhoSenadores;
  retirarCadeiras(bancadas, "deputados", ganhoDeputados, protegidos);
  retirarCadeiras(bancadas, "senadores", ganhoSenadores, protegidos);
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
  const politico = POLITICOS.find((p) => p.id === id);
  if (politico) return politico;
  const ministerio = MINISTERIOS.find((m) => `tecnico-${m.id}` === id);
  return ministerio ? tecnicoDe(ministerio) : null;
}

// Quem está na chapa ou enfrentou o jogador no segundo turno não entra no ministério.
export function candidatosAoMinisterio(g: Governo, c: Candidato, ministerio: Ministerio, nomesFora: string[]) {
  const ocupados = new Set(
    Object.entries(g.ministros)
      .filter(([id, pessoa]) => pessoa && id !== ministerio.id)
      .map(([, pessoa]) => pessoa),
  );
  const vice = dadosDoVice(c)?.nome;
  const politicos = POLITICOS.filter(
    (p) => !ocupados.has(p.id) && p.nome !== vice && !nomesFora.includes(p.nome),
  );
  return [tecnicoDe(ministerio), ...politicos];
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
  const vice = VICES.find((v) => v.id === c.viceId)?.sigla;
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
  const vice = VICES.find((v) => v.id === c.viceId)?.sigla;
  if (sigla === proprio || sigla === vice || pastasDoPartido(g, sigla).length > 0) return "base";
  if (sigla === g.adversario) return "oposicao";
  if (sigla === "Sem partido") return "independente";
  return distanciaDoPresidente(sigla, c) < 30 ? "independente" : "oposicao";
}

const CHANCE_DE_APOIO: Record<Posicao, number> = { base: 0.86, independente: 0.5, oposicao: 0.14 };

function chanceDoPartido(g: Governo, c: Candidato, sigla: string) {
  const posicao = posicaoDoPartidoNoCongresso(g, c, sigla);
  if (posicao !== "base") return CHANCE_DE_APOIO[posicao];
  const chapa = [partidoDoCandidato(c)?.sigla, VICES.find((v) => v.id === c.viceId)?.sigla];
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

// Indicações passam por voto no Senado: maioria absoluta, 41 votos.
export function votarIndicacao(original: Governo, c: Candidato, bonus: number) {
  const g = structuredClone(original);
  const senado = votarNaCasa(g, c, { economia: 50, camara: null, senado: 41 }, "senadores", 41, bonus);
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

export function votarProjeto(original: Governo, c: Candidato): Governo {
  const g = structuredClone(original);
  const projeto = PROJETOS.find((p) => p.id === g.projeto);
  if (!projeto) return g;
  const camara = votarNaCasa(g, c, projeto, "deputados", projeto.camara);
  const senado = camara.aprovado ? votarNaCasa(g, c, projeto, "senadores", projeto.senado) : null;
  g.votacao = { projeto: projeto.id, camara, senado, aprovado: Boolean(senado?.aprovado) };
  return g;
}

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
          deputados(b.sigla) - deputados(a.sigla),
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
    credibilidade: 35 + media("confiabilidade") * 0.3 - excesso * 0.2 + folga * 0.1,
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
