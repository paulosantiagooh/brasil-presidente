import type { Efeito } from "./mandato-dados";

// Modelo de acordo internacional: serve para qualquer parceiro ou organização.
export type TipoAcordo = "comercial" | "investimento" | "cooperacao";

export type ModeloAcordo = {
  nome: string;
  resumo: string;
  // Chance base de fechar; a relação com o parceiro soma ou tira.
  chance: number;
  imediato: Efeito;
  // Efeito que chega aos poucos: metade no meio do prazo, metade no fim.
  gradual: Efeito;
  meses: number;
  relacao: number;
  feminino?: boolean;
};

export const ACORDOS: Record<TipoAcordo, ModeloAcordo> = {
  comercial: {
    nome: "Acordo comercial",
    resumo: "Menos tarifas e mais exportações em alguns meses.",
    chance: 0.5,
    imediato: {},
    gradual: { "e.exportacoes": 8, "e.pib": 0.1 },
    meses: 6,
    relacao: 8,
  },
  investimento: {
    nome: "Acordo de investimentos",
    resumo: "Empresas do parceiro investem no Brasil. Leva tempo.",
    chance: 0.45,
    imediato: { "e.confianca": 1 },
    gradual: { "e.investimento": 0.4 },
    meses: 8,
    relacao: 6,
  },
  cooperacao: {
    nome: "Cooperação técnica e científica",
    resumo: "Mais fácil de fechar, com ganhos menores em saúde, ciência e ambiente.",
    chance: 0.75,
    imediato: { "s.educacao": 0.5 },
    gradual: { "s.saude": 0.5, "s.ambiente": 1 },
    meses: 6,
    relacao: 5,
    feminino: true,
  },
};

export const ORGANIZACOES = ["BRICS", "Mercosul", "ONU", "G20", "OMC"];

export function chanceDoAcordo(modelo: ModeloAcordo, relacao: number) {
  return Math.min(0.9, Math.max(0.1, modelo.chance + (relacao - 60) / 120));
}
