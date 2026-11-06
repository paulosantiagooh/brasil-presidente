"use client";

import { useState, type ReactNode } from "react";
import { nomeDoMes, type Registro } from "@/lib/mandato";

export function numero(valor: number, casas = 1) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

export function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="area">
      <h2 className="titulo-bloco">{titulo}</h2>
      {children}
    </section>
  );
}

export function Numeros({ itens }: { itens: { nome: string; valor: string; nota?: string }[] }) {
  return (
    <dl className="numeros">
      {itens.map((item) => (
        <div key={item.nome}>
          <dt>{item.nome}</dt>
          <dd>{item.valor}</dd>
          {item.nota && <p>{item.nota}</p>}
        </div>
      ))}
    </dl>
  );
}

export function Barras({ itens }: { itens: { nome: string; valor: number; texto?: string }[] }) {
  return (
    <ul className="atributos">
      {itens.map((item) => (
        <li key={item.nome}>
          <span>{item.nome}</span>
          <span className="barra" aria-hidden="true">
            <span style={{ width: `${Math.min(100, Math.max(0, item.valor))}%` }} />
          </span>
          <strong>{item.texto ?? Math.round(item.valor)}</strong>
        </li>
      ))}
    </ul>
  );
}

const LARGURA = 640;
const ALTURA = 240;
const MARGEM = { topo: 12, direita: 16, baixo: 28, esquerda: 52 };

// Um indicador por vez, para evitar duas escalas no mesmo gráfico.
export function Serie(props: {
  historico: Registro[];
  campo: keyof Registro;
  nome: string;
  sufixo: string;
  casas?: number;
}) {
  const { historico, campo, nome, sufixo, casas = 1 } = props;
  const [foco, setFoco] = useState<number | null>(null);
  const valores = historico.map((r) => r[campo]);
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);
  const folga = Math.max((maximo - minimo) * 0.15, 0.5);
  const piso = minimo - folga;
  const teto = maximo + folga;
  const largura = LARGURA - MARGEM.esquerda - MARGEM.direita;
  const altura = ALTURA - MARGEM.topo - MARGEM.baixo;
  const x = (i: number) => MARGEM.esquerda + (historico.length > 1 ? (i / (historico.length - 1)) * largura : largura / 2);
  const y = (v: number) => MARGEM.topo + altura - ((v - piso) / (teto - piso)) * altura;
  const marcas = [piso, (piso + teto) / 2, teto];
  const passoRotulo = Math.max(1, Math.ceil(historico.length / 5));
  const emFoco = foco === null ? null : historico[foco];

  return (
    <figure className="grafico">
      <div className="grafico-area">
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          role="img"
          aria-label={`${nome}, mês a mês`}
          onMouseLeave={() => setFoco(null)}
        >
          {marcas.map((marca) => (
            <g key={marca}>
              <line className="grade" x1={MARGEM.esquerda} x2={LARGURA - MARGEM.direita} y1={y(marca)} y2={y(marca)} />
              <text className="eixo" x={MARGEM.esquerda - 8} y={y(marca) + 4} textAnchor="end">
                {numero(marca, casas)}
              </text>
            </g>
          ))}
          {historico.map((r, i) =>
            i % passoRotulo === 0 ? (
              <text key={r.mes} className="eixo" x={x(i)} y={ALTURA - 8} textAnchor="middle">
                {nomeDoMes(r.mes)}
              </text>
            ) : null,
          )}
          {foco !== null && (
            <line className="cruz" x1={x(foco)} x2={x(foco)} y1={MARGEM.topo} y2={MARGEM.topo + altura} />
          )}
          <polyline
            className="linha"
            stroke="var(--candidato-0)"
            points={historico.map((r, i) => `${x(i)},${y(r[campo])}`).join(" ")}
          />
          {foco !== null && (
            <circle className="ponto" fill="var(--candidato-0)" cx={x(foco)} cy={y(valores[foco])} r="5" />
          )}
          {historico.map((r, i) => (
            <rect
              key={r.mes}
              className="alvo"
              x={x(i) - Math.max(largura / historico.length, 24) / 2}
              y={0}
              width={Math.max(largura / historico.length, 24)}
              height={ALTURA}
              onMouseEnter={() => setFoco(i)}
              onClick={() => setFoco(i)}
            />
          ))}
        </svg>
        {emFoco && foco !== null && (
          <div
            className="dica"
            style={{
              left: `${(x(foco) / LARGURA) * 100}%`,
              minWidth: "7rem",
              transform: foco * 2 >= historico.length - 1 ? "translateX(-105%)" : "translateX(5%)",
            }}
          >
            <p className="rotulo">{nomeDoMes(emFoco.mes)}</p>
            <p>
              {numero(emFoco[campo], casas)}
              {sufixo}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}
