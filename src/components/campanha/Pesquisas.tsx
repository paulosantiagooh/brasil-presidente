"use client";

import { useState } from "react";
import type { Campanha, Pesquisa } from "@/lib/campanha";
import type { Disputante } from "./PainelCampanha";

const LARGURA = 640;
const ALTURA = 280;
const MARGEM = { topo: 14, direita: 22, baixo: 30, esquerda: 48 };

const nomeDaSemana = (pesquisa: Pesquisa) =>
  pesquisa.semana === 0 ? "Início" : `Semana ${pesquisa.semana}`;

function Evolucao({ pesquisas, nomes }: { pesquisas: Pesquisa[]; nomes: Disputante[] }) {
  const [foco, setFoco] = useState<number | null>(null);
  const maior = Math.max(...pesquisas.flatMap((p) => p.nacional));
  const topo = Math.ceil((maior + 5) / 10) * 10;
  const largura = LARGURA - MARGEM.esquerda - MARGEM.direita;
  const altura = ALTURA - MARGEM.topo - MARGEM.baixo;
  const passo = pesquisas.length > 1 ? largura / (pesquisas.length - 1) : 0;
  const x = (indice: number) =>
    MARGEM.esquerda + (pesquisas.length > 1 ? indice * passo : largura / 2);
  const y = (valor: number) => MARGEM.topo + altura - (valor / topo) * altura;
  const marcas = [0, topo / 2, topo];
  const emFoco = foco === null ? null : pesquisas[foco];

  return (
    <figure className="grafico">
      <div className="grafico-area">
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          role="img"
          aria-label="Evolução da intenção de voto, semana a semana"
          onMouseLeave={() => setFoco(null)}
        >
          {marcas.map((marca) => (
            <g key={marca}>
              <line
                className="grade"
                x1={MARGEM.esquerda}
                x2={LARGURA - MARGEM.direita}
                y1={y(marca)}
                y2={y(marca)}
              />
              <text className="eixo" x={MARGEM.esquerda - 8} y={y(marca) + 4} textAnchor="end">
                {marca}%
              </text>
            </g>
          ))}
          {pesquisas.map((pesquisa, indice) => (
            <text key={pesquisa.semana} className="eixo" x={x(indice)} y={ALTURA - 8} textAnchor="middle">
              {pesquisa.semana === 0 ? "Início" : `S${pesquisa.semana}`}
            </text>
          ))}
          {foco !== null && (
            <line
              className="cruz"
              x1={x(foco)}
              x2={x(foco)}
              y1={MARGEM.topo}
              y2={MARGEM.topo + altura}
            />
          )}
          {nomes.map((nome, candidato) => (
            <g key={nome.nome}>
              <polyline
                className="linha"
                stroke={`var(--candidato-${candidato})`}
                points={pesquisas.map((p, i) => `${x(i)},${y(p.nacional[candidato])}`).join(" ")}
              />
              {pesquisas.map((pesquisa, indice) => (
                <circle
                  key={pesquisa.semana}
                  className="ponto"
                  fill={`var(--candidato-${candidato})`}
                  cx={x(indice)}
                  cy={y(pesquisa.nacional[candidato])}
                  r="4"
                />
              ))}
            </g>
          ))}
          {pesquisas.map((pesquisa, indice) => (
            <rect
              key={pesquisa.semana}
              className="alvo"
              x={x(indice) - Math.max(passo, 60) / 2}
              y={0}
              width={Math.max(passo, 60)}
              height={ALTURA}
              onMouseEnter={() => setFoco(indice)}
              onClick={() => setFoco(indice)}
            />
          ))}
        </svg>
        {emFoco && foco !== null && (
          <div
            className="dica"
            style={{
              left: `${(x(foco) / LARGURA) * 100}%`,
              transform: foco * 2 >= pesquisas.length - 1 ? "translateX(-105%)" : "translateX(5%)",
            }}
          >
            <p className="rotulo">{nomeDaSemana(emFoco)}</p>
            {nomes
              .map((nome, i) => ({ nome: nome.nome, voto: emFoco.nacional[i], i }))
              .sort((a, b) => b.voto - a.voto)
              .map((item) => (
                <p key={item.nome} className="dica-linha">
                  <span className="marca" style={{ background: `var(--candidato-${item.i})` }} />
                  <span>{item.nome}</span>
                  <strong>{item.voto}%</strong>
                </p>
              ))}
          </div>
        )}
      </div>
      <ul className="legenda">
        {nomes.map((nome, indice) => (
          <li key={nome.nome}>
            <span style={{ background: `var(--candidato-${indice})` }} />
            {indice === 0 ? `Você (${nome.nome})` : nome.nome}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function Pesquisas({ campanha, nomes }: { campanha: Campanha; nomes: Disputante[] }) {
  const { pesquisas } = campanha;
  const pesquisa = pesquisas[pesquisas.length - 1];
  const ranking = nomes
    .map((nome, indice) => ({ ...nome, indice, voto: pesquisa.nacional[indice] }))
    .sort((a, b) => b.voto - a.voto);

  return (
    <div className="pesquisas">
      <section>
        <h2 className="titulo-bloco">Intenção de voto: {nomeDaSemana(pesquisa).toLowerCase()}</h2>
        <ul className="barras-candidatos">
          {ranking.map((item) => (
            <li key={item.nome}>
              <span className="barra-nome">
                <span>
                  {item.numero} · {item.nome} ({item.sigla})
                </span>
                <strong>{item.voto}%</strong>
              </span>
              <span className="barra" aria-hidden="true">
                <span
                  style={{ width: `${item.voto}%`, background: `var(--candidato-${item.indice})` }}
                />
              </span>
            </li>
          ))}
        </ul>
        <p className="ajuda">
          Indecisos, brancos e nulos: {pesquisa.indecisos}%. Margem de erro: 2 pontos. Pesquisa
          simulada pelo jogo.
        </p>
      </section>

      <section>
        <h2 className="titulo-bloco">Evolução</h2>
        <Evolucao pesquisas={pesquisas} nomes={nomes} />
        <details className="tabela-dados">
          <summary>Ver em tabela</summary>
          <div className="tabela-rolagem">
            <table>
              <thead>
                <tr>
                  <th scope="col">Candidatura</th>
                  {pesquisas.map((p) => (
                    <th key={p.semana} scope="col">
                      {p.semana === 0 ? "Início" : `S${p.semana}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nomes.map((nome, indice) => (
                  <tr key={nome.nome}>
                    <th scope="row">{nome.nome}</th>
                    {pesquisas.map((p) => (
                      <td key={p.semana}>{p.nacional[indice]}%</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
    </div>
  );
}
