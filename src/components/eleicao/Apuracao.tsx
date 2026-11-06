"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { liderDaUf, percentualValido, totalDoTurno, type Turno } from "@/lib/eleicao";
import { ESTADOS } from "@/lib/estados";
import { ALTURA_MAPA, LARGURA_MAPA } from "@/lib/mapa";
import { CAMINHOS_UF } from "@/lib/mapa-ufs";
import type { Disputante } from "../campanha/PainelCampanha";

const INTERVALO_MS = 450;
const formatoPercentual = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Props = {
  turno: Turno;
  nomes: Disputante[];
  aoConcluir: () => void;
};

export function Apuracao({ turno, nomes, aoConcluir }: Props) {
  const [apurados, setApurados] = useState(0);
  const concluir = useRef(aoConcluir);

  useEffect(() => {
    concluir.current = aoConcluir;
  });

  // Estados menores e mais rápidos fecham primeiro, e o resultado vira ao longo da apuração.
  const ordem = useMemo(
    () => [...ESTADOS].sort((a, b) => a.eleitorado - b.eleitorado).map((e) => e.uf),
    [],
  );

  useEffect(() => {
    const relogio = window.setInterval(() => {
      setApurados((atual) => Math.min(ordem.length, atual + 1));
    }, INTERVALO_MS);
    return () => window.clearInterval(relogio);
  }, [ordem.length]);

  useEffect(() => {
    if (apurados < ordem.length) return;
    const pausa = window.setTimeout(() => concluir.current(), 900);
    return () => window.clearTimeout(pausa);
  }, [apurados, ordem.length]);

  const fechados = ordem.slice(0, apurados);
  const parcial = totalDoTurno(turno, fechados);
  const total = totalDoTurno(turno);
  const urnas = (parcial.eleitores / total.eleitores) * 100;
  const ranking = turno.participantes
    .map((indice) => ({ ...nomes[indice], indice, parte: percentualValido(parcial, indice) }))
    .sort((a, b) => b.parte - a.parte);

  return (
    <section className="apuracao" aria-labelledby="titulo-apuracao">
      <p className="sobretitulo">{turno.numero}º turno · Eleição 2026 · Simulação</p>
      <h1 id="titulo-apuracao" className="titulo-tela">
        Apuração
      </h1>
      <p className="texto-tela" role="status">
        {formatoPercentual.format(urnas)}% das urnas apuradas · {apurados} de {ordem.length} estados
      </p>
      <span className="barra" aria-hidden="true">
        <span style={{ width: `${urnas}%` }} />
      </span>

      <div className="apuracao-corpo">
        <ul className="barras-candidatos">
          {ranking.map((item) => (
            <li key={item.nome}>
              <span className="barra-nome">
                <span>
                  {item.numero} · {item.nome} ({item.sigla})
                </span>
                <strong>{formatoPercentual.format(item.parte)}%</strong>
              </span>
              <span className="barra" aria-hidden="true">
                <span
                  style={{ width: `${item.parte}%`, background: `var(--candidato-${item.indice})` }}
                />
              </span>
            </li>
          ))}
        </ul>

        <svg
          className="mapa-ufs"
          viewBox={`0 0 ${LARGURA_MAPA} ${ALTURA_MAPA}`}
          role="img"
          aria-label="Estados já apurados, coloridos por quem venceu"
        >
          {ESTADOS.map((estado) => (
            <path
              key={estado.uf}
              d={CAMINHOS_UF[estado.uf]}
              className="uf-apuracao"
              fill={
                fechados.includes(estado.uf)
                  ? `var(--candidato-${liderDaUf(turno.ufs[estado.uf])})`
                  : "var(--superficie-alta)"
              }
            />
          ))}
        </svg>
      </div>

      <footer className="rodape-passo">
        <span />
        <button type="button" className="botao" onClick={aoConcluir}>
          Pular a apuração
        </button>
      </footer>
    </section>
  );
}
