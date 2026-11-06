"use client";

import { useEffect, useState } from "react";
import type { Casa } from "@/lib/governo";
import {
  colocarEmVotacao,
  estimativaDeVotos,
  fecharPendencia,
  negociar,
  nomeDoMes,
  type Concessoes,
  type Contexto,
  type Mandato,
} from "@/lib/mandato";

const INTERVALO_MS = 260;

const OFERTAS: { id: keyof Concessoes; nome: string; resumo: string }[] = [
  { id: "emendas", nome: "Liberar emendas", resumo: "Ganha votos, pesa nas contas públicas." },
  { id: "cargos", nome: "Oferecer cargos", resumo: "Ganha votos, reduz a confiança nas instituições." },
  { id: "texto", nome: "Ceder no texto", resumo: "Ganha votos, reduz o efeito da medida." },
];

type Props = {
  mandato: Mandato;
  contexto: Contexto;
  atualizar: (mudar: (m: Mandato) => Mandato) => void;
};

function Painel({ titulo, casa, partidos }: { titulo: string; casa: Casa; partidos: number }) {
  const mostrados = casa.partidos.slice(0, partidos);
  const sim = mostrados.reduce((soma, p) => soma + p.sim, 0);
  const nao = mostrados.reduce((soma, p) => soma + p.nao, 0);
  const total = casa.sim + casa.nao;
  const completo = partidos >= casa.partidos.length;
  return (
    <section className="bloco painel-voto">
      <h2 className="titulo-bloco">{titulo}</h2>
      <dl className="placar placar-duplo">
        <div>
          <dt>A favor</dt>
          <dd>{sim}</dd>
        </div>
        <div>
          <dt>Contra</dt>
          <dd>{nao}</dd>
        </div>
      </dl>
      <div className="barra-voto" aria-hidden="true">
        <span className="voto-sim" style={{ width: `${(sim / total) * 100}%` }} />
        <span className="voto-nao" style={{ width: `${(nao / total) * 100}%` }} />
      </div>
      {casa.necessarios && <p className="ajuda">São necessários {casa.necessarios} votos a favor.</p>}
      <ul className="diario voto-partidos">
        {mostrados
          .slice(-4)
          .reverse()
          .map((partido) => (
            <li key={partido.sigla}>
              {partido.sigla}: {partido.sim} a favor e {partido.nao} contra
            </li>
          ))}
      </ul>
      {completo && <p className="situacao">{casa.aprovado ? "Aprovado" : "Rejeitado"}</p>}
    </section>
  );
}

export function TelaVotacao({ mandato, contexto, atualizar }: Props) {
  const [passo, setPasso] = useState(0);
  const pendencia = mandato.pendencia;
  const votacao = pendencia?.tipo === "votacao" ? pendencia : null;
  const resultado = votacao?.resultado ?? null;
  const totalPartidos = resultado
    ? resultado.camara.partidos.length + (resultado.senado?.partidos.length ?? 0)
    : 0;

  useEffect(() => {
    if (!resultado) return;
    const relogio = window.setInterval(() => {
      setPasso((atual) => Math.min(totalPartidos, atual + 1));
    }, INTERVALO_MS);
    return () => window.clearInterval(relogio);
  }, [resultado, totalPartidos]);

  if (!votacao) return null;
  const { proposta, concessoes } = votacao;

  if (resultado) {
    const naCamara = resultado.camara.partidos.length;
    const terminou = passo >= totalPartidos;
    return (
      <section className="boletim" aria-labelledby="titulo-voto">
        <p className="sobretitulo">{nomeDoMes(mandato.mes)} · Votação em plenário</p>
        <h1 id="titulo-voto" className="titulo-tela">
          {proposta.nome}
        </h1>
        <Painel titulo="Câmara dos Deputados" casa={resultado.camara} partidos={Math.min(passo, naCamara)} />
        {resultado.senado && passo >= naCamara && (
          <Painel titulo="Senado Federal" casa={resultado.senado} partidos={passo - naCamara} />
        )}
        {terminou && !resultado.senado && (
          <p className="ajuda">O projeto parou na Câmara e não chegou ao Senado.</p>
        )}
        <footer className="rodape-passo">
          {terminou ? <span /> : (
            <button type="button" className="botao" onClick={() => setPasso(totalPartidos)}>
              Ver o resultado
            </button>
          )}
          <button
            type="button"
            className="botao botao-destaque"
            disabled={!terminou}
            onClick={() => atualizar(fecharPendencia)}
          >
            Continuar
          </button>
        </footer>
      </section>
    );
  }

  const estimativa = estimativaDeVotos(mandato, contexto);
  const necessarios = proposta.camara ?? 257;

  return (
    <section className="boletim" aria-labelledby="titulo-negociacao">
      <p className="sobretitulo">
        {nomeDoMes(mandato.mes)} · {proposta.tipo} · Negociação
      </p>
      <h1 id="titulo-negociacao" className="titulo-tela">
        {proposta.nome}
      </h1>
      <p className="texto-tela">
        Antes do plenário, você pode negociar. A previsão muda com cada oferta, mas o resultado só sai na
        votação.
      </p>
      <dl className="placar placar-duplo">
        <div>
          <dt>Previsão na Câmara</dt>
          <dd>{estimativa?.deputados}</dd>
          <p>{proposta.camara ? `${proposta.camara} necessários` : "maioria dos presentes"}</p>
        </div>
        <div>
          <dt>Previsão no Senado</dt>
          <dd>{estimativa?.senadores}</dd>
          <p>{proposta.senado ? `${proposta.senado} necessários` : "maioria dos presentes"}</p>
        </div>
      </dl>
      {estimativa && estimativa.deputados < necessarios && (
        <p className="alerta espaco-topo">Pela previsão, faltam votos na Câmara.</p>
      )}
      <ul className="lista-acoes espaco-topo">
        {OFERTAS.map((oferta) => (
          <li key={oferta.id}>
            <button
              type="button"
              className="acao"
              disabled={concessoes[oferta.id] >= 2}
              onClick={() => atualizar((m) => negociar(m, oferta.id))}
            >
              <span className="cartao-topo">
                <strong>{oferta.nome}</strong>
                <span className="dado">{concessoes[oferta.id]} de 2</span>
              </span>
              <span className="ajuda">{oferta.resumo}</span>
            </button>
          </li>
        ))}
      </ul>
      <footer className="rodape-passo">
        <span />
        <button
          type="button"
          className="botao botao-destaque"
          onClick={() => atualizar((m) => colocarEmVotacao(m, contexto))}
        >
          Colocar em votação
        </button>
      </footer>
    </section>
  );
}
