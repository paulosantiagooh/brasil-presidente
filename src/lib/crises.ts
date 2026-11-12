import type { TipoCena } from "./cenas";
import type { Efeito } from "./mandato-dados";

// Gabinete de crise: uma crise grande que dura três meses. Quem fala são os assessores fictícios do jogo,
// cada um responsável por uma área. Ministros reais nunca recebem falas inventadas.

export type Conselho = {
  quem: string;
  fala: string;
  plano: string;
  efeito: Efeito;
  gravidade: number;
  // O que o assessor diz quando o plano dele é deixado de lado.
  ignorado: string;
};

export type FaseDaCrise = {
  titulo: string;
  texto: string;
  noticias: string[];
  conselhos: Conselho[];
};

export type Crise = {
  id: string;
  nome: string;
  cena: TipoCena;
  fases: FaseDaCrise[];
  // Efeito duradouro de cada desfecho: a história do mandato muda a partir daqui.
  desfechos: { contida: Efeito; arrastada: Efeito; desastre: Efeito };
  textos: { contida: string; arrastada: string; desastre: string };
};

export const AREA_DO_ASSESSOR: Record<string, string> = {
  helena: "Casa Civil",
  tico: "Comunicação",
  nair: "Economia",
  coronel: "Segurança",
  cida: "Área social",
  zeca: "Articulação política",
};

export const SEGUNDOS_DA_CRISE = 75;

export const CRISES: Crise[] = [
  {
    id: "apagao",
    nome: "Apagão nacional",
    cena: "apagao",
    fases: [
      {
        titulo: "A luz caiu em 14 estados",
        texto: "Uma falha em cadeia derrubou a rede elétrica. Hospitais estão no gerador, o metrô parou e o país está no escuro.",
        noticias: ["Metrôs parados em três capitais", "Hospitais ligam geradores", "Semáforos apagados travam o trânsito", "Operadora fala em falha em cadeia"],
        conselhos: [
          { quem: "coronel", fala: "Ponha as Forças Armadas na rua agora. Escuro é convite para saque.", plano: "Tropas nas ruas e toque de recolher nas capitais.", efeito: { "p.crime": -2, "s.confianca": -2, aprovacao: -1 }, gravidade: -8, ignorado: "Quando começarem os saques, lembre de mim." },
          { quem: "nair", fala: "O problema é técnico. Dê carta branca aos engenheiros e pague o que for preciso.", plano: "Gabinete técnico com poder total e verba de emergência.", efeito: { "e.primario": -0.08 }, gravidade: -18, ignorado: "Política não religa disjuntor, presidente." },
          { quem: "tico", fala: "O povo quer ver você. Vá para uma sala de controle, com câmera e lanterna na mão.", plano: "Ir ao centro de controle e falar ao vivo.", efeito: { aprovacao: 3 }, gravidade: -4, ignorado: "Sumir numa hora dessas custa caro." },
        ],
      },
      {
        titulo: "Uma semana no escuro",
        texto: "Parte do Norte e do Nordeste continua sem energia. Comida estraga, água não chega às caixas e a paciência acabou.",
        noticias: ["Caminhões-pipa nas periferias", "Comércio calcula prejuízo bilionário", "Oposição fala em descaso", "Geradores esgotados nas lojas"],
        conselhos: [
          { quem: "cida", fala: "Tem gente com criança sem água. Manda comida, água e gerador para os bairros pobres primeiro.", plano: "Operação de socorro aos bairros mais pobres.", efeito: { aprovacao: 3, "e.primario": -0.06 }, gravidade: -12, ignorado: "Os pobres sempre ficam para depois, né?" },
          { quem: "zeca", fala: "Os governadores estão te culpando. Chama todos para Brasília e divide a conta.", plano: "Pacto com os governadores e verba dividida.", efeito: { congresso: 3 }, gravidade: -6, ignorado: "Vai brigar sozinho com 27 governadores?" },
          { quem: "nair", fala: "Importe energia dos vizinhos e ligue todas as térmicas. Vai ficar caro, mas acende.", plano: "Térmicas no máximo e energia dos países vizinhos.", efeito: { "e.ipca": 0.3, "r.Argentina": 3 }, gravidade: -16, ignorado: "Sem energia não tem economia nenhuma." },
        ],
      },
      {
        titulo: "O verão vem aí",
        texto: "A luz voltou, mas os reservatórios estão baixos e o calor vai chegar. Racionar agora ou arriscar outro apagão?",
        noticias: ["Reservatórios no menor nível em uma década", "Indústria teme racionamento", "Previsão é de calor recorde"],
        conselhos: [
          { quem: "nair", fala: "Racione agora, com bônus para quem economizar. Dói hoje e salva o verão.", plano: "Racionamento com bônus para quem economizar.", efeito: { aprovacao: -3, "e.pib": -0.3, "s.ambiente": 2 }, gravidade: -20, ignorado: "Depois não diga que eu não avisei." },
          { quem: "tico", fala: "Racionamento é palavra maldita. Chama de 'consumo consciente' e torce pela chuva.", plano: "Campanha de economia voluntária, sem racionar.", efeito: { aprovacao: 1 }, gravidade: 6, ignorado: "Você vai virar o presidente do apagão." },
          { quem: "helena", fala: "Contrate usinas de emergência e mude a regra do setor. Leva tempo, mas resolve de vez.", plano: "Leilão de energia de emergência e reforma do setor.", efeito: { "e.primario": -0.1, "e.investimento": 0.4 }, gravidade: -12, ignorado: "Remendo sobre remendo. Vai cair de novo." },
        ],
      },
    ],
    desfechos: {
      contida: { aprovacao: 4, "e.confianca": 3 },
      arrastada: { aprovacao: -2, "e.pib": -0.2 },
      desastre: { aprovacao: -7, "e.pib": -0.6, pressao: 12 },
    },
    textos: {
      contida: "A rede foi reforçada e o verão passou sem apagão. Você saiu da crise maior do que entrou.",
      arrastada: "A luz voltou, mas aos trancos. Ninguém esquece o mês no escuro.",
      desastre: "Outro apagão no verão. A palavra 'apagão' grudou no seu governo.",
    },
  },
  {
    id: "banco",
    nome: "A quebra de um grande banco",
    cena: "queda",
    fases: [
      {
        titulo: "Fila na porta do banco",
        texto: "Um dos maiores bancos privados do país não consegue pagar os saques. Correntistas fazem fila e o pânico começa a se espalhar.",
        noticias: ["Filas dobram quarteirões", "Ações de bancos despencam", "Banco Central convoca reunião de emergência", "Redes sociais espalham boatos"],
        conselhos: [
          { quem: "nair", fala: "Garantia total aos depósitos, hoje. Se o pânico pular para outros bancos, acabou.", plano: "Garantir todos os depósitos com dinheiro público.", efeito: { "e.primario": -0.15, "e.confianca": 4 }, gravidade: -20, ignorado: "Pânico bancário não espera reunião." },
          { quem: "cida", fala: "Salvar banqueiro com dinheiro do povo? Garanta só a poupança das pessoas comuns.", plano: "Garantir só a poupança de pessoas físicas.", efeito: { aprovacao: 2, "e.confianca": -3 }, gravidade: -6, ignorado: "Para banco sempre tem dinheiro." },
          { quem: "tico", fala: "Não fale nada. Se o presidente aparecer, todo mundo acha que é grave.", plano: "Silêncio total e deixar o Banco Central agir.", efeito: {}, gravidade: 8, ignorado: "Falar só piora, você vai ver." },
        ],
      },
      {
        titulo: "O contágio",
        texto: "Dois bancos médios também sofrem saques. O dólar dispara e empresas não conseguem crédito para pagar salários.",
        noticias: ["Dólar bate recorde", "Empresas atrasam salários", "Bolsa interrompe negócios", "FMI acompanha a situação"],
        conselhos: [
          { quem: "nair", fala: "Abra uma linha de crédito pelos bancos públicos para as empresas pagarem salários.", plano: "Crédito emergencial dos bancos públicos.", efeito: { "e.primario": -0.1, "e.desemprego": -0.2 }, gravidade: -14, ignorado: "Sem crédito, o desemprego vem em ondas." },
          { quem: "helena", fala: "Estatize o banco quebrado e troque a diretoria. É drástico, mas acaba com a dúvida.", plano: "Intervenção e estatização do banco quebrado.", efeito: { "e.confianca": -4, "e.divida": 0.8, aprovacao: 2 }, gravidade: -16, ignorado: "Meia solução vira problema inteiro." },
          { quem: "zeca", fala: "Mande um projeto ao Congresso e divida o desgaste. Deixe os deputados votarem o socorro.", plano: "Socorro aprovado pelo Congresso, com prazo.", efeito: { congresso: 3 }, gravidade: -4, ignorado: "Decidir sozinho é carregar a culpa sozinho." },
        ],
      },
      {
        titulo: "Quem paga a conta",
        texto: "O sistema se acalmou, mas a conta chegou: dezenas de bilhões. O país quer saber quem vai pagar e se alguém vai preso.",
        noticias: ["Conta do socorro passa de R$ 60 bilhões", "Investigação mira a antiga diretoria", "CPI ganha assinaturas"],
        conselhos: [
          { quem: "coronel", fala: "Polícia Federal em cima da diretoria antiga. O povo precisa ver alguém pagar.", plano: "Investigação dura sobre os responsáveis.", efeito: { "s.confianca": 3, aprovacao: 2 }, gravidade: -10, ignorado: "Sem culpado, o culpado vira você." },
          { quem: "nair", fala: "Cobre uma taxa extra dos bancos por dez anos. Quem quebrou o sistema paga o conserto.", plano: "Taxa sobre os bancos para pagar o socorro.", efeito: { "e.carga": 0.2, "e.confianca": -2, aprovacao: 2 }, gravidade: -12, ignorado: "O contribuinte vai pagar a festa dos banqueiros." },
          { quem: "tico", fala: "Página virada. Anuncie uma boa notícia e mude de assunto.", plano: "Virar a página e mudar de assunto.", efeito: { aprovacao: 1 }, gravidade: 8, ignorado: "Ficar remoendo derruba a aprovação." },
        ],
      },
    ],
    desfechos: {
      contida: { "e.confianca": 6, aprovacao: 3 },
      arrastada: { "e.confianca": -3, "e.dolar": 0.2 },
      desastre: { "e.confianca": -10, "e.dolar": 0.6, "e.desemprego": 0.6, pressao: 10 },
    },
    textos: {
      contida: "O pânico morreu na praia. O mercado passou a confiar na sua mão firme.",
      arrastada: "O sistema sobreviveu, mas a desconfiança vai durar anos.",
      desastre: "Crédito travado, demissões e dólar nas alturas. A crise bancária virou recessão.",
    },
  },
  {
    id: "hacker",
    nome: "Ataque hacker ao governo",
    cena: "vazamento",
    fases: [
      {
        titulo: "Os sistemas caíram",
        texto: "Hackers sequestraram os sistemas do governo. Aposentadorias, notas fiscais e o portal da saúde estão fora do ar. Eles pedem resgate.",
        noticias: ["INSS fora do ar", "Grupo hacker pede resgate em criptomoeda", "Bancos reforçam segurança", "Especialistas falam no maior ataque da história do país"],
        conselhos: [
          { quem: "coronel", fala: "Não se negocia com criminoso. Desliga tudo e reconstrói do zero.", plano: "Desligar a rede e reconstruir os sistemas.", efeito: { "e.pib": -0.1, "s.confianca": 1 }, gravidade: -10, ignorado: "Pagou uma vez, vai pagar sempre." },
          { quem: "nair", fala: "Cada dia parado custa bilhões. Pague o resgate em silêncio e volte a funcionar.", plano: "Pagar o resgate discretamente.", efeito: { "e.primario": -0.03 }, gravidade: -14, ignorado: "O país parado sai mais caro que o resgate." },
          { quem: "helena", fala: "Peça ajuda a outros países e às grandes empresas de tecnologia. Sozinhos não damos conta.", plano: "Força-tarefa internacional de tecnologia.", efeito: { "r.Estados Unidos": 3, "r.União Europeia": 3 }, gravidade: -12, ignorado: "Orgulho não restaura servidor." },
        ],
      },
      {
        titulo: "Os dados vazaram",
        texto: "Dados de milhões de brasileiros apareceram à venda. CPF, endereço, renda. Golpes por telefone explodem.",
        noticias: ["Dados de 120 milhões à venda", "Golpes por mensagem disparam", "Procon recebe enxurrada de queixas", "Oposição pede CPI"],
        conselhos: [
          { quem: "cida", fala: "As pessoas estão sendo roubadas no celular. Faz uma campanha simples ensinando a se proteger.", plano: "Campanha nacional contra golpes.", efeito: { aprovacao: 2, "e.primario": -0.02 }, gravidade: -10, ignorado: "Quem cai no golpe é sempre o mais simples." },
          { quem: "tico", fala: "Culpe o governo anterior. Os sistemas eram velhos, isso é verdade.", plano: "Responsabilizar a gestão anterior.", efeito: { aprovacao: 1, congresso: -2 }, gravidade: 4, ignorado: "Vai assumir a culpa de graça?" },
          { quem: "zeca", fala: "Apoie a CPI. Se você liderar a investigação, ela não vira contra você.", plano: "Apoiar a CPI e entregar todas as informações.", efeito: { "s.confianca": 3, congresso: 2 }, gravidade: -8, ignorado: "CPI sem o governo vira CPI contra o governo." },
        ],
      },
      {
        titulo: "Nunca mais",
        texto: "Os sistemas voltaram. Agora é decidir quanto investir para que isso não se repita.",
        noticias: ["Governo estuda agência de defesa cibernética", "Empresas cobram regras", "Hackers ameaçam novo ataque"],
        conselhos: [
          { quem: "coronel", fala: "Crie uma agência de defesa cibernética, com gente boa e salário bom.", plano: "Agência nacional de defesa cibernética.", efeito: { "e.primario": -0.06, "p.defesa": 3 }, gravidade: -16, ignorado: "Eles vão voltar, e vamos estar nus de novo." },
          { quem: "nair", fala: "Contrate as melhores empresas privadas. Mais rápido e mais barato que criar outra estatal.", plano: "Contratar segurança digital privada.", efeito: { "e.primario": -0.03, "e.confianca": 2 }, gravidade: -12, ignorado: "Burocracia não para hacker." },
          { quem: "tico", fala: "Já passou. Ninguém mais fala disso. Gaste em coisa que dá voto.", plano: "Encerrar o assunto.", efeito: {}, gravidade: 12, ignorado: "Segurança digital não dá voto, presidente." },
        ],
      },
    ],
    desfechos: {
      contida: { "s.confianca": 4, aprovacao: 2 },
      arrastada: { "s.confianca": -2 },
      desastre: { "s.confianca": -6, aprovacao: -5, "e.pib": -0.3 },
    },
    textos: {
      contida: "O governo saiu do ataque mais forte, com sistemas novos e uma defesa que virou exemplo.",
      arrastada: "Os sistemas funcionam, mas ninguém confia muito neles.",
      desastre: "Um segundo ataque derrubou tudo de novo. O governo virou piada nas redes.",
    },
  },
  {
    id: "greve-geral",
    nome: "Greve geral",
    cena: "protesto",
    fases: [
      {
        titulo: "O país parou",
        texto: "Centrais sindicais, caminhoneiros e servidores cruzaram os braços juntos. Ônibus, portos e escolas parados.",
        noticias: ["Maior greve em décadas", "Portos parados", "Escolas sem aula em 20 estados", "Centrais divulgam lista de reivindicações"],
        conselhos: [
          { quem: "cida", fala: "Eles têm razão em metade das coisas. Senta na mesa hoje e ouve.", plano: "Abrir negociação imediata com as centrais.", efeito: { aprovacao: 2, congresso: -1 }, gravidade: -14, ignorado: "Quem não escuta o povo escuta a rua." },
          { quem: "coronel", fala: "Serviço essencial não pode parar. Garanta portos e estradas com a polícia.", plano: "Garantir serviços essenciais com força policial.", efeito: { "s.confianca": -2, pressao: 6 }, gravidade: -4, ignorado: "Sem combustível, o país quebra em uma semana." },
          { quem: "nair", fala: "Não ceda nada. Se ceder, todo ano tem greve. Aguenta firme.", plano: "Não negociar e esperar a greve perder força.", efeito: { "e.confianca": 3, aprovacao: -2 }, gravidade: 8, ignorado: "Ceder agora é inflação depois." },
        ],
      },
      {
        titulo: "Prateleiras vazias",
        texto: "Sem caminhões, falta comida e combustível em várias cidades. O preço do que sobrou disparou.",
        noticias: ["Postos sem gasolina", "Supermercados limitam compras", "Preço do tomate triplica", "Hospitais racionam oxigênio"],
        conselhos: [
          { quem: "zeca", fala: "O Congresso aprova um acordo em 48 horas se você der um gesto aos caminhoneiros.", plano: "Acordo relâmpago no Congresso sobre o frete.", efeito: { congresso: 3, "e.primario": -0.06 }, gravidade: -12, ignorado: "Sem o Congresso, a greve vai longe." },
          { quem: "coronel", fala: "Escolte comboios de alimentos e oxigênio com o Exército. Primeiro a vida.", plano: "Comboios escoltados com alimentos e oxigênio.", efeito: { "s.saude": 1, pressao: 2 }, gravidade: -14, ignorado: "Se faltar oxigênio, a culpa vai ser sua." },
          { quem: "tico", fala: "Mostre os grevistas como vilões. A classe média já está irritada.", plano: "Campanha contra os grevistas.", efeito: { aprovacao: -1, pressao: 10 }, gravidade: 10, ignorado: "Você vai perder a classe média." },
        ],
      },
      {
        titulo: "A mesa final",
        texto: "As centrais aceitam sentar. Cada lado tem uma lista. O que você assina define os próximos anos.",
        noticias: ["Reunião decisiva no Planalto", "Centrais falam em acordo histórico", "Mercado teme concessões"],
        conselhos: [
          { quem: "cida", fala: "Reajuste do salário mínimo acima da inflação e mesa permanente com os trabalhadores.", plano: "Acordo com ganho real e mesa permanente.", efeito: { aprovacao: 4, "e.ipca": 0.3, "e.primario": -0.1 }, gravidade: -18, ignorado: "Vão voltar para a rua, e com razão." },
          { quem: "nair", fala: "Acordo mínimo: só repõe a inflação. O resto é irresponsável.", plano: "Acordo mínimo, só reposição da inflação.", efeito: { "e.confianca": 3, aprovacao: -1 }, gravidade: -8, ignorado: "Essa conta vai chegar na inflação." },
          { quem: "helena", fala: "Meio-termo: ganho real pequeno agora e outro em dois anos, amarrado ao crescimento.", plano: "Acordo escalonado, ligado ao crescimento.", efeito: { aprovacao: 2, "e.confianca": 1 }, gravidade: -14, ignorado: "Extremos não fecham acordo." },
        ],
      },
    ],
    desfechos: {
      contida: { aprovacao: 4, pressao: -12 },
      arrastada: { aprovacao: -2, "e.pib": -0.2 },
      desastre: { aprovacao: -6, "e.pib": -0.5, pressao: 15 },
    },
    textos: {
      contida: "O acordo virou referência. O país voltou a andar, e você ganhou fama de negociador.",
      arrastada: "A greve acabou por cansaço. Ninguém ganhou, e todo mundo perdeu um pouco.",
      desastre: "A greve terminou em caos e voltou meses depois. As ruas não perdoam.",
    },
  },
  {
    id: "fronteira",
    nome: "Crise humanitária na fronteira",
    cena: "fronteira",
    fases: [
      {
        titulo: "Milhares atravessam",
        texto: "Uma guerra civil num país vizinho empurra milhares de famílias para a fronteira norte. Abrigos lotados em poucas horas.",
        noticias: ["Dez mil pessoas cruzam em um dia", "Cidades de fronteira pedem socorro", "ONU pede ajuda ao Brasil", "Crianças desacompanhadas chegam sozinhas"],
        conselhos: [
          { quem: "cida", fala: "São famílias fugindo da guerra. Abrigo, comida e vacina para todos, agora.", plano: "Operação de acolhida humanitária.", efeito: { "e.primario": -0.05, "r.ONU": 6, aprovacao: 1 }, gravidade: -14, ignorado: "Quem vira as costas para criança não dorme em paz." },
          { quem: "coronel", fala: "Feche a fronteira e controle quem entra. Não sabemos quem está vindo.", plano: "Fechar a fronteira e controlar a entrada.", efeito: { "r.ONU": -6, "p.fronteiras": 3 }, gravidade: 4, ignorado: "Fronteira aberta é porta aberta para o crime." },
          { quem: "helena", fala: "Peça ajuda à ONU e divida a conta com outros países, mas receba as pessoas.", plano: "Acolher com apoio internacional.", efeito: { "r.ONU": 8, "e.primario": -0.02 }, gravidade: -10, ignorado: "Sozinho, isso vai sair caro." },
        ],
      },
      {
        titulo: "Cidades no limite",
        texto: "As cidades da fronteira não aguentam mais. Moradores reclamam de filas nos postos de saúde e há tensão nas ruas.",
        noticias: ["Postos de saúde lotados", "Moradores protestam na fronteira", "Prefeitos pedem dinheiro", "Vídeos de brigas viralizam"],
        conselhos: [
          { quem: "helena", fala: "Leve as famílias para outros estados, com emprego garantido. A fronteira precisa respirar.", plano: "Interiorização com vagas de emprego.", efeito: { "e.primario": -0.04, "e.desemprego": -0.05 }, gravidade: -16, ignorado: "Tudo amontoado num lugar só vai explodir." },
          { quem: "tico", fala: "O povo daqui está irritado. Fale duro e prometa controle.", plano: "Discurso duro e promessa de controle.", efeito: { aprovacao: 1, "r.ONU": -4 }, gravidade: 6, ignorado: "O eleitor da fronteira também vota." },
          { quem: "zeca", fala: "Mande dinheiro extra para as prefeituras. Prefeito feliz acalma a cidade.", plano: "Verba extra para as cidades da fronteira.", efeito: { "e.primario": -0.05, congresso: 2 }, gravidade: -10, ignorado: "Prefeito sem dinheiro vira inimigo." },
        ],
      },
      {
        titulo: "O mundo está olhando",
        texto: "A guerra no vizinho chegou a uma trégua. Brasil pode ajudar a negociar a paz ou se manter longe.",
        noticias: ["Trégua frágil no país vizinho", "Líderes pedem mediação brasileira", "Mercosul se reúne às pressas"],
        conselhos: [
          { quem: "helena", fala: "Ofereça o Brasil como mediador da paz. Se der certo, é histórico.", plano: "Liderar a mediação de paz.", efeito: { "r.ONU": 8, "r.Mercosul": 6, aprovacao: 2 }, gravidade: -18, ignorado: "Quando o mundo chama, o Brasil não pode faltar." },
          { quem: "coronel", fala: "Não se meta em guerra dos outros. Proteja a fronteira e pronto.", plano: "Ficar neutro e reforçar a fronteira.", efeito: { "p.fronteiras": 3 }, gravidade: -4, ignorado: "Quem se mete em briga alheia apanha junto." },
          { quem: "nair", fala: "Ofereça ajuda para a reconstrução com empresas brasileiras. Paz também gera negócio.", plano: "Plano de reconstrução com empresas brasileiras.", efeito: { "e.exportacoes": 4, "r.Mercosul": 4 }, gravidade: -10, ignorado: "Outros países vão ocupar esse espaço." },
        ],
      },
    ],
    desfechos: {
      contida: { "r.ONU": 10, aprovacao: 3 },
      arrastada: { aprovacao: -1, "e.primario": -0.05 },
      desastre: { aprovacao: -5, "r.ONU": -10, pressao: 10 },
    },
    textos: {
      contida: "O Brasil virou exemplo de acolhida e ajudou a construir a paz. O mundo inteiro notou.",
      arrastada: "As famílias foram atendidas, mas a conta e a tensão ficaram por anos.",
      desastre: "Abrigos colapsaram e a imagem do país ruiu lá fora.",
    },
  },
];

export function desfechoDaCrise(gravidade: number): "contida" | "arrastada" | "desastre" {
  if (gravidade < 35) return "contida";
  if (gravidade < 65) return "arrastada";
  return "desastre";
}

export const NOME_DESFECHO = { contida: "Crise contida", arrastada: "Crise arrastada", desastre: "Desastre" };
