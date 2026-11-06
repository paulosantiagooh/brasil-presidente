"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NOME_DIFICULDADE } from "@/lib/config";
import { formatarData, usePartidas } from "@/lib/partidas";

const ETAPAS = [
  { nome: "Criação do candidato", detalhe: "Cadastro, fotografia, partido, ideologia, vice e biografia" },
  { nome: "Campanha eleitoral", detalhe: "Cinco semanas, agenda, pesquisas, mapa e debates" },
  { nome: "Eleições", detalhe: "Primeiro turno, segundo turno e apuração" },
  { nome: "Formação do governo", detalhe: "Ministros, Congresso, orçamento e primeiras decisões" },
];

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
        <p className="dado">Salva em {formatarData(partida.atualizadaEm)}</p>
      </header>

      <p className="sobretitulo">
        {partida.nome} · Eleição {partida.cenario} · Dificuldade{" "}
        {NOME_DIFICULDADE[partida.dificuldade]}
      </p>
      <h1 className="titulo-tela">O caminho até a Presidência</h1>
      <p className="texto-tela">
        A sua partida já está salva. A criação do candidato é a próxima parte em construção, e o
        jogo continua daqui quando ela estiver pronta.
      </p>

      <ol className="etapas">
        {ETAPAS.map((etapa, indice) => (
          <li key={etapa.nome} className={indice === 0 ? "etapa etapa-atual" : "etapa"}>
            <span className="etapa-numero">{indice + 1}</span>
            <div>
              <p className="etapa-nome">{etapa.nome}</p>
              <p className="etapa-detalhe">{etapa.detalhe}</p>
            </div>
            {indice === 0 && <span className="selo">Próxima</span>}
          </li>
        ))}
      </ol>
    </>
  );
}
