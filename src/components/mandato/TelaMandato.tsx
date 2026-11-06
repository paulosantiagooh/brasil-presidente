"use client";

import Link from "next/link";
import { useState } from "react";
import type { Campanha } from "@/lib/campanha";
import type { Candidato } from "@/lib/candidato";
import type { Governo } from "@/lib/governo";
import {
  ACOES_POR_MES,
  defenderImpeachment,
  encerrarMes,
  fecharPendencia,
  indicacaoLivre,
  indicacaoPolitica,
  indicar,
  nomeDoMes,
  promessasDoMandato,
  responderEvento,
  type Contexto,
  type Mandato,
} from "@/lib/mandato";
import { DEFESAS_IMPEACHMENT } from "@/lib/mandato-dados";
import { atualizarGoverno, atualizarMandato, disputarReeleicao, type Partida } from "@/lib/partidas";
import { POLITICOS } from "@/lib/pessoas";
import { BuscaPessoa } from "../BuscaPessoa";
import {
  Painel,
  PainelCongresso,
  PainelDiplomacia,
  PainelEconomia,
  PainelEstatais,
  PainelInstituicoes,
  PainelMedidas,
  PainelMinistros,
  PainelObras,
  PainelOrcamento,
  PainelRelatorios,
  PainelSociedade,
} from "./Areas";
import { numero } from "./Comum";
import { TelaVotacao } from "./Votacao";

const ABAS = [
  { id: "painel", nome: "Painel" },
  { id: "medidas", nome: "Medidas" },
  { id: "ministros", nome: "Ministros" },
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

function TelaIndicacao(props: {
  mandato: Mandato;
  contexto: Contexto;
  atualizar: (mudar: (m: Mandato) => Mandato) => void;
}) {
  const { mandato, contexto, atualizar } = props;
  const [nome, setNome] = useState("");
  if (mandato.pendencia?.tipo !== "indicacao") return null;
  const { vaga } = mandato.pendencia;

  return (
    <section className="boletim" aria-labelledby="titulo-indicacao">
      <p className="sobretitulo">
        {nomeDoMes(mandato.mes)} · Indicação: {vaga.orgao}
      </p>
      <h1 id="titulo-indicacao" className="titulo-tela">
        {vaga.cargo}
      </h1>
      <p className="texto-tela">{vaga.regra}</p>
      <h2 className="titulo-bloco espaco-topo">Nomes técnicos</h2>
      <p className="ajuda">Personagens fictícios, com mais chance no Senado.</p>
      <div className="respostas">
        {vaga.opcoes.map((opcao) => (
          <button
            key={opcao.nome}
            type="button"
            className="resposta"
            onClick={() => atualizar((m) => indicar(m, contexto, opcao))}
          >
            {opcao.nome}. {opcao.perfil}
          </button>
        ))}
      </div>
      <div className="bloco espaco-topo">
        <label className="campo">
          <span className="rotulo">Escrever outro nome</span>
          <input value={nome} maxLength={60} autoComplete="off" onChange={(e) => setNome(e.target.value)} />
        </label>
        <button
          type="button"
          className="botao"
          disabled={nome.trim().length < 3}
          onClick={() => atualizar((m) => indicar(m, contexto, indicacaoLivre(nome.trim())))}
        >
          Indicar
        </button>
      </div>
      {vaga.politicos && (
        <>
          <h2 className="titulo-bloco espaco-topo">Nomes políticos</h2>
          <p className="ajuda">
            Uma escolha política agrada a base, mas reduz a confiança nas instituições. Cenário hipotético.
          </p>
          <BuscaPessoa
            pessoas={POLITICOS}
            aoEscolher={(pessoa) => atualizar((m) => indicar(m, contexto, indicacaoPolitica(pessoa, contexto)))}
          />
        </>
      )}
    </section>
  );
}

function TelaPendencia(props: {
  mandato: Mandato;
  contexto: Contexto;
  atualizar: (mudar: (m: Mandato) => Mandato) => void;
}) {
  const { mandato, contexto, atualizar } = props;
  const pendencia = mandato.pendencia;
  if (!pendencia) return null;

  if (pendencia.tipo === "impeachment") {
    return (
      <section className="boletim" aria-labelledby="titulo-impeachment">
        <p className="sobretitulo">{nomeDoMes(mandato.mes)} · Crise política</p>
        <h1 id="titulo-impeachment" className="titulo-tela">
          Pedido de impeachment
        </h1>
        <p className="texto-tela">
          Com {numero(mandato.aprovacao, 0)}% de aprovação e pouco apoio no Congresso, a Câmara vai votar a
          abertura do processo. O governo precisa de 172 deputados para barrar. Se perder, o Senado decide, e
          o governo precisa de 28 senadores. Como você reage?
        </p>
        <ul className="lista-acoes espaco-topo">
          {DEFESAS_IMPEACHMENT.map((defesa) => (
            <li key={defesa.id}>
              <button
                type="button"
                className="acao"
                onClick={() => atualizar((m) => defenderImpeachment(m, contexto, defesa.id))}
              >
                <strong>{defesa.nome}</strong>
                <span className="ajuda">{defesa.resumo}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (pendencia.tipo === "votacao") {
    return <TelaVotacao mandato={mandato} contexto={contexto} atualizar={atualizar} />;
  }

  if (pendencia.tipo === "indicacao") {
    return <TelaIndicacao mandato={mandato} contexto={contexto} atualizar={atualizar} />;
  }

  if (pendencia.tipo === "resultado-indicacao") {
    return (
      <section className="boletim" aria-labelledby="titulo-pendencia">
        <p className="sobretitulo">{nomeDoMes(mandato.mes)} · Sabatina no Senado</p>
        <h1 id="titulo-pendencia" className="titulo-tela">
          {pendencia.titulo}
        </h1>
        <p className="texto-tela">
          {pendencia.texto.includes("precisava")
            ? `${pendencia.texto}: teve ${pendencia.sim}, contra ${pendencia.nao}.`
            : `${pendencia.texto}: ${pendencia.sim} votos a favor e ${pendencia.nao} contra. São necessários 41.`}
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

  const { evento } = pendencia;

  return (
    <section className="boletim" aria-labelledby="titulo-pendencia">
      <p className="sobretitulo">
        {nomeDoMes(mandato.mes)} · {evento.tema}
      </p>
      <h1 id="titulo-pendencia" className="titulo-tela">
        {evento.titulo}
      </h1>
      <p className="texto-tela">{evento.texto}</p>
      <div className="respostas">
        {evento.opcoes.map((opcao, indice) => (
          <button
            key={opcao.texto}
            type="button"
            className="resposta"
            onClick={() => atualizar((m) => responderEvento(m, indice))}
          >
            {opcao.texto}
          </button>
        ))}
      </div>
    </section>
  );
}

type LinhaBalanco = { nome: string; inicio: number; fim: number; casas: number; sufixo: string; melhor: "maior" | "menor" | null };

function linhasDoBalanco(m: Mandato): { titulo: string; linhas: LinhaBalanco[] }[] {
  const { economia: e0, sociedade: s0, seguranca: p0 } = m.inicio;
  const { economia: e, sociedade: s, seguranca: p } = m;
  const linha = (nome: string, inicio: number, fim: number, melhor: LinhaBalanco["melhor"], casas = 1, sufixo = "") => ({ nome, inicio, fim, melhor, casas, sufixo });
  return [
    {
      titulo: "Governo",
      linhas: [
        linha("Aprovação", m.inicio.aprovacao, m.aprovacao, "maior", 0, "%"),
        linha("Relação com o Congresso", m.inicio.congresso, m.congresso, "maior", 0),
      ],
    },
    {
      titulo: "Economia",
      linhas: [
        linha("PIB", e0.pib, e.pib, "maior", 1, "%"),
        linha("IPCA", e0.ipca, e.ipca, "menor", 1, "%"),
        linha("Selic", e0.selic, e.selic, "menor", 2, "%"),
        linha("Dólar (R$)", e0.dolar, e.dolar, "menor", 2),
        linha("Desemprego", e0.desemprego, e.desemprego, "menor", 1, "%"),
        linha("Dívida pública", e0.divida, e.divida, "menor", 1, "% do PIB"),
        linha("Resultado primário", e0.primario, e.primario, "maior", 1, "% do PIB"),
        linha("Renda", e0.renda, e.renda, "maior"),
        linha("Investimentos", e0.investimento, e.investimento, "maior", 1, "% do PIB"),
        linha("Exportações (US$ bi)", e0.exportacoes, e.exportacoes, "maior", 0),
        linha("Reservas (US$ bi)", e0.reservas, e.reservas, "maior", 0),
        linha("Confiança", e0.confianca, e.confianca, "maior", 0),
        linha("Pobreza", e0.pobreza, e.pobreza, "menor", 1, "%"),
        linha("Desigualdade", e0.desigualdade, e.desigualdade, "menor", 3),
        linha("Informalidade", e0.informalidade, e.informalidade, "menor", 1, "%"),
      ],
    },
    {
      titulo: "Sociedade",
      linhas: [
        linha("Saúde", s0.saude, s.saude, "maior", 0),
        linha("Educação", s0.educacao, s.educacao, "maior", 0),
        linha("Qualidade de vida", s0.qualidade, s.qualidade, "maior", 0),
        linha("Confiança nas instituições", s0.confianca, s.confianca, "maior", 0),
        linha("Meio ambiente", s0.ambiente, s.ambiente, "maior", 0),
      ],
    },
    {
      titulo: "Segurança e defesa",
      linhas: [
        linha("Homicídios (por 100 mil)", p0.homicidios, p.homicidios, "menor"),
        linha("Roubos e furtos", p0.roubos, p.roubos, "menor", 0),
        linha("Crime organizado", p0.crime, p.crime, "menor", 0),
        linha("Sistema prisional", p0.prisional, p.prisional, "menor", 0, "%"),
        linha("Eficiência policial", p0.eficiencia, p.eficiencia, "maior", 0),
        linha("Defesa nacional", p0.defesa, p.defesa, "maior", 0),
      ],
    },
  ];
}

function veredito(l: LinhaBalanco) {
  const margem = Math.max(Math.abs(l.inicio) * 0.01, 0.05 / 10 ** (l.casas - 1));
  const diferenca = l.fim - l.inicio;
  if (Math.abs(diferenca) < margem) return "Estável";
  const subiu = diferenca > 0;
  return subiu === (l.melhor === "maior") ? "Melhorou" : "Piorou";
}

function TelaFim({ partida, mandato, campanha, candidato }: { partida: Partida; mandato: Mandato; campanha: Campanha; candidato: Candidato }) {
  const reeleicao = mandato.reeleicao;
  const promessas = promessasDoMandato(mandato, campanha);
  const cumpridas = promessas.filter((p) => p.cumprida).length;
  const obras = mandato.obras.filter((o) => o.situacao === "concluida").length;
  const grupos = linhasDoBalanco(mandato);
  const todas = grupos.flatMap((g) => g.linhas).map(veredito);
  const melhoraram = todas.filter((v) => v === "Melhorou").length;
  const pioraram = todas.filter((v) => v === "Piorou").length;
  const aprovados = mandato.indicados.filter((i) => i.aprovado);
  const segundo = mandato.limite > 48;
  const perdeu = reeleicao?.venceu === false;
  // Lula já estaria no segundo mandato seguido: a Constituição não permite o terceiro.
  const terceiroMandato = candidato.pessoaReal === "lula";
  const podeDisputar = !mandato.cassado && !segundo && !reeleicao && !terceiroMandato;

  return (
    <section className="campanha" aria-labelledby="titulo-fim">
      <p className="sobretitulo">{mandato.cassado ? nomeDoMes(mandato.mes) : `Dezembro de ${segundo ? 2034 : 2030}`} · Fim do mandato · Simulação</p>
      <h1 id="titulo-fim" className="titulo-tela">
        {mandato.cassado
          ? "O mandato foi interrompido"
          : segundo
            ? "Fim do segundo mandato"
            : perdeu
              ? "O governo perdeu a reeleição"
              : "Fim do primeiro mandato"}
      </h1>
      <p className="texto-tela">
        {mandato.cassado
          ? `${candidato.nomeUrna} deixou o governo depois de um impeachment.`
          : segundo
            ? `${candidato.nomeUrna} completou oito anos de governo. A Constituição não permite um terceiro mandato seguido.`
            : perdeu
              ? `A candidatura à reeleição terminou com ${numero(reeleicao?.votos ?? 0)}% dos votos válidos.`
              : terceiroMandato
                ? "Este seria o segundo mandato seguido, e a Constituição não permite um terceiro. A partida termina aqui."
                : "O país volta às urnas. A Constituição permite uma reeleição. Veja como você entrega o governo."}
      </p>
      <dl className="placar">
        <div>
          <dt>Melhoraram</dt>
          <dd>{melhoraram}</dd>
          <p>de {todas.length} indicadores</p>
        </div>
        <div>
          <dt>Pioraram</dt>
          <dd>{pioraram}</dd>
          <p>de {todas.length} indicadores</p>
        </div>
        <div>
          <dt>Obras entregues</dt>
          <dd>{obras}</dd>
        </div>
        <div>
          <dt>Aprovados no Congresso</dt>
          <dd>{mandato.votacoes.filter((v) => v.aprovado).length}</dd>
          <p>de {mandato.votacoes.length} votações</p>
        </div>
      </dl>

      <h2 className="titulo-bloco espaco-topo">Como você recebeu e como entregou o país</h2>
      {grupos.map((grupo) => (
        <div key={grupo.titulo} className="tabela-rolagem espaco-topo">
          <table className="tabela-partidos tabela-balanco">
            <caption>{grupo.titulo}</caption>
            <thead>
              <tr>
                <th scope="col">Indicador</th>
                <th scope="col">Posse</th>
                <th scope="col">Fim</th>
                <th scope="col">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {grupo.linhas.map((l) => {
                const resultado = veredito(l);
                return (
                  <tr key={l.nome}>
                    <th scope="row">{l.nome}</th>
                    <td>
                      {numero(l.inicio, l.casas)}
                      {l.sufixo}
                    </td>
                    <td>
                      {numero(l.fim, l.casas)}
                      {l.sufixo}
                    </td>
                    <td className={`veredito-${resultado.toLowerCase()}`}>{resultado}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      <div className="bloco espaco-topo">
        <h2 className="titulo-bloco">O legado do governo</h2>
        {promessas.length > 0 && (
          <p>
            Promessas cumpridas: {cumpridas} de {promessas.length}.
          </p>
        )}
        <p>Medidas escritas por você: {mandato.medidas.length}.</p>
        {aprovados.length > 0 && (
          <ul className="diario">
            {aprovados.map((i) => (
              <li key={i.vaga + i.mes}>
                {i.cargo}: {i.nome}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="ajuda aviso-simulacao">
        Resultado inventado pelo jogo, sem relação com a realidade ou com previsões.
      </p>
      <footer className="rodape-passo">
        <span />
        {podeDisputar ? (
          <button
            type="button"
            className="botao botao-destaque"
            onClick={() => {
              disputarReeleicao(partida.id);
              window.scrollTo({ top: 0 });
            }}
          >
            Disputar a reeleição
          </button>
        ) : (
          <Link className="botao botao-destaque" href="/">
            Voltar ao menu
          </Link>
        )}
      </footer>
    </section>
  );
}

function sinal(valor: number, casas = 1) {
  return `${valor > 0 ? "+" : ""}${numero(valor, casas)}`;
}

export function TelaMandato({ partida, mandato, governo, campanha, candidato }: Props) {
  const [aba, setAba] = useState<Aba>("painel");
  const contexto: Contexto = { governo, candidato };
  const atualizar = (mudar: (m: Mandato) => Mandato) => atualizarMandato(partida.id, mudar);
  const props = { mandato, contexto, atualizar };
  const e = mandato.economia;

  if (mandato.fase === "fim") {
    return <TelaFim partida={partida} mandato={mandato} campanha={campanha} candidato={candidato} />;
  }
  if (mandato.fase === "pendencia") return <TelaPendencia {...props} />;

  return (
    <section className="campanha" aria-labelledby="titulo-mandato">
      <p className="sobretitulo">
        Mês {mandato.mes} de {mandato.limite} · Simulação
      </p>
      <div className="topo-mandato">
        <h1 id="titulo-mandato" className="titulo-tela">
          {nomeDoMes(mandato.mes)}
        </h1>
        <button
          type="button"
          className={mandato.acoes === 0 ? "botao botao-destaque" : "botao"}
          onClick={() => {
            atualizar((m) => encerrarMes(m, contexto));
            window.scrollTo({ top: 0 });
          }}
        >
          {mandato.mes === mandato.limite ? "Encerrar o mandato" : "Encerrar o mês"}
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

      {mandato.resumoMes && (
        <p className="resumo-mes" role="status">
          <strong>{nomeDoMes(mandato.resumoMes.mes)}:</strong> aprovação {sinal(mandato.resumoMes.aprovacao)} · PIB{" "}
          {sinal(mandato.resumoMes.pib)} · IPCA {sinal(mandato.resumoMes.ipca)} · desemprego{" "}
          {sinal(mandato.resumoMes.desemprego)}
        </p>
      )}
      {mandato.noticias[0]?.mes === mandato.mes && (
        <p className="ultima-acao" role="status">
          {mandato.noticias[0].texto}
        </p>
      )}

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
      {aba === "medidas" && <PainelMedidas {...props} />}
      {aba === "ministros" && (
        <PainelMinistros
          {...props}
          aoTrocar={(id, pessoa) =>
            atualizarGoverno(partida.id, (g) => ({ ...g, ministros: { ...g.ministros, [id]: pessoa.id } }))
          }
        />
      )}
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
