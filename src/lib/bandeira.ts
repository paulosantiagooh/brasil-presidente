// Geometria da Bandeira Nacional (Lei 5.700/1971), em unidades de 10 por módulo: 20 por 14 módulos.
// A lei proíbe mudar a forma, as cores, as proporções ou o dístico, então o jogo desenha sempre a bandeira inteira.
export const BANDEIRA = {
  largura: 200,
  altura: 140,
  verde: "#009c3b",
  amarelo: "#ffdf00",
  azul: "#002776",
  branco: "#ffffff",
  // Losango a 1,7 módulo das bordas.
  losango: [
    [17, 70],
    [100, 17],
    [183, 70],
    [100, 123],
  ] as const,
  circulo: { x: 100, y: 70, r: 35 },
  // A faixa branca é um arco com centro 2 módulos abaixo da base, raios de 8 e 8,5 módulos.
  faixa: { x: 100, y: 160, interno: 80, externo: 85 },
  disticoTexto: "ORDEM E PROGRESSO",
};

// As 27 estrelas, uma por unidade da federação. Posições aproximadas em escala de jogo.
export const ESTRELAS: [number, number, number][] = [
  [108, 63, 1.6],
  [101, 90, 1.9], [101, 100, 1.9], [95, 95, 1.6], [107, 94, 1.6], [103, 97, 1.1],
  [74, 86, 1.3], [77, 90, 1.2], [80, 94, 1.4], [84, 97, 1.2], [88, 100, 1.3], [82, 99, 1.1], [76, 94, 1.1],
  [120, 86, 1.9], [125, 89, 1.3], [117, 92, 1.3], [124, 95, 1.2], [119, 98, 1.2],
  [90, 85, 1.1], [110, 86, 1.2], [96, 86, 1.1], [113, 92, 1.1], [129, 89, 1.1], [93, 103, 1.2], [107, 103, 1.2],
  [100, 104, 1.1], [111, 99, 1.1],
];

export function caminhoEstrela(x: number, y: number, r: number) {
  const pontos: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const raio = i % 2 === 0 ? r : r * 0.42;
    const angulo = -Math.PI / 2 + (i * Math.PI) / 5;
    pontos.push(`${(x + Math.cos(angulo) * raio).toFixed(2)},${(y + Math.sin(angulo) * raio).toFixed(2)}`);
  }
  return `M${pontos.join("L")}Z`;
}

// Desenha a bandeira num canvas (usada como textura pelas cenas).
export function desenharBandeira(c: CanvasRenderingContext2D) {
  const { largura, altura, verde, amarelo, azul, branco, losango, circulo, faixa } = BANDEIRA;
  c.fillStyle = verde;
  c.fillRect(0, 0, largura, altura);
  c.fillStyle = amarelo;
  c.beginPath();
  losango.forEach(([x, y], i) => (i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
  c.closePath();
  c.fill();
  c.save();
  c.beginPath();
  c.arc(circulo.x, circulo.y, circulo.r, 0, Math.PI * 2);
  c.fillStyle = azul;
  c.fill();
  c.clip();
  c.beginPath();
  c.arc(faixa.x, faixa.y, faixa.externo, 0, Math.PI * 2);
  c.arc(faixa.x, faixa.y, faixa.interno, 0, Math.PI * 2, true);
  c.fillStyle = branco;
  c.fill("evenodd");
  c.fillStyle = branco;
  for (const [x, y, r] of ESTRELAS) c.fill(new Path2D(caminhoEstrela(x, y, r)));
  // O dístico acompanha a curva da faixa.
  c.fillStyle = verde;
  c.font = "700 4.6px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  const raio = (faixa.interno + faixa.externo) / 2;
  const texto = BANDEIRA.disticoTexto;
  const passo = 0.0335;
  const inicio = -Math.PI / 2 - ((texto.length - 1) * passo) / 2;
  for (let i = 0; i < texto.length; i += 1) {
    const angulo = inicio + i * passo;
    c.save();
    c.translate(faixa.x + Math.cos(angulo) * raio, faixa.y + Math.sin(angulo) * raio);
    c.rotate(angulo + Math.PI / 2);
    c.fillText(texto[i], 0, 0.3);
    c.restore();
  }
  c.restore();
}
