import type { Ambiente } from "./sons";

export type TipoCena =
  | "gabinete"
  | "protesto"
  | "fogo"
  | "aprovado"
  | "rejeitado"
  | "imprensa"
  | "queda"
  | "alta"
  | "carestia"
  | "posse"
  | "urna"
  | "tribunal"
  | "obra"
  | "enchente"
  | "seca"
  | "apagao"
  | "estrada"
  | "policia"
  | "aviao"
  | "porto"
  | "petroleo"
  | "impeachment"
  | "hospital"
  | "fogos"
  | "derrota"
  | "assinatura"
  | "comicio"
  | "debate"
  | "redes"
  | "vazamento"
  | "barragem"
  | "fronteira";

// Cada cena dura 5 segundos e é desenhada pelo jogo: só silhuetas anônimas, sem imagem de ninguém.
export const CENAS: Record<TipoCena, { legenda: string; som: Ambiente | null }> = {
  gabinete: { legenda: "O telefone não para no gabinete", som: "telefone" },
  protesto: { legenda: "Multidão ocupa as ruas", som: "multidao" },
  fogo: { legenda: "Barricadas em chamas nas capitais", som: "multidao" },
  aprovado: { legenda: "O plenário aprova", som: "batidas" },
  rejeitado: { legenda: "O plenário rejeita", som: "batidas" },
  imprensa: { legenda: "Imprensa cerca o governo", som: "flashes" },
  queda: { legenda: "O mercado desaba", som: "batidas" },
  alta: { legenda: "O mercado comemora", som: "aplausos" },
  carestia: { legenda: "Os preços não param de subir", som: "bip" },
  posse: { legenda: "Começa um novo governo", som: "aplausos" },
  urna: { legenda: "O Brasil vota", som: "bip" },
  tribunal: { legenda: "A decisão sai em Brasília", som: "batidas" },
  obra: { legenda: "Máquinas em ação", som: "obra" },
  enchente: { legenda: "A água invade as cidades", som: "chuva" },
  seca: { legenda: "A terra racha sob o sol", som: "vento" },
  apagao: { legenda: "As luzes começam a apagar", som: "vento" },
  estrada: { legenda: "Estradas bloqueadas", som: "motor" },
  policia: { legenda: "Operação em andamento", som: "sirene" },
  aviao: { legenda: "A comitiva chega", som: "motor" },
  porto: { legenda: "O comércio exterior em jogo", som: "motor" },
  petroleo: { legenda: "O petróleo pega fogo", som: "vento" },
  impeachment: { legenda: "A Câmara decide o futuro do governo", som: "batidas" },
  hospital: { legenda: "Hospitais em alerta", som: "sirene" },
  fogos: { legenda: "Festa na Esplanada", som: "fogos" },
  derrota: { legenda: "Noite longa no Palácio", som: "chuva" },
  assinatura: { legenda: "A caneta do presidente decide", som: "batidas" },
  comicio: { legenda: "Palanque lotado", som: "multidao" },
  debate: { legenda: "Câmeras ligadas: é ao vivo", som: "flashes" },
  redes: { legenda: "Viralizou nas redes", som: "bip" },
  vazamento: { legenda: "A gravação vazou", som: "batidas" },
  barragem: { legenda: "A barragem cedeu", som: "chuva" },
  fronteira: { legenda: "Alerta na fronteira", som: "batidas" },
};

const POR_ID: Record<string, TipoCena> = {
  // Eventos do mandato
  "crise-global": "queda",
  "inflacao-alimentos": "carestia",
  recessao: "queda",
  "greve-transporte": "estrada",
  "greve-servidores": "protesto",
  enchentes: "enchente",
  seca: "seca",
  energia: "apagao",
  contrato: "imprensa",
  vetos: "gabinete",
  tarifas: "porto",
  conflito: "petroleo",
  protestos: "protesto",
  // Histórias do gabinete
  "audio-pericia": "tribunal",
  "audio-cpi": "imprensa",
  "real-ministros": "gabinete",
  "barragem-2": "imprensa",
  "cida-1": "redes",
  "cida-2": "obra",
  "cida-ruas": "protesto",
  "cida-gas": "carestia",
  "tico-pesquisa": "gabinete",
  "nair-caixa": "alta",
  "nair-gasolina": "petroleo",
  "coronel-ameaca": "policia",
  "vazamento-prova": "vazamento",
  "ruas-fogo": "fogo",
  "c-gafe": "imprensa",
};

// O começo do nome diz de que história a carta faz parte.
const POR_ARCO: Record<string, TipoCena> = {
  audio: "vazamento",
  real: "queda",
  virus: "hospital",
  barragem: "barragem",
  tico: "redes",
  coronel: "fronteira",
  c: "comicio",
};

const POR_PALAVRA: [RegExp, TipoCena][] = [
  [/áudio|gravação/i, "vazamento"],
  [/rompeu|barragem/i, "barragem"],
  [/hospital|vírus|saúde/i, "hospital"],
  [/inflação|preço|carrinho/i, "carestia"],
  [/dólar|desemprego/i, "queda"],
  [/economia acelera/i, "alta"],
  [/popularidade/i, "comicio"],
  [/derrete/i, "imprensa"],
  [/ruas|protesto/i, "protesto"],
  [/congresso|mesa/i, "aprovado"],
];

export function cenaDoAcontecimento(id: string, titulo = ""): TipoCena {
  const porPalavra = POR_PALAVRA.find(([palavra]) => palavra.test(titulo));
  return POR_ID[id] ?? POR_ARCO[id.split("-")[0]] ?? porPalavra?.[1] ?? "gabinete";
}
