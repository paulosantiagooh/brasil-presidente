"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NOME_DIFICULDADE } from "@/lib/config";
import { candidatoDaPartida, formatarData, usePartidas } from "@/lib/partidas";
import { CriacaoCandidato } from "./criacao/CriacaoCandidato";
import { FichaCandidato } from "./criacao/FichaCandidato";

export function TelaPartida() {
  const id = useSearchParams().get("id");
  const partidas = usePartidas();
  const partida = partidas.find((p) => p.id === id);

  if (!partida) {
    return (
      <section className="cartao">
        <h1 className="titulo-tela">Partida não encontrada</h1>
        <p>Ela pode ter sido apagada ou estar salva em outro aparelho.</p>
        <Link className="botao botao-destaque" href="/">
          Voltar ao menu
        </Link>
      </section>
    );
  }

  return (
    <>
      <header className="cabecalho-tela">
        <Link className="botao" href="/">
          ‹ Menu
        </Link>
        <p className="dado">
          {partida.nome} · {NOME_DIFICULDADE[partida.dificuldade]} · Salva às{" "}
          {formatarData(partida.atualizadaEm).split(" às ")[1]}
        </p>
      </header>

      {partida.etapa === "criacao-candidato" ? (
        <CriacaoCandidato partida={partida} />
      ) : (
        <section aria-labelledby="titulo-registro">
          <p className="sobretitulo">Eleição {partida.cenario}</p>
          <h1 id="titulo-registro" className="titulo-tela">
            Candidatura registrada
          </h1>
          <p className="texto-tela">
            A sua chapa está pronta e salva. A campanha eleitoral é a próxima parte em construção, e
            o jogo continua daqui quando ela estiver pronta.
          </p>
          <FichaCandidato c={candidatoDaPartida(partida)} />
        </section>
      )}
    </>
  );
}
