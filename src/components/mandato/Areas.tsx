"use client";

import { useState } from "react";
import type { Campanha } from "@/lib/campanha";
import { UFS } from "@/lib/candidato";
import { AREAS, NOME_NIVEL, TETO_ORCAMENTO } from "@/lib/governo";
import {
  aprovacaoDoGrupo,
  custoAnualDasObras,
  custoDoOrcamentoDoMandato,
  executar,
  mudarOrcamento,
  nomeDoMes,
  obrasAtivas,
  orcamentoAberto,
  podeIniciarObra,
  promessasDoMandato,
  type Acao,
  type Contexto,
  type Mandato,
  type Registro,
} from "@/lib/mandato";
import {
  ACOES_DIPLOMATICAS,
  ESTATAIS,
  GRUPOS_SOCIAIS,
  INSTITUICOES,
  MODELOS_OBRA,
  OBRAS_REAIS,
  PARCEIROS,
  PROGRAMAS_SEGURANCA,
  PROJETOS_MANDATO,
  STF,
  VAGAS,
  VAGAS_STF_ANTES_DE_2031,
  type AreaDoProjeto,
} from "@/lib/mandato-dados";
import { Barras, Bloco, numero, Numeros, Serie } from "./Comum";

type Props = {
  mandato: Mandato;
  contexto: Contexto;
  atualizar: (mudar: (m: Mandato) => Mandato) => void;
};

function useAcao({ mandato, contexto, atualizar }: Props) {
  const semAcoes = mandato.acoes <= 0;
  return {
    semAcoes,
    fazer: (acao: Acao) => atualizar((m) => executar(m, contexto, acao)),
  };
}

export function Painel({ mandato, campanha }: { mandato: Mandato; campanha: Campanha }) {
  const promessas = promessasDoMandato(mandato, campanha);
  return (
    <div className="areas">
      <Bloco titulo="Aprovação do governo">
        <Serie historico={mandato.historico} campo="aprovacao" nome="Aprovação" sufixo="%" />
        <h3 className="rotulo">Por grupo da população</h3>
        <Barras
          itens={GRUPOS_SOCIAIS.map((grupo) => ({
            nome: grupo,
            valor: aprovacaoDoGrupo(mandato, grupo),
            texto: `${aprovacaoDoGrupo(mandato, grupo)}%`,
          }))}
        />
      </Bloco>
      <Bloco titulo="Notícias">
        <ul className="diario">
          {mandato.noticias.slice(0, 10).map((noticia, indice) => (
            <li key={indice}>
              <span className="dado">{nomeDoMes(noticia.mes)}</span> {noticia.texto}
            </li>
          ))}
        </ul>
        {promessas.length > 0 && (
          <>
            <h3 className="rotulo">Promessas de campanha</h3>
            <ul className="diario">
              {promessas.map((promessa) => (
                <li key={promessa.texto}>
                  {promessa.cumprida ? "Cumprida" : "Pendente"}: {promessa.texto}
                </li>
              ))}
            </ul>
          </>
        )}
      </Bloco>
    </div>
  );
}

export function PainelEconomia(props: Props) {
  const { mandato } = props;
  const e = mandato.economia;
  const { semAcoes, fazer } = useAcao(props);
  return (
    <div className="areas">
      <Bloco titulo="Indicadores">
        <Numeros
          itens={[
            { nome: "PIB", valor: `${numero(e.pib)}%`, nota: "crescimento em 12 meses" },
            { nome: "IPCA", valor: `${numero(e.ipca)}%`, nota: "inflação em 12 meses" },
            { nome: "Selic", valor: `${numero(e.selic, 2)}%`, nota: "definida pelo Banco Central" },
            { nome: "Dólar", valor: `R$ ${numero(e.dolar, 2)}` },
            { nome: "Desemprego", valor: `${numero(e.desemprego)}%` },
            { nome: "Dívida pública", valor: `${numero(e.divida)}%`, nota: "do PIB" },
            { nome: "Resultado primário", valor: `${numero(e.primario)}%`, nota: e.primario >= 0 ? "superávit, em % do PIB" : "déficit, em % do PIB" },
            { nome: "Arrecadação", valor: `${numero(19 + e.carga)}%`, nota: "do PIB" },
            { nome: "Renda", valor: numero(e.renda), nota: "índice: 100 na posse" },
            { nome: "Investimentos", valor: `${numero(e.investimento)}%`, nota: "do PIB" },
            { nome: "Exportações", valor: `US$ ${numero(e.exportacoes, 0)} bi` },
            { nome: "Reservas", valor: `US$ ${numero(e.reservas, 0)} bi`, nota: "administradas pelo Banco Central" },
            { nome: "Confiança", valor: numero(e.confianca, 0), nota: "de 100" },
            { nome: "Pobreza", valor: `${numero(e.pobreza)}%` },
            { nome: "Desigualdade", valor: numero(e.desigualdade, 3), nota: "índice de Gini" },
            { nome: "Informalidade", valor: `${numero(e.informalidade)}%` },
          ]}
        />
        <p className="ajuda">
          Valores simulados. O ponto de partida é inspirado nas projeções de novembro de 2026. As decisões
          demoram meses para aparecer.
        </p>
      </Bloco>
      <Bloco titulo="Dívida pública">
        <ul className="lista-acoes">
          {(
            [
              ["alongar", "Alongar prazos", "Aumenta a confiança, custa um pouco mais de juros."],
              ["amortizar", "Antecipar amortização", "Reduz a dívida, pesa no caixa."],
              ["emitir", "Emitir títulos", "Reforça o caixa, aumenta a dívida."],
            ] as const
          ).map(([acao, nome, resumo]) => (
            <li key={acao}>
              <button type="button" className="acao" disabled={semAcoes} onClick={() => fazer({ tipo: "divida", acao })}>
                <strong>{nome}</strong>
                <span className="ajuda">{resumo}</span>
              </button>
            </li>
          ))}
        </ul>
      </Bloco>
    </div>
  );
}

export function PainelOrcamento({ mandato, atualizar }: Props) {
  const aberto = orcamentoAberto(mandato);
  const custo = custoDoOrcamentoDoMandato(mandato);
  const saldo = TETO_ORCAMENTO - custo;
  return (
    <div className="formulario">
      <p className={aberto ? "alerta" : "ajuda"}>
        {aberto
          ? "Janeiro é o mês de ajustar o orçamento do ano."
          : "O orçamento só pode mudar em janeiro de cada ano. Valores ilustrativos do jogo."}
      </p>
      <Numeros
        itens={[
          { nome: "Gastos planejados", valor: `R$ ${custo} bi`, nota: `limite de R$ ${TETO_ORCAMENTO} bi` },
          { nome: saldo >= 0 ? "Folga" : "Acima do limite", valor: `R$ ${Math.abs(saldo)} bi` },
          { nome: "Obras no ano", valor: `R$ ${numero(custoAnualDasObras(mandato))} bi` },
        ]}
      />
      <ul className="lista-orcamento">
        {AREAS.map((area) => (
          <li key={area.id}>
            <label className="campo">
              <span className="barra-nome">
                <span className="rotulo">{area.nome}</span>
                <strong>
                  {mandato.orcamento[area.id]} · {NOME_NIVEL[mandato.orcamento[area.id]]}
                </strong>
              </span>
              <input
                type="range"
                min={area.piso}
                max={5}
                disabled={!aberto}
                value={mandato.orcamento[area.id]}
                aria-valuetext={NOME_NIVEL[mandato.orcamento[area.id]]}
                onChange={(e) => {
                  const valor = Number(e.target.value);
                  atualizar((m) => mudarOrcamento(m, area.id, valor));
                }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PainelSociedade(props: Props) {
  const { mandato } = props;
  const s = mandato.sociedade;
  const p = mandato.seguranca;
  const { semAcoes, fazer } = useAcao(props);
  return (
    <div className="areas">
      <Bloco titulo="Sociedade">
        <Barras
          itens={[
            { nome: "Saúde", valor: s.saude },
            { nome: "Educação", valor: s.educacao },
            { nome: "Segurança", valor: s.seguranca },
            { nome: "Qualidade de vida", valor: s.qualidade },
            { nome: "Confiança nas instituições", valor: s.confianca },
            { nome: "Meio ambiente", valor: s.ambiente },
          ]}
        />
        <h3 className="rotulo">Segurança pública e defesa</h3>
        <Numeros
          itens={[
            { nome: "Homicídios", valor: numero(p.homicidios), nota: "por 100 mil habitantes" },
            { nome: "Roubos e furtos", valor: numero(p.roubos, 0), nota: "índice: 100 na posse" },
            { nome: "Crime organizado", valor: numero(p.crime, 0), nota: "de 100" },
            { nome: "Tráfico de drogas", valor: numero(p.trafico, 0), nota: "de 100" },
            { nome: "Violência contra a mulher", valor: numero(p.mulher, 0), nota: "índice: 100 na posse" },
            { nome: "Sistema prisional", valor: `${numero(p.prisional, 0)}%`, nota: "de ocupação" },
            { nome: "Eficiência policial", valor: numero(p.eficiencia, 0), nota: "de 100" },
            { nome: "Defesa nacional", valor: numero(p.defesa, 0), nota: "de 100" },
            { nome: "Fronteiras", valor: numero(p.fronteiras, 0), nota: "de 100" },
          ]}
        />
      </Bloco>
      <Bloco titulo="Programas">
        <p className="ajuda">A segurança é dividida com os estados. Os resultados aparecem em cerca de 4 meses.</p>
        <ul className="lista-acoes">
          {PROGRAMAS_SEGURANCA.map((programa) => (
            <li key={programa.id}>
              <button type="button" className="acao" disabled={semAcoes} onClick={() => fazer({ tipo: "seguranca", id: programa.id })}>
                <strong>{programa.nome}</strong>
                <span className="ajuda">{programa.resumo}</span>
              </button>
            </li>
          ))}
        </ul>
      </Bloco>
    </div>
  );
}

const NOME_SITUACAO_OBRA = {
  andamento: "Em andamento",
  suspensa: "Suspensa",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export function PainelObras(props: Props) {
  const { mandato } = props;
  const { semAcoes, fazer } = useAcao(props);
  const [modelo, setModelo] = useState(MODELOS_OBRA[0].id);
  const [uf, setUf] = useState("BA");
  const escolhido = MODELOS_OBRA.find((m) => m.id === modelo) ?? MODELOS_OBRA[0];
  const lotado = !podeIniciarObra(mandato);

  return (
    <div className="areas">
      <Bloco titulo="Obras do governo">
        {mandato.obras.length === 0 && <p className="ajuda">Nenhuma obra iniciada.</p>}
        <ul className="lista-obras">
          {mandato.obras.map((obra) => (
            <li key={obra.id} className="bloco">
              <p className="barra-nome">
                <strong>{obra.nome}</strong>
                <span className="dado">{NOME_SITUACAO_OBRA[obra.situacao]}</span>
              </p>
              <Barras itens={[{ nome: "Execução física", valor: obra.execucao, texto: `${Math.round(obra.execucao)}%` }]} />
              <p className="ajuda">
                {obra.categoria} · R$ {numero(obra.custo)} bi · cronograma de {obra.meses} meses ·{" "}
                {obra.licenca ? "licença emitida" : "aguardando licença"} ·{" "}
                {obra.contrato ? "contrato assinado" : "em licitação"}
              </p>
              {(obra.situacao === "andamento" || obra.situacao === "suspensa") && (
                <div className="acoes">
                  <button
                    type="button"
                    className="botao"
                    disabled={semAcoes}
                    onClick={() =>
                      fazer({ tipo: "obra-mudar", id: obra.id, para: obra.situacao === "andamento" ? "suspender" : "retomar" })
                    }
                  >
                    {obra.situacao === "andamento" ? "Suspender" : "Retomar"}
                  </button>
                  <button type="button" className="botao" disabled={semAcoes} onClick={() => fazer({ tipo: "obra-mudar", id: obra.id, para: "ampliar" })}>
                    Ampliar
                  </button>
                  <button type="button" className="botao" disabled={semAcoes} onClick={() => fazer({ tipo: "obra-mudar", id: obra.id, para: "cancelar" })}>
                    Cancelar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Bloco>
      <Bloco titulo="Iniciar uma obra">
        <p className="ajuda">
          {obrasAtivas(mandato).length} de 8 frentes ativas. Custos e prazos são estimativas do jogo.
        </p>
        <div className="bloco">
          <label className="campo">
            <span className="rotulo">Tipo de obra</span>
            <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
              {MODELOS_OBRA.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.categoria}: {m.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span className="rotulo">Estado</span>
            <select value={uf} onChange={(e) => setUf(e.target.value)}>
              {UFS.map((sigla) => (
                <option key={sigla}>{sigla}</option>
              ))}
            </select>
          </label>
          <p className="ajuda">
            R$ {numero(escolhido.custo)} bi em cerca de {escolhido.meses} meses.
          </p>
          <button
            type="button"
            className="botao botao-destaque"
            disabled={semAcoes || lotado}
            onClick={() => fazer({ tipo: "obra", modelo, uf })}
          >
            Iniciar
          </button>
        </div>
        <h3 className="rotulo">Obras reais</h3>
        <ul className="lista-acoes">
          {OBRAS_REAIS.map((obra) => {
            const iniciada = mandato.obras.some((o) => o.id === obra.id);
            return (
              <li key={obra.id}>
                <button
                  type="button"
                  className="acao"
                  disabled={semAcoes || lotado || iniciada}
                  onClick={() => fazer({ tipo: "obra-real", id: obra.id })}
                >
                  <strong>{obra.nome}</strong>
                  <span className="ajuda">{obra.situacaoReal}</span>
                  <span className="dado">Situação real em {obra.dataBase}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Bloco>
    </div>
  );
}

const NOME_CONTROLE = { estatal: "100% pública", "capital-aberto": "Capital aberto", privatizada: "Privatizada" };

export function PainelEstatais(props: Props) {
  const { mandato } = props;
  const { semAcoes, fazer } = useAcao(props);
  return (
    <div className="formulario">
      <p className="ajuda">
        Privatizar e abrir capital passam pelo Congresso e seguem as regras legais e de governança. Fundir e
        criar empresas ainda não estão disponíveis.
      </p>
      <ul className="lista-estatais">
        {ESTATAIS.map((estatal) => {
          const situacao = mandato.estatais[estatal.id];
          const vendida = situacao.controle === "privatizada";
          return (
            <li key={estatal.id} className="bloco">
              <p className="barra-nome">
                <strong>{estatal.nome}</strong>
                <span className="dado">{NOME_CONTROLE[situacao.controle]}</span>
              </p>
              <p className="ajuda">Gestão {situacao.gestao === "tecnica" ? "técnica" : "política"}</p>
              {!vendida && (
                <div className="acoes">
                  <button
                    type="button"
                    className="botao"
                    disabled={semAcoes}
                    onClick={() =>
                      fazer({
                        tipo: "estatal",
                        id: estatal.id,
                        acao: situacao.gestao === "tecnica" ? "gestao-politica" : "gestao-tecnica",
                      })
                    }
                  >
                    {situacao.gestao === "tecnica" ? "Gestão política" : "Gestão técnica"}
                  </button>
                  {situacao.controle === "estatal" && (
                    <button type="button" className="botao" disabled={semAcoes} onClick={() => fazer({ tipo: "estatal", id: estatal.id, acao: "abrir-capital" })}>
                      Abrir capital
                    </button>
                  )}
                  <button type="button" className="botao" disabled={semAcoes} onClick={() => fazer({ tipo: "estatal", id: estatal.id, acao: "privatizar" })}>
                    Privatizar
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const AREAS_PROJETO: AreaDoProjeto[] = ["Tributos", "Contas públicas", "Moeda", "Políticas públicas"];

export function PainelCongresso(props: Props) {
  const { mandato } = props;
  const { semAcoes, fazer } = useAcao(props);
  return (
    <div className="areas">
      <Bloco titulo="Enviar um projeto">
        <Barras itens={[{ nome: "Relação com o Congresso", valor: mandato.congresso }]} />
        {AREAS_PROJETO.map((area) => (
          <div key={area}>
            <h3 className="rotulo espaco-topo">{area}</h3>
            <ul className="lista-pessoas">
              {PROJETOS_MANDATO.filter((p) => p.area === area).map((projeto) => {
                const aprovado = mandato.projetosAprovados.includes(projeto.id);
                return (
                  <li key={projeto.id}>
                    <button type="button" className="acao" disabled={semAcoes || aprovado} onClick={() => fazer({ tipo: "projeto", id: projeto.id })}>
                      <span className="cartao-topo">
                        <strong>{projeto.nome}</strong>
                      </span>
                      <span className="ajuda">{aprovado ? "Aprovado." : projeto.resumo}</span>
                      <span className="dado">
                        {projeto.tipo}
                        {projeto.camara ? ` · ${projeto.camara} deputados e ${projeto.senado} senadores` : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Bloco>
      <Bloco titulo="Votações">
        {mandato.votacoes.length === 0 && <p className="ajuda">Nenhuma votação ainda.</p>}
        <ul className="diario">
          {mandato.votacoes.slice(0, 12).map((votacao, indice) => (
            <li key={indice}>
              <span className="dado">{nomeDoMes(votacao.mes)}</span> {votacao.projeto}:{" "}
              <strong>{votacao.aprovado ? "aprovado" : "rejeitado"}</strong> ({votacao.camara.sim} a{" "}
              {votacao.camara.nao} na Câmara
              {votacao.senado ? `, ${votacao.senado.sim} a ${votacao.senado.nao} no Senado` : ""})
            </li>
          ))}
        </ul>
      </Bloco>
    </div>
  );
}

export function PainelInstituicoes({ mandato }: { mandato: Mandato }) {
  return (
    <div className="areas">
      <Bloco titulo="Calendário de vagas">
        <ul className="diario">
          {VAGAS.map((vaga) => {
            const feita = mandato.indicados.find((i) => i.vaga === vaga.id);
            return (
              <li key={vaga.id}>
                <span className="dado">{nomeDoMes(vaga.mes)}</span> {vaga.cargo}.{" "}
                {feita ? `${feita.nome}: ${feita.aprovado ? "aprovado no Senado" : "rejeitado no Senado"}.` : vaga.regra}
              </li>
            );
          })}
        </ul>
        <h3 className="rotulo">Competências</h3>
        <ul className="diario">
          {INSTITUICOES.map((item) => (
            <li key={item.nome}>
              <strong>{item.nome}:</strong> {item.papel}
            </li>
          ))}
        </ul>
      </Bloco>
      <Bloco titulo="STF">
        <div className="tabela-rolagem">
          <table className="tabela-partidos">
            <thead>
              <tr>
                <th scope="col">Ministro</th>
                <th scope="col">Nascimento</th>
                <th scope="col">Posse</th>
                <th scope="col">Indicação</th>
                <th scope="col">75 anos</th>
              </tr>
            </thead>
            <tbody>
              {STF.map((ministro) => (
                <tr key={ministro.nome}>
                  <th scope="row">{ministro.nome}</th>
                  <td>{ministro.nascimento}</td>
                  <td>{ministro.posse}</td>
                  <td>{ministro.indicacao}</td>
                  <td>{ministro.aposentadoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ajuda">{VAGAS_STF_ANTES_DE_2031}</p>
      </Bloco>
    </div>
  );
}

export function PainelDiplomacia(props: Props) {
  const { mandato } = props;
  const { semAcoes, fazer } = useAcao(props);
  const [parceiro, setParceiro] = useState(PARCEIROS[0]);
  const [acao, setAcao] = useState(ACOES_DIPLOMATICAS[0].id);
  return (
    <div className="areas">
      <Bloco titulo="Relações">
        <Barras itens={PARCEIROS.map((p) => ({ nome: p, valor: mandato.relacoes[p] }))} />
      </Bloco>
      <Bloco titulo="Nova iniciativa">
        <div className="bloco">
          <label className="campo">
            <span className="rotulo">Parceiro</span>
            <select value={parceiro} onChange={(e) => setParceiro(e.target.value)}>
              {PARCEIROS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span className="rotulo">Iniciativa</span>
            <select value={acao} onChange={(e) => setAcao(e.target.value)}>
              {ACOES_DIPLOMATICAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="botao botao-destaque"
            disabled={semAcoes}
            onClick={() => fazer({ tipo: "diplomacia", parceiro, acao })}
          >
            Confirmar
          </button>
        </div>
        <p className="ajuda">Aproximar-se muito de Estados Unidos ou China pode esfriar a relação com o outro.</p>
      </Bloco>
    </div>
  );
}

const SERIES: { campo: keyof Registro; nome: string; sufixo: string; casas?: number }[] = [
  { campo: "aprovacao", nome: "Aprovação", sufixo: "%" },
  { campo: "pib", nome: "PIB", sufixo: "%" },
  { campo: "ipca", nome: "IPCA", sufixo: "%" },
  { campo: "selic", nome: "Selic", sufixo: "%", casas: 2 },
  { campo: "desemprego", nome: "Desemprego", sufixo: "%" },
  { campo: "divida", nome: "Dívida pública", sufixo: "% do PIB" },
  { campo: "dolar", nome: "Dólar", sufixo: "", casas: 2 },
];

export function PainelRelatorios({ mandato }: { mandato: Mandato }) {
  const [indice, setIndice] = useState(0);
  const serie = SERIES[indice];
  const trimestres = mandato.historico.filter((r) => r.mes > 0 && r.mes % 3 === 0).reverse();

  return (
    <div className="areas">
      <Bloco titulo="Evolução">
        <label className="campo">
          <span className="rotulo">Indicador</span>
          <select value={indice} onChange={(e) => setIndice(Number(e.target.value))}>
            {SERIES.map((item, i) => (
              <option key={item.campo} value={i}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>
        <Serie historico={mandato.historico} {...serie} />
      </Bloco>
      <Bloco titulo="Fechamentos trimestrais">
        {trimestres.length === 0 ? (
          <p className="ajuda">O primeiro fechamento sai em março de 2031.</p>
        ) : (
          <div className="tabela-rolagem">
            <table className="tabela-partidos">
              <thead>
                <tr>
                  <th scope="col">Mês</th>
                  <th scope="col">Aprovação</th>
                  <th scope="col">PIB</th>
                  <th scope="col">IPCA</th>
                  <th scope="col">Desemprego</th>
                  <th scope="col">Dívida</th>
                </tr>
              </thead>
              <tbody>
                {trimestres.map((r) => (
                  <tr key={r.mes}>
                    <th scope="row">{nomeDoMes(r.mes)}</th>
                    <td>{numero(r.aprovacao, 0)}%</td>
                    <td>{numero(r.pib)}%</td>
                    <td>{numero(r.ipca)}%</td>
                    <td>{numero(r.desemprego)}%</td>
                    <td>{numero(r.divida)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Bloco>
    </div>
  );
}
