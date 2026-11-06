"use client";

import { useState } from "react";
import type { Campanha } from "@/lib/campanha";
import type { Candidato } from "@/lib/candidato";
import type { Eleicao } from "@/lib/eleicao";
import { errosDoPassoGoverno, PASSOS_GOVERNO, type Governo } from "@/lib/governo";
import { atualizarGoverno, comecarMandato, type Partida } from "@/lib/partidas";
import { PassoCongresso } from "./PassoCongresso";
import { PassoMinisterios } from "./PassoMinisterios";
import { PassoBalanco, PassoDecisoes, PassoOrcamento, PassoVotacao } from "./PassosFinais";

const TITULOS = [
  "Monte o ministério",
  "Conheça o Congresso",
  "Defina o orçamento",
  "Primeiras decisões",
  "A primeira votação",
  "Governo formado",
];

type Props = {
  partida: Partida;
  governo: Governo;
  campanha: Campanha;
  eleicao: Eleicao;
  candidato: Candidato;
};

export function TelaGoverno({ partida, governo, campanha, eleicao, candidato }: Props) {
  const [erros, setErros] = useState<string[]>([]);
  const ultimo = PASSOS_GOVERNO.length - 1;
  const passo = Math.min(governo.passo, ultimo);
  const nomesFora = eleicao.finalistas
    .filter((i) => i !== 0)
    .map((i) => campanha.rivais[i - 1].nome);

  function atualizar(mudar: (g: Governo) => Governo) {
    atualizarGoverno(partida.id, mudar);
    setErros([]);
  }

  function irPara(novo: number) {
    atualizar((g) => ({ ...g, passo: novo }));
    window.scrollTo({ top: 0 });
  }

  function avancar() {
    const encontrados = errosDoPassoGoverno(governo, passo);
    setErros(encontrados);
    if (encontrados.length === 0) irPara(passo + 1);
  }

  const votacaoFeita = governo.votacao !== null;

  return (
    <section className="campanha" aria-labelledby="titulo-governo">
      <p className="sobretitulo">
        Passo {passo + 1} de {PASSOS_GOVERNO.length} · {PASSOS_GOVERNO[passo]} · Simulação
      </p>
      <h1 id="titulo-governo" className="titulo-tela">
        {TITULOS[passo]}
      </h1>
      <div
        className="progresso"
        role="progressbar"
        aria-label="Progresso da formação do governo"
        aria-valuemin={1}
        aria-valuemax={PASSOS_GOVERNO.length}
        aria-valuenow={passo + 1}
      >
        {PASSOS_GOVERNO.map((nome, indice) => (
          <span key={nome} className={indice <= passo ? "feito" : undefined} />
        ))}
      </div>

      {passo === 0 && (
        <PassoMinisterios
          governo={governo}
          candidato={candidato}
          nomesFora={nomesFora}
          atualizar={atualizar}
        />
      )}
      {passo === 1 && <PassoCongresso governo={governo} candidato={candidato} />}
      {passo === 2 && <PassoOrcamento governo={governo} atualizar={atualizar} />}
      {passo === 3 && <PassoDecisoes governo={governo} atualizar={atualizar} />}
      {passo === 4 && (
        <PassoVotacao governo={governo} candidato={candidato} atualizar={atualizar} />
      )}
      {passo === 5 && <PassoBalanco governo={governo} candidato={candidato} eleicao={eleicao} />}

      {erros.length > 0 && (
        <ul className="erros" role="alert">
          {erros.map((erro) => (
            <li key={erro}>{erro}</li>
          ))}
        </ul>
      )}

      <footer className="rodape-passo">
        {passo > 0 && passo <= 4 && !votacaoFeita ? (
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
              comecarMandato(partida.id);
              window.scrollTo({ top: 0 });
            }}
          >
            Começar o mandato
          </button>
        )}
      </footer>
    </section>
  );
}
