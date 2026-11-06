export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export type Estado = {
  uf: string;
  nome: string;
  regiao: Regiao;
  eleitorado: number;
};

// Eleitorado em % do total nacional: valores aproximados, usados como peso na simulação.
export const ESTADOS: Estado[] = [
  { uf: "AC", nome: "Acre", regiao: "Norte", eleitorado: 0.4 },
  { uf: "AL", nome: "Alagoas", regiao: "Nordeste", eleitorado: 1.5 },
  { uf: "AM", nome: "Amazonas", regiao: "Norte", eleitorado: 1.7 },
  { uf: "AP", nome: "Amapá", regiao: "Norte", eleitorado: 0.4 },
  { uf: "BA", nome: "Bahia", regiao: "Nordeste", eleitorado: 7.2 },
  { uf: "CE", nome: "Ceará", regiao: "Nordeste", eleitorado: 4.4 },
  { uf: "DF", nome: "Distrito Federal", regiao: "Centro-Oeste", eleitorado: 1.4 },
  { uf: "ES", nome: "Espírito Santo", regiao: "Sudeste", eleitorado: 1.9 },
  { uf: "GO", nome: "Goiás", regiao: "Centro-Oeste", eleitorado: 3.2 },
  { uf: "MA", nome: "Maranhão", regiao: "Nordeste", eleitorado: 3.3 },
  { uf: "MG", nome: "Minas Gerais", regiao: "Sudeste", eleitorado: 10.3 },
  { uf: "MS", nome: "Mato Grosso do Sul", regiao: "Centro-Oeste", eleitorado: 1.3 },
  { uf: "MT", nome: "Mato Grosso", regiao: "Centro-Oeste", eleitorado: 1.6 },
  { uf: "PA", nome: "Pará", regiao: "Norte", eleitorado: 4.0 },
  { uf: "PB", nome: "Paraíba", regiao: "Nordeste", eleitorado: 2.0 },
  { uf: "PE", nome: "Pernambuco", regiao: "Nordeste", eleitorado: 4.5 },
  { uf: "PI", nome: "Piauí", regiao: "Nordeste", eleitorado: 1.6 },
  { uf: "PR", nome: "Paraná", regiao: "Sul", eleitorado: 5.5 },
  { uf: "RJ", nome: "Rio de Janeiro", regiao: "Sudeste", eleitorado: 8.2 },
  { uf: "RN", nome: "Rio Grande do Norte", regiao: "Nordeste", eleitorado: 1.7 },
  { uf: "RO", nome: "Rondônia", regiao: "Norte", eleitorado: 0.8 },
  { uf: "RR", nome: "Roraima", regiao: "Norte", eleitorado: 0.25 },
  { uf: "RS", nome: "Rio Grande do Sul", regiao: "Sul", eleitorado: 5.5 },
  { uf: "SC", nome: "Santa Catarina", regiao: "Sul", eleitorado: 3.7 },
  { uf: "SE", nome: "Sergipe", regiao: "Nordeste", eleitorado: 1.1 },
  { uf: "SP", nome: "São Paulo", regiao: "Sudeste", eleitorado: 22.0 },
  { uf: "TO", nome: "Tocantins", regiao: "Norte", eleitorado: 0.7 },
];

export const REGIOES: Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

// Inclinação média de cada região na simulação: estimativa do jogo.
export const PERFIL_REGIAO: Record<Regiao, { economia: number; costumes: number }> = {
  Norte: { economia: 42, costumes: 62 },
  Nordeste: { economia: 35, costumes: 52 },
  "Centro-Oeste": { economia: 62, costumes: 70 },
  Sudeste: { economia: 55, costumes: 52 },
  Sul: { economia: 62, costumes: 62 },
};

export function estadoDe(uf: string) {
  return ESTADOS.find((e) => e.uf === uf) as Estado;
}
