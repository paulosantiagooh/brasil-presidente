"use client";

import { useState } from "react";
import { liderDaUf, percentualValido, totalDoTurno, type Turno } from "@/lib/eleicao";
import { ESTADOS, estadoDe } from "@/lib/estados";
import { ALTURA_MAPA, LARGURA_MAPA } from "@/lib/mapa";
import { CAMINHOS_UF } from "@/lib/mapa-ufs";
import type { Disputante } from "../campanha/PainelCampanha";

const inteiro = new Intl.NumberFormat("pt-BR");
const percentual = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parteDe(valor: number, total: number) {
  return `${percentual.format((valor / total) * 100)}%`;
}

export function ResultadoTurno({ turno, nomes }: { turno: Turno; nomes: Disputante[] }) {
  const [uf, setUf] = useState("SP");
  const total = totalDoTurno(turno);
  const doEstado = totalDoTurno(turno, [uf]);
  const estado = estadoDe(uf);
  const ranking = (base: typeof total) =>
    turno.participantes
      .map((indice) => ({
        ...nomes[indice],
        indice,
        votos: base.votos[indice],
        parte: percentualValido(base, indice),
      }))
      .sort((a, b) => b.votos - a.votos);
  const vencedoresNoMapa = [...new Set(ESTADOS.map((e) => liderDaUf(turno.ufs[e.uf])))].sort(
    (a, b) => a - b,
  );

  return (
    <div className="resultado-turno">
      <dl className="placar">
        <div>
          <dt>Comparecimento</dt>
          <dd>{parteDe(total.comparecimento, total.eleitores)}</dd>
          <p>{inteiro.format(total.comparecimento)} eleitores</p>
        </div>
        <div>
          <dt>Abstenções</dt>
          <dd>{parteDe(total.abstencoes, total.eleitores)}</dd>
          <p>{inteiro.format(total.abstencoes)} eleitores</p>
        </div>
        <div>
          <dt>Votos brancos</dt>
          <dd>{parteDe(total.brancos, total.comparecimento)}</dd>
          <p>{inteiro.format(total.brancos)} votos</p>
        </div>
        <div>
          <dt>Votos nulos</dt>
          <dd>{parteDe(total.nulos, total.comparecimento)}</dd>
          <p>{inteiro.format(total.nulos)} votos</p>
        </div>
      </dl>

      <div className="resultado-colunas">
        <section>
          <h2 className="titulo-bloco">Resultado nacional</h2>
          <ul className="barras-candidatos">
            {ranking(total).map((item) => (
              <li key={item.nome}>
                <span className="barra-nome">
                  <span>
                    {item.numero} · {item.nome} ({item.sigla})
                  </span>
                  <strong>{percentual.format(item.parte)}%</strong>
                </span>
                <span className="barra" aria-hidden="true">
                  <span
                    style={{
                      width: `${item.parte}%`,
                      background: `var(--candidato-${item.indice})`,
                    }}
                  />
                </span>
                <span className="dado">{inteiro.format(item.votos)} votos</span>
              </li>
            ))}
          </ul>
          <p className="ajuda">Percentuais sobre os votos válidos, sem brancos e nulos.</p>
        </section>

        <section className="mapa-area">
          <h2 className="titulo-bloco">Quem venceu em cada estado</h2>
          <label className="campo">
            <span className="rotulo">Estado</span>
            <select value={uf} onChange={(e) => setUf(e.target.value)}>
              {ESTADOS.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.nome}
                </option>
              ))}
            </select>
          </label>
          <svg
            className="mapa-ufs"
            viewBox={`0 0 ${LARGURA_MAPA} ${ALTURA_MAPA}`}
            role="group"
            aria-label="Vencedor em cada estado"
          >
            {ESTADOS.map((e) => (
              <path
                key={e.uf}
                d={CAMINHOS_UF[e.uf]}
                fill={`var(--candidato-${liderDaUf(turno.ufs[e.uf])})`}
                className={e.uf === uf ? "uf selecionada" : "uf"}
                role="button"
                tabIndex={0}
                aria-label={`${e.nome}: ${nomes[liderDaUf(turno.ufs[e.uf])].nome} venceu`}
                aria-pressed={e.uf === uf}
                onClick={() => setUf(e.uf)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    setUf(e.uf);
                  }
                }}
              >
                <title>{`${e.nome}: ${nomes[liderDaUf(turno.ufs[e.uf])].nome}`}</title>
              </path>
            ))}
          </svg>
          <ul className="legenda">
            {vencedoresNoMapa.map((indice) => (
              <li key={indice}>
                <span style={{ background: `var(--candidato-${indice})` }} />
                {indice === 0 ? `Você (${nomes[0].nome})` : nomes[indice].nome}
              </li>
            ))}
          </ul>
          <div className="painel-uf" aria-live="polite">
            <h3 className="titulo-bloco">{estado.nome}</h3>
            <ul className="barras-candidatos">
              {ranking(doEstado).map((item) => (
                <li key={item.nome}>
                  <span className="barra-nome">
                    <span>{item.nome}</span>
                    <strong>{percentual.format(item.parte)}%</strong>
                  </span>
                  <span className="barra" aria-hidden="true">
                    <span
                      style={{
                        width: `${item.parte}%`,
                        background: `var(--candidato-${item.indice})`,
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
            <p className="ajuda">
              Comparecimento de {parteDe(doEstado.comparecimento, doEstado.eleitores)}.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
