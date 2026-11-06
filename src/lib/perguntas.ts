export type Efeito = {
  popularidade?: number;
  credibilidade?: number;
  confianca?: number;
  imprensa?: number;
  congresso?: number;
  coerencia?: number;
};

export type OpcaoResposta = {
  texto: string;
  economia?: number;
  costumes?: number;
  efeito: Efeito;
};

export type Pergunta = {
  id: string;
  tema: string;
  texto: string;
  opcoes: OpcaoResposta[];
};

// Cada resposta é uma abordagem legítima. A coerência com a posição do candidato é calculada no jogo.
export const PERGUNTAS: Pergunta[] = [
  {
    id: "saude-filas",
    tema: "Saúde",
    texto: "As filas por cirurgias e exames seguem longas. O que o seu governo faria primeiro?",
    opcoes: [
      { texto: "Contratar profissionais e ampliar a rede pública.", economia: 25, efeito: { popularidade: 3, credibilidade: 1, congresso: -1 } },
      { texto: "Comprar vagas de hospitais privados para zerar a fila.", economia: 72, efeito: { popularidade: 2, credibilidade: 2, imprensa: 1 } },
      { texto: "Fazer mutirões com estados e municípios.", economia: 48, efeito: { popularidade: 2, confianca: 1 } },
      { texto: "Informatizar o SUS antes de gastar mais.", economia: 60, efeito: { credibilidade: 2, popularidade: -1 } },
    ],
  },
  {
    id: "educacao-medio",
    tema: "Educação",
    texto: "A evasão no ensino médio preocupa. Qual é a sua prioridade?",
    opcoes: [
      { texto: "Escola em tempo integral e aumento do salário dos professores.", economia: 30, efeito: { popularidade: 3, confianca: 1 } },
      { texto: "Metas por escola e bolsas ligadas ao desempenho.", economia: 72, efeito: { credibilidade: 2, imprensa: 2 } },
      { texto: "Bolsa para o aluno permanecer na escola.", economia: 35, efeito: { popularidade: 2, imprensa: 1 } },
      { texto: "Expandir o ensino técnico ligado às empresas.", economia: 58, efeito: { credibilidade: 1, popularidade: 2 } },
    ],
  },
  {
    id: "seguranca-crime",
    tema: "Segurança",
    texto: "Como enfrentar o avanço do crime organizado?",
    opcoes: [
      { texto: "Penas mais duras e mais policiamento nas ruas.", costumes: 82, efeito: { popularidade: 3, imprensa: -1 } },
      { texto: "Inteligência, controle de fronteiras e prevenção social.", costumes: 28, efeito: { credibilidade: 3, imprensa: 1, popularidade: -1 } },
      { texto: "Asfixiar o dinheiro das facções com a Receita e a Polícia Federal.", costumes: 50, efeito: { credibilidade: 3, confianca: 1 } },
      { texto: "Criar uma força nacional permanente com os estados.", costumes: 62, efeito: { popularidade: 2, congresso: -1 } },
    ],
  },
  {
    id: "economia-gasto",
    tema: "Economia",
    texto: "O que fazer com as contas públicas no primeiro ano de governo?",
    opcoes: [
      { texto: "Manter o investimento público para sustentar o crescimento.", economia: 25, efeito: { popularidade: 2, credibilidade: -1, confianca: 1 } },
      { texto: "Cortar gastos para reduzir a dívida e os juros.", economia: 82, efeito: { credibilidade: 3, popularidade: -2, imprensa: 1 } },
      { texto: "Rever benefícios fiscais antes de cortar serviços.", economia: 45, efeito: { credibilidade: 2, congresso: -2 } },
      { texto: "Ajustar aos poucos, com uma meta para cada ano.", economia: 58, efeito: { credibilidade: 2, popularidade: -1 } },
    ],
  },
  {
    id: "economia-impostos",
    tema: "Economia",
    texto: "Quem deve pagar mais imposto no Brasil?",
    opcoes: [
      { texto: "As rendas mais altas, com alívio para a classe média.", economia: 20, efeito: { popularidade: 3, congresso: -2 } },
      { texto: "Ninguém: a carga precisa cair para as empresas contratarem.", economia: 85, efeito: { credibilidade: 1, popularidade: 1, congresso: 1 } },
      { texto: "Quem hoje tem isenções que não se justificam.", economia: 50, efeito: { credibilidade: 2, congresso: -1 } },
      { texto: "Antes de mudar, é preciso simplificar o sistema.", economia: 62, efeito: { credibilidade: 1, imprensa: 1 } },
    ],
  },
  {
    id: "ambiente-amazonia",
    tema: "Meio ambiente",
    texto: "Como conciliar a proteção da Amazônia com a produção rural?",
    opcoes: [
      { texto: "Fiscalização rígida, mesmo com custo para o produtor.", economia: 30, efeito: { imprensa: 2, credibilidade: 2, congresso: -2 } },
      { texto: "Regularizar quem produz e cobrar metas de preservação.", economia: 68, efeito: { popularidade: 1, congresso: 2, imprensa: -1 } },
      { texto: "Pagar por serviços ambientais a quem preserva.", economia: 42, efeito: { popularidade: 1, imprensa: 2 } },
      { texto: "Atrair investimento estrangeiro para a bioeconomia.", economia: 60, efeito: { credibilidade: 2, imprensa: 1 } },
    ],
  },
  {
    id: "estatais",
    tema: "Economia",
    texto: "O que fazer com as grandes empresas estatais?",
    opcoes: [
      { texto: "Mantê-las públicas e melhorar a gestão.", economia: 22, efeito: { popularidade: 2, confianca: 1, imprensa: -1 } },
      { texto: "Vender participações e usar o dinheiro para reduzir a dívida.", economia: 85, efeito: { credibilidade: 2, popularidade: -1, imprensa: 1 } },
      { texto: "Privatizar só as deficitárias e manter as estratégicas.", economia: 62, efeito: { credibilidade: 2, popularidade: 1 } },
      { texto: "Blindar a gestão com regras contra indicação política.", economia: 55, efeito: { credibilidade: 2, congresso: -2 } },
    ],
  },
  {
    id: "drogas",
    tema: "Segurança",
    texto: "Qual deve ser a política do país sobre drogas?",
    opcoes: [
      { texto: "Tratar o usuário como questão de saúde pública.", costumes: 20, efeito: { credibilidade: 1, imprensa: 2, popularidade: -2 } },
      { texto: "Manter a proibição e reforçar a repressão.", costumes: 85, efeito: { popularidade: 2, imprensa: -1 } },
      { texto: "Separar o usuário do traficante com critérios claros.", costumes: 45, efeito: { credibilidade: 2, popularidade: -1 } },
      { texto: "Fazer um debate nacional antes de qualquer mudança.", costumes: 60, efeito: { confianca: 1 } },
    ],
  },
  {
    id: "aplicativos",
    tema: "Trabalho",
    texto: "Como regular o trabalho dos entregadores e motoristas de aplicativo?",
    opcoes: [
      { texto: "Garantir direitos trabalhistas e previdência obrigatória.", economia: 25, efeito: { popularidade: 2, confianca: 1, congresso: -1 } },
      { texto: "Preservar a autonomia, com seguro e contribuição opcional.", economia: 75, efeito: { popularidade: 1, credibilidade: 1, congresso: 1 } },
      { texto: "Criar uma categoria nova, com ganho mínimo por hora.", economia: 45, efeito: { popularidade: 2, credibilidade: 1 } },
      { texto: "Deixar as regras para acordos entre empresas e trabalhadores.", economia: 68, efeito: { congresso: 1, imprensa: -1 } },
    ],
  },
  {
    id: "politica-externa",
    tema: "Política externa",
    texto: "Em um mundo dividido, com quem o Brasil deve buscar mais proximidade?",
    opcoes: [
      { texto: "Fortalecer os BRICS e o Sul Global.", economia: 32, efeito: { credibilidade: 1, imprensa: -1, popularidade: 1 } },
      { texto: "Aproximar-se dos Estados Unidos e da Europa.", economia: 72, efeito: { credibilidade: 1, imprensa: 1 } },
      { texto: "Manter a neutralidade e negociar com todos.", economia: 50, efeito: { credibilidade: 2 } },
      { texto: "Priorizar a América do Sul.", economia: 42, efeito: { popularidade: 1, confianca: 1 } },
    ],
  },
  {
    id: "previdencia",
    tema: "Economia",
    texto: "O déficit da Previdência continua crescendo. Você faria uma nova reforma?",
    opcoes: [
      { texto: "Não: a prioridade é proteger quem já contribuiu.", economia: 25, efeito: { popularidade: 3, credibilidade: -1 } },
      { texto: "Sim: sem reforma, as contas não fecham.", economia: 80, efeito: { credibilidade: 3, popularidade: -3, imprensa: 1 } },
      { texto: "Só depois de combater fraudes e privilégios.", economia: 50, efeito: { popularidade: 2, credibilidade: 1 } },
      { texto: "Faria mudanças graduais, com regras de transição longas.", economia: 62, efeito: { credibilidade: 2, popularidade: -1 } },
    ],
  },
  {
    id: "emendas",
    tema: "Congresso",
    texto: "Como será a relação do seu governo com as emendas parlamentares?",
    opcoes: [
      { texto: "Limitar os valores e exigir transparência total.", efeito: { imprensa: 3, credibilidade: 2, congresso: -4 } },
      { texto: "Negociar com o Congresso para garantir a governabilidade.", efeito: { congresso: 4, imprensa: -2, credibilidade: -1 } },
      { texto: "Manter as emendas, ligadas a metas de cada área.", efeito: { credibilidade: 2, congresso: 1 } },
      { texto: "Levar o tema ao STF se o Congresso não aceitar regras.", efeito: { imprensa: 1, congresso: -5, popularidade: 1 } },
    ],
  },
  {
    id: "cotas",
    tema: "Educação",
    texto: "As cotas nas universidades federais devem continuar como estão?",
    opcoes: [
      { texto: "Sim, e devem ser ampliadas.", costumes: 22, efeito: { popularidade: 1, imprensa: 1 } },
      { texto: "Devem seguir apenas o critério de renda.", costumes: 70, efeito: { popularidade: 1, credibilidade: 1 } },
      { texto: "Devem ser mantidas, com avaliação periódica.", costumes: 42, efeito: { credibilidade: 2 } },
      { texto: "Devem ser substituídas por mais vagas e bolsas.", costumes: 80, efeito: { popularidade: 1, imprensa: -1 } },
    ],
  },
  {
    id: "terra",
    tema: "Agricultura",
    texto: "O que fazer com os conflitos por terra no campo?",
    opcoes: [
      { texto: "Acelerar a reforma agrária e os assentamentos.", economia: 20, efeito: { confianca: 1, congresso: -2, popularidade: 1 } },
      { texto: "Dar título de propriedade e proteger quem produz.", economia: 75, efeito: { congresso: 2, popularidade: 1, imprensa: -1 } },
      { texto: "Usar primeiro as terras públicas sem destinação.", economia: 45, efeito: { credibilidade: 2 } },
      { texto: "Criar mesas de negociação em cada região.", economia: 50, efeito: { confianca: 2, congresso: -1 } },
    ],
  },
];
