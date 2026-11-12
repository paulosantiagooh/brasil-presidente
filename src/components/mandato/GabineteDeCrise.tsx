"use client";

import { useEffect } from "react";
import { AREA_DO_ASSESSOR, SEGUNDOS_DA_CRISE } from "@/lib/crises";
import { PERSONAGENS } from "@/lib/drama";
import { conselhosDaFase, criseAtual, decidirCrise, fecharPendencia, nomeDoMes, type Mandato } from "@/lib/mandato";
import { tocar } from "@/lib/sons";
import { CenaAnimada } from "../cenas/CenaAnimada";
import { Relogio, Rosto } from "./CartaDrama";

type Props = { mandato: Mandato; atualizar: (mudar: (m: Mandato) => Mandato) => void };

function Gravidade({ valor, antes }: { valor: number; antes?: number }) {
  const nivel = valor >= 65 ? "Grave" : valor >= 35 ? "Séria" : "Sob controle";
  return (
    <div className={valor >= 65 ? "gravidade grave" : valor >= 35 ? "gravidade seria" : "gravidade"}>
      <span className="barra-nome">
        <span className="rotulo">Gravidade da crise</span>
        <strong>
          {nivel} · {valor}
          {antes !== undefined && antes !== valor ? ` (antes ${antes})` : ""}
        </strong>
      </span>
      <span className="barra" aria-hidden="true">
        <span style={{ width: `${valor}%` }} />
      </span>
    </div>
  );
}

export function GabineteDeCrise({ mandato, atualizar }: Props) {
  const crise = criseAtual(mandato);
  const ativa = mandato.crise;

  useEffect(() => {
    tocar("urgente");
  }, [ativa?.fase]);

  if (!crise || !ativa) return null;
  const fase = crise.fases[ativa.fase];
  const conselhos = conselhosDaFase(mandato);

  return (
    <section className="carta carta-urgente gabinete-crise" aria-labelledby="titulo-crise">
      <p className="faixa-urgente">
        <span className="ao-vivo" aria-hidden="true" /> Gabinete de crise · Ao vivo
      </p>
      <CenaAnimada cena={crise.cena} legenda={crise.nome} chave={`crise-${crise.id}-${ativa.fase}`} />
      <p className="sobretitulo">
        {nomeDoMes(mandato.mes)} · {crise.nome} · Fase {ativa.fase + 1} de {crise.fases.length}
      </p>
      <h1 id="titulo-crise" className="titulo-tela">
        {fase.titulo}
      </h1>
      <p className="fala">{fase.texto}</p>
      <div className="letreiro" aria-label="Últimas notícias">
        <span className="letreiro-selo">Plantão</span>
        <span className="letreiro-faixa">
          <span>{fase.noticias.join("  •  ")}  •  </span>
          <span aria-hidden="true">{fase.noticias.join("  •  ")}  •  </span>
        </span>
      </div>
      <Gravidade valor={ativa.gravidade} />
      <Relogio key={`${crise.id}-${ativa.fase}`} segundos={SEGUNDOS_DA_CRISE} aoAcabar={() => atualizar((m) => decidirCrise(m, null))} />
      <p className="rotulo espaco-topo">A equipe não concorda. Qual plano você segue?</p>
      <ul className="conselhos">
        {conselhos.map(({ conselho, indice }) => (
          <li key={conselho.quem} className="conselho">
            <div className="conselho-topo">
              <Rosto quem={conselho.quem} />
              <span className="dado">{AREA_DO_ASSESSOR[conselho.quem]}</span>
            </div>
            <p className="conselho-fala">“{conselho.fala}”</p>
            <button type="button" className="resposta" onClick={() => atualizar((m) => decidirCrise(m, indice))}>
              {conselho.plano}
            </button>
          </li>
        ))}
      </ul>
      <p className="ajuda aviso-simulacao">Assessores fictícios. Cenário inventado pelo jogo.</p>
    </section>
  );
}

export function ResultadoDaCrise({ mandato, atualizar }: Props) {
  const pendencia = mandato.pendencia;
  const resultado = pendencia?.tipo === "crise-resultado" ? pendencia : null;

  useEffect(() => {
    if (!resultado) return;
    tocar(resultado.desfecho === "contida" || (!resultado.desfecho && resultado.depois < resultado.antes) ? "bom" : "ruim");
  }, [resultado]);

  if (!resultado) return null;
  return (
    <section className="carta" aria-labelledby="titulo-resultado-crise">
      <p className="sobretitulo">{resultado.desfecho ? "Fim da crise" : "Gabinete de crise"}</p>
      <h1 id="titulo-resultado-crise" className="titulo-tela">
        {resultado.titulo}
      </h1>
      <p className="fala fala-resultado">{resultado.texto}</p>
      <Gravidade valor={resultado.depois} antes={resultado.antes} />
      <ul className="reacoes">
        {resultado.reacoes.map((reacao) => (
          <li key={reacao.quem}>
            <Rosto quem={reacao.quem} />
            <p className="conselho-fala">“{reacao.texto}”</p>
          </li>
        ))}
      </ul>
      {resultado.saiu && (
        <p className="alerta espaco-topo">
          {PERSONAGENS[resultado.saiu]?.nome} pediu demissão depois de ser ignorado o tempo todo. As histórias com essa pessoa acabaram.
        </p>
      )}
      <footer className="rodape-passo">
        <span />
        <button type="button" className="botao botao-destaque" onClick={() => atualizar(fecharPendencia)}>
          Continuar
        </button>
      </footer>
    </section>
  );
}
