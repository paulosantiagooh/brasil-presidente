// Converte a malha de estados do IBGE (GeoJSON) em caminhos SVG do mapa eleitoral.
// Fonte: https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo%2Bjson&qualidade=minima&intrarregiao=UF
// Uso: node scripts/gerar-mapa-ufs.mjs caminho/do/arquivo.json
import { readFileSync, writeFileSync } from "node:fs";

const UF_POR_CODIGO = {
  11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO", 21: "MA", 22: "PI",
  23: "CE", 24: "RN", 25: "PB", 26: "PE", 27: "AL", 28: "SE", 29: "BA", 31: "MG", 32: "ES",
  33: "RJ", 35: "SP", 41: "PR", 42: "SC", 43: "RS", 50: "MS", 51: "MT", 52: "GO", 53: "DF",
};

const projetar = ([longitude, latitude]) => [
  Math.round((longitude + 74.5) * 0.966 * 20 * 10) / 10,
  Math.round((5.8 - latitude) * 20 * 10) / 10,
];

function anelParaCaminho(anel) {
  const pontos = [];
  for (const coordenada of anel) {
    const ponto = projetar(coordenada);
    const anterior = pontos.at(-1);
    if (!anterior || anterior[0] !== ponto[0] || anterior[1] !== ponto[1]) pontos.push(ponto);
  }
  return `M${pontos.map((p) => p.join(" ")).join("L")}Z`;
}

const malha = JSON.parse(readFileSync(process.argv[2], "utf8"));
const caminhos = {};
for (const estado of malha.features) {
  const { type, coordinates } = estado.geometry;
  const poligonos = type === "Polygon" ? [coordinates] : coordinates;
  caminhos[UF_POR_CODIGO[estado.properties.codarea]] = poligonos
    .flatMap((poligono) => poligono.map(anelParaCaminho))
    .join("");
}

const linhas = Object.keys(caminhos)
  .sort()
  .map((uf) => `  ${uf}: "${caminhos[uf]}",`);

writeFileSync(
  "src/lib/mapa-ufs.ts",
  `// Gerado por scripts/gerar-mapa-ufs.mjs a partir da malha oficial do IBGE. Não edite à mão.\nexport const CAMINHOS_UF: Record<string, string> = {\n${linhas.join("\n")}\n};\n`,
);
console.log(`${linhas.length} estados gerados`);
