import { useId } from "react";
import { BANDEIRA, caminhoEstrela, ESTRELAS } from "@/lib/bandeira";

// Bandeira Nacional completa, nas proporções da lei.
export function Bandeira({ className, titulo = "Bandeira do Brasil" }: { className?: string; titulo?: string }) {
  const id = useId().replace(/:/g, "");
  const { largura, altura, verde, amarelo, azul, branco, losango, circulo, faixa } = BANDEIRA;
  const meio = (faixa.interno + faixa.externo) / 2;
  return (
    <svg className={className} viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label={titulo}>
      <defs>
        <clipPath id={`globo-${id}`}>
          <circle cx={circulo.x} cy={circulo.y} r={circulo.r} />
        </clipPath>
        <path id={`arco-${id}`} d={`M ${faixa.x - meio} ${faixa.y} A ${meio} ${meio} 0 0 1 ${faixa.x + meio} ${faixa.y}`} />
      </defs>
      <rect width={largura} height={altura} fill={verde} />
      <polygon points={losango.map(([x, y]) => `${x},${y}`).join(" ")} fill={amarelo} />
      <circle cx={circulo.x} cy={circulo.y} r={circulo.r} fill={azul} />
      <g clipPath={`url(#globo-${id})`}>
        <path
          d={`M ${faixa.x - faixa.externo} ${faixa.y} A ${faixa.externo} ${faixa.externo} 0 0 1 ${faixa.x + faixa.externo} ${faixa.y} L ${faixa.x + faixa.interno} ${faixa.y} A ${faixa.interno} ${faixa.interno} 0 0 0 ${faixa.x - faixa.interno} ${faixa.y} Z`}
          fill={branco}
        />
        {ESTRELAS.map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={caminhoEstrela(x, y, r)} fill={branco} />
        ))}
        <text fill={verde} fontSize="4.6" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.15" dy="1.6">
          <textPath href={`#arco-${id}`} startOffset="50%" textAnchor="middle">
            {BANDEIRA.disticoTexto}
          </textPath>
        </text>
      </g>
    </svg>
  );
}
