import {
  calcularAtributos,
  CARGOS,
  dadosDoVice,
  EXPERIENCIAS,
  HISTORICOS,
  NOME_ATRIBUTO,
  nomeDaIdeologia,
  partidoDoCandidato,
  type Atributos,
  type Candidato,
} from "@/lib/candidato";

function nomeDe(lista: { id: string; nome: string }[], id: string | null) {
  return lista.find((item) => item.id === id)?.nome ?? "";
}

export function FichaCandidato({ c }: { c: Candidato }) {
  const partido = partidoDoCandidato(c);
  const vice = dadosDoVice(c);
  const atributos = calcularAtributos(c);

  return (
    <article className="ficha">
      <header className="ficha-topo">
        <div className="foto">{c.foto && <img src={c.foto} alt={`Foto de ${c.nomeUrna}`} />}</div>
        <div className="ficha-nome">
          {partido && <p className="ficha-numero">{partido.numero}</p>}
          <h2>{c.nomeUrna}</h2>
          <p>{c.nomeCompleto}</p>
          <p className="dado">
            {c.idade} anos · {c.uf}
          </p>
        </div>
      </header>

      <dl className="ficha-dados">
        <div>
          <dt>Partido</dt>
          <dd>{partido ? `${partido.sigla} · ${partido.nome}` : ""}</dd>
        </div>
        <div>
          <dt>Ideologia</dt>
          <dd>{nomeDaIdeologia(c)}</dd>
        </div>
        <div>
          <dt>Vice</dt>
          <dd>{vice ? `${vice.nome} (${vice.detalhe})` : ""}</dd>
        </div>
        <div>
          <dt>Trajetória</dt>
          <dd>
            {[nomeDe(CARGOS, c.cargo), nomeDe(EXPERIENCIAS, c.experiencia), nomeDe(HISTORICOS, c.historico)]
              .filter(Boolean)
              .join(" · ")}
          </dd>
        </div>
      </dl>

      <section aria-label="Atributos iniciais">
        <p className="rotulo">Como a chapa começa a campanha</p>
        <ul className="atributos">
          {(Object.keys(atributos) as (keyof Atributos)[]).map((chave) => (
            <li key={chave}>
              <span>{NOME_ATRIBUTO[chave]}</span>
              <span className="barra" aria-hidden="true">
                <span style={{ width: `${atributos[chave]}%` }} />
              </span>
              <strong>{atributos[chave]}</strong>
            </li>
          ))}
        </ul>
      </section>

      {c.biografia.trim() && <p className="ficha-texto">{c.biografia.trim()}</p>}
      {c.historiaPolitica.trim() && <p className="ficha-texto">{c.historiaPolitica.trim()}</p>}
    </article>
  );
}
