import { calcularAtributos, distanciaDoPartido, partidoDoCandidato, siglaDoVice, type Candidato } from "./candidato";
import type { Dificuldade } from "./config";
import { aoEstado, ESTADOS, estadoDe, noEstado, PERFIL_REGIAO, type Regiao } from "./estados";
import { PERGUNTAS, type Efeito, type Pergunta } from "./perguntas";

export const SEMANAS = 5;
export const ACOES_POR_SEMANA = 4;
export const SEMANAS_DE_DEBATE = [2, 4];

export type Indicadores = Required<Efeito>;

export const NOME_INDICADOR: Record<keyof Indicadores, string> = {
  popularidade: "Popularidade",
  credibilidade: "Credibilidade",
  confianca: "Confiança",
  imprensa: "Imprensa",
  congresso: "Congresso",
  coerencia: "Coerência",
};

export type Rival = {
  nome: string;
  sigla: string;
  numero: number;
  uf: string;
  economia: number;
  costumes: number;
  forca: number;
};

// Políticos reais em um cenário hipotético, com partido conferido em novembro de 2026.
// Posição e força são estimativas do jogo. Nunca invente crime, escândalo ou fala para eles.
// Jair Bolsonaro está inelegível na vida real e só aparece aqui como cenário alternativo.
const RIVAIS_POR_BLOCO: Rival[][] = [
  [
    { nome: "Lula", sigla: "PT", numero: 13, uf: "SP", economia: 28, costumes: 32, forca: 26 },
    { nome: "Guilherme Boulos", sigla: "PSOL", numero: 50, uf: "SP", economia: 12, costumes: 14, forca: 14 },
    { nome: "Tabata Amaral", sigla: "PSB", numero: 40, uf: "SP", economia: 36, costumes: 28, forca: 12 },
  ],
  [
    { nome: "Flávio Bolsonaro", sigla: "PL", numero: 22, uf: "RJ", economia: 70, costumes: 85, forca: 23 },
    { nome: "Jair Bolsonaro", sigla: "PL", numero: 22, uf: "RJ", economia: 70, costumes: 88, forca: 25 },
    { nome: "Tarcísio de Freitas", sigla: "Republicanos", numero: 10, uf: "SP", economia: 72, costumes: 75, forca: 23 },
  ],
  [
    { nome: "Ronaldo Caiado", sigla: "PSD", numero: 55, uf: "GO", economia: 70, costumes: 80, forca: 12 },
    { nome: "Romeu Zema", sigla: "NOVO", numero: 30, uf: "MG", economia: 85, costumes: 62, forca: 10 },
    { nome: "Renan Santos", sigla: "MISSÃO", numero: 14, uf: "SP", economia: 85, costumes: 60, forca: 11 },
    { nome: "Augusto Cury", sigla: "Avante", numero: 70, uf: "SP", economia: 50, costumes: 58, forca: 11 },
    { nome: "Eduardo Paes", sigla: "PSD", numero: 55, uf: "RJ", economia: 52, costumes: 42, forca: 13 },
    { nome: "Daniel Vilela", sigla: "MDB", numero: 15, uf: "GO", economia: 58, costumes: 62, forca: 10 },
  ],
];

const HADDAD: Rival = { nome: "Fernando Haddad", sigla: "PT", numero: 13, uf: "SP", economia: 30, costumes: 28, forca: 22 };

export type Acao =
  | { tipo: "comicio"; uf: string }
  | { tipo: "visita"; uf: string }
  | { tipo: "evento"; regiao: Regiao }
  | { tipo: "proposta"; tema: string }
  | { tipo: "encontro"; grupo: string }
  | { tipo: "entrevista" }
  | { tipo: "debate" };

export type TipoAcao = Acao["tipo"];

export const CATALOGO: { tipo: TipoAcao; nome: string; descricao: string; custo: number }[] = [
  { tipo: "comicio", nome: "Comício", descricao: "Ganho forte em um estado, mas pode aumentar a rejeição.", custo: 1 },
  { tipo: "visita", nome: "Visita ao estado", descricao: "Ganho menor, reduz a rejeição e aumenta a confiança.", custo: 1 },
  { tipo: "evento", nome: "Evento de campanha", descricao: "Um ganho moderado em todos os estados de uma região.", custo: 1 },
  { tipo: "proposta", nome: "Apresentar proposta", descricao: "Efeito nacional. Vira promessa e será cobrada.", custo: 1 },
  { tipo: "encontro", nome: "Encontro político", descricao: "Abre portas com um grupo e muda a sua relação com ele.", custo: 1 },
  { tipo: "entrevista", nome: "Entrevista", descricao: "Uma pergunta ao vivo, com cronômetro.", custo: 1 },
  { tipo: "debate", nome: "Debate na TV", descricao: "Três perguntas ao vivo. Faltar custa caro.", custo: 2 },
];

export const TEMAS = [
  { id: "saude", nome: "Ampliar o atendimento do SUS", economia: 40, costumes: 50 },
  { id: "educacao", nome: "Escola em tempo integral", economia: 40, costumes: 45 },
  { id: "seguranca", nome: "Plano nacional contra o crime organizado", economia: 60, costumes: 75 },
  { id: "emprego", nome: "Programa de geração de empregos", economia: 45, costumes: 50 },
  { id: "impostos", nome: "Reduzir impostos sobre o consumo", economia: 72, costumes: 55 },
  { id: "social", nome: "Reforçar a transferência de renda", economia: 25, costumes: 45 },
  { id: "ambiente", nome: "Transição energética e proteção da Amazônia", economia: 30, costumes: 25 },
  { id: "obras", nome: "Grande plano de obras", economia: 45, costumes: 55 },
];

export const GRUPOS: { id: string; nome: string; economia: number; costumes: number; efeito: Efeito }[] = [
  { id: "lideres", nome: "Líderes partidários", economia: 50, costumes: 50, efeito: { congresso: 6, credibilidade: -1 } },
  { id: "prefeitos", nome: "Prefeitos", economia: 50, costumes: 55, efeito: { congresso: 3, popularidade: 1 } },
  { id: "sindicatos", nome: "Sindicatos", economia: 20, costumes: 45, efeito: { popularidade: 2, confianca: 1 } },
  { id: "empresarios", nome: "Empresários", economia: 85, costumes: 50, efeito: { credibilidade: 2, imprensa: 1 } },
  { id: "religiosos", nome: "Lideranças religiosas", economia: 50, costumes: 85, efeito: { popularidade: 2, confianca: 1 } },
  { id: "movimentos", nome: "Movimentos sociais", economia: 25, costumes: 15, efeito: { popularidade: 2, imprensa: 1 } },
];

export type PesquisaUf = { votos: number[]; indecisos: number; rejeicao: number };

export type Pesquisa = {
  semana: number;
  nacional: number[];
  indecisos: number;
  rejeicao: number;
  ufs: Record<string, PesquisaUf>;
};

export type ResultadoResposta = {
  resposta: string;
  mudancas: Efeito;
  replica: "pendente" | "feita" | null;
  textoReplica?: string;
};

// Depois de cada resposta em debate, a candidatura adversária contesta.
export const REPLICAS: { texto: string; efeito: Efeito; retorno: string }[] = [
  { texto: "Rebater com firmeza.", efeito: { popularidade: 2, imprensa: -1 }, retorno: "Você subiu o tom, e parte do público gostou." },
  { texto: "Explicar com números.", efeito: { credibilidade: 2, popularidade: -1 }, retorno: "A resposta foi técnica e passou segurança." },
  { texto: "Voltar às suas propostas.", efeito: { confianca: 2 }, retorno: "Você evitou o confronto e manteve o foco." },
  { texto: "Atacar a trajetória da outra campanha.", efeito: { popularidade: 1, credibilidade: -2, imprensa: -2 }, retorno: "O ataque animou a militância, mas a imprensa criticou." },
];

export type Debate = {
  tipo: "debate" | "entrevista";
  perguntas: { pergunta: Pergunta; segundos: number }[];
  indice: number;
  resultado: ResultadoResposta | null;
};

export type Boletim = {
  semana: number;
  acoes: string[];
  eventos: { titulo: string; texto: string }[];
  variacao: number;
};

export type Campanha = {
  versao: 1;
  semente: number;
  semana: number;
  fase: "agenda" | "debate" | "boletim" | "encerrada";
  acoes: { tipo: TipoAcao; chave: string; custo: number; texto: string }[];
  rivais: Rival[];
  votos: Record<string, number[]>;
  rejeicao: Record<string, number>;
  indicadores: Indicadores;
  pesquisas: Pesquisa[];
  boletins: Boletim[];
  promessas: string[];
  perguntasFeitas: string[];
  eventosRegionais: { uf: string; semana: number; titulo: string }[];
  debate: Debate | null;
};

const limitar = (valor: number, minimo = 0, maximo = 100) =>
  Math.min(maximo, Math.max(minimo, valor));

// Sorteio com semente salva na partida: continuar um jogo não muda o que já foi decidido.
function sortear(c: Campanha) {
  c.semente = (c.semente + 0x6d2b79f5) | 0;
  let t = c.semente;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function escolherUm<T>(c: Campanha, lista: T[]) {
  return lista[Math.floor(sortear(c) * lista.length)];
}

function sementeDe(texto: string) {
  let hash = 2166136261;
  for (const letra of texto) hash = Math.imul(hash ^ letra.charCodeAt(0), 16777619);
  return hash | 0;
}

function afinidade(economia: number, costumes: number, alvo: { economia: number; costumes: number }) {
  return limitar(1 - Math.hypot(economia - alvo.economia, costumes - alvo.costumes) / 110, 0, 1);
}

const decimal = (valor: number) => valor.toFixed(1).replace(".", ",");

export function totalDeVotos(votos: number[]) {
  return votos.reduce((soma, voto) => soma + voto, 0);
}

export function nacional(c: Campanha) {
  const soma = new Array<number>(c.rivais.length + 1).fill(0);
  let pesos = 0;
  for (const estado of ESTADOS) {
    pesos += estado.eleitorado;
    c.votos[estado.uf].forEach((voto, i) => (soma[i] += voto * estado.eleitorado));
  }
  return soma.map((voto) => voto / pesos);
}

function rejeicaoNacional(c: Campanha) {
  let soma = 0;
  let pesos = 0;
  for (const estado of ESTADOS) {
    pesos += estado.eleitorado;
    soma += c.rejeicao[estado.uf] * estado.eleitorado;
  }
  return soma / pesos;
}

function fazerPesquisa(c: Campanha): Pesquisa {
  const ruido = (margem: number) => (sortear(c) * 2 - 1) * margem;
  const ufs: Record<string, PesquisaUf> = {};
  for (const estado of ESTADOS) {
    const votos = c.votos[estado.uf].map((voto) => Math.max(0, Math.round(voto + ruido(2))));
    ufs[estado.uf] = {
      votos,
      indecisos: Math.max(0, 100 - totalDeVotos(votos)),
      rejeicao: Math.round(limitar(c.rejeicao[estado.uf] + ruido(2))),
    };
  }
  const votos = nacional(c).map((voto) => Math.max(0, Math.round(voto + ruido(0.8))));
  return {
    semana: c.semana,
    nacional: votos,
    indecisos: Math.max(0, 100 - totalDeVotos(votos)),
    rejeicao: Math.round(rejeicaoNacional(c)),
    ufs,
  };
}

// Uma candidatura por partido, sem repetir os partidos da chapa do jogador.
function escolherRivais(c: Campanha, candidato: Candidato, reeleicao: boolean) {
  const ocupados = new Set([
    partidoDoCandidato(candidato)?.sigla,
    siglaDoVice(candidato),
  ]);
  const escolhidos: Rival[] = [];
  const escolher = (opcoes: Rival[]) => {
    const livres = opcoes.filter((r) => !ocupados.has(r.sigla));
    if (livres.length === 0) return;
    const rival = escolherUm(c, livres);
    escolhidos.push(rival);
    ocupados.add(rival.sigla);
  };
  // Lula é o adversário principal da esquerda, sempre que o PT estiver livre.
  const [esquerda, direita, centro] = RIVAIS_POR_BLOCO;
  // Em 2030, o nome do PT é outro: Haddad é o mais citado para a sucessão.
  const principal = reeleicao ? [HADDAD] : esquerda.slice(0, 1);
  escolher(ocupados.has("PT") ? esquerda.slice(1) : principal);
  escolher(direita);
  escolher(centro);
  while (escolhidos.length < 4) escolher(RIVAIS_POR_BLOCO.flat());
  return escolhidos;
}

const FORCA_DIFICULDADE: Record<Dificuldade, number> = { facil: 1.15, media: 1, dificil: 0.85 };
const ATIVIDADE_RIVAIS: Record<Dificuldade, number> = { facil: 0.8, media: 1, dificil: 1.25 };

// Na reeleição, a aprovação do governo vira força de campanha.
export function criarCampanha(id: string, candidato: Candidato, dificuldade: Dificuldade, reeleicao?: { aprovacao: number }): Campanha {
  const atributos = calcularAtributos(candidato);
  const c: Campanha = {
    versao: 1,
    semente: sementeDe(reeleicao ? `${id}-2030` : id),
    semana: 0,
    fase: "agenda",
    acoes: [],
    rivais: [],
    votos: {},
    rejeicao: {},
    indicadores: {
      popularidade: limitar(20 + atributos.reconhecimento * 0.5),
      credibilidade: atributos.credibilidade,
      confianca: Math.round((atributos.credibilidade + atributos.gestao) / 2),
      imprensa: 50,
      congresso: atributos.articulacao,
      coerencia: Math.round(limitar(100 - distanciaDoPartido(candidato) / 1.5)),
    },
    pesquisas: [],
    boletins: [],
    promessas: [],
    perguntasFeitas: [],
    eventosRegionais: [],
    debate: null,
  };
  c.rivais = escolherRivais(c, candidato, Boolean(reeleicao));

  const forcaJogador =
    (6 + atributos.reconhecimento * 0.14 + atributos.articulacao * 0.03 + (reeleicao ? 3 + (reeleicao.aprovacao - 40) * 0.35 : 0)) *
    FORCA_DIFICULDADE[dificuldade];
  const disputa = [
    { uf: candidato.uf, economia: candidato.economia, costumes: candidato.costumes, forca: forcaJogador },
    ...c.rivais,
  ];

  for (const estado of ESTADOS) {
    const perfil = PERFIL_REGIAO[estado.regiao];
    const forcas = disputa.map((nome) => {
      const casa = nome.uf === estado.uf ? 1.7 : 1;
      const regiao = estadoDe(nome.uf).regiao === estado.regiao ? 1.15 : 1;
      return nome.forca * (0.55 + afinidade(nome.economia, nome.costumes, perfil)) * casa * regiao;
    });
    const decididos = 70 + sortear(c) * 8;
    const soma = totalDeVotos(forcas);
    c.votos[estado.uf] = forcas.map((forca) => (forca / soma) * decididos);
    c.rejeicao[estado.uf] = limitar(
      18 +
        (100 - atributos.credibilidade) * 0.18 +
        (1 - afinidade(candidato.economia, candidato.costumes, perfil)) * 22 +
        sortear(c) * 4,
      8,
      60,
    );
  }

  c.pesquisas.push(fazerPesquisa(c));
  c.semana = 1;
  return c;
}

function mudarVoto(c: Campanha, uf: string, indice: number, pontos: number) {
  const votos = c.votos[uf];
  if (pontos < 0) {
    votos[indice] = Math.max(0.5, votos[indice] + pontos);
    return;
  }
  const total = totalDeVotos(votos);
  const deIndecisos = Math.min(100 - total, pontos * 0.6);
  const outros = total - votos[indice];
  const deRivais = Math.min(pontos - deIndecisos, outros * 0.5);
  votos.forEach((voto, i) => {
    if (i !== indice) votos[i] = voto - (deRivais * voto) / outros;
  });
  votos[indice] += deIndecisos + deRivais;
}

function mudarVotoNacional(c: Campanha, indice: number, pontos: number) {
  for (const estado of ESTADOS) mudarVoto(c, estado.uf, indice, pontos);
}

function aplicarEfeito(c: Campanha, efeito: Efeito) {
  for (const [chave, valor] of Object.entries(efeito)) {
    const nome = chave as keyof Indicadores;
    c.indicadores[nome] = Math.round(limitar(c.indicadores[nome] + valor));
  }
  const popularidade = efeito.popularidade ?? 0;
  const credibilidade = efeito.credibilidade ?? 0;
  const confianca = efeito.confianca ?? 0;
  mudarVotoNacional(c, 0, popularidade * 0.12 + credibilidade * 0.06 + confianca * 0.06);
}

export function acoesRestantes(c: Campanha) {
  return ACOES_POR_SEMANA - c.acoes.reduce((soma, acao) => soma + acao.custo, 0);
}

export function podeDebater(c: Campanha) {
  return (
    SEMANAS_DE_DEBATE.includes(c.semana) &&
    !c.acoes.some((a) => a.tipo === "debate") &&
    acoesRestantes(c) >= 2
  );
}

function vezesNaSemana(c: Campanha, chave: string) {
  return c.acoes.filter((a) => a.chave === chave).length;
}

function reducao(c: Campanha, chave: string) {
  return Math.pow(0.6, vezesNaSemana(c, chave));
}

function montarPerguntas(c: Campanha, candidato: Candidato, quantidade: number) {
  const dinamicas: Pergunta[] = [];
  const promessa = c.promessas.at(-1);
  if (promessa) {
    dinamicas.push({
      id: `promessa-${promessa}`,
      tema: "Promessa de campanha",
      texto: `Você prometeu: "${promessa}". De onde vai sair o dinheiro?`,
      opcoes: [
        { texto: "Vou cortar despesas em outras áreas.", economia: 75, efeito: { credibilidade: 2, popularidade: -1 } },
        { texto: "Vou buscar novas receitas e rever benefícios fiscais.", economia: 30, efeito: { popularidade: 1, congresso: -1 } },
        { texto: "Vou fazer de forma gradual, conforme a arrecadação crescer.", efeito: { credibilidade: 1, imprensa: 1 } },
      ],
    });
  }
  const partido = partidoDoCandidato(candidato);
  if (partido && !candidato.partidoProprio && distanciaDoPartido(candidato) > 30) {
    dinamicas.push({
      id: "linha-do-partido",
      tema: "Coerência",
      texto: `Sua posição é diferente da linha do ${partido.sigla}. Quem manda no seu governo?`,
      opcoes: [
        { texto: "Mantenho as minhas posições, mesmo contrariando o partido.", efeito: { credibilidade: 3, congresso: -3 } },
        { texto: "Vou construir uma posição comum com o partido.", efeito: { congresso: 3, coerencia: -3 } },
        { texto: "Quem governa é a chapa eleita, com diálogo com todos.", efeito: { popularidade: 1, confianca: 1 } },
      ],
    });
  }
  const evento = c.eventosRegionais.at(-1);
  if (evento) {
    dinamicas.push({
      id: `crise-${evento.semana}`,
      tema: "Acontecimento recente",
      texto: `Sobre o que aconteceu ${noEstado(evento.uf)} (${evento.titulo.toLowerCase()}): o que você faria como presidente?`,
      opcoes: [
        { texto: "Iria ao local e coordenaria a resposta com o governo estadual.", efeito: { confianca: 3, popularidade: 1 } },
        { texto: "Criaria um fundo federal permanente para situações como essa.", economia: 30, efeito: { credibilidade: 2, popularidade: 1 } },
        { texto: "Deixaria a condução com o governo estadual e daria apoio técnico.", economia: 65, efeito: { credibilidade: 1, popularidade: -1 } },
      ],
    });
  }

  const novas = dinamicas.filter((p) => !c.perguntasFeitas.includes(p.id));
  const fixas = PERGUNTAS.filter((p) => !c.perguntasFeitas.includes(p.id));
  const selecionadas: Pergunta[] = [];
  if (novas.length > 0) selecionadas.push(escolherUm(c, novas));
  while (selecionadas.length < quantidade) {
    const disponiveis = fixas.filter((p) => !selecionadas.includes(p));
    selecionadas.push(escolherUm(c, disponiveis.length > 0 ? disponiveis : PERGUNTAS));
  }
  c.perguntasFeitas.push(...selecionadas.map((p) => p.id));
  return selecionadas.map((pergunta) => ({
    pergunta,
    segundos: 45 + Math.floor(sortear(c) * 16),
  }));
}

export function executarAcao(original: Campanha, candidato: Candidato, acao: Acao): Campanha {
  const c = structuredClone(original);
  const atributos = calcularAtributos(candidato);
  const registrar = (chave: string, texto: string, custo = 1) =>
    c.acoes.push({ tipo: acao.tipo, chave, custo, texto });

  if (acao.tipo === "comicio") {
    const chave = `uf-${acao.uf}`;
    const estado = estadoDe(acao.uf);
    const pontos = (1.4 + atributos.reconhecimento / 70) * reducao(c, chave);
    mudarVoto(c, acao.uf, 0, pontos);
    for (const vizinho of ESTADOS) {
      if (vizinho.regiao === estado.regiao && vizinho.uf !== acao.uf) {
        mudarVoto(c, vizinho.uf, 0, pontos * 0.15);
      }
    }
    c.rejeicao[acao.uf] = limitar(c.rejeicao[acao.uf] + 0.4);
    const tumulto = sortear(c) < 0.12;
    if (tumulto) aplicarEfeito(c, { imprensa: -2 });
    registrar(
      chave,
      `Comício ${noEstado(acao.uf)}: +${decimal(pontos)} no estado${tumulto ? ". Houve tumulto, e a imprensa criticou" : ""}.`,
    );
  }

  if (acao.tipo === "visita") {
    const chave = `uf-${acao.uf}`;
    const pontos = (0.8 + atributos.gestao / 120) * reducao(c, chave);
    mudarVoto(c, acao.uf, 0, pontos);
    c.rejeicao[acao.uf] = limitar(c.rejeicao[acao.uf] - 1.2);
    aplicarEfeito(c, { confianca: 1 });
    registrar(chave, `Visita ${aoEstado(acao.uf)}: +${decimal(pontos)} e menos rejeição no estado.`);
  }

  if (acao.tipo === "evento") {
    const chave = `regiao-${acao.regiao}`;
    const pontos = (0.45 + atributos.reconhecimento / 200) * reducao(c, chave);
    for (const estado of ESTADOS) {
      if (estado.regiao === acao.regiao) mudarVoto(c, estado.uf, 0, pontos);
    }
    registrar(chave, `Evento na região ${acao.regiao}: +${decimal(pontos)} em cada estado.`);
  }

  if (acao.tipo === "proposta") {
    const tema = TEMAS.find((t) => t.id === acao.tema) ?? TEMAS[0];
    const chave = `tema-${tema.id}`;
    const encaixe = afinidade(candidato.economia, candidato.costumes, tema);
    const pontos = (0.2 + 0.55 * encaixe) * reducao(c, chave);
    mudarVotoNacional(c, 0, pontos);
    aplicarEfeito(c, { popularidade: 1, coerencia: encaixe > 0.7 ? 2 : -2 });
    if (!c.promessas.includes(tema.nome)) c.promessas.push(tema.nome);
    registrar(
      chave,
      `Proposta "${tema.nome}": +${decimal(pontos)} no país${encaixe > 0.7 ? "" : ". Destoou das suas posições"}.`,
    );
  }

  if (acao.tipo === "encontro") {
    const grupo = GRUPOS.find((g) => g.id === acao.grupo) ?? GRUPOS[0];
    const chave = `grupo-${grupo.id}`;
    const fator = (0.5 + afinidade(candidato.economia, candidato.costumes, grupo)) * reducao(c, chave);
    const efeito: Efeito = {};
    for (const [nome, valor] of Object.entries(grupo.efeito)) {
      efeito[nome as keyof Efeito] = Math.round(valor * fator);
    }
    aplicarEfeito(c, efeito);
    registrar(chave, `Encontro com ${grupo.nome.toLowerCase()}: ${descreverEfeito(efeito)}.`);
  }

  if (acao.tipo === "entrevista" || acao.tipo === "debate") {
    const debate = acao.tipo === "debate";
    c.debate = {
      tipo: acao.tipo,
      perguntas: montarPerguntas(c, candidato, debate ? 3 : 1),
      indice: 0,
      resultado: null,
    };
    c.fase = "debate";
    registrar(acao.tipo, debate ? "Participou do debate na TV." : "Deu uma entrevista ao vivo.", debate ? 2 : 1);
  }

  return c;
}

export function descreverEfeito(efeito: Efeito) {
  const partes = Object.entries(efeito)
    .filter(([, valor]) => valor !== 0)
    .map(([nome, valor]) => {
      const rotulo = NOME_INDICADOR[nome as keyof Indicadores].toLowerCase();
      return `${rotulo} ${valor > 0 ? "+" : ""}${valor}`;
    });
  return partes.length > 0 ? partes.join(", ") : "sem efeito";
}

// Sem `resposta`, o tempo acabou. Um texto é uma resposta escrita pelo jogador.
export function responderPergunta(original: Campanha, candidato: Candidato, resposta: number | string | null) {
  const c = structuredClone(original);
  const debate = c.debate;
  if (!debate || debate.resultado) return c;
  const { pergunta } = debate.perguntas[debate.indice];
  const peso = debate.tipo === "debate" ? 1.4 : 1;

  let base: Efeito = { credibilidade: -3, imprensa: -2, popularidade: -1 };
  let texto = "O tempo acabou e você ficou sem resposta.";
  if (typeof resposta === "string") {
    // O jogo não julga o conteúdo: resposta própria soa autêntica e rende um pouco de tudo.
    base = { popularidade: 1, credibilidade: 1, coerencia: 1 };
    texto = resposta;
  } else if (resposta !== null) {
    const opcao = pergunta.opcoes[resposta];
    const distancias = [
      opcao.economia === undefined ? null : Math.abs(opcao.economia - candidato.economia),
      opcao.costumes === undefined ? null : Math.abs(opcao.costumes - candidato.costumes),
    ].filter((d) => d !== null);
    const distancia = distancias.length > 0 ? Math.max(...distancias) : 0;
    const coerencia = (opcao.efeito.coerencia ?? 0) + (distancia > 50 ? -3 : distancia < 30 ? 2 : 0);
    base = { ...opcao.efeito, coerencia };
    texto = opcao.texto;
  }

  const mudancas: Efeito = {};
  for (const [nome, valor] of Object.entries(base)) {
    mudancas[nome as keyof Efeito] = Math.round(valor * peso);
  }
  aplicarEfeito(c, mudancas);
  debate.resultado = {
    resposta: texto,
    mudancas,
    replica: debate.tipo === "debate" && resposta !== null ? "pendente" : null,
  };
  return c;
}

export function responderReplica(original: Campanha, indice: number) {
  const c = structuredClone(original);
  const resultado = c.debate?.resultado;
  if (!resultado || resultado.replica !== "pendente") return c;
  const replica = REPLICAS[indice];
  aplicarEfeito(c, replica.efeito);
  resultado.replica = "feita";
  resultado.textoReplica = `${replica.retorno} ${descreverEfeito(replica.efeito)}.`;
  return c;
}

export function seguirNoDebate(original: Campanha) {
  const c = structuredClone(original);
  const debate = c.debate;
  if (!debate) return c;
  if (debate.indice + 1 < debate.perguntas.length) {
    debate.indice += 1;
    debate.resultado = null;
  } else {
    c.debate = null;
    c.fase = "agenda";
  }
  return c;
}

type Evento = {
  titulo: string;
  texto: string;
  aplicar?: (c: Campanha) => void;
};

function sortearEvento(c: Campanha): Evento {
  const rival = 1 + Math.floor(sortear(c) * c.rivais.length);
  const nomeRival = c.rivais[rival - 1].nome;
  const uf = escolherUm(c, ESTADOS).uf;
  const regional = (titulo: string) => c.eventosRegionais.push({ uf, semana: c.semana, titulo });

  const eventos: Evento[] = [
    {
      titulo: "Denúncia contra a sua campanha",
      texto: "Uma reportagem questiona doadores da campanha. Credibilidade −4, imprensa −3.",
      aplicar: (x) => aplicarEfeito(x, { credibilidade: -4, imprensa: -3 }),
    },
    {
      titulo: "Vídeo seu viraliza",
      texto: "Um trecho de discurso se espalha pelas redes. Popularidade +3.",
      aplicar: (x) => aplicarEfeito(x, { popularidade: 3 }),
    },
    {
      titulo: `Campanha de ${nomeRival} perde fôlego`,
      texto: "Na simulação, a candidatura adversária recua nas pesquisas em todo o país.",
      aplicar: (x) => mudarVotoNacional(x, rival, -1.4),
    },
    {
      titulo: `Campanha de ${nomeRival} ganha fôlego`,
      texto: "Na simulação, a candidatura adversária avança nas pesquisas em todo o país.",
      aplicar: (x) => mudarVotoNacional(x, rival, 0.9),
    },
    {
      titulo: `Greve no transporte ${noEstado(uf)}`,
      texto: "A paralisação domina o noticiário local e aumenta a cobrança sobre os candidatos.",
      aplicar: () => regional("Greve no transporte"),
    },
    {
      titulo: `Chuvas fortes ${noEstado(uf)}`,
      texto: "Moradores ficam desalojados, e a população cobra respostas dos candidatos.",
      aplicar: () => regional("Chuvas fortes"),
    },
    {
      titulo: `Protestos ${noEstado(uf)}`,
      texto: "Manifestantes vão às ruas contra o aumento do custo de vida.",
      aplicar: () => regional("Protestos contra o custo de vida"),
    },
    {
      titulo: "Semana sem grandes surpresas",
      texto: "O noticiário ficou morno, e a disputa seguiu dentro do esperado.",
    },
  ];
  return escolherUm(c, eventos);
}

export function fecharSemana(original: Campanha, dificuldade: Dificuldade) {
  const c = structuredClone(original);
  const antes = c.pesquisas.at(-1)?.nacional[0] ?? 0;
  const eventos: Boletim["eventos"] = [];

  if (SEMANAS_DE_DEBATE.includes(c.semana) && !c.acoes.some((a) => a.tipo === "debate")) {
    aplicarEfeito(c, { credibilidade: -5, imprensa: -4, popularidade: -2 });
    eventos.push({
      titulo: "Você faltou ao debate",
      texto: "A cadeira vazia virou assunto. Credibilidade −5, imprensa −4, popularidade −2.",
    });
  }

  const forcaDaSemana = ATIVIDADE_RIVAIS[dificuldade];
  c.rivais.forEach((rival, i) => {
    for (let vez = 0; vez < 3; vez++) {
      let sorteio = sortear(c) * 100;
      const alvo =
        ESTADOS.find((estado) => (sorteio -= estado.eleitorado) <= 0) ?? ESTADOS[ESTADOS.length - 1];
      mudarVoto(c, alvo.uf, i + 1, 1.4 * (rival.forca / 18) * forcaDaSemana * (0.7 + sortear(c) * 0.6));
    }
    mudarVotoNacional(c, i + 1, 0.12 * forcaDaSemana);
  });

  const { popularidade, credibilidade } = c.indicadores;
  mudarVotoNacional(c, 0, ((popularidade - 50) / 50) * 0.35 + ((credibilidade - 50) / 50) * 0.2);
  for (const estado of ESTADOS) {
    c.rejeicao[estado.uf] = limitar(c.rejeicao[estado.uf] + ((50 - credibilidade) / 50) * 0.4);
    const votos = c.votos[estado.uf];
    const total = totalDeVotos(votos);
    const decidem = (100 - total) * 0.08;
    votos.forEach((voto, i) => (votos[i] = voto + (decidem * voto) / total));
  }

  const evento = sortearEvento(c);
  evento.aplicar?.(c);
  eventos.push({ titulo: evento.titulo, texto: evento.texto });

  const pesquisa = fazerPesquisa(c);
  c.pesquisas.push(pesquisa);
  c.boletins.push({
    semana: c.semana,
    acoes: c.acoes.map((a) => a.texto),
    eventos,
    variacao: pesquisa.nacional[0] - antes,
  });
  c.fase = "boletim";
  return c;
}

export function seguirCampanha(original: Campanha) {
  const c = structuredClone(original);
  if (c.semana >= SEMANAS) {
    c.fase = "encerrada";
    return c;
  }
  c.semana += 1;
  c.acoes = [];
  c.fase = "agenda";
  return c;
}

export function situacaoNoEstado(pesquisa: PesquisaUf, nomes: string[]) {
  const [jogador, ...rivais] = pesquisa.votos;
  const melhor = Math.max(...rivais);
  const diferenca = jogador - melhor;
  if (diferenca > 8) return "Você lidera com folga";
  if (diferenca > 0) return "Você lidera por pouco";
  if (diferenca >= -5) return "Disputa acirrada";
  return `${nomes[rivais.indexOf(melhor) + 1]} está à frente`;
}
