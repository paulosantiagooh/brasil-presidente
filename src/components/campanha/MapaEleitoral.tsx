"use client";

import { useState } from "react";
import { situacaoNoEstado, type Campanha, type PesquisaUf } from "@/lib/campanha";
import { ESTADOS, estadoDe } from "@/lib/estados";
import { ALTURA_MAPA, LARGURA_MAPA } from "@/lib/mapa";
import { CAMINHOS_UF } from "@/lib/mapa-ufs";
import type { Disputante } from "./PainelCampanha";

type Metrica = "lider" | "intencao" | "rejeicao" | "indecisos";

const METRICAS: { id: Metrica; nome: string }[] = [
  { id: "lider", nome: "Quem lidera" },
  { id: "intencao", nome: "Sua intenção de voto" },
  { id: "rejeicao", nome: "Sua rejeição" },
  { id: "indecisos", nome: "Indecisos" },
];

function valorDa(metrica: Metrica, dados: PesquisaUf) {
  if (metrica === "rejeicao") return dados.rejeicao;
  if (metrica === "indecisos") return dados.indecisos;
  return dados.votos[0];
}

function lider(dados: PesquisaUf) {
  return dados.votos.indexOf(Math.max(...dados.votos));
}

export function MapaEleitoral({ campanha, nomes }: { campanha: Campanha; nomes: Disputante[] }) {
  const [metrica, setMetrica] = useState<Metrica>("lider");
  const [uf, setUf] = useState("SP");
  const pesquisas = campanha.pesquisas;
  const pesquisa = pesquisas[pesquisas.length - 1];
  const anterior = pesquisas[pesquisas.length - 2];
  const dados = pesquisa.ufs[uf];
  const estado = estadoDe(uf);
  const eventos = campanha.eventosRegionais.filter((e) => e.uf === uf);
  const variacao = anterior ? dados.votos[0] - anterior.ufs[uf].votos[0] : null;
  const nomesCurtos = nomes.map((n) => n.nome);

  const valores = ESTADOS.map((e) => valorDa(metrica, pesquisa.ufs[e.uf]));
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);

  function corDe(sigla: string) {
    const item = pesquisa.ufs[sigla];
    if (metrica === "lider") return `var(--candidato-${lider(item)})`;
    const parte = maximo === minimo ? 60 : 15 + ((valorDa(metrica, item) - minimo) / (maximo - minimo)) * 85;
    return `color-mix(in srgb, var(--turquesa) ${parte.toFixed(0)}%, var(--superficie))`;
  }

  const lideres = [...new Set(ESTADOS.map((e) => lider(pesquisa.ufs[e.uf])))].sort((a, b) => a - b);
  const ranking = nomes
    .map((disputante, indice) => ({ ...disputante, indice, voto: dados.votos[indice] }))
    .sort((a, b) => b.voto - a.voto);

  return (
    <div className="mapa-eleitoral">
      <div className="mapa-area">
        <div className="filtros">
          <label className="campo">
            <span className="rotulo">Mostrar</span>
            <select value={metrica} onChange={(e) => setMetrica(e.target.value as Metrica)}>
              {METRICAS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </label>
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
        </div>

        <svg
          className="mapa-ufs"
          viewBox={`0 0 ${LARGURA_MAPA} ${ALTURA_MAPA}`}
          role="group"
          aria-label="Mapa eleitoral do Brasil"
        >
          {ESTADOS.map((e) => (
            <path
              key={e.uf}
              d={CAMINHOS_UF[e.uf]}
              fill={corDe(e.uf)}
              className={e.uf === uf ? "uf selecionada" : "uf"}
              role="button"
              tabIndex={0}
              aria-label={`${e.nome}: ${situacaoNoEstado(pesquisa.ufs[e.uf], nomesCurtos)}`}
              aria-pressed={e.uf === uf}
              onClick={() => setUf(e.uf)}
              onKeyDown={(evento) => {
                if (evento.key === "Enter" || evento.key === " ") {
                  evento.preventDefault();
                  setUf(e.uf);
                }
              }}
            >
              <title>{`${e.nome}: ${valorDa(metrica === "lider" ? "intencao" : metrica, pesquisa.ufs[e.uf])}%`}</title>
            </path>
          ))}
        </svg>

        {metrica === "lider" ? (
          <ul className="legenda">
            {lideres.map((indice) => (
              <li key={indice}>
                <span style={{ background: `var(--candidato-${indice})` }} />
                {indice === 0 ? "Você" : nomes[indice].nome}
              </li>
            ))}
          </ul>
        ) : (
          <div className="legenda-escala">
            <span>{minimo}%</span>
            <span className="escala" aria-hidden="true" />
            <span>{maximo}%</span>
          </div>
        )}
      </div>

      <section className="painel-uf" aria-live="polite">
        <p className="sobretitulo">
          {estado.regiao} · {estado.eleitorado.toLocaleString("pt-BR")}% do eleitorado
        </p>
        <h2 className="titulo-bloco">{estado.nome}</h2>
        <p className="situacao">{situacaoNoEstado(dados, nomesCurtos)}</p>

        <dl className="ficha-dados">
          <div>
            <dt>Sua intenção</dt>
            <dd>
              {dados.votos[0]}%
              {variacao !== null && variacao !== 0 && ` (${variacao > 0 ? "+" : ""}${variacao})`}
            </dd>
          </div>
          <div>
            <dt>Sua rejeição</dt>
            <dd>{dados.rejeicao}%</dd>
          </div>
          <div>
            <dt>Indecisos</dt>
            <dd>{dados.indecisos}%</dd>
          </div>
        </dl>

        <h3 className="rotulo">Pesquisa no estado</h3>
        <ul className="barras-candidatos">
          {ranking.map((item) => (
            <li key={item.nome}>
              <span className="barra-nome">
                <span>
                  {item.nome} ({item.sigla})
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

        <h3 className="rotulo">Eventos regionais</h3>
        {eventos.length === 0 ? (
          <p className="ajuda">Nenhum evento recente neste estado.</p>
        ) : (
          <ul className="diario">
            {eventos.map((evento) => (
              <li key={`${evento.semana}-${evento.titulo}`}>
                Semana {evento.semana}: {evento.titulo}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
