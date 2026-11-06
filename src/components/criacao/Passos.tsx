"use client";

import { useState } from "react";
import {
  CARGOS,
  distanciaDoPartido,
  EXPERIENCIAS,
  HISTORICOS,
  IDADE_MINIMA,
  IDEOLOGIAS,
  NOME_TAMANHO,
  PARTIDOS,
  partidoDoCandidato,
  posicaoDasIdeologias,
  UFS,
  VICE_PROPRIO,
  VICES,
  type Candidato,
} from "@/lib/candidato";
import { CampoFoto } from "./CampoFoto";
import { Campo, Cartao, Eixo, Selecao } from "./Campos";

type Props = {
  c: Candidato;
  mudar: (mudanca: Partial<Candidato>) => void;
};

export function PassoIdentidade({ c, mudar }: Props) {
  return (
    <div className="formulario">
      <CampoFoto
        rotulo="Fotografia do candidato"
        foto={c.foto}
        aoMudar={(foto) => mudar({ foto })}
      />
      <Campo rotulo="Nome completo">
        <input
          value={c.nomeCompleto}
          maxLength={80}
          autoComplete="off"
          onChange={(e) => mudar({ nomeCompleto: e.target.value })}
        />
      </Campo>
      <div className="duas-colunas">
        <Campo rotulo="Nome de urna" ajuda="Como o eleitor vai ver na urna.">
          <input
            value={c.nomeUrna}
            maxLength={30}
            autoComplete="off"
            onChange={(e) => mudar({ nomeUrna: e.target.value })}
          />
        </Campo>
        <div className="duas-colunas">
          <Campo rotulo="Idade em 2030" ajuda={`Mínimo: ${IDADE_MINIMA}.`}>
            <input
              inputMode="numeric"
              value={c.idade}
              maxLength={3}
              onChange={(e) => mudar({ idade: e.target.value.replace(/\D/g, "") })}
            />
          </Campo>
          <Campo rotulo="Estado">
            <select value={c.uf} onChange={(e) => mudar({ uf: e.target.value })}>
              <option value="">UF</option>
              {UFS.map((uf) => (
                <option key={uf}>{uf}</option>
              ))}
            </select>
          </Campo>
        </div>
      </div>
    </div>
  );
}

function semAcento(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function PassoPartido({ c, mudar }: Props) {
  const [busca, setBusca] = useState("");
  const termo = semAcento(busca.trim());
  const partidos = PARTIDOS.filter((p) =>
    semAcento(`${p.numero} ${p.sigla} ${p.nome}`).includes(termo),
  );

  return (
    <div className="formulario">
      <p className="ajuda">
        Partido grande ajuda na articulação. Partido novo começa sem estrutura, mas com discurso de
        renovação. A posição de cada partido é uma estimativa do jogo.
      </p>
      <Campo rotulo="Procurar partido">
        <input
          type="search"
          value={busca}
          placeholder="Sigla, nome ou número"
          autoComplete="off"
          onChange={(e) => setBusca(e.target.value)}
        />
      </Campo>
      <fieldset className="grade-cartoes grade-compacta">
        <legend className="rotulo">Partido</legend>
        <Cartao
          nome="partido"
          marcado={c.partidoProprio}
          aoMarcar={() => mudar({ partidoProprio: true, partidoSigla: null })}
        >
          <span className="cartao-topo">
            <strong>Novo</strong>
          </span>
          <span>Criar o meu partido</span>
          <span className="dado">{NOME_TAMANHO.novo}</span>
        </Cartao>
        {partidos.map((partido) => (
          <Cartao
            key={partido.sigla}
            nome="partido"
            marcado={!c.partidoProprio && c.partidoSigla === partido.sigla}
            aoMarcar={() => mudar({ partidoSigla: partido.sigla, partidoProprio: false })}
          >
            <span className="cartao-topo">
              <strong>{partido.sigla}</strong>
              <span className="numero-urna">{partido.numero}</span>
            </span>
            <span>{partido.nome}</span>
            <span className="dado">{NOME_TAMANHO[partido.tamanho]}</span>
          </Cartao>
        ))}
      </fieldset>
      {c.partidoProprio && (
        <div className="bloco">
          <Campo rotulo="Nome do partido">
            <input
              value={c.novoPartidoNome}
              maxLength={60}
              autoComplete="off"
              onChange={(e) => mudar({ novoPartidoNome: e.target.value })}
            />
          </Campo>
          <div className="duas-colunas">
            <Campo rotulo="Sigla">
              <input
                value={c.novoPartidoSigla}
                maxLength={8}
                autoComplete="off"
                onChange={(e) => mudar({ novoPartidoSigla: e.target.value.toUpperCase() })}
              />
            </Campo>
            <Campo rotulo="Número" ajuda="Dois algarismos.">
              <input
                inputMode="numeric"
                value={c.novoPartidoNumero}
                maxLength={2}
                onChange={(e) => mudar({ novoPartidoNumero: e.target.value.replace(/\D/g, "") })}
              />
            </Campo>
          </div>
        </div>
      )}
    </div>
  );
}

export function PassoIdeologia({ c, mudar }: Props) {
  const partido = partidoDoCandidato(c);
  const distancia = distanciaDoPartido(c);

  function escolher(principal: string, secundaria: string | null) {
    const combinacao = secundaria === principal ? null : secundaria;
    mudar({
      ideologia: principal,
      ideologiaSecundaria: combinacao,
      ...posicaoDasIdeologias(principal, combinacao),
    });
  }

  return (
    <div className="formulario">
      <fieldset className="grade-cartoes grade-compacta">
        <legend className="rotulo">Ideologia principal</legend>
        {IDEOLOGIAS.map((ideologia) => (
          <Cartao
            key={ideologia.id}
            nome="ideologia"
            marcado={c.ideologia === ideologia.id}
            aoMarcar={() => escolher(ideologia.id, c.ideologiaSecundaria)}
          >
            <span>{ideologia.nome}</span>
          </Cartao>
        ))}
      </fieldset>
      {c.ideologia && (
        <>
          <Selecao
            rotulo="Combinar com outra ideologia (opcional)"
            vazio="Nenhuma"
            valor={c.ideologiaSecundaria}
            opcoes={IDEOLOGIAS.filter((i) => i.id !== c.ideologia)}
            aoMudar={(secundaria) => escolher(c.ideologia as string, secundaria)}
          />
          <div className="bloco">
            <p className="rotulo">Ajuste a sua posição</p>
            <Eixo
              rotulo="Economia"
              esquerda="Mais Estado"
              direita="Mais mercado"
              valor={c.economia}
              aoMudar={(economia) => mudar({ economia })}
            />
            <Eixo
              rotulo="Costumes"
              esquerda="Progressista"
              direita="Conservador"
              valor={c.costumes}
              aoMudar={(costumes) => mudar({ costumes })}
            />
          </div>
          {partido && !c.partidoProprio && distancia > 30 && (
            <p className="alerta">
              Esta posição está longe da linha do {partido.sigla}. A incoerência reduz a sua
              credibilidade no começo da campanha.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function PassoTrajetoria({ c, mudar }: Props) {
  return (
    <div className="formulario">
      <Selecao
        rotulo="Cargo mais alto da carreira"
        vazio="Escolha"
        valor={c.cargo}
        opcoes={CARGOS}
        aoMudar={(cargo) => mudar({ cargo })}
      />
      <div className="duas-colunas">
        <Selecao
          rotulo="Experiência administrativa"
          vazio="Escolha"
          valor={c.experiencia}
          opcoes={EXPERIENCIAS}
          aoMudar={(experiencia) => mudar({ experiencia })}
        />
        <Selecao
          rotulo="Histórico eleitoral"
          vazio="Escolha"
          valor={c.historico}
          opcoes={HISTORICOS}
          aoMudar={(historico) => mudar({ historico })}
        />
      </div>
      <Campo rotulo="Biografia" ajuda="Quem é o candidato e de onde ele veio.">
        <textarea
          rows={4}
          maxLength={600}
          value={c.biografia}
          onChange={(e) => mudar({ biografia: e.target.value })}
        />
      </Campo>
      <Campo rotulo="História política (opcional)" ajuda="Bandeiras, mandatos e momentos marcantes.">
        <textarea
          rows={3}
          maxLength={600}
          value={c.historiaPolitica}
          onChange={(e) => mudar({ historiaPolitica: e.target.value })}
        />
      </Campo>
    </div>
  );
}

export function PassoVice({ c, mudar }: Props) {
  const partido = partidoDoCandidato(c);
  return (
    <div className="formulario">
      <p className="ajuda">
        Nomes reais em um cenário hipotético: nenhuma dessas pessoas participa do jogo nem aprovou esta
        simulação. Vice de outro partido forma uma aliança na chapa.
      </p>
      <fieldset className="grade-cartoes">
        <legend className="rotulo">Vice-presidência</legend>
        {VICES.map((vice) => (
          <Cartao
            key={vice.id}
            nome="vice"
            marcado={c.viceId === vice.id}
            aoMarcar={() => mudar({ viceId: vice.id })}
          >
            <strong>{vice.nome}</strong>
            <span className="dado">
              {vice.sigla} · {vice.uf}
              {partido && partido.sigla !== vice.sigla ? " · Aliança" : ""}
            </span>
            <span className="ajuda">{vice.perfil}</span>
          </Cartao>
        ))}
        <Cartao
          nome="vice"
          marcado={c.viceId === VICE_PROPRIO}
          aoMarcar={() => mudar({ viceId: VICE_PROPRIO })}
        >
          <strong>Escolher outra pessoa</strong>
          <span className="ajuda">Escreva o nome de quem vai compor a chapa.</span>
        </Cartao>
      </fieldset>
      {c.viceId === VICE_PROPRIO && (
        <div className="bloco">
          <Campo rotulo="Nome completo de quem será vice">
            <input
              value={c.viceNome}
              maxLength={80}
              autoComplete="off"
              onChange={(e) => mudar({ viceNome: e.target.value })}
            />
          </Campo>
          <CampoFoto
            rotulo="Fotografia (opcional)"
            foto={c.viceFoto}
            aoMudar={(viceFoto) => mudar({ viceFoto })}
          />
        </div>
      )}
    </div>
  );
}
