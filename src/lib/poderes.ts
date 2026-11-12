import type { Efeito } from "./mandato-dados";

// Os outros Poderes também jogam: o Congresso aprova projetos próprios, o STF decide e as Forças Armadas
// só agem dentro da Constituição. Nenhuma pessoa real é citada nos textos.

export type ProjetoDoCongresso = {
  id: string;
  nome: string;
  autoria: string;
  texto: string;
  sancionar: Efeito;
  // Quanto o Congresso quer o projeto (pesa para derrubar o veto) e quanto o povo gosta dele.
  interesse: number;
  popular: number;
};

export const PROJETOS_DO_CONGRESSO: ProjetoDoCongresso[] = [
  {
    id: "aposentadoria-especial", nome: "Aposentadoria especial para novas categorias", autoria: "Frente parlamentar dos servidores",
    texto: "O texto antecipa a aposentadoria de seis categorias. O custo cresce ano a ano.",
    sancionar: { "e.primario": -0.25, "e.confianca": -4, aprovacao: 2 }, interesse: 0.6, popular: 0.75,
  },
  {
    id: "fundo-eleitoral", nome: "Aumento do fundo eleitoral", autoria: "Líderes dos maiores partidos",
    texto: "Os partidos querem mais dinheiro público para as campanhas. Nas ruas, ninguém gosta.",
    sancionar: { "e.primario": -0.05, aprovacao: -3, congresso: 4, "s.confianca": -2 }, interesse: 0.95, popular: 0.1,
  },
  {
    id: "jornada", nome: "Fim da escala 6x1", autoria: "Bancada trabalhista",
    texto: "A jornada cai para cinco dias por semana sem corte de salário. Empresários falam em demissões.",
    sancionar: { aprovacao: 5, "e.confianca": -5, "e.desemprego": 0.3, "e.pib": -0.2 }, interesse: 0.4, popular: 0.85,
  },
  {
    id: "desoneracao", nome: "Prorrogação da desoneração da folha", autoria: "Frente parlamentar do empreendedorismo",
    texto: "Dezessete setores seguem pagando menos imposto sobre salários por mais quatro anos.",
    sancionar: { "e.primario": -0.15, "e.desemprego": -0.25, "e.confianca": 2, congresso: 2 }, interesse: 0.8, popular: 0.55,
  },
  {
    id: "dividas-rurais", nome: "Renegociação das dívidas rurais", autoria: "Bancada do agronegócio",
    texto: "Produtores ganham prazo e desconto nas dívidas com bancos públicos.",
    sancionar: { "e.primario": -0.1, congresso: 3, aprovacao: 0.5 }, interesse: 0.9, popular: 0.45,
  },
  {
    id: "armas", nome: "Ampliação do porte de armas", autoria: "Bancada da segurança",
    texto: "Mais categorias passam a andar armadas. O país se divide ao meio.",
    sancionar: { "p.homicidios": 0.4, congresso: 2, pressao: 4 }, interesse: 0.65, popular: 0.45,
  },
  {
    id: "redes", nome: "Regulação das redes sociais", autoria: "Comissão de comunicação",
    texto: "Plataformas passam a responder por conteúdo criminoso que não removerem.",
    sancionar: { "s.confianca": 2, aprovacao: -1, "r.Estados Unidos": -3 }, interesse: 0.45, popular: 0.55,
  },
  {
    id: "piso-professores", nome: "Novo piso nacional dos professores", autoria: "Comissão de educação",
    texto: "Professores da rede pública ganham um piso maior. Estados e municípios dizem que não têm caixa.",
    sancionar: { "e.primario": -0.12, "s.educacao": 3, aprovacao: 2 }, interesse: 0.55, popular: 0.8,
  },
  {
    id: "isencao-ir", nome: "Isenção de Imposto de Renda até R$ 7 mil", autoria: "Oposição",
    texto: "A oposição aprovou a isenção maior para colocar o governo contra a parede.",
    sancionar: { "e.carga": -0.4, "e.primario": -0.2, aprovacao: 4, "e.confianca": -2 }, interesse: 0.7, popular: 0.95,
  },
  {
    id: "emendas", nome: "Mais emendas obrigatórias", autoria: "Mesa da Câmara",
    texto: "Uma fatia maior do Orçamento passa a ser decidida pelos parlamentares, e o governo não pode bloquear.",
    sancionar: { "e.primario": -0.08, congresso: 5, "s.confianca": -1 }, interesse: 1, popular: 0.2,
  },
  {
    id: "multas-ambientais", nome: "Perdão de multas ambientais", autoria: "Bancada do agronegócio",
    texto: "Quem desmatou até 2025 tem as multas perdoadas. A Europa ameaça travar acordos.",
    sancionar: { "s.ambiente": -4, congresso: 2, "r.União Europeia": -6 }, interesse: 0.75, popular: 0.3,
  },
  {
    id: "marco-ia", nome: "Marco legal da inteligência artificial", autoria: "Comissão de ciência e tecnologia",
    texto: "Regras para empresas de IA, com incentivo a centros de dados no Brasil.",
    sancionar: { "e.investimento": 0.3, "e.confianca": 1 }, interesse: 0.4, popular: 0.5,
  },
  {
    id: "passe-livre", nome: "Passe livre estudantil nacional", autoria: "Bancada jovem",
    texto: "Estudantes de baixa renda não pagam ônibus. A conta vai para a União.",
    sancionar: { "e.primario": -0.1, aprovacao: 2 }, interesse: 0.35, popular: 0.85,
  },
  {
    id: "loterias", nome: "Liberação dos cassinos", autoria: "Frente parlamentar do turismo",
    texto: "Cassinos voltam a funcionar em resorts. Promete empregos e preocupa igrejas.",
    sancionar: { "e.carga": 0.15, "e.desemprego": -0.1, aprovacao: -1, congresso: 2 }, interesse: 0.6, popular: 0.35,
  },
];

export type DecisaoDoSTF = {
  id: string;
  titulo: string;
  texto: string;
  cumprir: Efeito;
  recorrer: Efeito;
};

export const DECISOES_DO_STF: DecisaoDoSTF[] = [
  {
    id: "stf-tributo", titulo: "STF derruba um imposto federal",
    texto: "Por maioria, o tribunal considera inconstitucional uma cobrança federal. O caixa perde de uma vez.",
    cumprir: { "e.carga": -0.3, "e.primario": -0.15, "s.confianca": 1 }, recorrer: { "e.carga": -0.15, "e.primario": -0.08 },
  },
  {
    id: "stf-inss", titulo: "STF manda corrigir aposentadorias",
    texto: "Milhões de aposentados ganham direito a revisão. A conta passa de R$ 100 bilhões.",
    cumprir: { "e.primario": -0.3, aprovacao: 2, "s.confianca": 1 }, recorrer: { "e.primario": -0.12, aprovacao: -1 },
  },
  {
    id: "stf-emendas", titulo: "STF bloqueia emendas sem transparência",
    texto: "O tribunal trava o pagamento de emendas sem dono identificado. O Congresso ferve.",
    cumprir: { "s.confianca": 3, congresso: -4 }, recorrer: { congresso: 2, "s.confianca": -2 },
  },
  {
    id: "stf-remedios", titulo: "STF obriga a União a pagar remédios caros",
    texto: "Pacientes com doenças raras ganham acesso a tratamentos que custam milhões por ano.",
    cumprir: { "e.primario": -0.06, "s.saude": 2, aprovacao: 1 }, recorrer: { aprovacao: -1.5 },
  },
  {
    id: "stf-queimadas", titulo: "STF dá 60 dias para um plano contra queimadas",
    texto: "A decisão manda o governo apresentar metas, verba e prazos para a Amazônia e o Pantanal.",
    cumprir: { "s.ambiente": 3, "e.primario": -0.05, "r.União Europeia": 3 }, recorrer: { "s.ambiente": -1, "r.União Europeia": -2 },
  },
  {
    id: "stf-greve", titulo: "STF manda servidores em greve voltarem ao trabalho",
    texto: "O tribunal limita a greve em serviços essenciais. Sindicatos acusam o governo de ter pedido.",
    cumprir: { aprovacao: 0.5, pressao: -3, congresso: 1 }, recorrer: { pressao: 4 },
  },
  {
    id: "stf-presidios", titulo: "STF declara crise nos presídios",
    texto: "O tribunal manda a União abrir vagas e melhorar as prisões em todo o país.",
    cumprir: { "p.prisional": -6, "e.primario": -0.08 }, recorrer: { "p.prisional": 2, "s.confianca": -1 },
  },
  {
    id: "stf-big-techs", titulo: "STF responsabiliza as redes sociais",
    texto: "Plataformas passam a responder por conteúdo criminoso mesmo sem ordem judicial.",
    cumprir: { "s.confianca": 2, "r.Estados Unidos": -3 }, recorrer: { "r.Estados Unidos": 2, "s.confianca": -1 },
  },
];

// Descumprir uma decisão do STF é uma crise institucional: abala a confiança e dá argumento ao impeachment.
export const AFRONTAR_STF: Efeito = { "s.confianca": -6, pressao: 10, congresso: -6, aprovacao: -2, "e.confianca": -4 };

export type ProgramaEconomico = {
  id: string;
  nome: string;
  grupo: "Emprego" | "Inflação" | "Crescimento" | "Renda";
  instrumento: "Decreto" | "Medida provisória" | "Projeto de lei";
  meses: number;
  resumo: string;
  // Efeito por mês, enquanto o programa durar: PIB, inflação e juros em pontos; desemprego por mês.
  pib?: number;
  ipca?: number;
  selic?: number;
  desemprego?: number;
  primario?: number;
  // Efeito na hora do anúncio.
  anuncio: Efeito;
  economia: number;
};

export const PROGRAMAS_ECONOMICOS: ProgramaEconomico[] = [
  {
    id: "credito-pme", nome: "Crédito barato para pequenas empresas", grupo: "Emprego", instrumento: "Decreto", meses: 18,
    resumo: "Bancos públicos emprestam com juros menores para quem contrata.", pib: 0.25, desemprego: -0.04, ipca: 0.1, primario: -0.08,
    anuncio: { aprovacao: 1 }, economia: 40,
  },
  {
    id: "frentes-trabalho", nome: "Frentes de trabalho em obras locais", grupo: "Emprego", instrumento: "Medida provisória", meses: 12,
    resumo: "Prefeituras contratam na hora para pequenas obras. Emprego rápido, gasto alto.", pib: 0.2, desemprego: -0.06, ipca: 0.15, primario: -0.15,
    anuncio: { aprovacao: 2 }, economia: 30,
  },
  {
    id: "primeiro-emprego", nome: "Primeiro emprego para jovens", grupo: "Emprego", instrumento: "Projeto de lei", meses: 24,
    resumo: "Empresas pagam menos imposto ao contratar quem nunca teve carteira assinada.", desemprego: -0.05, pib: 0.05, primario: -0.08,
    anuncio: { aprovacao: 1 }, economia: 55,
  },
  {
    id: "qualificacao", nome: "Qualificação profissional em massa", grupo: "Emprego", instrumento: "Decreto", meses: 24,
    resumo: "Cursos técnicos rápidos ligados a vagas reais. Resultado mais lento e duradouro.", desemprego: -0.03, pib: 0.1, primario: -0.05,
    anuncio: { "s.educacao": 2 }, economia: 45,
  },
  {
    id: "zerar-tarifas", nome: "Zerar imposto de importação de alimentos", grupo: "Inflação", instrumento: "Decreto", meses: 12,
    resumo: "Comida importada fica mais barata. O agronegócio reclama.", ipca: -0.4, primario: -0.03,
    anuncio: { aprovacao: 1, congresso: -1 }, economia: 60,
  },
  {
    id: "estoques", nome: "Estoques públicos de alimentos", grupo: "Inflação", instrumento: "Decreto", meses: 12,
    resumo: "O governo compra na safra e vende na entressafra para segurar preços.", ipca: -0.25, primario: -0.05,
    anuncio: {}, economia: 35,
  },
  {
    id: "corte-gastos", nome: "Corte de gastos e meta fiscal mais dura", grupo: "Inflação", instrumento: "Decreto", meses: 12,
    resumo: "Bloqueia despesas. Acalma o mercado e a inflação, esfria a economia.", ipca: -0.3, pib: -0.2, primario: 0.3,
    anuncio: { "e.confianca": 5, aprovacao: -2 }, economia: 80,
  },
  {
    id: "combustiveis", nome: "Segurar o preço dos combustíveis", grupo: "Inflação", instrumento: "Decreto", meses: 6,
    resumo: "A estatal de petróleo segura o reajuste. A inflação cai, o mercado desconfia.", ipca: -0.35,
    anuncio: { aprovacao: 2, "e.confianca": -4 }, economia: 25,
  },
  {
    id: "meta-inflacao", nome: "Subir a meta de inflação", grupo: "Crescimento", instrumento: "Decreto", meses: 36,
    resumo: "O conselho monetário aceita mais inflação, e o Banco Central pode baixar os juros.", selic: -1.5, ipca: 0.3, pib: 0.15,
    anuncio: { "e.confianca": -6, "e.dolar": 0.2 }, economia: 30,
  },
  {
    id: "concessoes", nome: "Pacote de concessões e parcerias", grupo: "Crescimento", instrumento: "Decreto", meses: 36,
    resumo: "Estradas, portos e aeroportos para a iniciativa privada investir.", pib: 0.3, desemprego: -0.02, primario: 0.05,
    anuncio: { "e.confianca": 4, "e.investimento": 0.5 }, economia: 75,
  },
  {
    id: "reindustrializacao", nome: "Plano de reindustrialização", grupo: "Crescimento", instrumento: "Projeto de lei", meses: 36,
    resumo: "Crédito e compras públicas para a indústria nacional.", pib: 0.25, desemprego: -0.03, ipca: 0.05, primario: -0.1,
    anuncio: { congresso: 1 }, economia: 35,
  },
  {
    id: "inovacao", nome: "Fundo de inovação e tecnologia", grupo: "Crescimento", instrumento: "Projeto de lei", meses: 36,
    resumo: "Dinheiro para pesquisa, startups e centros de dados.", pib: 0.2, primario: -0.05,
    anuncio: { "e.investimento": 0.4, "s.educacao": 1 }, economia: 55,
  },
  {
    id: "desburocratizar", nome: "Abrir empresa em um dia", grupo: "Crescimento", instrumento: "Decreto", meses: 36,
    resumo: "Menos papelada e licenças digitais. Barato e lento.", pib: 0.12, desemprego: -0.02,
    anuncio: { "e.confianca": 2 }, economia: 70,
  },
  {
    id: "casas", nome: "Programa de casas populares", grupo: "Crescimento", instrumento: "Medida provisória", meses: 24,
    resumo: "Construção civil a todo vapor: emprego rápido e voto agradecido.", pib: 0.25, desemprego: -0.04, primario: -0.12,
    anuncio: { aprovacao: 2 }, economia: 40,
  },
  {
    id: "exportar", nome: "Força-tarefa de exportação", grupo: "Crescimento", instrumento: "Decreto", meses: 24,
    resumo: "Missões comerciais, seguro de crédito e menos imposto para vender lá fora.", pib: 0.15,
    anuncio: { "e.exportacoes": 6 }, economia: 60,
  },
  {
    id: "salario-minimo", nome: "Aumento real do salário mínimo", grupo: "Renda", instrumento: "Medida provisória", meses: 12,
    resumo: "Mais dinheiro no bolso de quem ganha menos. Pressiona preços e a Previdência.", pib: 0.1, ipca: 0.2, primario: -0.12,
    anuncio: { aprovacao: 3 }, economia: 20,
  },
  {
    id: "fgts", nome: "Liberar saques do FGTS", grupo: "Renda", instrumento: "Decreto", meses: 6,
    resumo: "Um empurrão rápido no consumo, sem custo para o Tesouro.", pib: 0.4, ipca: 0.15,
    anuncio: { aprovacao: 2 }, economia: 45,
  },
  {
    id: "transferencia", nome: "Ampliar a transferência de renda", grupo: "Renda", instrumento: "Projeto de lei", meses: 24,
    resumo: "Mais famílias atendidas e benefício maior por criança.", pib: 0.05, primario: -0.15,
    anuncio: { aprovacao: 2, "e.pobreza": -1.5 }, economia: 20,
  },
];

export const LIMITE_PROGRAMAS = 5;

// Forças Armadas dentro da Constituição.
export const INTERVENCAO: Efeito = { "p.crime": -6, "p.homicidios": -0.8, aprovacao: 2, "e.primario": -0.05, "s.confianca": -1 };
export const GLO: Efeito = { "p.crime": -2.5, "p.roubos": -4, aprovacao: 1, "e.primario": -0.02, "s.confianca": -0.5 };

export type PassoDoGolpe = { titulo: string; texto: string; opcoes: { texto: string; chance: number; efeito: Efeito }[] };

// Tentativa de ruptura: crime contra o Estado Democrático de Direito. Quase sempre termina mal.
export const PASSOS_DO_GOLPE: PassoDoGolpe[] = [
  {
    titulo: "Os comandantes estão na sala",
    texto:
      "Exército, Marinha e Aeronáutica atenderam ao chamado. Ninguém sabe ainda o que você vai pedir. Um general fictício cruza os braços e espera.",
    opcoes: [
      { texto: "Prometer verbas, promoções e cargos.", chance: 0.06, efeito: { "e.primario": -0.1 } },
      { texto: "Dizer que o país está à beira do caos e precisa de ordem.", chance: 0.03, efeito: { pressao: 6 } },
      { texto: "Dar a ordem como comandante supremo, sem explicar.", chance: -0.03, efeito: {} },
    ],
  },
  {
    titulo: "A notícia vazou",
    texto:
      "Blindados se movem perto da Esplanada e o vídeo está em todos os celulares. Congresso e STF convocam sessões de emergência.",
    opcoes: [
      { texto: "Mandar tirar as redes sociais do ar.", chance: 0.02, efeito: { "s.confianca": -10 } },
      { texto: "Ir à TV e dizer que é um exercício de rotina.", chance: 0.04, efeito: { aprovacao: -4 } },
      { texto: "Mandar cercar o Congresso.", chance: 0.06, efeito: { pressao: 20, "e.confianca": -15 } },
    ],
  },
];
