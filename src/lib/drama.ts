import type { Efeito } from "./mandato-dados";

// Todos os personagens e histórias deste arquivo são fictícios. Nunca use pessoas reais aqui.
export type Personagem = { id: string; nome: string; papel: string; cor: string };

export const PERSONAGENS: Record<string, Personagem> = {
  helena: { id: "helena", nome: "Helena Vargas", papel: "Chefe de gabinete", cor: "#0fa896" },
  tico: { id: "tico", nome: "Tico Barbosa", papel: "Marqueteiro", cor: "#cf7d23" },
  nair: { id: "nair", nome: "Dra. Nair Prado", papel: "Conselheira econômica", cor: "#6f8cf5" },
  coronel: { id: "coronel", nome: "Coronel Dantas", papel: "Segurança institucional", cor: "#8b9629" },
  cida: { id: "cida", nome: "Dona Cida", papel: "Conselho popular", cor: "#d94f8e" },
  zeca: { id: "zeca", nome: "Deputado Zeca Bandeira", papel: "Articulador do Congresso", cor: "#b07a4f" },
};

export type OpcaoCarta = {
  texto: string;
  resposta: string;
  efeito: Efeito;
  define?: string[];
  depois?: { id: string; meses: number };
};

export type Carta = {
  id: string;
  quem: string;
  titulo: string;
  texto: string;
  urgente?: number;
  capitulo?: string;
  requer?: string[];
  bloqueia?: string[];
  somenteAgendada?: boolean;
  // Histórias de corrupção ou chantagem não aparecem quando o jogador é uma pessoa real.
  sensivel?: boolean;
  opcoes: OpcaoCarta[];
  semResposta?: Omit<OpcaoCarta, "texto">;
};

export const CARTAS: Carta[] = [
  // O áudio
  {
    id: "audio-1", sensivel: true, quem: "coronel", capitulo: "O áudio · Capítulo 1", titulo: "Vazou um áudio", urgente: 25,
    texto: "Presidente, um áudio do Tico caiu nas redes. Ele promete contratos de publicidade a um empresário. Em 25 segundos isso estará em todos os celulares do país.",
    bloqueia: ["tico-fora"],
    opcoes: [
      { texto: "Demitir o Tico agora.", resposta: "Tico saiu chorando do Palácio. Disse que sabe muita coisa.", efeito: { "s.confianca": 3, aprovacao: 1 }, define: ["tico-fora"], depois: { id: "audio-vinganca", meses: 3 } },
      { texto: "Dizer que o áudio foi editado.", resposta: "A perícia independente vai sair em breve. Reze.", efeito: { aprovacao: -1, pressao: 6 }, depois: { id: "audio-pericia", meses: 2 } },
      { texto: "Mandar apurar e não comentar.", resposta: "O silêncio foi lido como culpa, mas ganhou tempo.", efeito: { aprovacao: -2 }, depois: { id: "audio-cpi", meses: 2 } },
    ],
    semResposta: { resposta: "Você congelou. A oposição falou primeiro, e o áudio virou meme nacional.", efeito: { aprovacao: -4, pressao: 10 } },
  },
  {
    id: "audio-vinganca", quem: "helena", capitulo: "O áudio · Capítulo 2", titulo: "O livro do Tico", somenteAgendada: true,
    texto: "O Tico anunciou um livro sobre os bastidores da campanha. A editora pede um encontro. Ele quer dinheiro para não publicar.",
    opcoes: [
      { texto: "Pagar por baixo dos panos.", resposta: "Ele sumiu. Por enquanto. Ninguém pode saber disso.", efeito: { "e.primario": -0.03 }, define: ["pagou-tico"], depois: { id: "audio-chantagem", meses: 6 } },
      { texto: "Deixar publicar e enfrentar.", resposta: "O livro saiu, doeu por uma semana e foi esquecido. Você dormiu em paz.", efeito: { aprovacao: -2, "s.confianca": 2 } },
    ],
  },
  {
    id: "audio-chantagem", quem: "helena", capitulo: "O áudio · Capítulo 3", titulo: "Ele voltou", somenteAgendada: true, urgente: 20,
    texto: "O Tico quer o dobro. E gravou a nossa primeira conversa. Se isso sair, é o fim do governo.",
    opcoes: [
      { texto: "Contar tudo à nação antes dele.", resposta: "Você foi à TV e assumiu o erro. Metade do país respeitou, a outra pediu a sua cabeça.", efeito: { aprovacao: -5, "s.confianca": 4, pressao: 10 } },
      { texto: "Pagar de novo.", resposta: "Agora você é refém. E ele sabe disso.", efeito: { "e.primario": -0.05, pressao: 12, congresso: -3 } },
    ],
    semResposta: { resposta: "A gravação saiu antes de você decidir. O Planalto parou.", efeito: { aprovacao: -9, pressao: 20, congresso: -6 } },
  },
  {
    id: "audio-pericia", quem: "coronel", capitulo: "O áudio · Capítulo 2", titulo: "A perícia saiu", somenteAgendada: true,
    texto: "A perícia confirmou: o áudio é verdadeiro. E você disse em rede nacional que era falso.",
    opcoes: [
      { texto: "Pedir desculpas ao país.", resposta: "Foi duro, mas a poeira baixou mais rápido do que o esperado.", efeito: { aprovacao: -3, "s.confianca": 2 }, define: ["tico-fora"] },
      { texto: "Atacar a perícia.", resposta: "A base inflamou. O resto do país se afastou de vez.", efeito: { aprovacao: -5, pressao: 12, "s.confianca": -4 }, depois: { id: "audio-cpi", meses: 2 } },
    ],
  },
  {
    id: "audio-cpi", quem: "zeca", capitulo: "O áudio · Capítulo final", titulo: "A CPI bateu à porta", somenteAgendada: true,
    texto: "Presidente, a oposição tem as assinaturas para a CPI. Eu seguro isso, mas meu grupo quer dois ministérios. É pegar ou largar.",
    opcoes: [
      { texto: "Entregar os ministérios.", resposta: "A CPI morreu na gaveta. O Zeca sorriu. Você não.", efeito: { congresso: 4, "s.confianca": -3, aprovacao: -1 } },
      { texto: "Deixar a CPI acontecer.", resposta: "Meses de manchetes ruins, mas o governo saiu limpo.", efeito: { aprovacao: -3, congresso: -3, "s.confianca": 4, pressao: 8 } },
    ],
  },

  // Ataque ao real
  {
    id: "real-1", quem: "nair", capitulo: "Ataque ao real · Capítulo 1", titulo: "O dólar está disparando", urgente: 20,
    texto: "O mercado abriu em pânico. O dólar subiu 4% em uma hora. Fundos estrangeiros estão saindo. O que eu digo à imprensa?",
    opcoes: [
      { texto: "Anunciar corte de gastos imediato.", resposta: "O dólar parou de subir. Os ministros querem o seu pescoço.", efeito: { "e.confianca": 6, "e.dolar": -0.15, aprovacao: -3 }, depois: { id: "real-ministros", meses: 2 } },
      { texto: "Acusar os especuladores.", resposta: "A militância aplaudiu. O dólar subiu mais 3%.", efeito: { "e.dolar": 0.3, aprovacao: 2, "e.confianca": -5 }, depois: { id: "real-2", meses: 1 } },
      { texto: "Confiar no Banco Central.", resposta: "Eles usaram reservas e o pânico diminuiu.", efeito: { "e.reservas": -18, "e.confianca": 2 } },
    ],
    semResposta: { resposta: "Silêncio do governo. O mercado entendeu que não havia comando.", efeito: { "e.dolar": 0.4, "e.confianca": -7, aprovacao: -3 } },
  },
  {
    id: "real-2", quem: "nair", capitulo: "Ataque ao real · Capítulo 2", titulo: "Corrida aos bancos?", somenteAgendada: true, urgente: 20,
    texto: "Há filas em caixas eletrônicos. Boato de confisco nas redes. Se isso virar pânico, perdemos o controle.",
    opcoes: [
      { texto: "Falar à nação ao vivo, agora.", resposta: "Você olhou para a câmera e garantiu cada centavo. As filas sumiram.", efeito: { aprovacao: 4, "e.confianca": 5, pressao: -8 } },
      { texto: "Mandar a Polícia Federal atrás dos boatos.", resposta: "As prisões viraram manchete. O medo continuou.", efeito: { aprovacao: -2, pressao: 8 } },
    ],
    semResposta: { resposta: "As filas dobraram de tamanho. O fim de semana foi de terror.", efeito: { aprovacao: -6, "e.confianca": -8, pressao: 15 } },
  },
  {
    id: "real-ministros", quem: "helena", capitulo: "Ataque ao real · Capítulo 2", titulo: "Rebelião na Esplanada", somenteAgendada: true,
    texto: "Três ministérios ameaçam vazar críticas ao corte. Eles querem uma exceção. Se você ceder a um, todos virão.",
    opcoes: [
      { texto: "Bater na mesa e manter o corte.", resposta: "Silêncio na reunião. Ninguém mais discutiu. Respeito ou medo?", efeito: { "e.confianca": 3, congresso: -3 } },
      { texto: "Liberar uma exceção.", resposta: "Paz na Esplanada. O mercado anotou.", efeito: { "e.confianca": -3, congresso: 2 } },
    ],
  },

  // Vírus novo
  {
    id: "virus-1", quem: "helena", capitulo: "Emergência sanitária · Capítulo 1", titulo: "Casos estranhos em Manaus", urgente: 25,
    texto: "Hospitais relatam um vírus respiratório desconhecido. Os técnicos pedem barreira nos aeroportos hoje. O turismo e o comércio vão gritar.",
    opcoes: [
      { texto: "Fechar as barreiras agora.", resposta: "Foi impopular e caro. Os técnicos disseram que você ganhou semanas preciosas.", efeito: { "e.pib": -0.2, aprovacao: -2 }, define: ["virus-agiu"], depois: { id: "virus-2", meses: 2 } },
      { texto: "Esperar mais dados.", resposta: "A economia agradeceu. Por enquanto.", efeito: { aprovacao: 1 }, define: ["virus-esperou"], depois: { id: "virus-2", meses: 2 } },
    ],
    semResposta: { resposta: "O voo das 18h já pousou em São Paulo com passageiros infectados.", efeito: { "s.saude": -3 }, define: ["virus-esperou"], depois: { id: "virus-2", meses: 2 } },
  },
  {
    id: "virus-2", quem: "cida", capitulo: "Emergência sanitária · Capítulo 2", titulo: "O hospital da minha rua lotou", somenteAgendada: true,
    texto: "Presidente, é a Cida. O hospital aqui tem gente no chão. Minha vizinha morreu sem respirador. Vocês estão vendo isso aí em Brasília?",
    opcoes: [
      { texto: "Decretar emergência nacional e abrir o cofre.", resposta: "Hospitais de campanha em 10 dias. A Cida chorou no telefone. Dessa vez, de alívio.", efeito: { "s.saude": 5, "e.primario": -0.5, aprovacao: 5, pressao: -6 } },
      { texto: "Pedir calma e manter a economia aberta.", resposta: "Os números de mortes passaram a abrir o jornal todas as noites.", efeito: { "s.saude": -6, aprovacao: -7, pressao: 15 }, define: ["cida-brava"] },
      { texto: "Entregar a condução aos governadores.", resposta: "Cada estado fez uma coisa. O país virou uma colcha de retalhos.", efeito: { "s.saude": -2, aprovacao: -2, congresso: 1 } },
    ],
  },

  // Zeca Bandeira
  {
    id: "zeca-1", sensivel: true, quem: "zeca", capitulo: "O preço do apoio · Capítulo 1", titulo: "Um cafezinho, presidente", bloqueia: ["zeca-rompeu"],
    texto: "Olha, eu tenho 80 votos no bolso. Ninguém vota de graça nesse país. Quero o comando de uma estatal para um afilhado. Coisa pequena.",
    opcoes: [
      { texto: "Fechar negócio.", resposta: "O Zeca piscou. 'Vai longe, presidente', ele disse.", efeito: { congresso: 6, "s.confianca": -2 }, define: ["zeca-amigo"], depois: { id: "zeca-2", meses: 4 } },
      { texto: "Recusar e mostrar a porta.", resposta: "Ele saiu rindo. 'Vamos ver na próxima votação.'", efeito: { congresso: -6, "s.confianca": 2 }, define: ["zeca-rompeu"], depois: { id: "zeca-troco", meses: 3 } },
    ],
  },
  {
    id: "zeca-2", quem: "coronel", capitulo: "O preço do apoio · Capítulo 2", titulo: "O afilhado do Zeca", somenteAgendada: true,
    texto: "O afilhado do Zeca assinou um contrato suspeito na estatal. A Polícia Federal está chegando perto. E o Zeca liga de cinco em cinco minutos.",
    opcoes: [
      { texto: "Demitir o afilhado na hora.", resposta: "O Zeca não atende mais o seu telefone. A imprensa elogiou.", efeito: { "s.confianca": 3, congresso: -5 }, define: ["zeca-rompeu"], depois: { id: "zeca-troco", meses: 3 } },
      { texto: "Segurar até passar a tempestade.", resposta: "A operação saiu em todas as capas com o carimbo do seu governo.", efeito: { aprovacao: -5, "s.confianca": -5, congresso: 3, pressao: 8 } },
    ],
  },
  {
    id: "zeca-troco", quem: "helena", capitulo: "O preço do apoio · Capítulo final", titulo: "O troco", somenteAgendada: true, urgente: 20,
    texto: "O Zeca virou a bancada. Em 20 minutos, a Câmara vota um projeto que estoura o Orçamento. Se passar, a conta é nossa.",
    opcoes: [
      { texto: "Ligar para ele e ceder.", resposta: "Ele atendeu no primeiro toque. Quase dava para ouvir o sorriso.", efeito: { congresso: 4, "s.confianca": -2, aprovacao: -1 } },
      { texto: "Deixar passar e vetar depois.", resposta: "Você vetou. O Congresso derrubou o veto. Guerra aberta.", efeito: { congresso: -6, "e.primario": -0.2, aprovacao: 2 } },
    ],
    semResposta: { resposta: "O projeto passou enquanto você hesitava. Rombo bilionário.", efeito: { "e.primario": -0.4, congresso: -4, "e.confianca": -5 } },
  },

  // Barragem
  {
    id: "barragem-1", quem: "coronel", capitulo: "A barragem · Capítulo 1", titulo: "Rompeu", urgente: 20,
    texto: "Uma barragem de mineração rompeu em Minas. A lama desce para uma cidade de 40 mil pessoas. Temos minutos para ordenar a evacuação federal.",
    opcoes: [
      { texto: "Acionar Exército e Defesa Civil já.", resposta: "Helicópteros tiraram milhares de pessoas a tempo. Um país inteiro respirou.", efeito: { aprovacao: 6, pressao: -6, "e.primario": -0.1 }, depois: { id: "barragem-2", meses: 2 } },
      { texto: "Esperar o laudo da empresa.", resposta: "O laudo chegou depois da lama. Você nunca vai esquecer aquelas imagens.", efeito: { aprovacao: -8, pressao: 15, "s.confianca": -4 }, depois: { id: "barragem-2", meses: 2 } },
    ],
    semResposta: { resposta: "Ninguém deu a ordem. A cidade soube pelo barulho.", efeito: { aprovacao: -10, pressao: 20, "s.confianca": -5 }, depois: { id: "barragem-2", meses: 2 } },
  },
  {
    id: "barragem-2", quem: "nair", capitulo: "A barragem · Capítulo final", titulo: "Quem paga?", somenteAgendada: true,
    texto: "A mineradora é uma gigante exportadora. Multa pesada assusta investidores. Multa leve revolta o país.",
    opcoes: [
      { texto: "Multa máxima e prisão dos responsáveis.", resposta: "O país aplaudiu de pé. Os investidores ligaram para os advogados.", efeito: { aprovacao: 5, "e.confianca": -4, "s.ambiente": 3 } },
      { texto: "Acordo de reparação negociado.", resposta: "As famílias receberam mais rápido. Os protestos diminuíram devagar.", efeito: { aprovacao: 1, "e.confianca": 2 } },
    ],
  },

  // Dona Cida
  {
    id: "cida-1", quem: "cida", capitulo: "A promessa · Capítulo 1", titulo: "Lembra de mim?", bloqueia: ["cida-brava"],
    texto: "Na campanha, você comeu na minha cozinha e prometeu escola na comunidade. Já faz tempo. As crianças ainda estudam em galpão.",
    opcoes: [
      { texto: "Mandar construir a escola agora.", resposta: "Ela mandou um bolo para o Planalto. Com bilhete: 'Eu sabia'.", efeito: { "s.educacao": 1, aprovacao: 2 }, define: ["cida-amiga"], depois: { id: "cida-2", meses: 6 } },
      { texto: "Prometer para o ano que vem.", resposta: "Ela desligou sem se despedir.", efeito: { aprovacao: -1 }, define: ["cida-brava"], depois: { id: "cida-ruas", meses: 5 } },
    ],
  },
  {
    id: "cida-2", quem: "cida", capitulo: "A promessa · Capítulo final", titulo: "Inauguração", somenteAgendada: true,
    texto: "A escola ficou pronta! Vai ter festa. Tem até faixa. Você vem, né? Aviso que é longe, e a sua agenda anda cheia.",
    opcoes: [
      { texto: "Largar tudo e ir.", resposta: "A foto de você dançando com a Cida rodou o Brasil.", efeito: { aprovacao: 5, pressao: -8 } },
      { texto: "Mandar um vídeo.", resposta: "Ela agradeceu. Educada. Fria.", efeito: { aprovacao: -1 } },
    ],
  },
  {
    id: "cida-ruas", quem: "tico", capitulo: "A promessa · Capítulo final", titulo: "Viralizou", somenteAgendada: true,
    texto: "Lembra da Dona Cida? Ela gravou um vídeo com as crianças no galpão: 'Cadê a escola, presidente?'. 40 milhões de views. Tem até música.",
    opcoes: [
      { texto: "Ir pessoalmente pedir desculpas.", resposta: "Ela olhou nos seus olhos e disse: 'Agora eu quero ver'.", efeito: { aprovacao: 2, "s.educacao": 1 } },
      { texto: "Ignorar: isso passa.", resposta: "Não passou. Virou bordão de manifestação.", efeito: { aprovacao: -5, pressao: 12 } },
    ],
  },

  // Dilemas soltos
  {
    id: "tico-dancinha", quem: "tico", titulo: "A dancinha", bloqueia: ["tico-fora"],
    texto: "Presidente, confia em mim: uma dancinha nas redes. 15 segundos. Os jovens vão amar. Ou vão zoar. Mas vão falar.",
    opcoes: [
      { texto: "Topar a dancinha.", resposta: "120 milhões de views. Você virou figurinha de WhatsApp.", efeito: { aprovacao: 2, "s.confianca": -1 } },
      { texto: "Isso aqui é a Presidência, Tico.", resposta: "'Por isso que perdem os jovens', ele resmungou.", efeito: { "s.confianca": 1 } },
    ],
  },
  {
    id: "tico-pesquisa", quem: "tico", titulo: "A pesquisa secreta", bloqueia: ["tico-fora"],
    texto: "Tenho uma pesquisa interna: o povo quer sangue. Sugiro demitir um ministro em público. Qualquer um. Dá manchete.",
    opcoes: [
      { texto: "Fazer a demissão pública.", resposta: "Deu manchete. E criou um inimigo no Congresso.", efeito: { aprovacao: 3, congresso: -3 } },
      { texto: "Não sacrifico ninguém por pesquisa.", resposta: "A equipe soube e ficou mais leal.", efeito: { congresso: 1, "s.confianca": 1 } },
    ],
  },
  {
    id: "nair-caixa", quem: "nair", titulo: "Sobrou no caixa",
    texto: "Boa notícia rara: a arrecadação veio acima do previsto. Tenho uma folga. Mas ela só dá para uma coisa.",
    opcoes: [
      { texto: "Abater a dívida.", resposta: "Agências de risco elogiaram. Ninguém na rua percebeu.", efeito: { "e.divida": -0.6, "e.confianca": 3 } },
      { texto: "Ampliar programas sociais.", resposta: "Muita gente foi dormir mais tranquila naquele mês.", efeito: { "e.pobreza": -0.8, aprovacao: 3 } },
      { texto: "Investir em obras.", resposta: "Canteiros reabertos e prefeitos felizes.", efeito: { "e.investimento": 0.4, aprovacao: 1 } },
    ],
  },
  {
    id: "nair-gasolina", quem: "nair", titulo: "A gasolina vai subir",
    texto: "O barril disparou. Se segurarmos o preço, a conta aparece depois. Se soltarmos, aparece no posto amanhã de manhã.",
    opcoes: [
      { texto: "Soltar o preço.", resposta: "Filas e xingamentos nos postos. O mercado respirou.", efeito: { aprovacao: -3, "e.confianca": 3, "e.ipca": 0.2 } },
      { texto: "Segurar o preço.", resposta: "Alívio na bomba. Rombo na conta.", efeito: { aprovacao: 2, "e.primario": -0.15, "e.confianca": -3 } },
    ],
  },
  {
    id: "coronel-fronteira", quem: "coronel", titulo: "Movimentação na fronteira", urgente: 20,
    texto: "Facções armadas cruzaram a fronteira e atacaram um posto da PF. Temos a localização. A operação é arriscada, e o relógio está correndo.",
    opcoes: [
      { texto: "Autorizar a operação.", resposta: "Operação concluída sem baixas. Você assistiu tudo em silêncio, no escuro.", efeito: { "p.crime": -4, aprovacao: 3, "p.fronteiras": 3 } },
      { texto: "Esperar a inteligência confirmar.", resposta: "Eles sumiram na mata. O coronel não disse nada. Nem precisava.", efeito: { "p.crime": 2, aprovacao: -1 } },
    ],
    semResposta: { resposta: "A janela fechou. Dois agentes ficaram feridos na retirada.", efeito: { aprovacao: -3, "p.crime": 3 } },
  },
  {
    id: "coronel-ameaca", quem: "coronel", titulo: "Ameaça na agenda",
    texto: "Recebemos uma ameaça para o seu evento de amanhã no interior. Pode ser trote. Recomendo cancelar. A população está esperando há meses.",
    opcoes: [
      { texto: "Ir mesmo assim.", resposta: "Nada aconteceu. A multidão gritou o seu nome. O coronel suou frio.", efeito: { aprovacao: 3, pressao: -4 } },
      { texto: "Cancelar.", resposta: "Prudente. A cidade ficou decepcionada.", efeito: { aprovacao: -1 } },
    ],
  },
  {
    id: "helena-fiel", quem: "helena", titulo: "Noite no gabinete",
    texto: "São duas da manhã, presidente. Só nós aqui. Posso falar francamente? Você está cercado de gente que só diz sim. Quando foi a última vez que alguém discordou de você?",
    opcoes: [
      { texto: "Peça para ela dizer o que ninguém diz.", resposta: "Ela falou por uma hora. Doeu. Foi a reunião mais útil do ano.", efeito: { "s.confianca": 2, congresso: 1 } },
      { texto: "Agradecer e encerrar a conversa.", resposta: "Ela fechou a pasta. 'Boa noite, presidente.' E nunca mais tocou no assunto.", efeito: { "e.confianca": -1 } },
    ],
  },
  {
    id: "helena-vice", quem: "helena", titulo: "O almoço misterioso",
    texto: "Me contaram de um jantar de líderes partidários discutindo 'o dia seguinte'. Falaram do seu governo no passado. Isso nunca é bom.",
    opcoes: [
      { texto: "Chamar todos para um churrasco no Alvorada.", resposta: "Muita picanha, muito abraço. Ninguém confiou em ninguém, mas todos sorriram.", efeito: { congresso: 4, "e.primario": -0.02 } },
      { texto: "Vazar que você sabe de tudo.", resposta: "Os telefones pararam de tocar. Medo funciona. Por um tempo.", efeito: { congresso: -2, pressao: 3 } },
    ],
  },
  {
    id: "cida-gas", quem: "cida", titulo: "O gás acabou",
    texto: "Presidente, aqui no bairro tem gente cozinhando com álcool e se queimando porque o botijão ficou caro. Você já comprou um botijão?",
    opcoes: [
      { texto: "Criar um vale-gás.", resposta: "Os fogões voltaram a acender. A Nair fez uma careta.", efeito: { aprovacao: 3, "e.pobreza": -0.4, "e.primario": -0.08 } },
      { texto: "Explicar a política de preços.", resposta: "Ela ouviu tudo. 'Você fala bonito', disse, e desligou.", efeito: { aprovacao: -2 } },
    ],
  },
  {
    id: "zeca-emenda", quem: "zeca", titulo: "Só uma emendinha",
    texto: "Tem uma ponte na minha base. Ponte que não liga nada a lugar nenhum, confesso. Mas é ano bom pra ponte. Libera?",
    opcoes: [
      { texto: "Liberar a ponte.", resposta: "O Zeca mandou uma foto da faixa com o seu nome. A ponte continua sem ligar nada.", efeito: { congresso: 3, "e.primario": -0.03, "s.confianca": -1 } },
      { texto: "Ponte para lugar nenhum, não.", resposta: "'Você é duro na queda', ele disse. E anotou numa cadernetinha.", efeito: { congresso: -2, "s.confianca": 1 } },
    ],
  },
  {
    id: "vazamento-prova", quem: "tico", titulo: "Hackearam a gente", urgente: 20, bloqueia: ["tico-fora"],
    texto: "Vazaram mensagens internas do governo! Tem piada com governador, tem crítica a aliado, tem de tudo. Tá subindo nos assuntos do momento agora.",
    opcoes: [
      { texto: "Rir de si mesmo nas redes.", resposta: "Você postou um meme sobre o próprio vazamento. Virou o presidente mais comentado do ano.", efeito: { aprovacao: 3, congresso: -1 } },
      { texto: "Pedir desculpas aos citados.", resposta: "Telefonemas constrangedores por dois dias inteiros.", efeito: { congresso: 2, aprovacao: -1 } },
    ],
    semResposta: { resposta: "O governo ficou mudo por horas, e o vazamento virou escândalo.", efeito: { aprovacao: -3, congresso: -3 } },
  },
];

export const CARTA_RUAS: Carta = {
  id: "ruas-fogo", quem: "coronel", titulo: "O país está em chamas", urgente: 20, capitulo: "Crise nas ruas",
  texto: "Um milhão de pessoas nas ruas. Marcharam até a Esplanada. Ministros pedem Força Nacional. Outros pedem que você fale. Eles estão na frente do Palácio agora.",
  opcoes: [
    { texto: "Sair e falar com a multidão.", resposta: "Você desceu a rampa sem escolta. O silêncio durou um segundo, e o país inteiro parou para ver.", efeito: { aprovacao: 6, pressao: -30 } },
    { texto: "Convocar a Força Nacional.", resposta: "A Esplanada foi esvaziada. As imagens rodaram o mundo.", efeito: { aprovacao: -6, pressao: -20, "s.confianca": -4 } },
    { texto: "Anunciar um pacote de medidas.", resposta: "A multidão voltou para casa. A conta chega depois.", efeito: { "e.primario": -0.3, pressao: -25, aprovacao: 2 } },
  ],
  semResposta: { resposta: "O governo sumiu no pior momento. Vidraças quebradas, o país assustado.", efeito: { aprovacao: -8, pressao: -10, congresso: -5 } },
};

export type CartaCampanha = {
  id: string;
  sensivel?: boolean;
  quem: string;
  titulo: string;
  texto: string;
  opcoes: { texto: string; resposta: string; efeito: Record<string, number> }[];
};

export const CARTAS_CAMPANHA: CartaCampanha[] = [
  {
    id: "c-sujo", sensivel: true, quem: "tico", titulo: "Jogar sujo?",
    texto: "Consegui um dossiê sem pé nem cabeça sobre a campanha rival. É fofoca. Mas fofoca ganha eleição. Solto nas redes?",
    opcoes: [
      { texto: "Soltar.", resposta: "Bombou por dois dias. Depois descobriram de onde veio.", efeito: { popularidade: 3, credibilidade: -5, imprensa: -3 } },
      { texto: "Jogar no lixo.", resposta: "'Vai perder com muita dignidade', disse o Tico.", efeito: { credibilidade: 3, imprensa: 1 } },
    ],
  },
  {
    id: "c-doador", sensivel: true, quem: "helena", titulo: "O doador generoso",
    texto: "Um empresário oferece uma fortuna para a campanha. Dentro da lei. Mas ele vai querer conversar depois da posse.",
    opcoes: [
      { texto: "Aceitar.", resposta: "Mais programas de TV, mais carro de som. E uma dívida invisível.", efeito: { popularidade: 3, credibilidade: -2, congresso: 1 } },
      { texto: "Recusar.", resposta: "A campanha apertou o cinto. Sua consciência, não.", efeito: { credibilidade: 3, popularidade: -1 } },
    ],
  },
  {
    id: "c-feira", quem: "cida", titulo: "Vem comer aqui em casa",
    texto: "Ouvi você no rádio. Falar é fácil. Vem almoçar aqui na comunidade, sem câmera. Quero ver se você vem.",
    opcoes: [
      { texto: "Ir sem câmeras.", resposta: "Ninguém filmou. Mas a comunidade inteira contou para todo mundo.", efeito: { popularidade: 2, confianca: 3 } },
      { texto: "Ir com a equipe de TV.", resposta: "Ficou lindo no programa. Dona Cida fez cara feia.", efeito: { popularidade: 3, confianca: -1 } },
    ],
  },
  {
    id: "c-gafe", quem: "tico", titulo: "Deu ruim ao vivo",
    texto: "Você errou o nome da cidade no comício e já viralizou. Tem meme, tem música. A gente desmente, ri junto ou finge que não viu?",
    opcoes: [
      { texto: "Rir junto.", resposta: "Você gravou um vídeo errando de propósito. A internet te perdoou.", efeito: { popularidade: 3, imprensa: 1 } },
      { texto: "Pedir desculpas à cidade.", resposta: "Foi educado, mas o meme durou mais uma semana.", efeito: { confianca: 2, popularidade: -1 } },
      { texto: "Fingir que não viu.", resposta: "O meme ganhou uma segunda temporada.", efeito: { popularidade: -2 } },
    ],
  },
  {
    id: "c-pesquisa", quem: "nair", titulo: "A promessa impossível",
    texto: "Seu plano promete o que a conta não fecha. Um jornalista descobriu e vai publicar amanhã. Corrigimos antes ou dobramos a aposta?",
    opcoes: [
      { texto: "Corrigir o plano.", resposta: "Os eleitores viram honestidade. Os adversários viram fraqueza.", efeito: { credibilidade: 4, popularidade: -1 } },
      { texto: "Dobrar a aposta.", resposta: "A militância vibrou. Os economistas riram.", efeito: { popularidade: 3, credibilidade: -4 } },
    ],
  },
  {
    id: "c-aliado", quem: "zeca", titulo: "Palanque duplo",
    texto: "Tenho uns prefeitos que sobem no seu palanque. Em troca, você esquece umas coisas que disse sobre emendas. Fechado?",
    opcoes: [
      { texto: "Fechado.", resposta: "Vinte palanques novos em uma semana.", efeito: { popularidade: 2, congresso: 4, coerencia: -4 } },
      { texto: "Não vendo o meu discurso.", resposta: "'Candidato bonito não ganha eleição', ele disse.", efeito: { coerencia: 3, congresso: -2 } },
    ],
  },
];

export type Meta = { id: string; texto: string; prazo: number; premio: string };

// Cada missão tem um prazo em meses desde que entrou em vigor.
export const METAS_BASE: { id: string; texto: string; meses: number; premio: string }[] = [
  { id: "inflacao", texto: "Levar a inflação para menos de 4%", meses: 18, premio: "Aprovação +4" },
  { id: "desemprego", texto: "Baixar o desemprego para menos de 5,5%", meses: 20, premio: "Aprovação +4" },
  { id: "pib", texto: "Fazer o PIB crescer acima de 2,5%", meses: 18, premio: "Aprovação +4" },
  { id: "selic", texto: "Ver a Selic cair abaixo de 11%", meses: 18, premio: "Confiança +5" },
  { id: "aprovacao", texto: "Chegar a 60% de aprovação", meses: 15, premio: "Congresso +5" },
  { id: "obras", texto: "Entregar 2 obras", meses: 30, premio: "Aprovação +3" },
  { id: "leis", texto: "Aprovar 3 projetos no Congresso", meses: 14, premio: "Congresso +5" },
  { id: "pobreza", texto: "Reduzir a pobreza para menos de 21%", meses: 24, premio: "Aprovação +4" },
  { id: "diplomacia", texto: "Levar uma relação internacional a 85", meses: 14, premio: "Exportações +8" },
  { id: "saude", texto: "Levar a saúde a 60 pontos", meses: 24, premio: "Aprovação +3" },
];

export const CONQUISTAS: { id: string; nome: string; texto: string }[] = [
  { id: "primeira-lei", nome: "Primeira vitória", texto: "Aprovou o primeiro projeto no Congresso." },
  { id: "emenda", nome: "Mudou a Constituição", texto: "Aprovou uma emenda à Constituição." },
  { id: "sangue-frio", nome: "Sangue frio", texto: "Decidiu 5 crises urgentes a tempo." },
  { id: "tres-metas", nome: "Entrega o que promete", texto: "Cumpriu 3 missões." },
  { id: "acima-de-60", nome: "Nos braços do povo", texto: "Chegou a 60% de aprovação." },
  { id: "abaixo-de-25", nome: "Fundo do poço", texto: "Caiu abaixo de 25% de aprovação." },
  { id: "sobreviveu", nome: "Sobrevivente", texto: "Sobreviveu a um pedido de impeachment." },
  { id: "pedreiro", nome: "Tocador de obras", texto: "Entregou 5 obras." },
  { id: "diplomata", nome: "Chanceler do mundo", texto: "Passou de 85 em 3 relações internacionais." },
  { id: "historias", nome: "Fim de novela", texto: "Viveu 4 finais de história." },
];

export const COMENTARIOS = {
  bom: [
    "Finalmente alguém com coragem nesse país", "Votei e votaria de novo", "Meu pai chorou vendo isso",
    "Por essa eu não esperava, parabéns", "Tá melhorando, vai", "Agora sim, presidente!",
    "Isso que é governar", "Compartilhem antes que apaguem", "Foi o melhor mês desse governo",
  ],
  ruim: [
    "Arrependimento define", "Cadê as promessas?", "Tá difícil defender esse governo",
    "Minha avó governava melhor", "Isso não vai acabar bem", "O mercado tá rindo da nossa cara",
    "Queria ver morar no meu bairro", "Vergonha", "Já estou contando os dias para a eleição",
  ],
  neutro: [
    "Vamos ver no que dá", "Alguém explica o que isso muda na minha vida?", "Tô só de olho",
    "Meu grupo da família tá pegando fogo", "Isso aqui é melhor que novela", "Sinceramente? Sei lá",
  ],
};

export const USUARIOS = ["@tia_do_zap", "@brasil_real", "@motoboy_sp", "@prof_ana", "@seu_jorge_oficial", "@zona_leste", "@agro_forte", "@estudante_ufba"];

export const JORNAL = "Diário da Capital";

export const TITULOS_LEGADO: { minimo: number; nota: string; titulo: string }[] = [
  { minimo: 85, nota: "S", titulo: "Estadista lendário" },
  { minimo: 72, nota: "A", titulo: "Grande presidente" },
  { minimo: 60, nota: "B", titulo: "Bom governo" },
  { minimo: 48, nota: "C", titulo: "Governo mediano" },
  { minimo: 35, nota: "D", titulo: "Governo esquecível" },
  { minimo: 0, nota: "F", titulo: "Um desastre para os livros de história" },
];
