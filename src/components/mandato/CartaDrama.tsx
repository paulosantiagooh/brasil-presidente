"use client";

import { useEffect, useRef, useState } from "react";
import { cenaDoAcontecimento } from "@/lib/cenas";
import { PERSONAGENS } from "@/lib/drama";
import { tocar } from "@/lib/sons";
import { CenaAnimada } from "../cenas/CenaAnimada";

function iniciais(nome: string) {
  return nome
    .replace(/^(Dra?\.|Deputado|Coronel|Dona)\s/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("");
}

export function Rosto({ quem }: { quem: string }) {
  const pessoa = PERSONAGENS[quem];
  return (
    <div className="rosto">
      <span className="rosto-foto" style={{ background: pessoa.cor }} aria-hidden="true">
        {iniciais(pessoa.nome)}
      </span>
      <span>
        <strong>{pessoa.nome}</strong>
        <span className="ajuda rosto-papel">{pessoa.papel}</span>
      </span>
    </div>
  );
}

function Relogio({ segundos, aoAcabar }: { segundos: number; aoAcabar: () => void }) {
  const [restante, setRestante] = useState(segundos);
  const acabar = useRef(aoAcabar);

  useEffect(() => {
    acabar.current = aoAcabar;
  });

  useEffect(() => {
    const fim = Date.now() + segundos * 1000;
    const relogio = window.setInterval(() => {
      const faltam = Math.max(0, Math.ceil((fim - Date.now()) / 1000));
      setRestante((antes) => {
        if (faltam !== antes && faltam <= 5 && faltam > 0) tocar("tique");
        return faltam;
      });
      if (faltam === 0) {
        window.clearInterval(relogio);
        acabar.current();
      }
    }, 200);
    return () => window.clearInterval(relogio);
  }, [segundos]);

  return (
    <div className="relogio-urgente" role="timer">
      <span className="cronometro-numero">{restante}s</span>
      <span className="barra" aria-hidden="true">
        <span style={{ width: `${(restante / segundos) * 100}%` }} />
      </span>
    </div>
  );
}

type Props = {
  id: string;
  quem: string;
  titulo: string;
  texto: string;
  capitulo?: string;
  urgente?: number;
  opcoes: string[];
  aoEscolher: (indice: number | null) => void;
};

export function CartaDrama({ id, quem, titulo, texto, capitulo, urgente, opcoes, aoEscolher }: Props) {
  useEffect(() => {
    if (urgente) tocar("urgente");
  }, [urgente]);

  return (
    <section className={urgente ? "carta carta-urgente" : "carta"} aria-labelledby="titulo-carta">
      {urgente && <p className="faixa-urgente">Urgente</p>}
      <CenaAnimada cena={cenaDoAcontecimento(id, titulo)} chave={`carta-${id}`} />
      {capitulo && <p className="sobretitulo">{capitulo}</p>}
      <h1 id="titulo-carta" className="titulo-tela">
        {titulo}
      </h1>
      <Rosto quem={quem} />
      <p className="fala">{texto}</p>
      {urgente ? <Relogio segundos={urgente} aoAcabar={() => aoEscolher(null)} /> : null}
      <div className="respostas respostas-carta">
        {opcoes.map((opcao, indice) => (
          <button key={opcao} type="button" className="resposta" onClick={() => aoEscolher(indice)}>
            {opcao}
          </button>
        ))}
      </div>
    </section>
  );
}

export function RespostaCarta(props: {
  quem: string;
  resposta: string;
  mudancas: { texto: string; bom: boolean }[];
  comentarios?: { usuario: string; texto: string }[];
  aoSeguir: () => void;
}) {
  const { quem, resposta, mudancas, comentarios, aoSeguir } = props;
  const positivas = mudancas.filter((m) => m.bom).length;

  useEffect(() => {
    tocar(positivas * 2 >= mudancas.length ? "bom" : "ruim");
  }, [positivas, mudancas.length]);

  return (
    <section className="carta" aria-labelledby="titulo-resposta">
      <h1 id="titulo-resposta" className="sobretitulo">
        O que aconteceu
      </h1>
      <Rosto quem={quem} />
      <p className="fala fala-resultado">{resposta}</p>
      <ul className="mudancas">
        {mudancas.map((mudanca) => (
          <li key={mudanca.texto} className={mudanca.bom ? "mudanca-boa" : "mudanca-ruim"}>
            {mudanca.bom ? "▲" : "▼"} {mudanca.texto}
          </li>
        ))}
      </ul>
      {comentarios && comentarios.length > 0 && (
        <ul className="redes">
          {comentarios.map((comentario) => (
            <li key={comentario.usuario + comentario.texto}>
              <span className="dado">{comentario.usuario}</span> {comentario.texto}
            </li>
          ))}
        </ul>
      )}
      <footer className="rodape-passo">
        <span />
        <button type="button" className="botao botao-destaque" onClick={aoSeguir}>
          Continuar
        </button>
      </footer>
    </section>
  );
}
