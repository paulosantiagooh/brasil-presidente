// Contorno simplificado do Brasil (longitude, latitude), usado só como arte de fundo.
// O mapa eleitoral jogável terá dados geográficos oficiais de cada estado.
const CONTORNO: [number, number][] = [
  [-51.6, 4.4], [-50.0, 1.7], [-50.0, 0.9], [-48.4, -0.5], [-47.0, -0.7], [-44.3, -2.4],
  [-41.8, -2.9], [-39.0, -3.0], [-37.2, -4.8], [-35.3, -5.2], [-34.8, -7.2], [-35.0, -9.0],
  [-36.4, -10.6], [-37.6, -12.0], [-38.5, -13.0], [-39.0, -15.0], [-39.2, -17.7], [-39.8, -19.6],
  [-40.9, -21.2], [-41.0, -22.0], [-42.0, -23.0], [-44.6, -23.2], [-46.3, -24.1], [-48.0, -25.3],
  [-48.6, -26.4], [-48.5, -28.2], [-49.7, -29.4], [-50.8, -31.0], [-52.2, -32.5], [-53.4, -33.75],
  [-53.5, -32.6], [-54.6, -31.5], [-55.6, -30.9], [-57.6, -30.2], [-56.2, -28.8], [-55.0, -27.8],
  [-53.8, -27.1], [-53.7, -26.2], [-54.6, -25.6], [-54.3, -24.1], [-55.4, -24.0], [-55.8, -22.4],
  [-57.9, -22.1], [-58.0, -20.2], [-57.7, -19.0], [-58.4, -17.2], [-60.2, -16.3], [-60.5, -13.8],
  [-61.9, -13.5], [-64.5, -12.4], [-65.3, -10.8], [-65.4, -9.7], [-67.0, -10.3], [-69.6, -11.0],
  [-70.6, -11.0], [-70.6, -9.5], [-72.2, -9.9], [-73.2, -9.4], [-74.0, -7.5], [-73.1, -6.4],
  [-73.0, -5.0], [-71.9, -4.4], [-70.0, -4.3], [-69.4, -1.1], [-70.0, 0.6], [-69.2, 1.0],
  [-66.9, 1.2], [-65.6, 0.9], [-63.4, 2.2], [-64.0, 3.9], [-62.8, 3.7], [-60.9, 5.2],
  [-60.2, 5.27], [-59.9, 4.4], [-59.8, 2.4], [-58.8, 1.4], [-56.5, 1.9], [-55.0, 2.5],
  [-54.0, 2.2], [-52.7, 2.3],
];

// As 26 capitais estaduais e Brasília.
const CAPITAIS: [number, number][] = [
  [-67.81, -9.97], [-35.73, -9.66], [-51.07, 0.03], [-60.02, -3.12], [-38.51, -12.97],
  [-38.54, -3.73], [-40.31, -20.32], [-49.25, -16.68], [-44.3, -2.53], [-56.1, -15.6],
  [-54.62, -20.45], [-43.94, -19.92], [-48.5, -1.46], [-34.86, -7.12], [-49.27, -25.43],
  [-34.88, -8.05], [-42.8, -5.09], [-43.2, -22.91], [-35.21, -5.79], [-51.23, -30.03],
  [-63.9, -8.76], [-60.67, 2.82], [-48.55, -27.6], [-46.63, -23.55], [-37.07, -10.91],
  [-48.33, -10.18],
];

const BRASILIA: [number, number] = [-47.88, -15.79];

export const LARGURA_MAPA = 780;
export const ALTURA_MAPA = 800;

type Ponto = { x: number; y: number };

function projetar([longitude, latitude]: [number, number]): Ponto {
  return { x: (longitude + 74.5) * 0.966 * 20, y: (5.8 - latitude) * 20 };
}

const POLIGONO = CONTORNO.map(projetar);

function estaDentro({ x, y }: Ponto) {
  let dentro = false;
  for (let i = 0, j = POLIGONO.length - 1; i < POLIGONO.length; j = i++) {
    const a = POLIGONO[i];
    const b = POLIGONO[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
      dentro = !dentro;
    }
  }
  return dentro;
}

// Todos os pontos do território em um único traço, para o navegador desenhar rápido.
export function tracarPontos(passo: number) {
  let traco = "";
  let linha = 0;
  for (let y = 0; y <= ALTURA_MAPA; y += passo * 0.866, linha++) {
    for (let x = linha % 2 ? passo / 2 : 0; x <= LARGURA_MAPA; x += passo) {
      if (estaDentro({ x, y })) traco += `M${x.toFixed(1)} ${y.toFixed(1)}h.01`;
    }
  }
  return traco;
}

export function tracarContorno() {
  return `M${POLIGONO.map(({ x, y }) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
}

export const CENTRO = projetar(BRASILIA);
export const PONTOS_CAPITAIS = CAPITAIS.map(projetar);

// Uma curva leve de Brasília até a capital.
export function tracarLigacao(destino: Ponto) {
  const meioX = (CENTRO.x + destino.x) / 2;
  const meioY = (CENTRO.y + destino.y) / 2;
  const curvaX = meioX + (destino.y - CENTRO.y) * 0.14;
  const curvaY = meioY - (destino.x - CENTRO.x) * 0.14;
  return `M${CENTRO.x.toFixed(1)} ${CENTRO.y.toFixed(1)}Q${curvaX.toFixed(1)} ${curvaY.toFixed(1)} ${destino.x.toFixed(1)} ${destino.y.toFixed(1)}`;
}
