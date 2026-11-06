export const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
  "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

// Constituição, art. 14, § 3º, VI, "a".
export const IDADE_MINIMA = 35;

export type Tamanho = "grande" | "medio" | "pequeno" | "novo";

export type Partido = {
  sigla: string;
  nome: string;
  numero: number;
  tamanho: Tamanho;
  economia: number;
  costumes: number;
};

// Partidos fictícios: os reais podem mudar até 2030, e o jogo não presume esse cenário.
export const PARTIDOS: Partido[] = [
  { sigla: "FPT", nome: "Frente Popular do Trabalho", numero: 21, tamanho: "grande", economia: 18, costumes: 25 },
  { sigla: "ASD", nome: "Aliança Social-Democrata", numero: 31, tamanho: "medio", economia: 38, costumes: 38 },
  { sigla: "CDM", nome: "Centro Democrático Municipalista", numero: 41, tamanho: "grande", economia: 50, costumes: 52 },
  { sigla: "RL", nome: "Renovação Liberal", numero: 34, tamanho: "pequeno", economia: 82, costumes: 45 },
  { sigla: "PCN", nome: "Partido Conservador Nacional", numero: 61, tamanho: "grande", economia: 68, costumes: 82 },
  { sigla: "MCD", nome: "Movimento Cristão Democrático", numero: 72, tamanho: "medio", economia: 55, costumes: 75 },
  { sigla: "VF", nome: "Verde Futuro", numero: 84, tamanho: "pequeno", economia: 35, costumes: 18 },
  { sigla: "SN", nome: "Soberania Nacional", numero: 94, tamanho: "pequeno", economia: 38, costumes: 70 },
];

export const NOME_TAMANHO: Record<Tamanho, string> = {
  grande: "Bancada grande",
  medio: "Bancada média",
  pequeno: "Bancada pequena",
  novo: "Partido novo",
};

export type Ideologia = { id: string; nome: string; economia: number; costumes: number };

export const IDEOLOGIAS: Ideologia[] = [
  { id: "conservadorismo", nome: "Conservadorismo", economia: 65, costumes: 85 },
  { id: "liberalismo", nome: "Liberalismo", economia: 80, costumes: 45 },
  { id: "social-democracia", nome: "Social-democracia", economia: 38, costumes: 38 },
  { id: "socialismo", nome: "Socialismo", economia: 12, costumes: 25 },
  { id: "nacionalismo", nome: "Nacionalismo", economia: 35, costumes: 72 },
  { id: "progressismo", nome: "Progressismo", economia: 30, costumes: 15 },
  { id: "democracia-crista", nome: "Democracia cristã", economia: 52, costumes: 72 },
  { id: "libertarianismo", nome: "Libertarianismo", economia: 95, costumes: 35 },
  { id: "centro", nome: "Centro", economia: 50, costumes: 50 },
];

export type Atributos = {
  reconhecimento: number;
  credibilidade: number;
  gestao: number;
  articulacao: number;
};

export const NOME_ATRIBUTO: Record<keyof Atributos, string> = {
  reconhecimento: "Reconhecimento",
  credibilidade: "Credibilidade",
  gestao: "Gestão",
  articulacao: "Articulação",
};

type Opcao = { id: string; nome: string; efeito: Partial<Atributos> };

export const CARGOS: Opcao[] = [
  { id: "nenhum", nome: "Nunca ocupou cargo eletivo", efeito: { reconhecimento: 15, credibilidade: 40, gestao: 20, articulacao: 15 } },
  { id: "camara-municipal", nome: "Câmara municipal", efeito: { reconhecimento: 25, credibilidade: 45, gestao: 30, articulacao: 30 } },
  { id: "prefeitura", nome: "Prefeitura", efeito: { reconhecimento: 40, credibilidade: 50, gestao: 55, articulacao: 40 } },
  { id: "assembleia", nome: "Assembleia estadual", efeito: { reconhecimento: 30, credibilidade: 45, gestao: 30, articulacao: 45 } },
  { id: "camara-deputados", nome: "Câmara dos Deputados", efeito: { reconhecimento: 45, credibilidade: 50, gestao: 35, articulacao: 60 } },
  { id: "senado", nome: "Senado Federal", efeito: { reconhecimento: 60, credibilidade: 55, gestao: 40, articulacao: 70 } },
  { id: "governo-estadual", nome: "Governo estadual", efeito: { reconhecimento: 70, credibilidade: 55, gestao: 70, articulacao: 60 } },
  { id: "ministerio", nome: "Ministério", efeito: { reconhecimento: 55, credibilidade: 60, gestao: 65, articulacao: 55 } },
];

export const EXPERIENCIAS: Opcao[] = [
  { id: "nenhuma", nome: "Sem experiência de gestão", efeito: { gestao: -10 } },
  { id: "publica-curta", nome: "Até 4 anos na gestão pública", efeito: {} },
  { id: "publica-longa", nome: "Mais de 4 anos na gestão pública", efeito: { gestao: 10 } },
  { id: "privada", nome: "Gestão no setor privado", efeito: { gestao: 5 } },
];

export const HISTORICOS: Opcao[] = [
  { id: "estreante", nome: "Esta é a primeira eleição", efeito: { reconhecimento: -5, credibilidade: 5 } },
  { id: "derrotas", nome: "Já disputou e não venceu", efeito: { reconhecimento: 5, credibilidade: -5 } },
  { id: "uma-vitoria", nome: "Venceu uma eleição", efeito: { reconhecimento: 5, credibilidade: 5 } },
  { id: "varias-vitorias", nome: "Venceu várias eleições", efeito: { reconhecimento: 10, credibilidade: 5, articulacao: 5 } },
];

export type ViceSugerido = {
  id: string;
  nome: string;
  uf: string;
  sigla: string;
  perfil: string;
  efeito: Partial<Atributos>;
};

// Pessoas fictícias. O bônus é somado aos atributos da chapa.
export const VICES: ViceSugerido[] = [
  { id: "clarice", nome: "Clarice Antunes Moura", uf: "CE", sigla: "ASD", perfil: "Ex-prefeita com boa avaliação no Nordeste.", efeito: { reconhecimento: 5, gestao: 5 } },
  { id: "otavio", nome: "Otávio Lemos Barreto", uf: "MG", sigla: "CDM", perfil: "Negociador experiente e bem relacionado no Congresso.", efeito: { articulacao: 10 } },
  { id: "joana", nome: "Joana Tavares Pinheiro", uf: "SP", sigla: "RL", perfil: "Economista respeitada pelo mercado.", efeito: { credibilidade: 10 } },
  { id: "renato", nome: "Renato Quintela Rocha", uf: "PR", sigla: "PCN", perfil: "Ex-governador popular entre o eleitorado do Sul.", efeito: { reconhecimento: 10 } },
  { id: "iara", nome: "Iara Figueiredo Sales", uf: "PA", sigla: "VF", perfil: "Liderança ambiental com projeção internacional.", efeito: { credibilidade: 5, reconhecimento: 5 } },
  { id: "caio", nome: "Caio Medeiros Albuquerque", uf: "PE", sigla: "FPT", perfil: "Sindicalista com forte presença nas bases.", efeito: { articulacao: 5, reconhecimento: 5 } },
];

export type Candidato = {
  passo: number;
  nomeCompleto: string;
  nomeUrna: string;
  idade: string;
  uf: string;
  foto: string | null;
  partidoSigla: string | null;
  partidoProprio: boolean;
  novoPartidoNome: string;
  novoPartidoSigla: string;
  novoPartidoNumero: string;
  ideologia: string | null;
  ideologiaSecundaria: string | null;
  economia: number;
  costumes: number;
  biografia: string;
  historiaPolitica: string;
  cargo: string | null;
  experiencia: string | null;
  historico: string | null;
  viceId: string | null;
  viceNome: string;
  viceFoto: string | null;
};

export const CANDIDATO_VAZIO: Candidato = {
  passo: 0,
  nomeCompleto: "",
  nomeUrna: "",
  idade: "",
  uf: "",
  foto: null,
  partidoSigla: null,
  partidoProprio: false,
  novoPartidoNome: "",
  novoPartidoSigla: "",
  novoPartidoNumero: "",
  ideologia: null,
  ideologiaSecundaria: null,
  economia: 50,
  costumes: 50,
  biografia: "",
  historiaPolitica: "",
  cargo: null,
  experiencia: null,
  historico: null,
  viceId: null,
  viceNome: "",
  viceFoto: null,
};

export const VICE_PROPRIO = "proprio";

export const PASSOS = ["Identidade", "Partido", "Ideologia", "Trajetória", "Vice", "Candidatura"];

export function partidoDoCandidato(c: Candidato): Partido | null {
  if (c.partidoProprio) {
    if (!c.novoPartidoNome.trim() || !c.novoPartidoSigla.trim()) return null;
    return {
      sigla: c.novoPartidoSigla.trim().toUpperCase(),
      nome: c.novoPartidoNome.trim(),
      numero: Number(c.novoPartidoNumero),
      tamanho: "novo",
      economia: c.economia,
      costumes: c.costumes,
    };
  }
  return PARTIDOS.find((p) => p.sigla === c.partidoSigla) ?? null;
}

export function nomeDaIdeologia(c: Candidato) {
  const nomes = [c.ideologia, c.ideologiaSecundaria]
    .map((id) => IDEOLOGIAS.find((i) => i.id === id)?.nome)
    .filter(Boolean);
  return nomes.join(" + ");
}

// Posição de partida ao escolher as ideologias: a média das duas.
export function posicaoDasIdeologias(principal: string, secundaria: string | null) {
  const escolhidas = IDEOLOGIAS.filter((i) => i.id === principal || i.id === secundaria);
  const media = (campo: "economia" | "costumes") =>
    Math.round(escolhidas.reduce((soma, i) => soma + i[campo], 0) / escolhidas.length);
  return { economia: media("economia"), costumes: media("costumes") };
}

export function distanciaDoPartido(c: Candidato) {
  const partido = partidoDoCandidato(c);
  if (!partido) return 0;
  return Math.hypot(c.economia - partido.economia, c.costumes - partido.costumes);
}

const EFEITO_PARTIDO: Record<Tamanho, Partial<Atributos>> = {
  grande: { articulacao: 10, reconhecimento: 5 },
  medio: { articulacao: 5 },
  pequeno: {},
  novo: { articulacao: -5, credibilidade: 5 },
};

export function calcularAtributos(c: Candidato): Atributos {
  const total: Atributos = { reconhecimento: 0, credibilidade: 0, gestao: 0, articulacao: 0 };
  const partido = partidoDoCandidato(c);
  const distancia = distanciaDoPartido(c);
  const efeitos: (Partial<Atributos> | undefined)[] = [
    CARGOS.find((o) => o.id === c.cargo)?.efeito,
    EXPERIENCIAS.find((o) => o.id === c.experiencia)?.efeito,
    HISTORICOS.find((o) => o.id === c.historico)?.efeito,
    VICES.find((v) => v.id === c.viceId)?.efeito,
    partido ? EFEITO_PARTIDO[partido.tamanho] : undefined,
    { credibilidade: distancia > 45 ? -10 : distancia > 30 ? -5 : 0 },
  ];
  for (const efeito of efeitos) {
    for (const [chave, valor] of Object.entries(efeito ?? {})) {
      total[chave as keyof Atributos] += valor;
    }
  }
  for (const chave of Object.keys(total) as (keyof Atributos)[]) {
    total[chave] = Math.min(95, Math.max(5, total[chave]));
  }
  return total;
}

export function errosDoPasso(c: Candidato, passo: number): string[] {
  const erros: string[] = [];
  if (passo === 0) {
    const idade = Number(c.idade);
    if (c.nomeCompleto.trim().split(/\s+/).length < 2) erros.push("Escreva o nome completo.");
    if (!c.nomeUrna.trim()) erros.push("Escreva o nome de urna.");
    if (!Number.isInteger(idade) || idade < IDADE_MINIMA || idade > 110) {
      erros.push(`A Constituição exige pelo menos ${IDADE_MINIMA} anos para a Presidência.`);
    }
    if (!c.uf) erros.push("Escolha o estado de origem.");
    if (!c.foto) erros.push("Envie a fotografia do candidato.");
  }
  if (passo === 1) {
    if (!c.partidoProprio && !c.partidoSigla) erros.push("Escolha um partido ou crie o seu.");
    if (c.partidoProprio) {
      const sigla = c.novoPartidoSigla.trim().toUpperCase();
      const numero = Number(c.novoPartidoNumero);
      if (c.novoPartidoNome.trim().length < 3) erros.push("Escreva o nome do partido.");
      if (!/^[A-ZÀ-Ú]{2,8}$/.test(sigla)) erros.push("A sigla precisa ter de 2 a 8 letras.");
      if (PARTIDOS.some((p) => p.sigla === sigla)) erros.push("Essa sigla já é de outro partido.");
      if (!Number.isInteger(numero) || numero < 10 || numero > 99) {
        erros.push("O número do partido precisa ter 2 algarismos.");
      }
      if (PARTIDOS.some((p) => p.numero === numero)) erros.push("Esse número já é de outro partido.");
    }
  }
  if (passo === 2 && !c.ideologia) erros.push("Escolha a ideologia principal.");
  if (passo === 3) {
    if (!c.cargo) erros.push("Escolha o cargo mais alto da carreira.");
    if (!c.experiencia) erros.push("Escolha a experiência administrativa.");
    if (!c.historico) erros.push("Escolha o histórico eleitoral.");
    if (c.biografia.trim().length < 20) erros.push("Escreva uma biografia com pelo menos 20 letras.");
  }
  if (passo === 4) {
    if (!c.viceId) erros.push("Escolha quem será vice.");
    if (c.viceId === VICE_PROPRIO && c.viceNome.trim().split(/\s+/).length < 2) {
      erros.push("Escreva o nome completo de quem será vice.");
    }
  }
  return erros;
}

export function dadosDoVice(c: Candidato) {
  if (c.viceId === VICE_PROPRIO) {
    return { nome: c.viceNome.trim(), detalhe: "Vice da sua escolha", foto: c.viceFoto };
  }
  const vice = VICES.find((v) => v.id === c.viceId);
  if (!vice) return null;
  return { nome: vice.nome, detalhe: `${vice.sigla} · ${vice.uf}`, foto: null };
}
