"use client";

import { useState } from "react";
import {
  acoesRestantes,
  ACOES_POR_SEMANA,
  fecharCartaCampanha,
  responderCartaCampanha,
  SEMANAS,
  type Campanha,
} from "@/lib/campanha";
import { CARTAS_CAMPANHA } from "@/lib/drama";
import { CartaDrama, RespostaCarta } from "../mandato/CartaDrama";
import { partidoDoCandidato, type Candidato } from "@/lib/candidato";
import { atualizarCampanha, irAsUrnas, type Partida } from "@/lib/partidas";
import { Agenda } from "./Agenda";
import { TelaBoletim, ListaBoletins } from "./Boletins";
import { TelaDebate } from "./Debate";
import { MapaEleitoral } from "./MapaEleitoral";
import { Pesquisas } from "./Pesquisas";

export type Disputante = { nome: string; sigla: string; numero: number };

export function disputantes(c: Campanha, candidato: Candidato): Disputante[] {
  const partido = partidoDoCandidato(candidato);
  return [
    { nome: candidato.nomeUrna, sigla: partido?.sigla ?? "", numero: partido?.numero ?? 0 },
    ...c.rivais.map((r) => ({ nome: r.nome, sigla: r.sigla, numero: r.numero })),
  ];
}

const ABAS = [
  { id: "agenda", nome: "Agenda" },
  { id: "mapa", nome: "Mapa" },
  { id: "pesquisas", nome: "Pesquisas" },
  { id: "boletins", nome: "Boletins" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

type Props = {
  partida: Partida;
  campanha: Campanha;
  candidato: Candidato;
};

export function PainelCampanha({ partida, campanha, candidato }: Props) {
  const [aba, setAba] = useState<Aba>("agenda");
  const nomes = disputantes(campanha, candidato);
  const pesquisa = campanha.pesquisas[campanha.pesquisas.length - 1];
  const posicao =
    [...pesquisa.nacional].sort((a, b) => b - a).indexOf(pesquisa.nacional[0]) + 1;
  const atualizar = (mudar: (c: Campanha) => Campanha) => atualizarCampanha(partida.id, mudar);

  if (campanha.fase === "debate" && campanha.debate) {
    return <TelaDebate campanha={campanha} candidato={candidato} atualizar={atualizar} />;
  }

  if (campanha.fase === "boletim") {
    return <TelaBoletim campanha={campanha} nomes={nomes} atualizar={atualizar} />;
  }

  const cartaDaSemana = CARTAS_CAMPANHA.find((carta) => carta.id === campanha.carta);
  if (campanha.fase === "agenda" && cartaDaSemana) {
    return (
      <CartaDrama
        key={cartaDaSemana.id}
        quem={cartaDaSemana.quem}
        titulo={cartaDaSemana.titulo}
        texto={cartaDaSemana.texto}
        capitulo={`Semana ${campanha.semana} da campanha`}
        opcoes={cartaDaSemana.opcoes.map((o) => o.texto)}
        aoEscolher={(indice) => atualizar((c) => responderCartaCampanha(c, indice ?? 0))}
      />
    );
  }
  if (campanha.cartaResposta) {
    return (
      <RespostaCarta
        quem={campanha.cartaResposta.quem}
        resposta={campanha.cartaResposta.resposta}
        mudancas={campanha.cartaResposta.mudancas}
        aoSeguir={() => atualizar(fecharCartaCampanha)}
      />
    );
  }

  const encerrada = campanha.fase === "encerrada";

  return (
    <section className="campanha" aria-labelledby="titulo-campanha">
      <p className="sobretitulo">{partida.ciclo === 2 ? "Reeleição 2030" : `Eleição ${partida.cenario}`}</p>
      <h1 id="titulo-campanha" className="titulo-tela">
        {encerrada ? "Fim da campanha" : `Semana ${campanha.semana} de ${SEMANAS}`}
      </h1>

      <dl className="placar">
        <div>
          <dt>Intenção de voto</dt>
          <dd>{pesquisa.nacional[0]}%</dd>
          <p>{posicao}º lugar</p>
        </div>
        <div>
          <dt>Rejeição</dt>
          <dd>{pesquisa.rejeicao}%</dd>
          <p>na última pesquisa</p>
        </div>
        <div>
          <dt>Indecisos</dt>
          <dd>{pesquisa.indecisos}%</dd>
          <p>brancos e nulos incluídos</p>
        </div>
        <div>
          <dt>Ações</dt>
          <dd>{encerrada ? 0 : acoesRestantes(campanha)}</dd>
          <p>de {ACOES_POR_SEMANA} nesta semana</p>
        </div>
      </dl>

      <nav className="abas" aria-label="Áreas da campanha">
        {ABAS.map(({ id, nome }) => (
          <button
            key={id}
            type="button"
            className={aba === id ? "aba ativa" : "aba"}
            aria-current={aba === id ? "page" : undefined}
            onClick={() => setAba(id)}
          >
            {nome}
          </button>
        ))}
      </nav>

      {aba === "agenda" &&
        (encerrada ? (
          <div className="bloco">
            <p className="rotulo">A campanha terminou</p>
            <p className="ajuda">
              As cinco semanas acabaram. O resultado pode ser diferente da última pesquisa: a decisão
              dos indecisos e o comparecimento só aparecem nas urnas.
            </p>
            <button
              type="button"
              className="botao botao-destaque"
              onClick={() => irAsUrnas(partida.id)}
            >
              Ir às urnas
            </button>
          </div>
        ) : (
          <Agenda
            campanha={campanha}
            candidato={candidato}
            dificuldade={partida.dificuldade}
            atualizar={atualizar}
          />
        ))}
      {aba === "mapa" && <MapaEleitoral campanha={campanha} nomes={nomes} />}
      {aba === "pesquisas" && <Pesquisas campanha={campanha} nomes={nomes} />}
      {aba === "boletins" && <ListaBoletins campanha={campanha} />}
    </section>
  );
}
