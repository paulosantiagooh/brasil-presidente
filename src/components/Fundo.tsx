import {
  ALTURA_MAPA,
  CENTRO,
  LARGURA_MAPA,
  PONTOS_CAPITAIS,
  tracarContorno,
  tracarLigacao,
  tracarPontos,
} from "@/lib/mapa";

const PONTOS = tracarPontos(12.5);
const CONTORNO = tracarContorno();

export function MapaDoBrasil() {
  return (
    <svg
      className="mapa"
      viewBox={`-10 -10 ${LARGURA_MAPA + 20} ${ALTURA_MAPA + 20}`}
      aria-hidden="true"
      focusable="false"
    >
      <path className="mapa-contorno" d={CONTORNO} />
      <path className="mapa-pontos" d={PONTOS} />
      {PONTOS_CAPITAIS.map((capital, indice) => (
        <path
          key={indice}
          className="mapa-ligacao"
          d={tracarLigacao(capital)}
          style={{ animationDelay: `${(indice % 9) * 0.9}s` }}
        />
      ))}
      {PONTOS_CAPITAIS.map((capital, indice) => (
        <circle key={indice} className="mapa-capital" cx={capital.x} cy={capital.y} r="3" />
      ))}
      <circle className="mapa-pulso" cx={CENTRO.x} cy={CENTRO.y} r="9" />
      <circle className="mapa-brasilia" cx={CENTRO.x} cy={CENTRO.y} r="5.5" />
    </svg>
  );
}

// Silhueta do Congresso Nacional: Senado, torres e Câmara.
export function Congresso() {
  return (
    <svg
      className="congresso"
      viewBox="0 0 1200 170"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 160H1200" />
      <path d="M110 160L190 132H1010L1090 160" />
      <path d="M190 132H1010V144H190Z" />
      <path d="M338 132A62 40 0 0 1 462 132Z" />
      <path d="M712 94H888C872 124 836 132 800 132C764 132 728 124 712 94Z" />
      <path d="M584 18H606V132H584ZM614 18H636V132H614ZM606 68H614V74H606Z" />
    </svg>
  );
}
