"use client";

import { useEffect } from "react";
import { mudarConfig, useConfig } from "@/lib/config";
import { atualizarMusica, pedirTrilha, type NomeTrilha } from "@/lib/musica";

export function Trilha({ nome }: { nome: NomeTrilha }) {
  useEffect(() => {
    pedirTrilha(nome);
  }, [nome]);
  return null;
}

export function BotaoMusica() {
  const { musica } = useConfig();
  const ligada = musica !== "desligada";
  return (
    <button
      type="button"
      className="botao botao-musica"
      aria-pressed={ligada}
      onClick={() => {
        mudarConfig({ musica: ligada ? "desligada" : "ligada" });
        atualizarMusica();
      }}
    >
      {ligada ? "♪ Música" : "♪ Sem música"}
    </button>
  );
}
