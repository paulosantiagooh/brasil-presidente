// Cada pasta responde por um número. O presidente dá a meta, cobra e decide o que fazer se ela não vier.
export type IndicadorDaPasta = {
  nome: string;
  chave: string;
  menor: boolean;
  casas: number;
  sufixo: string;
  realista: number;
  ousada: number;
};

export const INDICADOR_DA_PASTA: Record<string, IndicadorDaPasta> = {
  "casa-civil": { nome: "Relação com o Congresso", chave: "congresso", menor: false, casas: 0, sufixo: "", realista: 5, ousada: 12 },
  fazenda: { nome: "Inflação", chave: "e.ipca", menor: true, casas: 1, sufixo: "%", realista: 0.4, ousada: 1.5 },
  saude: { nome: "Saúde", chave: "s.saude", menor: false, casas: 0, sufixo: "", realista: 2, ousada: 7 },
  educacao: { nome: "Educação", chave: "s.educacao", menor: false, casas: 0, sufixo: "", realista: 2, ousada: 7 },
  justica: { nome: "Homicídios por 100 mil", chave: "p.homicidios", menor: true, casas: 1, sufixo: "", realista: 0.5, ousada: 2 },
  defesa: { nome: "Defesa nacional", chave: "p.defesa", menor: false, casas: 0, sufixo: "", realista: 3, ousada: 7 },
  "relacoes-exteriores": { nome: "Média das relações exteriores", chave: "relacoes", menor: false, casas: 0, sufixo: "", realista: 3, ousada: 8 },
  planejamento: { nome: "Resultado primário", chave: "e.primario", menor: false, casas: 1, sufixo: "% do PIB", realista: 0.3, ousada: 0.8 },
  infraestrutura: { nome: "Investimentos", chave: "e.investimento", menor: false, casas: 1, sufixo: "% do PIB", realista: 0.4, ousada: 1 },
  agricultura: { nome: "Exportações", chave: "e.exportacoes", menor: false, casas: 0, sufixo: " US$ bi", realista: 4, ousada: 10 },
  ambiente: { nome: "Meio ambiente", chave: "s.ambiente", menor: false, casas: 0, sufixo: "", realista: 2, ousada: 7 },
  social: { nome: "Pobreza", chave: "e.pobreza", menor: true, casas: 1, sufixo: "%", realista: 0.5, ousada: 2 },
  ciencia: { nome: "Crescimento do PIB", chave: "e.pib", menor: false, casas: 1, sufixo: "%", realista: 0.3, ousada: 0.8 },
  cultura: { nome: "Aprovação do governo", chave: "aprovacao", menor: false, casas: 0, sufixo: "%", realista: 2, ousada: 5 },
  cidades: { nome: "Qualidade de vida", chave: "s.qualidade", menor: false, casas: 0, sufixo: "", realista: 2, ousada: 5 },
  pesca: { nome: "Renda", chave: "e.renda", menor: false, casas: 1, sufixo: "", realista: 1, ousada: 3 },
};

export const PRAZO_DA_META = 12;

export type MetaDoMinistro = {
  ministerio: string;
  inicial: number;
  alvo: number;
  inicio: number;
  prazo: number;
  ousada: boolean;
  cobrancas: number;
};
