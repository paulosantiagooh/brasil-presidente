"use client";

import { useEffect, useRef, useState } from "react";
import {
  descreverEfeito,
  REPLICAS,
  responderPergunta,
  responderReplica,
  seguirNoDebate,
  type Campanha,
} from "@/lib/campanha";
import type { Candidato } from "@/lib/candidato";

const AVISO_SEGUNDOS = 10;

type Props = {
  campanha: Campanha;
  candidato: Candidato;
  atualizar: (mudar: (c: Campanha) => Campanha) => void;
};

function Cronometro({ total, aoAcabar }: { total: number; aoAcabar: () => void }) {
  const [restante, setRestante] = useState(total);
  const acabar = useRef(aoAcabar);

  useEffect(() => {
    acabar.current = aoAcabar;
  });

  useEffect(() => {
    const fim = Date.now() + total * 1000;
    const relogio = window.setInterval(() => {
      const faltam = Math.max(0, Math.ceil((fim - Date.now()) / 1000));
      setRestante(faltam);
      if (faltam === 0) {
        window.clearInterval(relogio);
        acabar.current();
      }
    }, 200);
    return () => window.clearInterval(relogio);
  }, [total]);

  const urgente = restante <= AVISO_SEGUNDOS;

  return (
    <div className={urgente ? "cronometro urgente" : "cronometro"}>
      <div className="cronometro-linha">
        <span className="cronometro-numero">{restante}s</span>
        {urgente && <span role="status">Faltam {AVISO_SEGUNDOS} segundos</span>}
      </div>
      <span className="barra" aria-hidden="true">
        <span style={{ width: `${(restante / total) * 100}%` }} />
      </span>
    </div>
  );
}

function RespostaPropria({ aoResponder }: { aoResponder: (texto: string) => void }) {
  const [texto, setTexto] = useState("");
  return (
    <details className="bloco espaco-topo">
      <summary>Responder com as suas palavras</summary>
      <label className="campo">
        <span className="rotulo">Sua resposta</span>
        <textarea rows={3} maxLength={300} value={texto} onChange={(e) => setTexto(e.target.value)} />
      </label>
      <button
        type="button"
        className="botao botao-destaque"
        disabled={texto.trim().length < 5}
        onClick={() => aoResponder(texto.trim())}
      >
        Responder
      </button>
    </details>
  );
}

export function TelaDebate({ campanha, candidato, atualizar }: Props) {
  const debate = campanha.debate;
  if (!debate) return null;
  const { pergunta, segundos } = debate.perguntas[debate.indice];
  const ultima = debate.indice + 1 === debate.perguntas.length;
  const responder = (resposta: number | string | null) =>
    atualizar((c) => responderPergunta(c, candidato, resposta));

  return (
    <section className="debate" aria-labelledby="titulo-debate">
      <p className="sobretitulo">
        {debate.tipo === "debate"
          ? `Debate na TV · Pergunta ${debate.indice + 1} de ${debate.perguntas.length}`
          : "Entrevista ao vivo"}{" "}
        · {pergunta.tema}
      </p>
      <h1 id="titulo-debate" className="pergunta">
        {pergunta.texto}
      </h1>

      {debate.resultado ? (
        <div className="resultado-resposta" role="status">
          <p className="rotulo">Sua resposta</p>
          <p>{debate.resultado.resposta}</p>
          <p className="rotulo">Consequências</p>
          <p className="dado">{descreverEfeito(debate.resultado.mudancas)}</p>
          {debate.resultado.replica === "pendente" ? (
            <>
              <p className="rotulo espaco-topo">Sua resposta foi contestada. Como você reage?</p>
              <div className="respostas respostas-replica">
                {REPLICAS.map((replica, indice) => (
                  <button
                    key={replica.texto}
                    type="button"
                    className="resposta"
                    onClick={() => atualizar((c) => responderReplica(c, indice))}
                  >
                    {replica.texto}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {debate.resultado.textoReplica && <p>{debate.resultado.textoReplica}</p>}
              <button
                type="button"
                className="botao botao-destaque"
                onClick={() => atualizar(seguirNoDebate)}
              >
                {ultima ? "Voltar à agenda" : "Próxima pergunta"}
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <Cronometro
            key={`${debate.indice}-${pergunta.id}`}
            total={segundos}
            aoAcabar={() => responder(null)}
          />
          <div className="respostas">
            {pergunta.opcoes.map((opcao, indice) => (
              <button
                key={opcao.texto}
                type="button"
                className="resposta"
                onClick={() => responder(indice)}
              >
                {opcao.texto}
              </button>
            ))}
          </div>
          <RespostaPropria aoResponder={responder} />
        </>
      )}
    </section>
  );
}
