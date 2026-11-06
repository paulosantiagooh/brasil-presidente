import { PARLAMENTARES } from "./parlamentares";

export type TipoPessoa = "governo" | "senado" | "deputado" | "politico" | "tecnico";

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
const DESTAQUES: Pessoa[] = [
  { id: "lula", nome: "Lula", sigla: "PT", uf: "SP", cargo: "Presidente da República.", tipo: "politico" },
  { id: "jair-bolsonaro", nome: "Jair Bolsonaro", sigla: "PL", uf: "RJ", cargo: "Ex-presidente da República. Inelegível na vida real: aparece só neste cenário hipotético.", tipo: "politico" },
  { id: "alckmin", nome: "Geraldo Alckmin", sigla: "PSB", uf: "SP", cargo: "Vice-presidente da República.", tipo: "politico" },
  { id: "tarcisio", nome: "Tarcísio de Freitas", sigla: "Republicanos", uf: "SP", cargo: eleito("de São Paulo"), tipo: "governo" },
  { id: "flavio", nome: "Flávio Bolsonaro", sigla: "PL", uf: "RJ", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "michelle", nome: "Michelle Bolsonaro", sigla: "PL", uf: "DF", cargo: "Eleita em 2026 para o Senado pelo Distrito Federal.", tipo: "senado" },
  { id: "haddad", nome: "Fernando Haddad", sigla: "PT", uf: "SP", cargo: "Filiado ao PT.", tipo: "politico" },
  { id: "camilo", nome: "Camilo Santana", sigla: "PT", uf: "CE", cargo: "Filiado ao PT.", tipo: "politico" },
  { id: "boulos", nome: "Guilherme Boulos", sigla: "PSOL", uf: "SP", cargo: "Filiado ao PSOL.", tipo: "politico" },
  { id: "tabata", nome: "Tabata Amaral", sigla: "PSB", uf: "SP", cargo: "Filiada ao PSB.", tipo: "politico" },
  { id: "caiado", nome: "Ronaldo Caiado", sigla: "PSD", uf: "GO", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "zema", nome: "Romeu Zema", sigla: "NOVO", uf: "MG", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "renan", nome: "Renan Santos", sigla: "MISSÃO", uf: "SP", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "cury", nome: "Augusto Cury", sigla: "Avante", uf: "SP", cargo: "Disputou a Presidência em 2026.", tipo: "politico" },
  { id: "paes", nome: "Eduardo Paes", sigla: "PSD", uf: "RJ", cargo: "Disputou o governo do Rio de Janeiro em 2026.", tipo: "politico" },
  { id: "dorinha", nome: "Professora Dorinha", sigla: "UNIÃO", uf: "TO", cargo: "Disputou o governo do Tocantins em 2026.", tipo: "politico" },
  { id: "cleitinho", nome: "Cleitinho Azevedo", sigla: "Republicanos", uf: "MG", cargo: eleito("de Minas Gerais"), tipo: "governo" },
  { id: "pazolini", nome: "Lorenzo Pazolini", sigla: "Republicanos", uf: "ES", cargo: eleito("do Espírito Santo"), tipo: "governo" },
  { id: "pivetta", nome: "Otaviano Pivetta", sigla: "Republicanos", uf: "MT", cargo: eleito("de Mato Grosso"), tipo: "governo" },
  { id: "moro", nome: "Sérgio Moro", sigla: "PL", uf: "PR", cargo: eleito("do Paraná"), tipo: "governo" },
  { id: "zucco", nome: "Zucco", sigla: "PL", uf: "RS", cargo: eleito("do Rio Grande do Sul"), tipo: "governo" },
  { id: "jorginho", nome: "Jorginho Mello", sigla: "PL", uf: "SC", cargo: eleito("de Santa Catarina"), tipo: "governo" },
  { id: "marcos-rogerio", nome: "Marcos Rogério", sigla: "PL", uf: "RO", cargo: eleito("de Rondônia"), tipo: "governo" },
  { id: "arthur-henrique", nome: "Arthur Henrique", sigla: "PL", uf: "RR", cargo: eleito("de Roraima"), tipo: "governo" },
  { id: "douglas-ruas", nome: "Douglas Ruas", sigla: "PL", uf: "RJ", cargo: "Disputou o segundo turno no Rio de Janeiro em 2026.", tipo: "politico" },
  { id: "raquel", nome: "Raquel Lyra", sigla: "PSD", uf: "PE", cargo: eleita("de Pernambuco"), tipo: "governo" },
  { id: "braide", nome: "Eduardo Braide", sigla: "PSD", uf: "MA", cargo: eleito("do Maranhão"), tipo: "governo" },
  { id: "mitidieri", nome: "Fábio Mitidieri", sigla: "PSD", uf: "SE", cargo: eleito("de Sergipe"), tipo: "governo" },
  { id: "omar", nome: "Omar Aziz", sigla: "PSD", uf: "AM", cargo: eleito("do Amazonas"), tipo: "governo" },
  { id: "furlan", nome: "Dr. Furlan", sigla: "PSD", uf: "AP", cargo: eleito("do Amapá"), tipo: "governo" },
  { id: "riedel", nome: "Eduardo Riedel", sigla: "PP", uf: "MS", cargo: eleito("de Mato Grosso do Sul"), tipo: "governo" },
  { id: "lucas-ribeiro", nome: "Lucas Ribeiro", sigla: "PP", uf: "PB", cargo: eleito("da Paraíba"), tipo: "governo" },
  { id: "mailza", nome: "Mailza Assis", sigla: "PP", uf: "AC", cargo: eleita("do Acre"), tipo: "governo" },
  { id: "celina", nome: "Celina Leão", sigla: "PP", uf: "DF", cargo: eleita("do Distrito Federal"), tipo: "governo" },
  { id: "jeronimo", nome: "Jerônimo Rodrigues", sigla: "PT", uf: "BA", cargo: eleito("da Bahia"), tipo: "governo" },
  { id: "elmano", nome: "Elmano de Freitas", sigla: "PT", uf: "CE", cargo: eleito("do Ceará"), tipo: "governo" },
  { id: "fonteles", nome: "Rafael Fonteles", sigla: "PT", uf: "PI", cargo: eleito("do Piauí"), tipo: "governo" },
  { id: "cadu", nome: "Cadu de Lula", sigla: "PT", uf: "RN", cargo: eleito("do Rio Grande do Norte"), tipo: "governo" },
  { id: "vilela", nome: "Daniel Vilela", sigla: "MDB", uf: "GO", cargo: eleito("de Goiás"), tipo: "governo" },
  { id: "daniel-santos", nome: "Dr. Daniel Santos", sigla: "PODE", uf: "PA", cargo: eleito("do Pará"), tipo: "governo" },
  { id: "jhc", nome: "JHC", sigla: "PSDB", uf: "AL", cargo: eleito("de Alagoas"), tipo: "governo" },
  { id: "vicentinho", nome: "Vicentinho Júnior", sigla: "PSDB", uf: "TO", cargo: "Disputou o segundo turno no Tocantins em 2026.", tipo: "politico" },
  { id: "lira", nome: "Arthur Lira", sigla: "PP", uf: "AL", cargo: "Eleito em 2026 para o Senado por Alagoas.", tipo: "senado" },
  { id: "bia-kicis", nome: "Bia Kicis", sigla: "PL", uf: "DF", cargo: "Eleita em 2026 para o Senado pelo Distrito Federal.", tipo: "senado" },
];

export function semAcento(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const nomesDestaque = new Set(DESTAQUES.map((p) => semAcento(p.nome)));

const CARGO_PARLAMENTAR = {
  deputado: "Mandato na Câmara dos Deputados, legislatura 2023-2027.",
  senado: "Mandato no Senado Federal, em exercício em novembro de 2026.",
};

export const POLITICOS: Pessoa[] = [
  ...DESTAQUES,
  ...PARLAMENTARES.filter(([, nome]) => !nomesDestaque.has(semAcento(nome))).map(
    ([id, nome, sigla, uf, tipo]): Pessoa => ({ id, nome, sigla, uf, cargo: CARGO_PARLAMENTAR[tipo], tipo }),
  ),
];

const PORID = new Map(POLITICOS.map((p) => [p.id, p]));

export function politicoPorId(id: string | null | undefined) {
  return id ? (PORID.get(id) ?? null) : null;
}
