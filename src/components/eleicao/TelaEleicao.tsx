"use client";

import Link from "next/link";
import { useState } from "react";
import { executarAcao, type Campanha } from "@/lib/campanha";
import type { Candidato } from "@/lib/candidato";
import {
  apoiosRestantes,
  comecarSegundoTurno,
  concluirApuracao,
  eliminados,
  jogadorNaDisputa,
  pedirApoio,
  percentualValido,
  totalDoTurno,
  votarSegundoTurno,
  type Eleicao,
} from "@/lib/eleicao";
import { atualizarCampanha, atualizarEleicao, concluirReeleicao, formarGoverno, type Partida } from "@/lib/partidas";
import { TelaDebate } from "../campanha/Debate";
import { disputantes } from "../campanha/PainelCampanha";
import { Apuracao } from "./Apuracao";
import { ResultadoTurno } from "./ResultadoTurno";

const AVISO =
  "Resultado inventado pelo jogo, em uma história alternativa. Não reproduz nem prevê resultados reais.";

const percentual = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Props = {
  partida: Partida;
  eleicao: Eleicao;
  campanha: Campanha;
  candidato: Candidato;
};

export function TelaEleicao({ partida, eleicao, campanha, candidato }: Props) {
  const nomes = disputantes(campanha, candidato);
  const atualizar = (mudar: (e: Eleicao) => Eleicao) => atualizarEleicao(partida.id, mudar);
  const [turnoVisto, setTurnoVisto] = useState<1 | 2>(2);
  const reeleicao = partida.ciclo === 2;
  const ano = reeleicao ? 2030 : 2026;

  if (campanha.debate) {
    return (
      <TelaDebate
        campanha={campanha}
        candidato={candidato}
        atualizar={(mudar) => atualizarCampanha(partida.id, mudar)}
      />
    );
  }

  if (eleicao.fase === "apuracao-1") {
    return (
      <Apuracao
        key="primeiro"
        turno={eleicao.primeiro}
        nomes={nomes}
        ano={ano}
        aoConcluir={() => atualizar(concluirApuracao)}
      />
    );
  }

  if (eleicao.fase === "apuracao-2" && eleicao.segundo) {
    return (
      <Apuracao
        key="segundo"
        turno={eleicao.segundo}
        nomes={nomes}
        ano={ano}
        aoConcluir={() => atualizar(concluirApuracao)}
      />
    );
  }

  if (eleicao.fase === "resultado-1") {
    const total = totalDoTurno(eleicao.primeiro);
    const [a, b] = eleicao.finalistas;
    const participa = jogadorNaDisputa(eleicao);
    return (
      <section className="campanha" aria-labelledby="titulo-resultado">
        <p className="sobretitulo">1º turno · Eleição {ano} · Simulação</p>
        <h1 id="titulo-resultado" className="titulo-tela">
          {participa ? "Você está no segundo turno" : "Você ficou fora do segundo turno"}
        </h1>
        <p className="texto-tela">
          Ninguém passou de 50% dos votos válidos. {nomes[a].nome} ({percentual.format(percentualValido(total, a))}
          %) e {nomes[b].nome} ({percentual.format(percentualValido(total, b))}%) avançam.
        </p>
        <ResultadoTurno turno={eleicao.primeiro} nomes={nomes} />
        <p className="ajuda aviso-simulacao">{AVISO}</p>
        <footer className="rodape-passo">
          <span />
          <button
            type="button"
            className="botao botao-destaque"
            onClick={() =>
              atualizar((e) =>
                participa ? comecarSegundoTurno(e) : votarSegundoTurno(e, campanha, candidato),
              )
            }
          >
            {participa ? "Preparar o segundo turno" : "Acompanhar o segundo turno"}
          </button>
        </footer>
      </section>
    );
  }

  if (eleicao.fase === "entre-turnos") {
    const adversario = nomes[eleicao.finalistas.find((i) => i !== 0) ?? 1];
    const pedidos = apoiosRestantes(eleicao);
    return (
      <section className="boletim" aria-labelledby="titulo-entre-turnos">
        <p className="sobretitulo">Entre os turnos · Simulação</p>
        <h1 id="titulo-entre-turnos" className="titulo-tela">
          Contra {adversario.nome}
        </h1>
        <p className="texto-tela">
          Você tem {pedidos} {pedidos === 1 ? "pedido" : "pedidos"} de apoio e um debate antes da
          votação. Quem está mais perto das suas posições tende a aceitar.
        </p>

        <h2 className="titulo-bloco espaco-topo">Buscar apoio</h2>
        <ul className="lista-acoes">
          {eliminados(eleicao).map((indice) => {
            const apoio = eleicao.apoios.find((a) => a.indice === indice);
            return (
              <li key={indice}>
                <button
                  type="button"
                  className="acao"
                  disabled={Boolean(apoio) || pedidos === 0}
                  onClick={() => atualizar((e) => pedirApoio(e, campanha, candidato, indice))}
                >
                  <span className="cartao-topo">
                    <strong>{nomes[indice].nome}</strong>
                    <span className="dado">{nomes[indice].sigla}</span>
                  </span>
                  <span className="ajuda">
                    {apoio
                      ? apoio.aceito
                        ? "Na simulação, aceitou apoiar você."
                        : "Na simulação, ficou neutro."
                      : "Pedir apoio no segundo turno."}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <h2 className="titulo-bloco espaco-topo">Último debate</h2>
        <button
          type="button"
          className="acao"
          disabled={eleicao.debateFeito}
          onClick={() => {
            atualizar((e) => ({ ...e, debateFeito: true }));
            atualizarCampanha(partida.id, (c) => executarAcao(c, candidato, { tipo: "debate" }));
          }}
        >
          <span className="cartao-topo">
            <strong>Debate na TV</strong>
            <span className="dado">3 perguntas</span>
          </span>
          <span className="ajuda">
            {eleicao.debateFeito ? "Debate feito." : "Faltar custa votos em todo o país."}
          </span>
        </button>

        <footer className="rodape-passo">
          <span />
          <button
            type="button"
            className="botao botao-destaque"
            onClick={() => atualizar((e) => votarSegundoTurno(e, campanha, candidato))}
          >
            Ir às urnas
          </button>
        </footer>
      </section>
    );
  }

  const venceu = eleicao.vencedor === 0;
  const vencedor = nomes[eleicao.vencedor ?? 0];
  const turno = eleicao.segundo && turnoVisto === 2 ? eleicao.segundo : eleicao.primeiro;
  const final = totalDoTurno(eleicao.segundo ?? eleicao.primeiro);

  return (
    <section className="campanha" aria-labelledby="titulo-final">
      <p className="sobretitulo">Resultado final · Eleição {ano} · Simulação</p>
      <h1 id="titulo-final" className="titulo-tela">
        {venceu ? "Você venceu a eleição" : `Vitória de ${vencedor.nome}`}
      </h1>
      <p className="texto-tela">
        {venceu
          ? `${vencedor.nome} recebeu ${percentual.format(percentualValido(final, 0))}% dos votos válidos. ${reeleicao ? "O segundo mandato vai até dezembro de 2034." : "Agora é hora de formar o governo."}`
          : `Nesta partida, a candidatura de ${nomes[0].nome} terminou com ${percentual.format(percentualValido(totalDoTurno(eleicao.primeiro), 0))}% dos votos válidos no primeiro turno.`}
      </p>

      {eleicao.segundo && (
        <nav className="abas" aria-label="Turnos da eleição">
          {([2, 1] as const).map((numero) => (
            <button
              key={numero}
              type="button"
              className={turnoVisto === numero ? "aba ativa" : "aba"}
              aria-current={turnoVisto === numero ? "page" : undefined}
              onClick={() => setTurnoVisto(numero)}
            >
              {numero}º turno
            </button>
          ))}
        </nav>
      )}

      <ResultadoTurno turno={turno} nomes={nomes} />
      <p className="ajuda aviso-simulacao">{AVISO}</p>

      <footer className="rodape-passo">
        <span />
        {reeleicao ? (
          <button
            type="button"
            className="botao botao-destaque"
            onClick={() => {
              concluirReeleicao(partida.id);
              window.scrollTo({ top: 0 });
            }}
          >
            {venceu ? "Começar o segundo mandato" : "Ver o balanço do governo"}
          </button>
        ) : venceu ? (
          <button
            type="button"
            className="botao botao-destaque"
            onClick={() => {
              formarGoverno(partida.id);
              window.scrollTo({ top: 0 });
            }}
          >
            Formar o governo
          </button>
        ) : (
          <Link className="botao botao-destaque" href="/">
            Voltar ao menu
          </Link>
        )}
      </footer>
    </section>
  );
}
