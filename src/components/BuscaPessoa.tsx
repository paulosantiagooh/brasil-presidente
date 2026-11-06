"use client";

import { useMemo, useState, type ReactNode } from "react";
import { semAcento, type Pessoa } from "@/lib/pessoas";

const LIMITE = 24;

type Props = {
  pessoas: Pessoa[];
  selecionado?: string | null;
  aoEscolher: (pessoa: Pessoa) => void;
  detalhe?: (pessoa: Pessoa) => ReactNode;
};

// Procura por nome, partido ou estado entre todos os políticos do jogo.
export function BuscaPessoa({ pessoas, selecionado, aoEscolher, detalhe }: Props) {
  const [busca, setBusca] = useState("");
  const [partido, setPartido] = useState("todos");
  const siglas = useMemo(
    () => [...new Set(pessoas.map((p) => p.sigla ?? "Técnico"))].sort((a, b) => a.localeCompare(b)),
    [pessoas],
  );
  const termo = semAcento(busca.trim());
  const encontrados = pessoas.filter(
    (p) =>
      (partido === "todos" || (p.sigla ?? "Técnico") === partido) &&
      semAcento(`${p.nome} ${p.sigla ?? ""} ${p.uf}`).includes(termo),
  );
  const visiveis = encontrados.slice(0, LIMITE);

  return (
    <div className="busca-pessoa">
      <div className="filtros">
        <label className="campo">
          <span className="rotulo">Procurar</span>
          <input
            type="search"
            value={busca}
            placeholder="Nome, partido ou estado"
            autoComplete="off"
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
        <label className="campo">
          <span className="rotulo">Partido</span>
          <select value={partido} onChange={(e) => setPartido(e.target.value)}>
            <option value="todos">Todos</option>
            {siglas.map((sigla) => (
              <option key={sigla}>{sigla}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="ajuda" role="status">
        {encontrados.length === 1 ? "1 nome encontrado" : `${encontrados.length} nomes encontrados`}
        {encontrados.length > LIMITE ? `, mostrando ${LIMITE}. Procure para achar os demais.` : "."}
      </p>
      <ul className="lista-pessoas">
        {visiveis.map((pessoa) => (
          <li key={pessoa.id}>
            <button
              type="button"
              className={pessoa.id === selecionado ? "acao acao-marcada" : "acao"}
              aria-pressed={pessoa.id === selecionado}
              onClick={() => aoEscolher(pessoa)}
            >
              <span className="cartao-topo">
                <strong>{pessoa.nome}</strong>
                <span className="dado">
                  {pessoa.sigla ?? "Técnico"} · {pessoa.uf}
                </span>
              </span>
              <span className="ajuda">{pessoa.cargo}</span>
              {detalhe?.(pessoa)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
