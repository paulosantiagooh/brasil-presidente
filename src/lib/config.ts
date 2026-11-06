"use client";

import { useSyncExternalStore } from "react";
import { criarLoja } from "./loja";

export type Dificuldade = "facil" | "media" | "dificil";

export type Config = {
  dificuldade: Dificuldade;
  texto: "normal" | "grande";
  movimento: "normal" | "reduzido";
  som: "ligado" | "desligado";
};

export const CONFIG_PADRAO: Config = {
  dificuldade: "media",
  texto: "normal",
  movimento: "normal",
  som: "ligado",
};

export const NOME_DIFICULDADE: Record<Dificuldade, string> = {
  facil: "Fácil",
  media: "Média",
  dificil: "Difícil",
};

const loja = criarLoja<Config>("bp:config", CONFIG_PADRAO, (bruto) => ({
  ...CONFIG_PADRAO,
  ...(typeof bruto === "object" && bruto !== null ? bruto : {}),
}));

export function useConfig() {
  return useSyncExternalStore(loja.assinar, loja.ler, () => loja.vazio);
}

export function lerConfig() {
  return loja.ler();
}

export function mudarConfig(mudanca: Partial<Config>) {
  const nova = { ...loja.ler(), ...mudanca };
  loja.gravar(nova);
  document.documentElement.dataset.texto = nova.texto;
  document.documentElement.dataset.movimento = nova.movimento;
}
