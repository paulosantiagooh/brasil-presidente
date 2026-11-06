"use client";

import { useEffect, useRef, useState } from "react";
import { lerConfig, useConfig } from "@/lib/config";
import { CENAS, type TipoCena } from "@/lib/cenas";
import { abaixarMusica } from "@/lib/musica";
import { ambiente } from "@/lib/sons";
import { ALTURA, DURACAO, LARGURA, pintarCena } from "./quadros";

// Ao voltar para uma tela, a cena que já passou fica parada no último quadro.
const jaVistas = new Set<string>();

function semMovimento() {
  return lerConfig().movimento === "reduzido" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CenaAnimada({ cena, legenda, chave, rolar }: { cena: TipoCena; legenda?: string; chave?: string; rolar?: boolean }) {
  const config = useConfig();
  const tela = useRef<HTMLCanvasElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const [voltas, setVoltas] = useState(0);
  const [terminou, setTerminou] = useState(false);
  const marca = chave ?? cena;
  const texto = legenda ?? CENAS[cena].legenda;
  const ligada = config.cenas !== "desligadas";

  useEffect(() => {
    const canvas = tela.current;
    const c = canvas?.getContext("2d");
    if (!canvas || !c) return;

    const ajustar = () => {
      const largura = Math.min(1280, Math.round(canvas.clientWidth * Math.min(2, window.devicePixelRatio || 1)));
      if (largura === 0) return;
      canvas.width = largura;
      canvas.height = Math.round((largura * ALTURA) / LARGURA);
      c.setTransform(canvas.width / LARGURA, 0, 0, canvas.width / LARGURA, 0, 0);
    };
    const parar = (t: number) => {
      ajustar();
      pintarCena(c, cena, t);
      if (barra.current) barra.current.style.width = "100%";
      setTerminou(true);
    };

    if (semMovimento()) {
      parar(3.9);
      return;
    }
    if (jaVistas.has(marca) && voltas === 0) {
      parar(DURACAO);
      return;
    }

    ajustar();
    setTerminou(false);
    if (rolar) canvas.scrollIntoView({ block: "center", behavior: "smooth" });
    const som = CENAS[cena].som;
    const pararSom = som ? ambiente(som) : () => {};
    const voltarMusica = abaixarMusica();
    let quadro = 0;
    let anterior = performance.now();
    let tempo = 0;

    const desenhar = (agora: number) => {
      // Com a aba escondida o tempo não anda, e a cena continua de onde parou.
      tempo = Math.min(DURACAO, tempo + Math.min(0.1, (agora - anterior) / 1000));
      anterior = agora;
      pintarCena(c, cena, tempo);
      if (barra.current) barra.current.style.width = `${(tempo / DURACAO) * 100}%`;
      if (tempo >= DURACAO) {
        jaVistas.add(marca);
        setTerminou(true);
        voltarMusica();
        return;
      }
      quadro = requestAnimationFrame(desenhar);
    };
    quadro = requestAnimationFrame(desenhar);

    return () => {
      cancelAnimationFrame(quadro);
      pararSom();
      voltarMusica();
    };
  }, [cena, marca, voltas, ligada, rolar]);

  if (!ligada) return null;

  return (
    <figure className="cena">
      <canvas ref={tela} className="cena-tela" width={LARGURA} height={ALTURA} role="img" aria-label={`Cena ilustrativa: ${texto}`} />
      <figcaption className="cena-faixa">
        <span className="cena-selo">Edição extra</span>
        <span className="cena-texto">{texto}</span>
      </figcaption>
      <span className="cena-aviso">Cena ilustrativa · Simulação</span>
      <span className="cena-progresso" aria-hidden="true">
        <span ref={barra} />
      </span>
      {terminou && !semMovimento() && (
        <button type="button" className="cena-rever" onClick={() => setVoltas((v) => v + 1)}>
          ↻ Rever
        </button>
      )}
    </figure>
  );
}
