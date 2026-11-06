"use client";

import { useState } from "react";
import {
  acoesRestantes,
  CATALOGO,
  executarAcao,
  fecharSemana,
  GRUPOS,
  NOME_INDICADOR,
  podeDebater,
  SEMANAS_DE_DEBATE,
  TEMAS,
  type Acao,
  type Campanha,
  type Indicadores,
  type TipoAcao,
} from "@/lib/campanha";
import type { Candidato } from "@/lib/candidato";
import type { Dificuldade } from "@/lib/config";
import { ESTADOS, REGIOES, type Regiao } from "@/lib/estados";
import { ALTURA_MAPA, LARGURA_MAPA } from "@/lib/mapa";
import { CAMINHOS_UF } from "@/lib/mapa-ufs";
import { Janela } from "../Janela";

type Props = {
  campanha: Campanha;
  candidato: Candidato;
  dificuldade: Dificuldade;
  atualizar: (mudar: (c: Campanha) => Campanha) => void;
};

type TipoComEscolha = Exclude<TipoAcao, "entrevista" | "debate">;

const ESTADOS_POR_ELEITORADO = [...ESTADOS].sort((a, b) => b.eleitorado - a.eleitorado);

const ROTULO_ESCOLHA: Record<TipoComEscolha, string> = {
  comicio: "Em qual estado?",
  visita: "Qual estado visitar?",
  evento: "Em qual região?",
  proposta: "Qual proposta?",
  encontro: "Com qual grupo?",
};

function opcoesDe(tipo: TipoComEscolha) {
  if (tipo === "evento") return REGIOES.map((r) => ({ id: r, nome: r as string }));
  if (tipo === "proposta") return TEMAS;
  if (tipo === "encontro") return GRUPOS;
  return ESTADOS_POR_ELEITORADO.map((e) => ({
    id: e.uf,
    nome: `${e.nome} (${e.eleitorado.toLocaleString("pt-BR")}% do eleitorado)`,
  }));
}

function montarAcao(tipo: TipoComEscolha, valor: string): Acao {
  if (tipo === "evento") return { tipo, regiao: valor as Regiao };
  if (tipo === "proposta") return { tipo, tema: valor };
  if (tipo === "encontro") return { tipo, grupo: valor };
  return { tipo, uf: valor };
}

// Clique no estado para escolher o destino.
function MapaEscolha({ valor, aoEscolher }: { valor: string; aoEscolher: (uf: string) => void }) {
  return (
    <svg className="mapa-ufs mapa-escolha" viewBox={`0 0 ${LARGURA_MAPA} ${ALTURA_MAPA}`} role="group" aria-label="Escolha o estado no mapa">
      {ESTADOS.map((estado) => (
        <path
          key={estado.uf}
          d={CAMINHOS_UF[estado.uf]}
          fill={estado.uf === valor ? "var(--turquesa)" : "var(--superficie-alta)"}
          className={estado.uf === valor ? "uf selecionada" : "uf"}
          role="button"
          tabIndex={0}
          aria-label={estado.nome}
          aria-pressed={estado.uf === valor}
          onClick={() => aoEscolher(estado.uf)}
          onKeyDown={(evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
              evento.preventDefault();
              aoEscolher(estado.uf);
            }
          }}
        >
          <title>{estado.nome}</title>
        </path>
      ))}
    </svg>
  );
}

export function Agenda({ campanha, candidato, dificuldade, atualizar }: Props) {
  const [escolha, setEscolha] = useState<TipoComEscolha | null>(null);
  const [valor, setValor] = useState("");
  const restantes = acoesRestantes(campanha);
  const debateDaSemana = SEMANAS_DE_DEBATE.includes(campanha.semana);
  const debateFeito = campanha.acoes.some((a) => a.tipo === "debate");

  function clicar(tipo: TipoAcao) {
    if (tipo === "entrevista" || tipo === "debate") {
      atualizar((c) => executarAcao(c, candidato, { tipo }));
      return;
    }
    setValor(opcoesDe(tipo)[0].id);
    setEscolha(tipo);
  }

  function confirmar() {
    if (!escolha) return;
    const acao = montarAcao(escolha, valor);
    atualizar((c) => executarAcao(c, candidato, acao));
    setEscolha(null);
  }

  function indisponivel(tipo: TipoAcao, custo: number) {
    if (tipo === "debate") return !podeDebater(campanha);
    return restantes < custo;
  }

  function aviso(tipo: TipoAcao) {
    if (tipo !== "debate") return null;
    if (debateFeito) return "Debate feito";
    if (!debateDaSemana) return `Só nas semanas ${SEMANAS_DE_DEBATE.join(" e ")}`;
    if (restantes < 2) return "Precisa de 2 ações livres";
    return "Debate marcado para esta semana";
  }

  return (
    <div className="agenda">
      <div>
        <h2 className="titulo-bloco">O que fazer agora</h2>
        <ul className="lista-acoes">
          {CATALOGO.map(({ tipo, nome, descricao, custo }) => (
            <li key={tipo}>
              <button
                type="button"
                className="acao"
                disabled={indisponivel(tipo, custo)}
                onClick={() => clicar(tipo)}
              >
                <span className="cartao-topo">
                  <strong>{nome}</strong>
                  <span className="dado">
                    {custo} {custo === 1 ? "ação" : "ações"}
                  </span>
                </span>
                <span className="ajuda">{aviso(tipo) ?? descricao}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <aside className="coluna-agenda">
        <section>
          <h2 className="titulo-bloco">Esta semana</h2>
          {campanha.acoes.length === 0 ? (
            <p className="ajuda">Nenhuma ação feita ainda.</p>
          ) : (
            <ol className="diario">
              {campanha.acoes.map((acao, indice) => (
                <li key={indice}>{acao.texto}</li>
              ))}
            </ol>
          )}
          {debateDaSemana && !debateFeito && (
            <p className="alerta">Tem debate nesta semana. Faltar reduz credibilidade e popularidade.</p>
          )}
          <button
            type="button"
            className={restantes === 0 ? "botao botao-destaque largo" : "botao largo"}
            onClick={() => atualizar((c) => fecharSemana(c, dificuldade))}
          >
            {restantes === 0
              ? "Encerrar a semana"
              : `Encerrar com ${restantes} ${restantes === 1 ? "ação livre" : "ações livres"}`}
          </button>
        </section>

        <section>
          <h2 className="titulo-bloco">Sua campanha</h2>
          <ul className="atributos">
            {(Object.keys(NOME_INDICADOR) as (keyof Indicadores)[]).map((chave) => (
              <li key={chave}>
                <span>{NOME_INDICADOR[chave]}</span>
                <span className="barra" aria-hidden="true">
                  <span style={{ width: `${campanha.indicadores[chave]}%` }} />
                </span>
                <strong>{campanha.indicadores[chave]}</strong>
              </li>
            ))}
          </ul>
        </section>

        {campanha.promessas.length > 0 && (
          <section>
            <h2 className="titulo-bloco">Promessas</h2>
            <ul className="diario">
              {campanha.promessas.map((promessa) => (
                <li key={promessa}>{promessa}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <Janela
        aberta={escolha !== null}
        titulo={escolha ? (CATALOGO.find((a) => a.tipo === escolha)?.nome ?? "") : ""}
        aoFechar={() => setEscolha(null)}
      >
        {escolha && (
          <div className="formulario">
            {(escolha === "comicio" || escolha === "visita") && (
              <MapaEscolha valor={valor} aoEscolher={setValor} />
            )}
            <label className="campo">
              <span className="rotulo">{ROTULO_ESCOLHA[escolha]}</span>
              <select value={valor} onChange={(e) => setValor(e.target.value)}>
                {opcoesDe(escolha).map((opcao) => (
                  <option key={opcao.id} value={opcao.id}>
                    {opcao.nome}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="botao botao-destaque" onClick={confirmar}>
              Confirmar
            </button>
          </div>
        )}
      </Janela>
    </div>
  );
}
