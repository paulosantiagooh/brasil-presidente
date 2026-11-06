"use client";

import { useState } from "react";
import { NOME_DIFICULDADE } from "@/lib/config";
import { apagarPartida, formatarData, usePartidas } from "@/lib/partidas";

type Props = {
  aoCarregar: (id: string) => void;
};

export function PainelPartidas({ aoCarregar }: Props) {
  const partidas = usePartidas();
  const [apagando, setApagando] = useState<string | null>(null);

  if (partidas.length === 0) {
    return (
      <div className="vazio">
        <p className="vazio-titulo">Nenhuma partida salva</p>
        <p>Comece um novo jogo. Ele é salvo automaticamente neste aparelho.</p>
      </div>
    );
  }

  return (
    <ul className="partidas">
      {partidas.map((partida) => (
        <li key={partida.id} className="partida">
          <div className="partida-dados">
            <p className="partida-nome">{partida.nome}</p>
            <p className="dado">
              Eleição {partida.cenario} · {NOME_DIFICULDADE[partida.dificuldade]}
            </p>
            <p className="dado">Salva em {formatarData(partida.atualizadaEm)}</p>
          </div>
          {apagando === partida.id ? (
            <div className="acoes">
              <button
                type="button"
                className="botao botao-perigo"
                onClick={() => {
                  apagarPartida(partida.id);
                  setApagando(null);
                }}
              >
                Confirmar
              </button>
              <button type="button" className="botao" onClick={() => setApagando(null)}>
                Manter
              </button>
            </div>
          ) : (
            <div className="acoes">
              <button
                type="button"
                className="botao botao-destaque"
                onClick={() => aoCarregar(partida.id)}
              >
                Carregar
              </button>
              <button type="button" className="botao" onClick={() => setApagando(partida.id)}>
                Apagar
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
