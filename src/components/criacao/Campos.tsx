"use client";

import type { ReactNode } from "react";

export function Campo(props: { rotulo: string; ajuda?: string; children: ReactNode }) {
  return (
    <label className="campo">
      <span className="rotulo">{props.rotulo}</span>
      {props.children}
      {props.ajuda && <span className="ajuda">{props.ajuda}</span>}
    </label>
  );
}

export function Selecao(props: {
  rotulo: string;
  valor: string | null;
  vazio: string;
  opcoes: { id: string; nome: string }[];
  aoMudar: (valor: string | null) => void;
}) {
  return (
    <Campo rotulo={props.rotulo}>
      <select
        value={props.valor ?? ""}
        onChange={(evento) => props.aoMudar(evento.target.value || null)}
      >
        <option value="">{props.vazio}</option>
        {props.opcoes.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.nome}
          </option>
        ))}
      </select>
    </Campo>
  );
}

// Um cartão de escolha única. O rádio nativo cuida do teclado e dos leitores de tela.
export function Cartao(props: {
  nome: string;
  marcado: boolean;
  aoMarcar: () => void;
  children: ReactNode;
}) {
  return (
    <label className={props.marcado ? "cartao-opcao marcado" : "cartao-opcao"}>
      <input type="radio" name={props.nome} checked={props.marcado} onChange={props.aoMarcar} />
      {props.children}
    </label>
  );
}

export function Eixo(props: {
  rotulo: string;
  esquerda: string;
  direita: string;
  valor: number;
  aoMudar: (valor: number) => void;
}) {
  return (
    <label className="campo">
      <span className="rotulo">{props.rotulo}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={props.valor}
        aria-valuetext={`${props.valor} de 100, de ${props.esquerda} a ${props.direita}`}
        onChange={(evento) => props.aoMudar(Number(evento.target.value))}
      />
      <span className="eixo-pontas">
        <span>{props.esquerda}</span>
        <span>{props.direita}</span>
      </span>
    </label>
  );
}
