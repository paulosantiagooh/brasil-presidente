"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NOME_DIFICULDADE } from "@/lib/config";
import type { NomeTrilha } from "@/lib/musica";
import { candidatoDaPartida, formatarData, iniciarCampanha, usePartidas, type Partida } from "@/lib/partidas";
import { PainelCampanha } from "./campanha/PainelCampanha";
import { CriacaoCandidato } from "./criacao/CriacaoCandidato";
import { TelaEleicao } from "./eleicao/TelaEleicao";
import { TelaGoverno } from "./governo/TelaGoverno";
import { TelaMandato } from "./mandato/TelaMandato";
import { FichaCandidato } from "./criacao/FichaCandidato";
import { BotaoMusica, Trilha } from "./Trilha";

function trilhaDaPartida(partida: Partida): NomeTrilha {
  if (partida.etapa === "campanha" || partida.etapa === "eleicao") return "campanha";
  if (partida.etapa !== "mandato" || !partida.mandato) return "abertura";
  const { pendencia, drama, fase } = partida.mandato;
  if (fase === "fim") return "abertura";
  const urgente = pendencia?.tipo === "impeachment" || (pendencia?.tipo === "carta" && Boolean(pendencia.carta.urgente));
  return urgente || drama.pressao >= 60 ? "crise" : "mandato";
}

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

  if (partida.cenario !== 2026) {
    return (
      <section className="cartao">
        <h1 className="titulo-tela">Partida da versão antiga</h1>
        <p>
          Esta partida começou no cenário de {partida.cenario}. O jogo agora começa em 2026, e ela não
          pode continuar. Comece um novo jogo.
        </p>
        <Link className="botao botao-destaque" href="/">
          Voltar ao menu
        </Link>
      </section>
    );
  }

  const candidato = candidatoDaPartida(partida);

  return (
    <>
      <Trilha nome={trilhaDaPartida(partida)} />
      <header className="cabecalho-tela">
        <Link className="botao" href="/">
          ‹ Menu
        </Link>
        <p className="dado">
          {partida.nome} · {NOME_DIFICULDADE[partida.dificuldade]} · Salva às{" "}
          {formatarData(partida.atualizadaEm).split(" às ")[1]}
        </p>
        <BotaoMusica />
      </header>

      {partida.etapa === "criacao-candidato" && <CriacaoCandidato partida={partida} />}
      {partida.etapa === "campanha" && !partida.campanha && (
        <section aria-labelledby="titulo-registro">
          <p className="sobretitulo">Eleição {partida.cenario}</p>
          <h1 id="titulo-registro" className="titulo-tela">
            Candidatura registrada
          </h1>
          <p className="texto-tela">
            A sua chapa está pronta. A campanha dura cinco semanas, com quatro ações por semana.
          </p>
          <FichaCandidato c={candidato} />
          <footer className="rodape-passo">
            <span />
            <button
              type="button"
              className="botao botao-destaque"
              onClick={() => iniciarCampanha(partida.id)}
            >
              Começar a campanha
            </button>
          </footer>
        </section>
      )}
      {partida.etapa === "campanha" && partida.campanha && (
        <PainelCampanha partida={partida} campanha={partida.campanha} candidato={candidato} />
      )}
      {partida.etapa === "eleicao" && partida.campanha && partida.eleicao && (
        <TelaEleicao
          partida={partida}
          eleicao={partida.eleicao}
          campanha={partida.campanha}
          candidato={candidato}
        />
      )}
      {partida.etapa === "governo" && partida.campanha && partida.eleicao && partida.governo && (
        <TelaGoverno
          partida={partida}
          governo={partida.governo}
          campanha={partida.campanha}
          eleicao={partida.eleicao}
          candidato={candidato}
        />
      )}
      {partida.etapa === "mandato" && partida.campanha && partida.governo && partida.mandato && (
        <TelaMandato
          partida={partida}
          mandato={partida.mandato}
          governo={partida.governo}
          campanha={partida.campanha}
          candidato={candidato}
        />
      )}
    </>
  );
}
