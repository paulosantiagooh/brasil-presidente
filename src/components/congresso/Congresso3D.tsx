"use client";

import { useEffect, useRef, useState } from "react";
import type { BancadaNaCena, Visao } from "./cena-congresso";

const VISOES: { id: Visao; nome: string }[] = [
  { id: "predio", nome: "Prédio" },
  { id: "camara", nome: "Câmara" },
  { id: "senado", nome: "Senado" },
];

// A biblioteca 3D só é baixada quando esta tela abre, para não pesar no resto do jogo.
export function Congresso3D({ partidos }: { partidos: BancadaNaCena[] }) {
  const area = useRef<HTMLDivElement>(null);
  const irPara = useRef<((visao: Visao) => void) | null>(null);
  const [visao, setVisao] = useState<Visao>("predio");
  const [informacao, setInformacao] = useState("Carregando o Congresso...");
  const [falhou, setFalhou] = useState(false);
  const chave = JSON.stringify(partidos);

  useEffect(() => {
    let cancelado = false;
    let destruir: (() => void) | undefined;
    import("./cena-congresso")
      .then(({ montarCena }) => {
        if (cancelado || !area.current) return;
        const cena = montarCena(area.current, {
          partidos: JSON.parse(chave) as BancadaNaCena[],
          aoTrocarVisao: setVisao,
          aoInformar: setInformacao,
        });
        irPara.current = cena.irPara;
        destruir = cena.destruir;
      })
      .catch(() => setFalhou(true));
    return () => {
      cancelado = true;
      destruir?.();
    };
  }, [chave]);

  if (falhou) {
    return <p className="ajuda">Este aparelho não abriu a visão em 3D. O plenário abaixo mostra os mesmos dados.</p>;
  }

  return (
    <figure className="congresso-3d">
      <div className="acoes" role="group" aria-label="Escolher a visão do Congresso">
        {VISOES.map(({ id, nome }) => (
          <button
            key={id}
            type="button"
            className={visao === id ? "botao botao-destaque" : "botao"}
            aria-pressed={visao === id}
            onClick={() => irPara.current?.(id)}
          >
            {nome}
          </button>
        ))}
      </div>
      <div ref={area} className="congresso-3d-area" role="img" aria-label="Congresso Nacional em 3D. Arraste para girar." />
      <figcaption className="ajuda" role="status">
        {informacao} Arraste para girar.
      </figcaption>
    </figure>
  );
}
