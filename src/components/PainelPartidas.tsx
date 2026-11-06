"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { NOME_DIFICULDADE } from "@/lib/config";
import { apagarPartida, exportarPartidas, formatarData, importarPartidas, usePartidas } from "@/lib/partidas";

type Props = {
  aoCarregar: (id: string) => void;
};

export function PainelPartidas({ aoCarregar }: Props) {
  const partidas = usePartidas();
  const [apagando, setApagando] = useState<string | null>(null);

  const [aviso, setAviso] = useState("");
  const arquivo = useRef<HTMLInputElement>(null);

  function baixar() {
    const url = URL.createObjectURL(new Blob([exportarPartidas()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "brasil-presidente-partidas.json";
    link.click();
    URL.revokeObjectURL(url);
    setAviso("Arquivo salvo. Abra o jogo no outro aparelho e use Importar.");
  }

  async function importar(evento: ChangeEvent<HTMLInputElement>) {
    const escolhido = evento.target.files?.[0];
    evento.target.value = "";
    if (!escolhido) return;
    try {
      const total = importarPartidas(await escolhido.text());
      setAviso(total === 1 ? "1 partida importada." : `${total} partidas importadas.`);
    } catch {
      setAviso("Não consegui ler esse arquivo. Use um arquivo exportado pelo jogo.");
    }
  }

  const transferir = (
    <div className="bloco espaco-topo">
      <p className="rotulo">Levar para outro aparelho</p>
      <p className="ajuda">Exporte as partidas para um arquivo e importe no outro aparelho.</p>
      <div className="acoes">
        <button type="button" className="botao" disabled={partidas.length === 0} onClick={baixar}>
          Exportar
        </button>
        <button type="button" className="botao" onClick={() => arquivo.current?.click()}>
          Importar
        </button>
        <input ref={arquivo} className="arquivo" type="file" accept=".json,application/json" aria-label="Arquivo de partidas" onChange={importar} />
      </div>
      {aviso && <p className="ajuda" role="status">{aviso}</p>}
    </div>
  );

  if (partidas.length === 0) {
    return (
      <>
        <div className="vazio">
          <p className="vazio-titulo">Nenhuma partida salva</p>
          <p>Comece um novo jogo. Ele é salvo automaticamente neste aparelho.</p>
        </div>
        {transferir}
      </>
    );
  }

  return (
    <>
    <ul className="partidas">
      {partidas.map((partida) => (
        <li key={partida.id} className="partida">
          <div className="partida-dados">
            <p className="partida-nome">
              {partida.candidato?.nomeUrna.trim() || partida.nome}
            </p>
            <p className="dado">
              Eleição {partida.cenario} · {NOME_DIFICULDADE[partida.dificuldade]}
            </p>
            <p className="dado">Salva em {formatarData(partida.atualizadaEm)}</p>
          </div>
          {apagando === partida.id ? (
            <div className="acoes">
              <button
                type="button"
                className="botao botao-perigo"
                onClick={() => {
                  apagarPartida(partida.id);
                  setApagando(null);
                }}
              >
                Confirmar
              </button>
              <button type="button" className="botao" onClick={() => setApagando(null)}>
                Manter
              </button>
            </div>
          ) : (
            <div className="acoes">
              <button
                type="button"
                className="botao botao-destaque"
                onClick={() => aoCarregar(partida.id)}
              >
                Carregar
              </button>
              <button type="button" className="botao" onClick={() => setApagando(partida.id)}>
                Apagar
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
    {transferir}
    </>
  );
}
