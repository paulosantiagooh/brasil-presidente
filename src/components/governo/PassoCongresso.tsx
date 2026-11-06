"use client";

import type { Candidato } from "@/lib/candidato";
import {
  DEPUTADOS,
  NOME_POSICAO,
  resumoDoCongresso,
  SENADORES,
  type Governo,
  type Posicao,
} from "@/lib/governo";

const ORDEM: Posicao[] = ["base", "independente", "oposicao"];

// Distribui as cadeiras em fileiras de meia-lua, da esquerda para a direita.
function cadeiras(total: number) {
  const fileiras = total > 200 ? 9 : 5;
  const raioInicial = 90;
  const passo = (280 - raioInicial) / (fileiras - 1);
  const raios = Array.from({ length: fileiras }, (_, i) => raioInicial + i * passo);
  const soma = raios.reduce((a, b) => a + b, 0);
  const lugares = raios.flatMap((raio) => {
    const quantidade = Math.round((raio / soma) * total);
    return Array.from({ length: quantidade }, (_, i) => {
      const angulo = Math.PI - (i / Math.max(1, quantidade - 1)) * Math.PI;
      return { x: 300 + raio * Math.cos(angulo), y: 295 - raio * Math.sin(angulo), angulo };
    });
  });
  return lugares.sort((a, b) => b.angulo - a.angulo).slice(0, total);
}

function Plenario(props: { titulo: string; total: number; contagem: Record<Posicao, number> }) {
  const { titulo, total, contagem } = props;
  const lugares = cadeiras(total);
  const posicoes = ORDEM.flatMap((posicao) => new Array<Posicao>(contagem[posicao]).fill(posicao));
  const raio = total > 200 ? 6.5 : 10;

  return (
    <figure className="plenario">
      <figcaption className="titulo-bloco">{titulo}</figcaption>
      <svg
        viewBox="0 0 600 310"
        role="img"
        aria-label={`${titulo}: ${contagem.base} na base, ${contagem.independente} independentes e ${contagem.oposicao} na oposição`}
      >
        {lugares.map((lugar, indice) => (
          <circle
            key={indice}
            cx={lugar.x}
            cy={lugar.y}
            r={raio}
            className={`cadeira cadeira-${posicoes[indice] ?? "independente"}`}
          />
        ))}
      </svg>
      <ul className="legenda">
        {ORDEM.map((posicao) => (
          <li key={posicao}>
            <span className={`cadeira-marca cadeira-${posicao}`} />
            {NOME_POSICAO[posicao]}: {contagem[posicao]}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function PassoCongresso({ governo, candidato }: { governo: Governo; candidato: Candidato }) {
  const resumo = resumoDoCongresso(governo, candidato);

  return (
    <div className="formulario">
      <p className="ajuda">
        Bancadas reais eleitas em 2026, com a projeção do Senado para 2027. O apoio não é automático. Para mudar a base, volte aos ministérios.
      </p>
      <div className="plenarios">
        <Plenario titulo="Câmara dos Deputados" total={DEPUTADOS} contagem={resumo.deputados} />
        <Plenario titulo="Senado Federal" total={SENADORES} contagem={resumo.senadores} />
      </div>

      <dl className="placar placar-duplo">
        <div>
          <dt>Votos prováveis na Câmara</dt>
          <dd>{resumo.provaveis.deputados}</dd>
          <p>257 aprovam lei complementar, 308 aprovam emenda</p>
        </div>
        <div>
          <dt>Votos prováveis no Senado</dt>
          <dd>{resumo.provaveis.senadores}</dd>
          <p>41 aprovam lei complementar, 49 aprovam emenda</p>
        </div>
      </dl>

      <div className="tabela-rolagem">
        <table className="tabela-partidos">
          <thead>
            <tr>
              <th scope="col">Partido</th>
              <th scope="col">Deputados</th>
              <th scope="col">Senadores</th>
              <th scope="col">Pastas</th>
              <th scope="col">Posição</th>
            </tr>
          </thead>
          <tbody>
            {resumo.partidos.map((partido) => (
              <tr key={partido.sigla}>
                <th scope="row">{partido.sigla}</th>
                <td>{partido.deputados}</td>
                <td>{partido.senadores}</td>
                <td>{partido.pastas}</td>
                <td>{NOME_POSICAO[partido.posicao]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
