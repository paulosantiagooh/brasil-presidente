"use client";

import { useState } from "react";
import {
  mudarConfig,
  NOME_DIFICULDADE,
  useConfig,
  type Config,
  type Dificuldade,
} from "@/lib/config";
import { apagarTodasAsPartidas, usePartidas } from "@/lib/partidas";

type Opcao<T extends string> = { valor: T; rotulo: string };

function Escolha<T extends string>(props: {
  nome: string;
  titulo: string;
  ajuda: string;
  valor: T;
  opcoes: Opcao<T>[];
  aoMudar: (valor: T) => void;
}) {
  return (
    <fieldset className="ajuste">
      <legend>{props.titulo}</legend>
      <p>{props.ajuda}</p>
      <div className="escolha">
        {props.opcoes.map((opcao) => (
          <label key={opcao.valor}>
            <input
              type="radio"
              name={props.nome}
              checked={props.valor === opcao.valor}
              onChange={() => props.aoMudar(opcao.valor)}
            />
            <span>{opcao.rotulo}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const DIFICULDADES = (Object.keys(NOME_DIFICULDADE) as Dificuldade[]).map((valor) => ({
  valor,
  rotulo: NOME_DIFICULDADE[valor],
}));

const TEXTOS: Opcao<Config["texto"]>[] = [
  { valor: "normal", rotulo: "Normal" },
  { valor: "grande", rotulo: "Grande" },
];

const MOVIMENTOS: Opcao<Config["movimento"]>[] = [
  { valor: "normal", rotulo: "Ligadas" },
  { valor: "reduzido", rotulo: "Reduzidas" },
];

export function PainelConfiguracoes() {
  const config = useConfig();
  const partidas = usePartidas();
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className="ajustes">
      <Escolha
        nome="dificuldade"
        titulo="Dificuldade"
        ajuda="Vale para as próximas partidas."
        valor={config.dificuldade}
        opcoes={DIFICULDADES}
        aoMudar={(dificuldade) => mudarConfig({ dificuldade })}
      />
      <Escolha
        nome="texto"
        titulo="Tamanho do texto"
        ajuda="Aumenta as letras em todas as telas."
        valor={config.texto}
        opcoes={TEXTOS}
        aoMudar={(texto) => mudarConfig({ texto })}
      />
      <Escolha
        nome="movimento"
        titulo="Animações"
        ajuda="Reduza se o movimento incomodar ou o aparelho ficar lento."
        valor={config.movimento}
        opcoes={MOVIMENTOS}
        aoMudar={(movimento) => mudarConfig({ movimento })}
      />

      <section className="ajuste ajuste-perigo">
        <h3>Partidas salvas neste aparelho</h3>
        {partidas.length === 0 ? (
          <p>Nenhuma partida salva.</p>
        ) : confirmando ? (
          <>
            <p>
              {partidas.length === 1
                ? "A partida salva será apagada."
                : `As ${partidas.length} partidas salvas serão apagadas.`}{" "}
              Isso não pode ser desfeito.
            </p>
            <div className="acoes">
              <button
                type="button"
                className="botao botao-perigo"
                onClick={() => {
                  apagarTodasAsPartidas();
                  setConfirmando(false);
                }}
              >
                Apagar tudo
              </button>
              <button type="button" className="botao" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              {partidas.length === 1
                ? "1 partida salva."
                : `${partidas.length} partidas salvas.`}
            </p>
            <button type="button" className="botao" onClick={() => setConfirmando(true)}>
              Apagar partidas
            </button>
          </>
        )}
      </section>
    </div>
  );
}
