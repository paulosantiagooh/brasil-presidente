import { Congresso, MapaDoBrasil } from "@/components/Fundo";
import { MenuPrincipal } from "@/components/MenuPrincipal";

const CENARIO = [
  { valor: "27", rotulo: "unidades da federação" },
  { valor: "5", rotulo: "semanas de campanha" },
  { valor: "2", rotulo: "turnos" },
  { valor: "4", rotulo: "anos de mandato" },
];

export default function Inicio() {
  return (
    <main className="inicio">
      <div className="fundo" aria-hidden="true">
        <MapaDoBrasil />
        <Congresso />
      </div>

      <div className="conteudo">
        <header className="marca">
          <p className="sobretitulo">Eleição presidencial de 2030</p>
          <h1 className="logotipo">
            <span className="logotipo-pais">Brasil:</span>{" "}
            <span className="logotipo-cargo">Presidente</span>
          </h1>
          <p className="chamada">
            Dispute a eleição, governe o país e responda pelas consequências.
          </p>
        </header>

        <MenuPrincipal />

        <section className="cenario" aria-label="Cenário de 2030">
          <dl>
            {CENARIO.map((item) => (
              <div key={item.rotulo}>
                <dd>{item.valor}</dd>
                <dt>{item.rotulo}</dt>
              </div>
            ))}
          </dl>
          <p className="aviso">
            Simulação fictícia. Políticos reais aparecem em um cenário hipotético: ações, pesquisas
            e resultados são inventados pelo jogo e não preveem 2030.
          </p>
        </section>
      </div>
    </main>
  );
}
