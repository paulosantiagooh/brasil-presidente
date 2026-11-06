// Efeito: "e.campo" muda a economia, "s.campo" a sociedade, "p.campo" a segurança e os demais o governo.
export type Efeito = Record<string, number>;

export type AreaDoProjeto = "Tributos" | "Contas públicas" | "Moeda" | "Políticas públicas";

export type ProjetoMandato = {
  id: string;
  nome: string;
  area: AreaDoProjeto;
  tipo: string;
  economia: number;
  camara: number | null;
  senado: number | null;
  atraso: number;
  efeito: Efeito;
  resumo: string;
};

const LEI = { tipo: "Projeto de lei", camara: null, senado: null };
const COMPLEMENTAR = { tipo: "Lei complementar", camara: 257, senado: 41 };
const EMENDA = { tipo: "Emenda à Constituição", camara: 308, senado: 49 };

export const PROJETOS_MANDATO: ProjetoMandato[] = [
  { id: "reduzir-consumo", nome: "Reduzir impostos sobre o consumo", area: "Tributos", ...LEI, economia: 68, atraso: 4, efeito: { "e.carga": -1, aprovacao: 3 }, resumo: "Alivia o preço, reduz a arrecadação." },
  { id: "altas-rendas", nome: "Aumentar imposto sobre altas rendas", area: "Tributos", ...LEI, economia: 22, atraso: 6, efeito: { "e.carga": 0.8, "e.desigualdade": -0.01, "e.confianca": -3 }, resumo: "Reforça as contas, desagrada investidores." },
  { id: "incentivos", nome: "Incentivos fiscais à indústria", area: "Tributos", ...LEI, economia: 55, atraso: 6, efeito: { "e.carga": -0.4, "e.investimento": 0.8 }, resumo: "Atrai investimento, custa arrecadação." },
  { id: "tributo-digital", nome: "Criar contribuição sobre grandes plataformas digitais", area: "Tributos", ...COMPLEMENTAR, economia: 32, atraso: 8, efeito: { "e.carga": 0.5, "r.EUA": -5 }, resumo: "Nova receita e atrito com parceiros." },
  { id: "extinguir-folha", nome: "Extinguir tributo federal sobre a folha", area: "Tributos", ...COMPLEMENTAR, economia: 74, atraso: 8, efeito: { "e.carga": -0.8, "e.desemprego": -0.6, "e.informalidade": -1 }, resumo: "Estimula o emprego, reduz a receita." },
  { id: "regra-fiscal-mandato", nome: "Reforçar a regra fiscal", area: "Contas públicas", ...COMPLEMENTAR, economia: 72, atraso: 3, efeito: { "e.confianca": 8, "e.primario": 0.3, aprovacao: -1 }, resumo: "Anima o mercado, limita gastos." },
  { id: "previdencia", nome: "Reforma da Previdência", area: "Contas públicas", ...EMENDA, economia: 78, atraso: 12, efeito: { "e.primario": 0.6, "e.confianca": 6, aprovacao: -5 }, resumo: "Ajuda as contas no longo prazo, é impopular." },
  { id: "administrativa", nome: "Reforma administrativa", area: "Contas públicas", ...EMENDA, economia: 74, atraso: 12, efeito: { "e.primario": 0.4, "s.confianca": 2, aprovacao: -2 }, resumo: "Moderniza o Estado, enfrenta o funcionalismo." },
  { id: "nova-moeda", nome: "Criar uma nova moeda nacional", area: "Moeda", ...EMENDA, economia: 50, atraso: 18, efeito: { "e.confianca": -10, "e.ipca": 1.5, aprovacao: -6 }, resumo: "Transição cara e arriscada. Exige lei e mudança no Banco Central." },
  { id: "dolarizacao", nome: "Dolarizar a economia", area: "Moeda", ...EMENDA, economia: 92, atraso: 18, efeito: { "e.ipca": -2.5, "e.confianca": -4, "e.reservas": -120, aprovacao: -10 }, resumo: "Derruba a inflação, encerra a política monetária própria." },
  { id: "uniao-monetaria", nome: "Propor união monetária no Mercosul", area: "Moeda", ...EMENDA, economia: 45, atraso: 24, efeito: { "e.confianca": -6, "r.Mercosul": 15, "r.Argentina": 10, aprovacao: -3 }, resumo: "Aproxima a região, depende dos vizinhos." },
  { id: "sus", nome: "Plano nacional de redução de filas no SUS", area: "Políticas públicas", ...LEI, economia: 38, atraso: 8, efeito: { "s.saude": 6, "e.primario": -0.1, aprovacao: 3 }, resumo: "Melhora a saúde, aumenta gastos." },
  { id: "tempo-integral", nome: "Escola em tempo integral", area: "Políticas públicas", ...LEI, economia: 40, atraso: 12, efeito: { "s.educacao": 7, "e.primario": -0.1, aprovacao: 2 }, resumo: "Resultado lento e duradouro." },
  { id: "renda", nome: "Ampliar a transferência de renda", area: "Políticas públicas", ...LEI, economia: 25, atraso: 3, efeito: { "e.pobreza": -2, "e.primario": -0.3, aprovacao: 4 }, resumo: "Reduz a pobreza, pesa nas contas." },
  { id: "pec-seguranca", nome: "Sistema único de segurança pública", area: "Políticas públicas", ...EMENDA, economia: 55, atraso: 12, efeito: { "s.seguranca": 7, "p.eficiencia": 6, aprovacao: 2 }, resumo: "Integra União e estados." },
  { id: "transicao", nome: "Transição energética e proteção da Amazônia", area: "Políticas públicas", ...LEI, economia: 35, atraso: 10, efeito: { "s.ambiente": 8, "r.União Europeia": 6, "e.exportacoes": 5 }, resumo: "Abre mercados, desagrada parte do agro." },
];

export type ModeloObra = {
  id: string;
  nome: string;
  categoria: string;
  custo: number;
  meses: number;
  efeito: Efeito;
};

// Custos e prazos são estimativas do jogo, em R$ bilhões.
export const MODELOS_OBRA: ModeloObra[] = [
  { id: "rodovia", nome: "Duplicação de rodovia", categoria: "Rodovias", custo: 6, meses: 30, efeito: { "e.investimento": 0.1, aprovacao: 0.5 } },
  { id: "ferrovia", nome: "Ferrovia de carga", categoria: "Ferrovias", custo: 18, meses: 42, efeito: { "e.exportacoes": 6, "e.investimento": 0.2 } },
  { id: "ponte", nome: "Ponte interestadual", categoria: "Pontes", custo: 2, meses: 22, efeito: { aprovacao: 0.3 } },
  { id: "porto", nome: "Ampliação de porto", categoria: "Portos", custo: 5, meses: 28, efeito: { "e.exportacoes": 5 } },
  { id: "aeroporto", nome: "Novo terminal de aeroporto", categoria: "Aeroportos", custo: 3, meses: 24, efeito: { "e.investimento": 0.1 } },
  { id: "barragem", nome: "Barragem e adutora", categoria: "Barragens e adutoras", custo: 4, meses: 30, efeito: { "s.qualidade": 1.5 } },
  { id: "transposicao", nome: "Ramal de transposição de rio", categoria: "Transposição de rios", custo: 7, meses: 36, efeito: { "s.qualidade": 2, aprovacao: 0.5 } },
  { id: "hospital", nome: "Hospital federal", categoria: "Hospitais", custo: 1.5, meses: 20, efeito: { "s.saude": 1.5, aprovacao: 0.5 } },
  { id: "escola", nome: "Rede de escolas técnicas", categoria: "Escolas", custo: 1.2, meses: 18, efeito: { "s.educacao": 1.5 } },
  { id: "universidade", nome: "Novo campus universitário", categoria: "Universidades", custo: 1.5, meses: 26, efeito: { "s.educacao": 1.5 } },
  { id: "usina", nome: "Usina hidrelétrica de médio porte", categoria: "Usinas", custo: 12, meses: 40, efeito: { "e.investimento": 0.2, "s.ambiente": -1 } },
  { id: "renovavel", nome: "Parque de energia solar e eólica", categoria: "Energia solar e eólica", custo: 5, meses: 20, efeito: { "s.ambiente": 1, "e.investimento": 0.1 } },
  { id: "saneamento", nome: "Programa de saneamento", categoria: "Saneamento", custo: 6, meses: 28, efeito: { "s.saude": 1.5, "s.qualidade": 2 } },
  { id: "irrigacao", nome: "Projeto de irrigação", categoria: "Irrigação", custo: 2.5, meses: 22, efeito: { "e.exportacoes": 2 } },
  { id: "rural", nome: "Estradas e energia no campo", categoria: "Infraestrutura rural", custo: 2, meses: 18, efeito: { "s.qualidade": 1 } },
];

export type ObraReal = {
  id: string;
  nome: string;
  categoria: string;
  uf: string;
  custo: number;
  meses: number;
  execucao: number;
  licenca: boolean;
  dataBase: string;
  situacaoReal: string;
  efeito: Efeito;
};

// Situação conferida em novembro de 2026. O custo restante é uma estimativa do jogo.
export const OBRAS_REAIS: ObraReal[] = [
  { id: "transnordestina-pe", nome: "Transnordestina: trecho de Pernambuco", categoria: "Ferrovias", uf: "PE", custo: 8, meses: 36, execucao: 0, licenca: true, dataBase: "jun/2026", situacaoReal: "Primeira fase da ferrovia com cerca de 82% de execução. O trecho até Suape aguardava retomada.", efeito: { "e.exportacoes": 6, aprovacao: 0.5 } },
  { id: "angra-3", nome: "Usina nuclear Angra 3", categoria: "Usinas", uf: "RJ", custo: 23, meses: 48, execucao: 65, licenca: true, dataBase: "2023", situacaoReal: "Cerca de 65% das obras concluídas, segundo o dado mais recente encontrado, de 2023.", efeito: { "e.investimento": 0.2 } },
  { id: "ferrograo", nome: "Ferrogrão", categoria: "Ferrovias", uf: "PA", custo: 25, meses: 48, execucao: 0, licenca: false, dataBase: "2025", situacaoReal: "Projeto em fase de estudos, ainda sem licitação.", efeito: { "e.exportacoes": 10, "s.ambiente": -2 } },
  { id: "br-319", nome: "BR-319: trecho do meio", categoria: "Rodovias", uf: "AM", custo: 3, meses: 30, execucao: 0, licenca: false, dataBase: "dez/2025", situacaoReal: "Dependia do licenciamento do trecho do meio para licitar a obra.", efeito: { aprovacao: 0.5, "s.ambiente": -2 } },
];

export type Estatal = {
  id: string;
  nome: string;
  listada: boolean;
  valor: number;
};

// "listada" indica empresa com ações em bolsa. O valor de venda é uma estimativa do jogo, em % do PIB.
export const ESTATAIS: Estatal[] = [
  { id: "petrobras", nome: "Petrobras", listada: true, valor: 1.6 },
  { id: "bb", nome: "Banco do Brasil", listada: true, valor: 0.6 },
  { id: "caixa", nome: "Caixa Econômica Federal", listada: false, valor: 0.9 },
  { id: "correios", nome: "Correios", listada: false, valor: 0.1 },
  { id: "bndes", nome: "BNDES", listada: false, valor: 0.8 },
  { id: "serpro", nome: "Serpro", listada: false, valor: 0.05 },
  { id: "dataprev", nome: "Dataprev", listada: false, valor: 0.05 },
];

export const PARCEIROS = [
  "Estados Unidos", "China", "Rússia", "Argentina", "União Europeia", "África",
  "BRICS", "Mercosul", "ONU", "G20", "OMC",
];

export const ACOES_DIPLOMATICAS: { id: string; nome: string; relacao: number; efeito: Efeito }[] = [
  { id: "visita", nome: "Visita presidencial", relacao: 6, efeito: { aprovacao: 0.3 } },
  { id: "comercial", nome: "Acordo comercial", relacao: 8, efeito: { "e.exportacoes": 6 } },
  { id: "tecnologia", nome: "Acordo tecnológico", relacao: 5, efeito: { "e.investimento": 0.2 } },
  { id: "agricola", nome: "Cooperação agrícola", relacao: 5, efeito: { "e.exportacoes": 4 } },
  { id: "energia", nome: "Cooperação energética", relacao: 5, efeito: { "s.ambiente": 1, "e.investimento": 0.1 } },
];

export const PROGRAMAS_SEGURANCA: { id: string; nome: string; resumo: string; efeito: Efeito }[] = [
  { id: "crime-organizado", nome: "Força-tarefa contra o crime organizado", resumo: "Age com os estados, respeitando as competências de cada um.", efeito: { "p.crime": -5, "p.eficiencia": 2 } },
  { id: "fronteiras", nome: "Reforço das fronteiras", resumo: "Reduz o tráfico de armas e drogas.", efeito: { "p.fronteiras": 6, "p.trafico": -3 } },
  { id: "prisional", nome: "Vagas e gestão do sistema prisional", resumo: "Reduz a superlotação.", efeito: { "p.prisional": -6 } },
  { id: "mulheres", nome: "Rede de proteção às mulheres", resumo: "Amplia atendimento e medidas protetivas.", efeito: { "p.mulher": -6, aprovacao: 0.5 } },
  { id: "cooperacao", nome: "Pacto de cooperação com os estados", resumo: "Integra dados e polícias.", efeito: { "p.eficiencia": 4, "p.homicidios": -0.6 } },
  { id: "defesa", nome: "Modernização das Forças Armadas", resumo: "Aumenta a capacidade de defesa, custa orçamento.", efeito: { "p.defesa": 6, "e.primario": -0.05 } },
];

export type EventoMandato = {
  id: string;
  tema: string;
  titulo: string;
  texto: string;
  opcoes: [{ texto: string; efeito: Efeito }, { texto: string; efeito: Efeito }];
};

// Eventos genéricos: nenhuma pessoa real é citada.
export const EVENTOS_MANDATO: EventoMandato[] = [
  { id: "crise-global", tema: "Crise econômica", titulo: "Crise financeira global", texto: "Bolsas despencam no exterior, e o dólar dispara.", opcoes: [
    { texto: "Manter as contas e confiar no Banco Central.", efeito: { "e.confianca": 3, "e.pib": -0.5, aprovacao: -2 } },
    { texto: "Lançar um pacote de estímulo.", efeito: { "e.pib": 0.3, "e.primario": -0.4, "e.confianca": -4 } },
  ] },
  { id: "inflacao-alimentos", tema: "Inflação elevada", titulo: "Alta no preço dos alimentos", texto: "A cesta básica sobe forte, e a população cobra medidas.", opcoes: [
    { texto: "Zerar temporariamente impostos sobre alimentos.", efeito: { "e.ipca": -0.4, "e.carga": -0.1, aprovacao: 2 } },
    { texto: "Não intervir nos preços.", efeito: { "e.confianca": 2, aprovacao: -3 } },
  ] },
  { id: "recessao", tema: "Recessão", titulo: "Dois trimestres de queda no PIB", texto: "A economia encolhe, e o desemprego ameaça subir.", opcoes: [
    { texto: "Antecipar obras e crédito público.", efeito: { "e.pib": 0.5, "e.primario": -0.3 } },
    { texto: "Cortar gastos para recuperar a confiança.", efeito: { "e.confianca": 5, "e.pib": -0.2, aprovacao: -3 } },
  ] },
  { id: "greve-transporte", tema: "Greve", titulo: "Greve nacional dos caminhoneiros", texto: "Estradas bloqueadas ameaçam o abastecimento.", opcoes: [
    { texto: "Negociar e subsidiar o diesel.", efeito: { "e.primario": -0.1, aprovacao: 1 } },
    { texto: "Liberar as estradas e endurecer a negociação.", efeito: { aprovacao: -2, "e.confianca": 1 } },
  ] },
  { id: "greve-servidores", tema: "Greve", titulo: "Paralisação dos servidores federais", texto: "Categorias pedem reajuste e param serviços.", opcoes: [
    { texto: "Conceder reajuste.", efeito: { "e.primario": -0.15, aprovacao: 1, congresso: 1 } },
    { texto: "Manter a proposta do governo.", efeito: { "e.confianca": 2, "s.confianca": -1, aprovacao: -1 } },
  ] },
  { id: "enchentes", tema: "Desastre natural", titulo: "Enchentes atingem cidades do Sul", texto: "Milhares de pessoas estão desalojadas.", opcoes: [
    { texto: "Enviar recursos federais extraordinários.", efeito: { "e.primario": -0.15, aprovacao: 3 } },
    { texto: "Priorizar a coordenação com os governos locais.", efeito: { aprovacao: -1, "s.confianca": 1 } },
  ] },
  { id: "seca", tema: "Desastre natural", titulo: "Seca severa no Nordeste e na Amazônia", texto: "Rios baixam, e a produção é afetada.", opcoes: [
    { texto: "Criar um plano emergencial de água.", efeito: { "e.primario": -0.1, "s.qualidade": 1, aprovacao: 2 } },
    { texto: "Liberar crédito aos produtores atingidos.", efeito: { "e.exportacoes": 2, aprovacao: 1 } },
  ] },
  { id: "energia", tema: "Problema energético", titulo: "Risco de falta de energia", texto: "Reservatórios baixos forçam o uso de térmicas caras.", opcoes: [
    { texto: "Acionar térmicas e repassar o custo.", efeito: { "e.ipca": 0.3, aprovacao: -2 } },
    { texto: "Subsidiar a conta de luz.", efeito: { "e.primario": -0.2, aprovacao: 1 } },
  ] },
  { id: "contrato", tema: "Escândalo administrativo", titulo: "Irregularidade em contrato federal", texto: "Uma auditoria aponta sobrepreço em um órgão público.", opcoes: [
    { texto: "Afastar a chefia e abrir investigação.", efeito: { "s.confianca": 2, congresso: -2 } },
    { texto: "Aguardar a apuração interna.", efeito: { "s.confianca": -3, aprovacao: -3 } },
  ] },
  { id: "vetos", tema: "Executivo e Congresso", titulo: "Congresso ameaça derrubar vetos", texto: "Líderes cobram mais espaço no Orçamento.", opcoes: [
    { texto: "Negociar liberação de emendas.", efeito: { congresso: 5, "e.primario": -0.1, aprovacao: -1 } },
    { texto: "Manter os vetos e enfrentar a derrota.", efeito: { congresso: -6, aprovacao: 1 } },
  ] },
  { id: "tarifas", tema: "Crise diplomática", titulo: "Parceiro impõe tarifas ao Brasil", texto: "Exportadores temem perdas.", opcoes: [
    { texto: "Negociar sem retaliar.", efeito: { "e.exportacoes": -3, "e.confianca": 1 } },
    { texto: "Retaliar com tarifas.", efeito: { "e.exportacoes": -6, aprovacao: 2 } },
  ] },
  { id: "conflito", tema: "Conflito internacional", titulo: "Guerra pressiona o petróleo", texto: "Um conflito no exterior encarece combustíveis.", opcoes: [
    { texto: "Segurar o preço nas refinarias públicas.", efeito: { aprovacao: 1, "e.confianca": -3 } },
    { texto: "Seguir o preço internacional.", efeito: { "e.ipca": 0.4, aprovacao: -2, "e.confianca": 1 } },
  ] },
  { id: "protestos", tema: "Manifestações", titulo: "Protestos em grandes capitais", texto: "Multidões vão às ruas contra o custo de vida.", opcoes: [
    { texto: "Receber lideranças e anunciar medidas.", efeito: { aprovacao: 2, "e.primario": -0.05 } },
    { texto: "Defender a política atual.", efeito: { aprovacao: -3, "e.confianca": 1 } },
  ] },
];

export type Vaga = {
  id: string;
  mes: number;
  orgao: string;
  cargo: string;
  regra: string;
  opcoes: { nome: string; perfil: string; bonus: number; efeito: Efeito }[];
};

// Calendário real de vagas no mandato. Janeiro de 2031 é o mês 1. Os indicados são fictícios.
export const VAGAS: Vaga[] = [
  { id: "pgr-2031", mes: 12, orgao: "Ministério Público", cargo: "Procuradoria-Geral da República", regra: "Mandato de 2 anos. O presidente indica, e o Senado aprova com 41 votos.", opcoes: [
    { nome: "Dra. Cecília Rangel Motta", perfil: "Procuradora de carreira, sem ligação com o governo.", bonus: 0.08, efeito: { "s.confianca": 3, congresso: -1 } },
    { nome: "Dr. Augusto Paiva Leal", perfil: "Procurador próximo do governo.", bonus: 0, efeito: { "s.confianca": -3, congresso: 1 } },
  ] },
  { id: "bc-2033", mes: 24, orgao: "Banco Central", cargo: "Presidência do Banco Central", regra: "Mandato de 4 anos a partir de janeiro de 2033. O Senado aprova, e o banco mantém autonomia.", opcoes: [
    { nome: "Beatriz Holanda Viana", perfil: "Economista respeitada pelo mercado.", bonus: 0.08, efeito: { "e.confianca": 6 } },
    { nome: "Rubens Sá Teixeira", perfil: "Economista que defende juros mais baixos.", bonus: 0, efeito: { "e.confianca": -6, "e.ipca": 0.3, aprovacao: 1 } },
  ] },
  { id: "stf-2033", mes: 26, orgao: "STF", cargo: "Vaga de Edson Fachin no STF", regra: "Aposentadoria compulsória aos 75 anos, em fevereiro de 2033. O Senado aprova com 41 votos, e pode rejeitar, como fez em abril de 2026.", opcoes: [
    { nome: "Dra. Lúcia Falcão Bastos", perfil: "Jurista respeitada no meio acadêmico.", bonus: 0.08, efeito: { "s.confianca": 3 } },
    { nome: "Dr. Ricardo Meireles Couto", perfil: "Advogado próximo do governo.", bonus: -0.04, efeito: { "s.confianca": -3, congresso: 1 } },
  ] },
  { id: "pgr-2033", mes: 36, orgao: "Ministério Público", cargo: "Procuradoria-Geral da República", regra: "Mandato de 2 anos. O presidente indica, e o Senado aprova com 41 votos.", opcoes: [
    { nome: "Dra. Sílvia Tavora Mendes", perfil: "Procuradora com longa carreira no combate à corrupção.", bonus: 0.06, efeito: { "s.confianca": 2 } },
    { nome: "Dr. Nelson Ayres Fontes", perfil: "Procurador de perfil conciliador.", bonus: 0.04, efeito: { congresso: 1 } },
  ] },
];

export type Ministro = {
  nome: string;
  nascimento: string;
  posse: string;
  indicacao: string;
  aposentadoria: string;
};

// Composição real do STF conferida em novembro de 2026, com a aposentadoria aos 75 anos.
export const STF: Ministro[] = [
  { nome: "Dias Toffoli", nascimento: "15/11/1967", posse: "2009", indicacao: "Lula", aposentadoria: "2042" },
  { nome: "Alexandre de Moraes", nascimento: "13/12/1968", posse: "2017", indicacao: "Michel Temer", aposentadoria: "2043" },
  { nome: "Flávio Dino", nascimento: "30/04/1968", posse: "2024", indicacao: "Lula", aposentadoria: "2043" },
  { nome: "Nunes Marques", nascimento: "16/05/1972", posse: "2020", indicacao: "Jair Bolsonaro", aposentadoria: "2047" },
  { nome: "André Mendonça", nascimento: "27/12/1972", posse: "2021", indicacao: "Jair Bolsonaro", aposentadoria: "2047" },
  { nome: "Cristiano Zanin", nascimento: "15/11/1975", posse: "2023", indicacao: "Lula", aposentadoria: "2050" },
  { nome: "Edson Fachin", nascimento: "08/02/1958", posse: "2015", indicacao: "Dilma Rousseff", aposentadoria: "2033" },
];

export const VAGAS_STF_ANTES_DE_2031 =
  "Quatro cadeiras mudam antes do início do mandato: a de Luís Roberto Barroso (aberta em 2025) e as de Luiz Fux (2028), Cármen Lúcia (2029) e Gilmar Mendes (2030). O jogo não presume quem vai ocupá-las.";

export const INSTITUICOES = [
  { nome: "STF", papel: "Guarda da Constituição. Elege o próprio presidente: o presidente da República não escolhe." },
  { nome: "STJ", papel: "Uniformiza a lei federal. O presidente escolhe a partir de listas do próprio tribunal." },
  { nome: "TSE", papel: "Organiza as eleições. Reúne ministros do STF, do STJ e juristas." },
  { nome: "TST", papel: "Última instância da Justiça do Trabalho." },
  { nome: "STM", papel: "Justiça Militar da União." },
  { nome: "Ministério Público", papel: "Fiscaliza a lei com independência. O procurador-geral é indicado pelo presidente." },
  { nome: "Banco Central", papel: "Define os juros com autonomia e administra as reservas internacionais." },
];

export const GRUPOS_SOCIAIS = [
  "Trabalhadores", "Classe média", "Empresários", "Agronegócio", "Evangélicos", "Jovens", "Servidores",
];
