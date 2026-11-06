"use client";

import Link from "next/link";
import { useState } from "react";
import type { Campanha } from "@/lib/campanha";
import type { Candidato } from "@/lib/candidato";
import type { Governo } from "@/lib/governo";
import {
  ACOES_POR_MES,
  encerrarMes,
  fecharPendencia,
  indicar,
  MESES,
  nomeDoMes,
  promessasDoMandato,
  responderEvento,
  type Contexto,
  type Mandato,
} from "@/lib/mandato";
import { atualizarMandato, type Partida } from "@/lib/partidas";
import {
  Painel,
  PainelCongresso,
  PainelDiplomacia,
  PainelEconomia,
  PainelEstatais,
  PainelInstituicoes,
  PainelObras,
  PainelOrcamento,
  PainelRelatorios,
  PainelSociedade,
} from "./Areas";
import { numero } from "./Comum";

const ABAS = [
  { id: "painel", nome: "Painel" },
  { id: "economia", nome: "Economia" },
  { id: "orcamento", nome: "Orçamento" },
  { id: "sociedade", nome: "Sociedade" },
  { id: "obras", nome: "Obras" },
  { id: "estatais", nome: "Estatais" },
  { id: "congresso", nome: "Congresso" },
  { id: "instituicoes", nome: "Instituições" },
  { id: "diplomacia", nome: "Diplomacia" },
  { id: "relatorios", nome: "Relatórios" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

type Props = {
  partida: Partida;
  mandato: Mandato;
  governo: Governo;
  campanha: Campanha;
  candidato: Candidato;
};

function TelaPendencia(props: {
  mandato: Mandato;
  contexto: Contexto;
  atualizar: (mudar: (m: Mandato) => Mandato) => void;
}) {
  const { mandato, contexto, atualizar } = props;
  const pendencia = mandato.pendencia;
  if (!pendencia) return null;

  if (pendencia.tipo === "resultado-indicacao") {
    return (
      <section className="boletim" aria-labelledby="titulo-pendencia">
        <p className="sobretitulo">{nomeDoMes(mandato.mes)} · Sabatina no Senado</p>
        <h1 id="titulo-pendencia" className="titulo-tela">
          {pendencia.titulo}
        </h1>
        <p className="texto-tela">
          {pendencia.texto}: {pendencia.sim} votos a favor e {pendencia.nao} contra. São necessários 41.
        </p>
        <footer className="rodape-passo">
          <span />
          <button type="button" className="botao botao-destaque" onClick={() => atualizar(fecharPendencia)}>
            Continuar
          </button>
        </footer>
      </section>
    );
  }

  const indicacao = pendencia.tipo === "indicacao";
  const titulo = indicacao ? pendencia.vaga.cargo : pendencia.evento.titulo;
  const texto = indicacao ? pendencia.vaga.regra : pendencia.evento.texto;
  const opcoes = indicacao
    ? pendencia.vaga.opcoes.map((o) => `${o.nome}. ${o.perfil}`)
    : pendencia.evento.opcoes.map((o) => o.texto);

  return (
    <section className="boletim" aria-labelledby="titulo-pendencia">
      <p className="sobretitulo">
        {nomeDoMes(mandato.mes)} · {indicacao ? `Indicação: ${pendencia.vaga.orgao}` : pendencia.evento.tema}
      </p>
      <h1 id="titulo-pendencia" className="titulo-tela">
        {titulo}
      </h1>
      <p className="texto-tela">{texto}</p>
      {indicacao && <p className="ajuda">Os nomes são personagens fictícios.</p>}
      <div className="respostas">
        {opcoes.map((opcao, indice) => (
          <button
            key={opcao}
            type="button"
            className="resposta"
            onClick={() =>
              atualizar((m) => (indicacao ? indicar(m, contexto, indice) : responderEvento(m, indice)))
            }
          >
            {opcao}
          </button>
        ))}
      </div>
    </section>
  );
}

function TelaFim({ mandato, campanha, candidato }: { mandato: Mandato; campanha: Campanha; candidato: Candidato }) {
  const reeleicao = mandato.reeleicao;
  const promessas = promessasDoMandato(mandato, campanha);
  const cumpridas = promessas.filter((p) => p.cumprida).length;
  const obras = mandato.obras.filter((o) => o.situacao === "concluida").length;
  const { economia: e } = mandato;
  return (
    <section className="campanha" aria-labelledby="titulo-fim">
      <p className="sobretitulo">Dezembro de 2034 · Fim do mandato · Simulação</p>
      <h1 id="titulo-fim" className="titulo-tela">
        {reeleicao?.venceu ? `Reeleição de ${candidato.nomeUrna}` : "O mandato chegou ao fim"}
      </h1>
      <p className="texto-tela">
        {reeleicao?.venceu
          ? `A eleição de 2034 terminou com ${numero(reeleicao.votos)}% dos votos válidos para o seu governo.`
          : `Na eleição de 2034, sua candidatura à reeleição terminou com ${numero(reeleicao?.votos ?? 0)}% dos votos válidos.`}
      </p>
      <dl className="placar">
        <div>
          <dt>Aprovação final</dt>
          <dd>{numero(mandato.aprovacao, 0)}%</dd>
        </div>
        <div>
          <dt>PIB</dt>
          <dd>{numero(e.pib)}%</dd>
        </div>
        <div>
          <dt>Inflação</dt>
          <dd>{numero(e.ipca)}%</dd>
        </div>
        <div>
          <dt>Dívida</dt>
          <dd>{numero(e.divida)}%</dd>
        </div>
      </dl>
      <div className="bloco espaco-topo">
        <p>Obras entregues: {obras}.</p>
        <p>Projetos aprovados: {mandato.projetosAprovados.length}.</p>
        {promessas.length > 0 && (
          <p>
            Promessas cumpridas: {cumpridas} de {promessas.length}.
          </p>
        )}
      </div>
      <p className="ajuda aviso-simulacao">
        Resultado inventado pelo jogo, sem relação com a realidade ou com previsões.
      </p>
      <footer className="rodape-passo">
        <span />
        <Link className="botao botao-destaque" href="/">
          Voltar ao menu
        </Link>
      </footer>
    </section>
  );
}

export function TelaMandato({ partida, mandato, governo, campanha, candidato }: Props) {
  const [aba, setAba] = useState<Aba>("painel");
  const contexto: Contexto = { governo, candidato };
  const atualizar = (mudar: (m: Mandato) => Mandato) => atualizarMandato(partida.id, mudar);
  const props = { mandato, contexto, atualizar };
  const e = mandato.economia;

  if (mandato.fase === "fim") {
    return <TelaFim mandato={mandato} campanha={campanha} candidato={candidato} />;
  }
  if (mandato.fase === "pendencia") return <TelaPendencia {...props} />;

  return (
    <section className="campanha" aria-labelledby="titulo-mandato">
      <p className="sobretitulo">
        Mês {mandato.mes} de {MESES} · Simulação
      </p>
      <div className="topo-mandato">
        <h1 id="titulo-mandato" className="titulo-tela">
          {nomeDoMes(mandato.mes)}
        </h1>
        <button
          type="button"
          className={mandato.acoes === 0 ? "botao botao-destaque" : "botao"}
          onClick={() => {
            atualizar(encerrarMes);
            window.scrollTo({ top: 0 });
          }}
        >
          {mandato.mes === MESES ? "Encerrar o mandato" : "Encerrar o mês"}
        </button>
      </div>

      <dl className="placar placar-mandato">
        <div>
          <dt>Aprovação</dt>
          <dd>{numero(mandato.aprovacao, 0)}%</dd>
        </div>
        <div>
          <dt>PIB</dt>
          <dd>{numero(e.pib)}%</dd>
        </div>
        <div>
          <dt>IPCA</dt>
          <dd>{numero(e.ipca)}%</dd>
        </div>
        <div>
          <dt>Selic</dt>
          <dd>{numero(e.selic, 2)}%</dd>
        </div>
        <div>
          <dt>Desemprego</dt>
          <dd>{numero(e.desemprego)}%</dd>
        </div>
        <div>
          <dt>Ações</dt>
          <dd>
            {mandato.acoes} de {ACOES_POR_MES}
          </dd>
        </div>
      </dl>

      <nav className="abas" aria-label="Áreas do governo">
        {ABAS.map(({ id, nome }) => (
          <button
            key={id}
            type="button"
            className={aba === id ? "aba ativa" : "aba"}
            aria-current={aba === id ? "page" : undefined}
            onClick={() => setAba(id)}
          >
            {nome}
          </button>
        ))}
      </nav>

      {aba === "painel" && <Painel mandato={mandato} campanha={campanha} />}
      {aba === "economia" && <PainelEconomia {...props} />}
      {aba === "orcamento" && <PainelOrcamento {...props} />}
      {aba === "sociedade" && <PainelSociedade {...props} />}
      {aba === "obras" && <PainelObras {...props} />}
      {aba === "estatais" && <PainelEstatais {...props} />}
      {aba === "congresso" && <PainelCongresso {...props} />}
      {aba === "instituicoes" && <PainelInstituicoes mandato={mandato} />}
      {aba === "diplomacia" && <PainelDiplomacia {...props} />}
      {aba === "relatorios" && <PainelRelatorios mandato={mandato} />}
    </section>
  );
}
