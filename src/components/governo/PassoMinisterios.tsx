"use client";

import { useState } from "react";
import type { Candidato } from "@/lib/candidato";
import {
  atributosDe,
  candidatosAoMinisterio,
  MINISTERIOS,
  ministeriosAtivos,
  NOME_ATRIBUTO_MINISTRO,
  pessoaPorId,
  preencherMinisterio,
  type AtributosMinistro,
  type Governo,
  type Ministerio,
  type Pessoa,
} from "@/lib/governo";
import { BuscaPessoa } from "../BuscaPessoa";
import { Janela } from "../Janela";

type Props = {
  governo: Governo;
  candidato: Candidato;
  nomesFora: string[];
  atualizar: (mudar: (g: Governo) => Governo) => void;
};

function Atributos({ pessoa, candidato }: { pessoa: Pessoa; candidato: Candidato }) {
  const atributos = atributosDe(pessoa, candidato);
  return (
    <ul className="atributos atributos-compactos">
      {(Object.keys(NOME_ATRIBUTO_MINISTRO) as (keyof AtributosMinistro)[]).map((chave) => (
        <li key={chave}>
          <span>{NOME_ATRIBUTO_MINISTRO[chave]}</span>
          <span className="barra" aria-hidden="true">
            <span style={{ width: `${atributos[chave]}%` }} />
          </span>
          <strong>{atributos[chave]}</strong>
        </li>
      ))}
    </ul>
  );
}

function valorDaSituacao(g: Governo, ministerio: Ministerio) {
  return g.situacao[ministerio.id];
}

export function PassoMinisterios({ governo, candidato, nomesFora, atualizar }: Props) {
  const [aberto, setAberto] = useState<Ministerio | null>(null);
  const ativos = ministeriosAtivos(governo);
  const opcoes = aberto ? candidatosAoMinisterio(governo, candidato, aberto, nomesFora) : [];

  function escolher(pessoa: Pessoa) {
    if (!aberto) return;
    const id = aberto.id;
    atualizar((g) => ({ ...g, ministros: { ...g.ministros, [id]: pessoa.id } }));
    setAberto(null);
  }

  function mudarSituacao(ministerio: Ministerio, valor: string) {
    atualizar((g) => ({
      ...g,
      situacao: { ...g.situacao, [ministerio.id]: valor },
      ministros: valor === "ativo" ? g.ministros : { ...g.ministros, [ministerio.id]: null },
    }));
  }

  return (
    <div className="formulario">
      <p className="ajuda">
        Dar um ministério a um partido traz a bancada dele para a base, mas partido distante das suas
        ideias vota com menos fidelidade. Técnicos são personagens fictícios: entregam gestão, mas não
        trazem votos. Os políticos são reais em um cenário hipotético, e os números vêm do tipo de cargo,
        não de uma avaliação da pessoa.
      </p>
      <button
        type="button"
        className="botao"
        onClick={() => atualizar((g) => preencherMinisterio(g, candidato, nomesFora))}
      >
        Preencher as vagas com sugestões
      </button>

      <ul className="lista-ministerios">
        {ativos.map((ministerio) => {
          const pessoa = pessoaPorId(governo.ministros[ministerio.id]);
          return (
            <li key={ministerio.id}>
              <button
                type="button"
                className={pessoa ? "acao" : "acao acao-vaga"}
                onClick={() => setAberto(ministerio)}
              >
                <span className="cartao-topo">
                  <strong>{ministerio.nome}</strong>
                  {pessoa?.sigla && <span className="dado">{pessoa.sigla}</span>}
                </span>
                <span className="ajuda">{pessoa ? pessoa.nome : "Escolher ministro"}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <details className="bloco">
        <summary>Criar, fundir ou extinguir ministérios</summary>
        <p className="ajuda">
          Os sete ministérios principais não podem sair. Fundir mantém a área dentro de outra pasta.
        </p>
        <ul className="lista-estrutura">
          {MINISTERIOS.filter((m) => !m.essencial).map((ministerio) => (
            <li key={ministerio.id}>
              <label className="campo">
                <span className="rotulo">{ministerio.nome}</span>
                <select
                  value={valorDaSituacao(governo, ministerio)}
                  onChange={(e) => mudarSituacao(ministerio, e.target.value)}
                >
                  <option value="ativo">{ministerio.opcional ? "Criar" : "Manter"}</option>
                  <option value="extinto">{ministerio.opcional ? "Não criar" : "Extinguir"}</option>
                  {MINISTERIOS.filter((m) => m.essencial).map((destino) => (
                    <option key={destino.id} value={destino.id}>
                      Fundir com {destino.nome}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          ))}
        </ul>
      </details>

      <Janela
        aberta={aberto !== null}
        titulo={aberto?.nome ?? ""}
        aoFechar={() => setAberto(null)}
      >
        <div className="formulario">
          <BuscaPessoa
            key={aberto?.id}
            pessoas={opcoes}
            selecionado={aberto ? governo.ministros[aberto.id] : null}
            aoEscolher={escolher}
            detalhe={(pessoa) => <Atributos pessoa={pessoa} candidato={candidato} />}
          />
        </div>
      </Janela>
    </div>
  );
}
