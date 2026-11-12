"use client";

import { useEffect, useState } from "react";
import { lerConfig } from "@/lib/config";
import type { Dialogo } from "@/lib/dialogos";
import { Bandeira } from "../Bandeira";
import { CenaAnimada } from "../cenas/CenaAnimada";

function semMovimento() {
  return lerConfig().movimento === "reduzido" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fundo do pronunciamento: cortina, Bandeira e tribuna, só com CSS e SVG.
function Palco() {
  return (
    <div className="palco" aria-hidden="true">
      <span className="palco-ao-vivo">● Ao vivo · Cadeia nacional</span>
      <Bandeira className="palco-bandeira" />
      <svg className="palco-tribuna" viewBox="0 0 200 120">
        <circle cx="100" cy="30" r="15" fill="#0b1520" />
        <path d="M68 70 Q100 40 132 70 L136 120 L64 120 Z" fill="#0b1520" />
        <path d="M60 78 H140 L132 120 H68 Z" fill="#5b3a22" />
        <rect x="60" y="74" width="80" height="6" fill="#7a5030" />
        <circle cx="100" cy="96" r="9" fill="#d9b45a" />
      </svg>
    </div>
  );
}

// Cena de diálogo reutilizável: as falas aparecem uma a uma, e dá para avançar ou pular.
export function CenaDialogo({ dialogo, mes, aoEscolher }: { dialogo: Dialogo; mes: string; aoEscolher: (indice: number) => void }) {
  const [fala, setFala] = useState(0);
  const [letras, setLetras] = useState(0);
  const [tudo, setTudo] = useState(false);
  const atual = dialogo.falas[fala] ?? "";
  const fimDaFala = tudo || letras >= atual.length;
  const ultima = fala >= dialogo.falas.length - 1;

  useEffect(() => {
    if (semMovimento()) setTudo(true);
  }, []);

  useEffect(() => {
    if (tudo || letras >= atual.length) return;
    const relogio = window.setTimeout(() => setLetras((n) => n + 2), 22);
    return () => window.clearTimeout(relogio);
  }, [tudo, letras, atual.length]);

  function avancar() {
    if (!fimDaFala) setLetras(atual.length);
    else if (!ultima) {
      setFala(fala + 1);
      setLetras(0);
    }
  }

  const mostrarOpcoes = tudo || (ultima && fimDaFala);
  const iniciais = dialogo.quem.nome
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <section className={`dialogo dialogo-${dialogo.id}`} aria-labelledby="titulo-dialogo">
      {dialogo.fundo === "palco" ? <Palco /> : <CenaAnimada cena={dialogo.fundo} legenda={dialogo.titulo} chave={`dialogo-${dialogo.id}`} />}
      <p className="sobretitulo">
        {mes} · {dialogo.sobretitulo}
      </p>
      <h1 id="titulo-dialogo" className="titulo-tela">
        {dialogo.titulo}
      </h1>
      <div className="dialogo-caixa">
        <div className="rosto">
          <span className="rosto-foto" style={{ background: dialogo.quem.cor }} aria-hidden="true">
            {iniciais}
          </span>
          <span>
            <strong>{dialogo.quem.nome}</strong>
            <span className="ajuda rosto-papel">{dialogo.quem.papel}</span>
          </span>
        </div>
        {tudo ? (
          dialogo.falas.map((texto) => (
            <p key={texto} className="dialogo-fala">
              {texto}
            </p>
          ))
        ) : (
          <p className="dialogo-fala" aria-live="polite">
            {atual.slice(0, letras)}
            {!fimDaFala && <span className="cursor" aria-hidden="true" />}
          </p>
        )}
        {!mostrarOpcoes && (
          <div className="dialogo-controles">
            <button type="button" className="botao" onClick={() => setTudo(true)}>
              Pular
            </button>
            <button type="button" className="botao botao-destaque" onClick={avancar}>
              Avançar
            </button>
          </div>
        )}
      </div>
      {mostrarOpcoes && (
        <div className="respostas respostas-carta">
          {dialogo.opcoes.map((opcao, indice) => (
            <button key={opcao.texto} type="button" className="resposta" onClick={() => aoEscolher(indice)}>
              {opcao.texto}
            </button>
          ))}
        </div>
      )}
      <p className="ajuda aviso-simulacao">Cena fictícia. Ninguém real disse estas falas.</p>
    </section>
  );
}
