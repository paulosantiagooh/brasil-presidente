"use client";

import { useEffect, useState } from "react";
import { tocar } from "@/lib/sons";
import { CenaAnimada } from "../cenas/CenaAnimada";
import { extremosOpostos } from "@/lib/candidato";
import type { Casa, Reacao, VotoPartido } from "@/lib/governo";
import {
  colocarEmVotacao,
  estimativaDeVotos,
  fecharPendencia,
  LIMITE_LIDERES,
  negociar,
  negociarComLider,
  reacoesAProposta,
  resumirEfeito,
  nomeDoMes,
  type Concessoes,
  type Contexto,
  type Mandato,
} from "@/lib/mandato";

const INTERVALO_MS = 260;

const OFERTAS: { id: "emendas" | "cargos" | "texto"; nome: string; resumo: string }[] = [
  { id: "emendas", nome: "Liberar emendas", resumo: "Ganha votos, pesa nas contas públicas." },
  { id: "cargos", nome: "Oferecer cargos", resumo: "Ganha votos, reduz a confiança nas instituições." },
  { id: "texto", nome: "Ceder no texto", resumo: "Ganha votos, reduz o efeito da medida." },
];

type Props = {
  mandato: Mandato;
  contexto: Contexto;
  atualizar: (mudar: (m: Mandato) => Mandato) => void;
};

// Placar com a linha de quantos votos são precisos.
function Placar({ sim, nao, total, necessarios }: { sim: number; nao: number; total: number; necessarios: number | null }) {
  const linha = necessarios ?? Math.floor((sim + nao) / 2) + 1;
  return (
    <div className="placar-voto" aria-hidden="true">
      <span className="voto-sim" style={{ width: `${(sim / total) * 100}%` }} />
      <span className="voto-nao" style={{ width: `${(nao / total) * 100}%` }} />
      <span className="voto-linha" style={{ left: `${(linha / total) * 100}%` }} />
    </div>
  );
}

function Painel({ titulo, casa, partidos, total }: { titulo: string; casa: Casa; partidos: number; total: number }) {
  const mostrados = casa.partidos.slice(0, partidos);
  const sim = mostrados.reduce((soma, p) => soma + p.sim, 0);
  const nao = mostrados.reduce((soma, p) => soma + p.nao, 0);
  const completo = partidos >= casa.partidos.length;
  return (
    <section className="bloco painel-voto">
      <h2 className="titulo-bloco">{titulo}</h2>
      <dl className="placar placar-duplo">
        <div>
          <dt>A favor</dt>
          <dd className="numero-sim">{sim}</dd>
        </div>
        <div>
          <dt>Contra</dt>
          <dd className="numero-nao">{nao}</dd>
        </div>
      </dl>
      <Placar sim={sim} nao={nao} total={total} necessarios={casa.necessarios} />
      <p className="ajuda">
        {casa.necessarios ? `São necessários ${casa.necessarios} votos a favor.` : "Basta a maioria dos presentes."} A linha
        marca esse número.
      </p>
      <ul className="chips-partidos">
        {mostrados.map((partido) => (
          <li
            key={partido.sigla}
            className={partido.sim > partido.nao * 2 ? "chip-voto sim" : partido.nao > partido.sim * 2 ? "chip-voto nao" : "chip-voto dividido"}
          >
            {partido.sigla} {partido.sim}–{partido.nao}
          </li>
        ))}
      </ul>
      {completo && <p className={casa.aprovado ? "situacao aprovado" : "situacao rejeitado"}>{casa.aprovado ? "Aprovado" : "Rejeitado"}</p>}
    </section>
  );
}

const NOME_REACAO: Record<Reacao, string> = { apoia: "Apoia", negocia: "Quer negociar", contra: "Contra" };

export function TelaVotacao({ mandato, contexto, atualizar }: Props) {
  const [passo, setPasso] = useState(0);
  const pendencia = mandato.pendencia;
  const votacao = pendencia?.tipo === "votacao" ? pendencia : null;
  const resultado = votacao?.resultado ?? null;
  const totalPartidos = resultado
    ? resultado.camara.partidos.length + (resultado.senado?.partidos.length ?? 0)
    : 0;

  useEffect(() => {
    if (!resultado) return;
    const relogio = window.setInterval(() => {
      setPasso((atual) => Math.min(totalPartidos, atual + 1));
    }, INTERVALO_MS);
    return () => window.clearInterval(relogio);
  }, [resultado, totalPartidos]);

  const encerrou = Boolean(resultado) && passo >= totalPartidos;
  const aprovado = resultado?.aprovado;

  useEffect(() => {
    if (encerrou) tocar(aprovado ? "martelo" : "derrota");
    else if (resultado && passo > 0) tocar("tique");
  }, [encerrou, aprovado, passo, resultado]);

  if (!votacao) return null;
  const { proposta, concessoes } = votacao;

  if (resultado) {
    const naCamara = resultado.camara.partidos.length;
    const terminou = passo >= totalPartidos;
    return (
      <section className="boletim" aria-labelledby="titulo-voto">
        <p className="sobretitulo">{nomeDoMes(mandato.mes)} · Votação em plenário</p>
        <h1 id="titulo-voto" className="titulo-tela">
          {proposta.nome}
        </h1>
        {terminou && (
          <CenaAnimada cena={resultado.aprovado ? "aprovado" : "rejeitado"} chave={`voto-${mandato.mes}-${proposta.nome}`} />
        )}
        <div className="casas-voto">
          <Painel titulo="Câmara dos Deputados" casa={resultado.camara} partidos={Math.min(passo, naCamara)} total={513} />
          {resultado.senado && passo >= naCamara && (
            <Painel titulo="Senado Federal" casa={resultado.senado} partidos={passo - naCamara} total={81} />
          )}
        </div>
        {terminou && !resultado.senado && (
          <p className="ajuda">O projeto parou na Câmara e não chegou ao Senado.</p>
        )}
        {terminou && (
          <section className="bloco espaco-topo">
            <h2 className="titulo-bloco">Quem votou como</h2>
            {(
              [
                ["Apoiaram", (p: VotoPartido) => p.sim > p.nao * 2],
                ["Rejeitaram", (p: VotoPartido) => p.nao > p.sim * 2],
                ["Se dividiram", (p: VotoPartido) => p.sim <= p.nao * 2 && p.nao <= p.sim * 2],
              ] as [string, (p: VotoPartido) => boolean][]
            ).map(([nome, filtro]) => {
              const lista = resultado.camara.partidos.filter(filtro).map((p) => p.sigla);
              return lista.length > 0 ? (
                <p key={nome}>
                  <strong>{nome}:</strong> {lista.join(", ")}
                </p>
              ) : null;
            })}
            <h3 className="rotulo espaco-topo">Consequências</h3>
            <ul className="mudancas">
              {(resultado.aprovado ? resumirEfeito(proposta.efeito) : [{ texto: "Aprovação", bom: false, sobe: false }]).map((efeito) => (
                <li key={efeito.texto} className={efeito.bom ? "mudanca-boa" : "mudanca-ruim"}>
                  {efeito.sobe ? "▲" : "▼"} {efeito.texto}
                </li>
              ))}
              <li className={resultado.aprovado ? "mudanca-boa" : "mudanca-ruim"}>
                {resultado.aprovado ? "▲" : "▼"} Relação com o Congresso
              </li>
              {(concessoes.emendas > 0 || (concessoes.lideres ?? []).length > 0) && <li className="mudanca-ruim">▼ Contas públicas (acordos)</li>}
              {concessoes.cargos > 0 && <li className="mudanca-ruim">▼ Confiança nas instituições (cargos)</li>}
            </ul>
            {resultado.aprovado && proposta.atraso > 0 && (
              <p className="ajuda">Os efeitos da proposta chegam em cerca de {proposta.atraso} meses.</p>
            )}
          </section>
        )}
        <footer className="rodape-passo">
          {terminou ? <span /> : (
            <button type="button" className="botao" onClick={() => setPasso(totalPartidos)}>
              Ver o resultado
            </button>
          )}
          <button
            type="button"
            className="botao botao-destaque"
            disabled={!terminou}
            onClick={() => atualizar(fecharPendencia)}
          >
            Continuar
          </button>
        </footer>
      </section>
    );
  }

  const estimativa = estimativaDeVotos(mandato, contexto);
  const reacoes = reacoesAProposta(mandato, contexto);
  const necessarios = proposta.camara ?? 257;

  return (
    <section className="boletim" aria-labelledby="titulo-negociacao">
      <p className="sobretitulo">
        {nomeDoMes(mandato.mes)} · {proposta.tipo} · Negociação
      </p>
      <h1 id="titulo-negociacao" className="titulo-tela">
        {proposta.nome}
      </h1>
      <p className="texto-tela">
        Antes do plenário, você pode negociar. A previsão muda com cada oferta, mas o resultado só sai na
        votação.
      </p>
      <dl className="placar placar-duplo">
        <div>
          <dt>Previsão na Câmara</dt>
          <dd>{estimativa?.deputados}</dd>
          <p>{proposta.camara ? `${proposta.camara} necessários` : "maioria dos presentes"}</p>
        </div>
        <div>
          <dt>Previsão no Senado</dt>
          <dd>{estimativa?.senadores}</dd>
          <p>{proposta.senado ? `${proposta.senado} necessários` : "maioria dos presentes"}</p>
        </div>
      </dl>
      {estimativa && (
        <div className="espaco-topo">
          <p className="rotulo">Previsão na Câmara</p>
          <Placar sim={estimativa.deputados} nao={487 - estimativa.deputados} total={513} necessarios={proposta.camara} />
        </div>
      )}
      {estimativa && estimativa.deputados < necessarios && (
        <p className="alerta espaco-topo">Pela previsão, faltam votos na Câmara.</p>
      )}
      <h2 className="titulo-bloco espaco-topo">Reação dos partidos</h2>
      <p className="ajuda">
        Chame até {LIMITE_LIDERES} líderes para negociar pessoalmente. Cada acordo puxa a bancada para o seu lado e custa
        verbas. Líderes atendidos: {(concessoes.lideres ?? []).length} de {LIMITE_LIDERES}.
      </p>
      <ul className="reacoes-partidos">
        {reacoes.slice(0, 12).map((r) => {
          const atendido = (concessoes.lideres ?? []).includes(r.sigla);
          const oposto = extremosOpostos(contexto.candidato.partidoSigla, r.sigla);
          return (
            <li key={r.sigla} className={`reacao-partido ${r.reacao}`}>
              <span className="reacao-sigla">
                <strong>{r.sigla}</strong>
                <span className="dado">
                  {r.deputados} dep. · {r.senadores} sen.
                </span>
              </span>
              <span className="reacao-nome">{atendido ? "Acordo feito" : oposto && r.reacao !== "apoia" ? "Não negocia com você" : NOME_REACAO[r.reacao]}</span>
              {r.reacao !== "apoia" && !atendido && !oposto && (
                <button
                  type="button"
                  className="botao"
                  disabled={(concessoes.lideres ?? []).length >= LIMITE_LIDERES}
                  onClick={() => atualizar((m) => negociarComLider(m, contexto, r.sigla))}
                >
                  Chamar o líder
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <ul className="lista-acoes espaco-topo">
        {OFERTAS.map((oferta) => (
          <li key={oferta.id}>
            <button
              type="button"
              className="acao"
              disabled={concessoes[oferta.id] >= 2}
              onClick={() => atualizar((m) => negociar(m, oferta.id))}
            >
              <span className="cartao-topo">
                <strong>{oferta.nome}</strong>
                <span className="dado">{concessoes[oferta.id]} de 2</span>
              </span>
              <span className="ajuda">{oferta.resumo}</span>
            </button>
          </li>
        ))}
      </ul>
      <footer className="rodape-passo">
        <span />
        <button
          type="button"
          className="botao botao-destaque"
          onClick={() => atualizar((m) => colocarEmVotacao(m, contexto))}
        >
          Colocar em votação
        </button>
      </footer>
    </section>
  );
}
