"use client";

import { SEMANAS, seguirCampanha, type Boletim, type Campanha } from "@/lib/campanha";
import type { Disputante } from "./PainelCampanha";

function CorpoBoletim({ boletim }: { boletim: Boletim }) {
  return (
    <>
      <h3 className="rotulo">Acontecimentos</h3>
      <ul className="diario">
        {boletim.eventos.map((evento) => (
          <li key={evento.titulo}>
            <strong>{evento.titulo}.</strong> {evento.texto}
          </li>
        ))}
      </ul>
      <h3 className="rotulo">Sua agenda</h3>
      {boletim.acoes.length === 0 ? (
        <p className="ajuda">Você não fez nenhuma ação nesta semana.</p>
      ) : (
        <ul className="diario">
          {boletim.acoes.map((acao, indice) => (
            <li key={indice}>{acao}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function textoVariacao(variacao: number) {
  if (variacao === 0) return "Sua intenção de voto ficou estável";
  const pontos = Math.abs(variacao);
  return `Sua intenção de voto ${variacao > 0 ? "subiu" : "caiu"} ${pontos} ${pontos === 1 ? "ponto" : "pontos"}`;
}

export function TelaBoletim(props: {
  campanha: Campanha;
  nomes: Disputante[];
  atualizar: (mudar: (c: Campanha) => Campanha) => void;
}) {
  const { campanha, nomes, atualizar } = props;
  const boletim = campanha.boletins[campanha.boletins.length - 1];
  const pesquisa = campanha.pesquisas[campanha.pesquisas.length - 1];
  const ranking = nomes
    .map((disputante, i) => ({ ...disputante, voto: pesquisa.nacional[i] }))
    .sort((a, b) => b.voto - a.voto);

  return (
    <section className="boletim" aria-labelledby="titulo-boletim">
      <p className="sobretitulo">Boletim de campanha</p>
      <h1 id="titulo-boletim" className="titulo-tela">
        Semana {boletim.semana} de {SEMANAS}
      </h1>
      <p className="texto-tela">{textoVariacao(boletim.variacao)} na nova pesquisa.</p>
      <div className="bloco">
        <CorpoBoletim boletim={boletim} />
        <h3 className="rotulo">Pesquisa nacional</h3>
        <ol className="diario">
          {ranking.map((disputante) => (
            <li key={disputante.nome}>
              {disputante.nome} ({disputante.sigla}): {disputante.voto}%
            </li>
          ))}
        </ol>
      </div>
      <footer className="rodape-passo">
        <span />
        <button
          type="button"
          className="botao botao-destaque"
          onClick={() => atualizar(seguirCampanha)}
        >
          {campanha.semana >= SEMANAS ? "Ver o fim da campanha" : "Próxima semana"}
        </button>
      </footer>
    </section>
  );
}

export function ListaBoletins({ campanha }: { campanha: Campanha }) {
  if (campanha.boletins.length === 0) {
    return <p className="ajuda">O primeiro boletim sai no fim da semana 1.</p>;
  }
  return (
    <div className="lista-boletins">
      {[...campanha.boletins].reverse().map((boletim) => (
        <details key={boletim.semana} className="bloco" open={boletim.semana === campanha.boletins.length}>
          <summary>
            Semana {boletim.semana}: {textoVariacao(boletim.variacao).toLowerCase()}
          </summary>
          <CorpoBoletim boletim={boletim} />
        </details>
      ))}
    </div>
  );
}
