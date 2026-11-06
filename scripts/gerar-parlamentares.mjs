// Gera a lista de parlamentares em exercício a partir dos dados abertos da Câmara e do Senado.
// Fontes:
//   https://dadosabertos.camara.leg.br/api/v2/deputados?itens=1000&ordem=ASC&ordenarPor=nome
//   https://legis.senado.leg.br/dadosabertos/senador/lista/atual.json
// Uso: node scripts/gerar-parlamentares.mjs deputados.json senadores.json
import { readFileSync, writeFileSync } from "node:fs";

const SIGLAS = {
  REPUBLICANOS: "Republicanos",
  CIDADANIA: "Cidadania",
  SOLIDARIEDADE: "Solidariedade",
  AVANTE: "Avante",
  "S/Partido": "Sem partido",
};
const sigla = (valor) => SIGLAS[valor] ?? valor;

const deputados = JSON.parse(readFileSync(process.argv[2], "utf8")).dados.map((d) => [
  `d${d.id}`, d.nome, sigla(d.siglaPartido), d.siglaUf, "deputado",
]);

const senadores = JSON.parse(readFileSync(process.argv[3], "utf8"))
  .ListaParlamentarEmExercicio.Parlamentares.Parlamentar.map(({ IdentificacaoParlamentar: s }) => [
    `s${s.CodigoParlamentar}`, s.NomeParlamentar, sigla(s.SiglaPartidoParlamentar), s.UfParlamentar, "senado",
  ]);

const linhas = [...senadores, ...deputados].map((p) => `  ${JSON.stringify(p)},`);

writeFileSync(
  "src/lib/parlamentares.ts",
  `// Gerado por scripts/gerar-parlamentares.mjs a partir dos dados abertos do Congresso. Não edite à mão.\nexport const DATA_PARLAMENTARES = "novembro de 2026";\n\nexport const PARLAMENTARES: [string, string, string, string, "deputado" | "senado"][] = [\n${linhas.join("\n")}\n];\n`,
);
console.log(`${senadores.length} senadores e ${deputados.length} deputados gerados`);
