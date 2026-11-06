"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { lerConfig } from "@/lib/config";
import { Trilha } from "./Trilha";
import { criarPartida, formatarData, marcarComoJogada, usePartidas } from "@/lib/partidas";
import { Janela } from "./Janela";
import { PainelConfiguracoes } from "./PainelConfiguracoes";
import { PainelPartidas } from "./PainelPartidas";

type JanelaAberta = "partidas" | "configuracoes" | null;

export function MenuPrincipal() {
  const router = useRouter();
  const partidas = usePartidas();
  const [janela, setJanela] = useState<JanelaAberta>(null);
  const ultima = partidas[0];

  function abrirPartida(id: string) {
    marcarComoJogada(id);
    router.push(`/partida/?id=${id}`);
  }

  function novoJogo() {
    const partida = criarPartida(lerConfig().dificuldade);
    router.push(`/partida/?id=${partida.id}`);
  }

  return (
    <>
      <Trilha nome="abertura" />
      <nav className="menu" aria-label="Menu principal">
        <button type="button" className="item-menu item-principal" onClick={novoJogo}>
          <span className="item-rotulo">Novo jogo</span>
          <span className="item-ajuda">Crie o seu candidato</span>
        </button>
        <button
          type="button"
          className="item-menu"
          disabled={!ultima}
          onClick={() => ultima && abrirPartida(ultima.id)}
        >
          <span className="item-rotulo">Continuar</span>
          <span className="item-ajuda">
            {ultima
              ? `${ultima.nome} · ${formatarData(ultima.atualizadaEm)}`
              : "Nenhuma partida salva"}
          </span>
        </button>
        <button type="button" className="item-menu" onClick={() => setJanela("partidas")}>
          <span className="item-rotulo">Carregar partida</span>
          <span className="item-ajuda">
            {partidas.length === 1 ? "1 salva" : `${partidas.length} salvas`}
          </span>
        </button>
        <button type="button" className="item-menu" onClick={() => setJanela("configuracoes")}>
          <span className="item-rotulo">Configurações</span>
          <span className="item-ajuda">Dificuldade, texto e animações</span>
        </button>
      </nav>

      <Janela
        aberta={janela === "partidas"}
        titulo="Carregar partida"
        aoFechar={() => setJanela(null)}
      >
        <PainelPartidas aoCarregar={abrirPartida} />
      </Janela>
      <Janela
        aberta={janela === "configuracoes"}
        titulo="Configurações"
        aoFechar={() => setJanela(null)}
      >
        <PainelConfiguracoes />
      </Janela>
    </>
  );
}
