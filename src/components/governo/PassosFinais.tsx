"use client";

import type { Candidato } from "@/lib/candidato";
import type { Eleicao } from "@/lib/eleicao";
import {
  AREAS,
  calcularBalanco,
  custoDoOrcamento,
  DECISOES,
  ministeriosAtivos,
  NOME_NIVEL,
  pessoaPorId,
  PROJETOS,
  resumoDoCongresso,
  TETO_ORCAMENTO,
  votarProjeto,
  type Casa,
  type Governo,
} from "@/lib/governo";

type Atualizar = (mudar: (g: Governo) => Governo) => void;

export function PassoOrcamento({ governo, atualizar }: { governo: Governo; atualizar: Atualizar }) {
  const custo = custoDoOrcamento(governo);
  const saldo = TETO_ORCAMENTO - custo;

  return (
    <div className="formulario">
      <p className="ajuda">
        Escolha a prioridade de cada área. Valores ilustrativos do jogo. Saúde e educação têm piso, por
        causa das vinculações constitucionais.
      </p>
      <dl className="placar placar-duplo">
        <div>
          <dt>Gastos planejados</dt>
          <dd>R$ {custo} bi</dd>
          <p>limite de R$ {TETO_ORCAMENTO} bi</p>
        </div>
        <div>
          <dt>{saldo >= 0 ? "Folga" : "Acima do limite"}</dt>
          <dd>R$ {Math.abs(saldo)} bi</dd>
          <p>{saldo >= 0 ? "ajuda a credibilidade" : "reduz a credibilidade"}</p>
        </div>
      </dl>
      {saldo < 0 && <p className="alerta">O plano passa do limite da regra fiscal.</p>}
      <ul className="lista-orcamento">
        {AREAS.map((area) => (
          <li key={area.id}>
            <label className="campo">
              <span className="barra-nome">
                <span className="rotulo">{area.nome}</span>
                <strong>
                  {governo.orcamento[area.id]} · {NOME_NIVEL[governo.orcamento[area.id]]}
                </strong>
              </span>
              <input
                type="range"
                min={area.piso}
                max={5}
                value={governo.orcamento[area.id]}
                aria-valuetext={NOME_NIVEL[governo.orcamento[area.id]]}
                onChange={(e) => {
                  const nivel = Number(e.target.value);
                  atualizar((g) => ({ ...g, orcamento: { ...g.orcamento, [area.id]: nivel } }));
                }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PassoDecisoes({ governo, atualizar }: { governo: Governo; atualizar: Atualizar }) {
  return (
    <div className="formulario">
      {DECISOES.map((decisao) => (
        <fieldset key={decisao.id} className="grade-cartoes">
          <legend className="rotulo">
            {decisao.tema}: {decisao.texto}
          </legend>
          {decisao.opcoes.map((opcao, indice) => {
            const marcado = governo.decisoes[decisao.id] === indice;
            return (
              <label key={opcao.texto} className={marcado ? "cartao-opcao marcado" : "cartao-opcao"}>
                <input
                  type="radio"
                  name={decisao.id}
                  checked={marcado}
                  onChange={() =>
                    atualizar((g) => ({ ...g, decisoes: { ...g.decisoes, [decisao.id]: indice } }))
                  }
                />
                <span>{opcao.texto}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}

function ResultadoCasa({ titulo, casa }: { titulo: string; casa: Casa }) {
  return (
    <section className="bloco">
      <h3 className="titulo-bloco">{titulo}</h3>
      <p>
        <strong>{casa.aprovado ? "Aprovado" : "Rejeitado"}</strong>: {casa.sim} a favor e {casa.nao}{" "}
        contra
        {casa.necessarios ? `, com ${casa.necessarios} votos necessários` : ""}.
      </p>
      <details>
        <summary>Votos por partido</summary>
        <div className="tabela-rolagem">
          <table className="tabela-partidos">
            <thead>
              <tr>
                <th scope="col">Partido</th>
                <th scope="col">A favor</th>
                <th scope="col">Contra</th>
              </tr>
            </thead>
            <tbody>
              {casa.partidos.map((partido) => (
                <tr key={partido.sigla}>
                  <th scope="row">{partido.sigla}</th>
                  <td>{partido.sim}</td>
                  <td>{partido.nao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

export function PassoVotacao(props: {
  governo: Governo;
  candidato: Candidato;
  atualizar: Atualizar;
}) {
  const { governo, candidato, atualizar } = props;
  const resumo = resumoDoCongresso(governo, candidato);
  const votacao = governo.votacao;
  const projeto = PROJETOS.find((p) => p.id === governo.projeto);

  if (votacao && projeto) {
    return (
      <div className="formulario">
        <p className="texto-tela">
          {projeto.nome}: {votacao.aprovado ? "projeto aprovado no Congresso." : "projeto derrotado no Congresso."}
        </p>
        <ResultadoCasa titulo="Câmara dos Deputados" casa={votacao.camara} />
        {votacao.senado ? (
          <ResultadoCasa titulo="Senado Federal" casa={votacao.senado} />
        ) : (
          <p className="ajuda">O projeto parou na Câmara e não chegou ao Senado.</p>
        )}
      </div>
    );
  }

  return (
    <div className="formulario">
      <p className="ajuda">
        Escolha o primeiro projeto do governo. Sua estimativa é de {resumo.provaveis.deputados} votos na
        Câmara e {resumo.provaveis.senadores} no Senado, mas o resultado pode mudar no plenário.
      </p>
      <fieldset className="grade-cartoes">
        <legend className="rotulo">Primeiro projeto</legend>
        {PROJETOS.map((item) => {
          const marcado = governo.projeto === item.id;
          return (
            <label key={item.id} className={marcado ? "cartao-opcao marcado" : "cartao-opcao"}>
              <input
                type="radio"
                name="projeto"
                checked={marcado}
                onChange={() => atualizar((g) => ({ ...g, projeto: item.id }))}
              />
              <strong>{item.nome}</strong>
              <span className="ajuda">{item.descricao}</span>
            </label>
          );
        })}
      </fieldset>
      <button
        type="button"
        className="botao botao-destaque"
        disabled={!governo.projeto}
        onClick={() => atualizar((g) => votarProjeto(g, candidato))}
      >
        Enviar ao Congresso
      </button>
    </div>
  );
}

export function PassoBalanco(props: { governo: Governo; candidato: Candidato; eleicao: Eleicao }) {
  const { governo, candidato, eleicao } = props;
  const balanco = calcularBalanco(governo, candidato, eleicao);
  const resumo = resumoDoCongresso(governo, candidato);
  const projeto = PROJETOS.find((p) => p.id === governo.votacao?.projeto);

  return (
    <div className="formulario">
      <dl className="placar">
        <div>
          <dt>Aprovação</dt>
          <dd>{balanco.aprovacao}%</dd>
          <p>no começo do mandato</p>
        </div>
        <div>
          <dt>Credibilidade</dt>
          <dd>{balanco.credibilidade}</dd>
          <p>de 100</p>
        </div>
        <div>
          <dt>Governabilidade</dt>
          <dd>{balanco.governabilidade}</dd>
          <p>de 100</p>
        </div>
        <div>
          <dt>Gestão</dt>
          <dd>{balanco.gestao}</dd>
          <p>de 100</p>
        </div>
      </dl>
      <p className="texto-tela">
        Base com {resumo.deputados.base} deputados e {resumo.senadores.base} senadores.{" "}
        {projeto &&
          `${projeto.nome}: projeto ${governo.votacao?.aprovado ? "aprovado" : "derrotado"} no Congresso.`}
      </p>
      <section>
        <h2 className="titulo-bloco">Seu ministério</h2>
        <ul className="diario">
          {ministeriosAtivos(governo).map((ministerio) => {
            const pessoa = pessoaPorId(governo.ministros[ministerio.id]);
            return (
              <li key={ministerio.id}>
                {ministerio.nome}: {pessoa?.nome}
                {pessoa?.sigla ? ` (${pessoa.sigla})` : " (técnico)"}
              </li>
            );
          })}
        </ul>
      </section>
      <p className="ajuda aviso-simulacao">
        Cenário hipotético: as pessoas reais citadas não participam do jogo nem aprovaram esta
        simulação.
      </p>
    </div>
  );
}
