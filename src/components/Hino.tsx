"use client";

import { useEffect, useRef, useState } from "react";
import { useConfig } from "@/lib/config";
import { enderecoDoHino, HINOS, type IdHino } from "@/lib/hinos";

function tempo(segundos: number) {
  const s = Math.max(0, Math.floor(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// Toca um hino a partir do começo. Com o som desligado, só toca se a pessoa pedir.
export function Hino({ id, aoTerminar, aoMudar }: { id: IdHino; aoTerminar?: () => void; aoMudar?: (tocando: boolean) => void }) {
  const { som } = useConfig();
  const audio = useRef<HTMLAudioElement>(null);
  const terminar = useRef(aoTerminar);
  const [estado, setEstado] = useState<"parado" | "tocando" | "fim" | "bloqueado">("parado");
  const [atual, setAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const hino = HINOS[id];

  useEffect(() => {
    terminar.current = aoTerminar;
  });

  useEffect(() => {
    aoMudar?.(estado === "tocando");
  }, [estado, aoMudar]);

  useEffect(() => {
    const elemento = audio.current;
    if (!elemento || som === "desligado") return;
    elemento.currentTime = 0;
    elemento.volume = 0.85;
    elemento.play().then(
      () => setEstado("tocando"),
      () => setEstado("bloqueado"),
    );
    return () => elemento.pause();
  }, [id, som]);

  function tocar() {
    const elemento = audio.current;
    if (!elemento) return;
    elemento.currentTime = 0;
    void elemento.play().then(() => setEstado("tocando"));
  }

  return (
    <div className="hino-player">
      <audio
        ref={audio}
        src={enderecoDoHino(id)}
        preload="auto"
        onLoadedMetadata={(e) => setDuracao(e.currentTarget.duration)}
        onTimeUpdate={(e) => setAtual(e.currentTarget.currentTime)}
        onEnded={() => {
          setEstado("fim");
          terminar.current?.();
        }}
      />
      <div className="hino-player-topo">
        <strong>♪ {hino.nome}</strong>
        <span className="dado">
          {tempo(atual)} / {duracao ? tempo(duracao) : "--:--"}
        </span>
      </div>
      <span className="barra" aria-hidden="true">
        <span style={{ width: duracao ? `${(atual / duracao) * 100}%` : "0%" }} />
      </span>
      {estado !== "tocando" && (
        <button type="button" className="botao" onClick={tocar}>
          {estado === "fim" ? "Ouvir de novo" : `Tocar o ${hino.nome}`}
        </button>
      )}
      <p className="ajuda">{hino.credito}</p>
    </div>
  );
}
