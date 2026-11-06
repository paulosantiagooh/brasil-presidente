"use client";

import { useState } from "react";
import { errosDoPasso, PASSOS, type Candidato } from "@/lib/candidato";
import {
  atualizarCandidato,
  candidatoDaPartida,
  confirmarCandidatura,
  type Partida,
} from "@/lib/partidas";
import { FichaCandidato } from "./FichaCandidato";
import {
  PassoIdentidade,
  PassoIdeologia,
  PassoPartido,
  PassoTrajetoria,
  PassoVice,
} from "./Passos";

const TITULOS = [
  "Quem é você",
  "Por qual partido",
  "No que você acredita",
  "De onde você vem",
  "Quem divide a chapa",
  "Confirme a candidatura",
];

export function CriacaoCandidato({ partida }: { partida: Partida }) {
  const c = candidatoDaPartida(partida);
  const [erros, setErros] = useState<string[]>([]);
  const ultimo = PASSOS.length - 1;
  const passo = Math.min(c.passo, ultimo);

  function mudar(mudanca: Partial<Candidato>) {
    atualizarCandidato(partida.id, mudanca);
    setErros([]);
  }

  function irPara(novo: number) {
    mudar({ passo: novo });
    window.scrollTo({ top: 0 });
  }

  function avancar() {
    const encontrados = errosDoPasso(c, passo);
    setErros(encontrados);
    if (encontrados.length === 0) irPara(passo + 1);
  }

  const props = { c, mudar };

  return (
    <section aria-labelledby="titulo-passo">
      <p className="sobretitulo">
        Passo {passo + 1} de {PASSOS.length} · {PASSOS[passo]}
      </p>
      <h1 id="titulo-passo" className="titulo-tela">
        {TITULOS[passo]}
      </h1>
      <div
        className="progresso"
        role="progressbar"
        aria-label="Progresso da criação do candidato"
        aria-valuemin={1}
        aria-valuemax={PASSOS.length}
        aria-valuenow={passo + 1}
      >
        {PASSOS.map((nome, indice) => (
          <span key={nome} className={indice <= passo ? "feito" : undefined} />
        ))}
      </div>

      {passo === 0 && <PassoIdentidade {...props} />}
      {passo === 1 && <PassoPartido {...props} />}
      {passo === 2 && <PassoIdeologia {...props} />}
      {passo === 3 && <PassoTrajetoria {...props} />}
      {passo === 4 && <PassoVice {...props} />}
      {passo === 5 && <FichaCandidato c={c} />}

      {erros.length > 0 && (
        <ul className="erros" role="alert">
          {erros.map((erro) => (
            <li key={erro}>{erro}</li>
          ))}
        </ul>
      )}

      <footer className="rodape-passo">
        {passo > 0 ? (
          <button type="button" className="botao" onClick={() => irPara(passo - 1)}>
            Voltar
          </button>
        ) : (
          <span />
        )}
        {passo < ultimo ? (
          <button type="button" className="botao botao-destaque" onClick={avancar}>
            Avançar
          </button>
        ) : (
          <button
            type="button"
            className="botao botao-destaque"
            onClick={() => {
              confirmarCandidatura(partida.id);
              window.scrollTo({ top: 0 });
            }}
          >
            Confirmar candidatura
          </button>
        )}
      </footer>
    </section>
  );
}
