"use client";

import { useEffect, useState } from "react";
import type { TipoCena } from "@/lib/cenas";
import { pedirTrilha } from "@/lib/musica";
import { Bandeira } from "../Bandeira";
import { Hino } from "../Hino";
import { CenaAnimada } from "../cenas/CenaAnimada";

type Etapa = { id: string; cena: TipoCena; titulo: string; texto: string };

// A cerimônia de posse: cortejo, Hino Nacional, faixa presidencial e o primeiro discurso.
export function Posse({ nome, ano, reeleito, aoTerminar }: { nome: string; ano: number; reeleito: boolean; aoTerminar: () => void }) {
  const etapas: Etapa[] = [
    {
      id: "desfile",
      cena: "desfile",
      titulo: "O cortejo",
      texto:
        "Em carro aberto, com escolta da cavalaria de gala, você atravessa a Esplanada até o Congresso. No plenário, faz o compromisso de manter, defender e cumprir a Constituição, observar as leis e promover o bem geral do povo brasileiro.",
    },
    {
      id: "hino",
      cena: "hasteamento",
      titulo: "Hino Nacional",
      texto: "Todos de pé, em silêncio. A Bandeira sobe no mastro diante do Palácio do Planalto, e o Hino Nacional é tocado. Se preferir, você pode pular.",
    },
    ...(reeleito
      ? []
      : [
          {
            id: "faixa",
            cena: "faixa" as TipoCena,
            titulo: "A faixa presidencial",
            texto: "No alto da rampa do Planalto, quem deixa o cargo passa a faixa verde e amarela para você. A partir de agora, a caneta é sua.",
          },
        ]),
    {
      id: "parlatorio",
      cena: "posse",
      titulo: "O povo na praça",
      texto: reeleito
        ? "Do parlatório, você agradece pelo segundo mandato. A praça responde com bandeiras e gritos."
        : "Do parlatório, você fala ao país pela primeira vez como presidente da República. A praça explode.",
    },
  ];
  const [indice, setIndice] = useState(0);
  const [hinoTocando, setHinoTocando] = useState(false);
  const etapa = etapas[indice];
  const ultima = indice === etapas.length - 1;

  useEffect(() => {
    // Durante o Hino, a trilha do jogo fica em silêncio.
    pedirTrilha(etapa.id === "hino" ? "silencio" : "abertura");
  }, [etapa.id]);

  return (
    <section className="posse" aria-labelledby="titulo-posse">
      <div className="posse-topo">
        <Bandeira className="posse-bandeira" />
        <p className="sobretitulo">
          1º de janeiro de {ano} · Posse presidencial · Simulação
        </p>
      </div>
      <ol className="posse-passos" aria-label="Etapas da cerimônia">
        {etapas.map((e, i) => (
          <li key={e.id} className={i === indice ? "atual" : i < indice ? "feito" : ""}>
            {e.titulo}
          </li>
        ))}
      </ol>
      <CenaAnimada key={etapa.id} cena={etapa.cena} legenda={etapa.titulo} chave={`posse-${ano}-${etapa.id}`} />
      <h1 id="titulo-posse" className="titulo-tela">
        {etapa.titulo}
      </h1>
      <p className="texto-tela">{etapa.texto}</p>
      {etapa.id === "hino" && (
        <blockquote className="hino">
          <p>
            Ouviram do Ipiranga às margens plácidas
            <br />
            De um povo heroico o brado retumbante,
            <br />E o sol da Liberdade, em raios fúlgidos,
            <br />
            Brilhou no céu da Pátria nesse instante.
          </p>
          <footer className="ajuda">Primeira estrofe.</footer>
        </blockquote>
      )}
      {etapa.id === "hino" && <Hino id="nacional" aoMudar={setHinoTocando} />}
      {ultima && <p className="chamada-posse">{nome}, presidente da República Federativa do Brasil.</p>}
      <footer className="rodape-passo">
        {indice > 0 ? (
          <button type="button" className="botao" onClick={() => setIndice(indice - 1)}>
            Voltar
          </button>
        ) : (
          <button type="button" className="botao" onClick={aoTerminar}>
            Pular a cerimônia
          </button>
        )}
        <button
          type="button"
          className="botao botao-destaque"
          onClick={() => {
            if (ultima) aoTerminar();
            else setIndice(indice + 1);
            window.scrollTo({ top: 0 });
          }}
        >
          {ultima ? "Começar a governar" : etapa.id === "hino" && hinoTocando ? "Pular o Hino" : "Continuar"}
        </button>
      </footer>
    </section>
  );
}
