import type { TipoCena } from "@/lib/cenas";

export const DURACAO = 5;
export const LARGURA = 640;
export const ALTURA = 360;

const L = LARGURA;
const A = ALTURA;
const PI = Math.PI;

type C = CanvasRenderingContext2D;

const VERDE = "#0f8a56";
const AMARELO = "#f2c14e";
const AZUL = "#1f4fa8";
const TURQUESA = "#2dd4bf";

// Tudo depende só do tempo: qualquer quadro pode ser desenhado de novo, igual, em qualquer ordem.
function acaso(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function suave(x: number) {
  const v = Math.min(1, Math.max(0, x));
  return v * v * (3 - 2 * v);
}

function trecho(t: number, de: number, ate: number) {
  return suave((t - de) / (ate - de));
}

function fonte(tamanho: number) {
  const familia = getComputedStyle(document.documentElement).getPropertyValue("--fonte-titulo").trim();
  return `700 ${tamanho}px ${familia || "sans-serif"}, sans-serif`;
}

function ceu(c: C, ...cores: string[]) {
  const g = c.createLinearGradient(0, 0, 0, A);
  cores.forEach((cor, i) => g.addColorStop(i / (cores.length - 1), cor));
  c.fillStyle = g;
  c.fillRect(-80, -80, L + 160, A + 160);
}

function brilho(c: C, x: number, y: number, r: number, cor: string, alfa = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, cor);
  g.addColorStop(1, "rgba(0,0,0,0)");
  c.save();
  c.globalAlpha = alfa;
  c.globalCompositeOperation = "lighter";
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
  c.restore();
}

function aproximar(c: C, z: number, x = L / 2, y = A / 2) {
  c.translate(x, y);
  c.scale(z, z);
  c.translate(-x, -y);
}

function chao(c: C, y: number, cor: string) {
  c.fillStyle = cor;
  c.fillRect(-80, y, L + 160, A - y + 80);
}

function circulo(c: C, x: number, y: number, r: number) {
  c.beginPath();
  c.arc(x, y, r, 0, PI * 2);
  c.fill();
}

function linha(c: C, x1: number, y1: number, x2: number, y2: number) {
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function congresso(c: C, x: number, y: number, e: number, cor: string, luz = 0) {
  c.fillStyle = cor;
  c.fillRect(x - 175 * e, y - 16 * e, 350 * e, 16 * e);
  c.fillRect(x - 18 * e, y - 122 * e, 15 * e, 106 * e);
  c.fillRect(x + 3 * e, y - 122 * e, 15 * e, 106 * e);
  c.fillRect(x - 3 * e, y - 78 * e, 6 * e, 8 * e);
  c.beginPath();
  c.arc(x - 95 * e, y - 16 * e, 32 * e, PI, 0);
  c.fill();
  c.beginPath();
  c.moveTo(x + 48 * e, y - 54 * e);
  c.lineTo(x + 142 * e, y - 54 * e);
  c.quadraticCurveTo(x + 128 * e, y - 16 * e, x + 95 * e, y - 16 * e);
  c.quadraticCurveTo(x + 62 * e, y - 16 * e, x + 48 * e, y - 54 * e);
  c.fill();
  if (luz <= 0) return;
  for (let i = 0; i < 16; i += 1) {
    for (const lado of [-16, 5]) {
      if (acaso(i * 3 + lado) > 0.72) continue;
      c.fillStyle = `rgba(255,214,140,${luz * (0.5 + acaso(i) * 0.5)})`;
      c.fillRect(x + lado * e, y - (118 - i * 6) * e, 11 * e, 2.6 * e);
    }
  }
}

function ministerios(c: C, y: number, cor: string) {
  c.fillStyle = cor;
  for (let i = 0; i < 6; i += 1) {
    const altura = 54 - i * 6;
    const largura = 26 - i * 2;
    c.fillRect(22 + i * 33, y - altura, largura, altura);
    c.fillRect(L - 22 - i * 33 - largura, y - altura, largura, altura);
  }
}

function palacio(c: C, x: number, y: number, e: number, cor: string, vidro: string) {
  c.fillStyle = vidro;
  c.fillRect(x - 185 * e, y - 64 * e, 370 * e, 54 * e);
  c.fillStyle = cor;
  c.fillRect(x - 210 * e, y - 72 * e, 420 * e, 9 * e);
  c.fillRect(x - 210 * e, y - 13 * e, 420 * e, 7 * e);
  for (let i = 0; i <= 8; i += 1) {
    const cx = x - 190 * e + i * 47.5 * e;
    c.beginPath();
    c.moveTo(cx, y - 64 * e);
    c.quadraticCurveTo(cx + 17 * e, y - 38 * e, cx, y - 7 * e);
    c.quadraticCurveTo(cx - 17 * e, y - 38 * e, cx, y - 64 * e);
    c.fill();
  }
}

function pessoa(c: C, x: number, y: number, h: number, cor: string, braco = 0) {
  const r = h * 0.105;
  c.fillStyle = cor;
  circulo(c, x, y - h + r, r);
  c.beginPath();
  c.roundRect(x - h * 0.15, y - h + r * 2.3, h * 0.3, h * 0.46, h * 0.07);
  c.fill();
  c.fillRect(x - h * 0.13, y - h * 0.36, h * 0.11, h * 0.36);
  c.fillRect(x + h * 0.02, y - h * 0.36, h * 0.11, h * 0.36);
  if (braco === 0) return;
  c.strokeStyle = cor;
  c.lineCap = "round";
  c.lineWidth = h * 0.075;
  linha(c, x + h * 0.13, y - h * 0.72, x + h * (0.16 + braco * 0.1), y - h * 1.04);
}

// Uma fileira de gente vista de costas, com a cabeça balançando e alguns braços para cima.
function multidao(c: C, y: number, n: number, tam: number, cor: string, t: number, semente: number, passo = 0) {
  c.fillStyle = cor;
  c.fillRect(-80, y + tam * 0.7, L + 160, A - y + 80);
  c.strokeStyle = cor;
  c.lineCap = "round";
  for (let i = 0; i < n; i += 1) {
    const base = acaso(i + semente);
    const x = ((base * (L + 120) + t * passo) % (L + 120)) - 60;
    const pulo = Math.sin(t * (3 + acaso(i + semente + 1) * 3) + i) * tam * 0.14;
    const topo = y + pulo + acaso(i + semente + 2) * tam * 0.3;
    circulo(c, x, topo, tam * 0.36);
    c.beginPath();
    c.roundRect(x - tam * 0.62, topo + tam * 0.3, tam * 1.24, tam * 2.4, tam * 0.4);
    c.fill();
    if (acaso(i + semente + 3) > 0.7) {
      c.lineWidth = tam * 0.24;
      const balanco = Math.sin(t * 5 + i) * tam * 0.3;
      linha(c, x + tam * 0.5, topo + tam * 0.6, x + tam * 0.72 + balanco, topo - tam * 0.9);
    }
  }
}

function bandeira(c: C, x: number, y: number, l: number, h: number, t: number) {
  const onda = (u: number) => Math.sin(u * 5 - t * 5) * h * 0.09 * u;
  c.strokeStyle = "#20282b";
  c.lineWidth = 2.5;
  linha(c, x, y - 4, x, y + h * 2.4);
  const passos = 16;
  c.fillStyle = VERDE;
  c.beginPath();
  for (let i = 0; i <= passos; i += 1) c.lineTo(x + (i / passos) * l, y + onda(i / passos));
  for (let i = passos; i >= 0; i -= 1) c.lineTo(x + (i / passos) * l, y + h + onda(i / passos));
  c.closePath();
  c.fill();
  c.fillStyle = AMARELO;
  c.beginPath();
  c.moveTo(x + l * 0.08, y + h / 2 + onda(0.08));
  c.lineTo(x + l * 0.5, y + h * 0.1 + onda(0.5));
  c.lineTo(x + l * 0.92, y + h / 2 + onda(0.92));
  c.lineTo(x + l * 0.5, y + h * 0.9 + onda(0.5));
  c.closePath();
  c.fill();
  c.fillStyle = AZUL;
  circulo(c, x + l * 0.5, y + h / 2 + onda(0.5), h * 0.22);
}

function fumaca(c: C, x: number, y: number, t: number, cor: string, n = 8, tamanho = 40) {
  c.fillStyle = cor;
  for (let i = 0; i < n; i += 1) {
    const vida = (t * 0.28 + acaso(i + x)) % 1;
    c.globalAlpha = (1 - vida) * 0.42;
    circulo(c, x + Math.sin(vida * 4 + i) * 22 + vida * 30, y - vida * 170, 8 + vida * tamanho);
  }
  c.globalAlpha = 1;
}

function chamas(c: C, x: number, y: number, t: number, tam: number) {
  brilho(c, x, y - tam * 0.6, tam * 3, "#ff7a1a", 0.65);
  for (let i = 0; i < 9; i += 1) {
    const vida = (t * 1.5 + acaso(i + x)) % 1;
    c.globalAlpha = 1 - vida;
    c.fillStyle = vida < 0.4 ? "#ffe08a" : vida < 0.7 ? "#ff9a2e" : "#d63c1e";
    circulo(c, x + (acaso(i) - 0.5) * tam * 1.3 + Math.sin(t * 6 + i) * 3, y - vida * tam * 1.8, tam * 0.42 * (1 - vida * 0.7));
  }
  c.globalAlpha = 1;
}

function confete(c: C, t: number, n: number, cores: string[]) {
  for (let i = 0; i < n; i += 1) {
    const x = acaso(i) * L + Math.sin(t * 2 + i) * 14;
    const y = ((acaso(i + 40) * (A + 40) + t * (50 + acaso(i + 80) * 70)) % (A + 40)) - 20;
    c.save();
    c.translate(x, y);
    c.rotate(t * 3 + i);
    c.fillStyle = cores[i % cores.length];
    c.fillRect(-3, -1.8, 6, 3.6);
    c.restore();
  }
}

function chuva(c: C, t: number, n: number, alfa: number) {
  c.strokeStyle = `rgba(190,215,235,${alfa})`;
  c.lineWidth = 1;
  c.lineCap = "butt";
  for (let i = 0; i < n; i += 1) {
    const x = acaso(i) * (L + 100) - 20 - ((t * 240) % 40);
    const y = (acaso(i + 90) * (A + 40) + t * (620 + acaso(i) * 240)) % (A + 40);
    linha(c, x, y - 20, x - 5, y);
  }
}

function carimbo(c: C, texto: string, cor: string, t: number, inicio: number) {
  const p = trecho(t, inicio, inicio + 0.22);
  if (p <= 0) return;
  c.save();
  c.translate(L / 2, A / 2);
  c.rotate(-0.09);
  const escala = 2.3 - p * 1.3;
  c.scale(escala, escala);
  c.globalAlpha = p;
  c.font = fonte(64);
  c.textAlign = "center";
  c.textBaseline = "middle";
  const largura = c.measureText(texto).width + 44;
  c.fillStyle = "rgba(6,14,16,0.82)";
  c.fillRect(-largura / 2, -46, largura, 92);
  c.strokeStyle = cor;
  c.lineWidth = 5;
  c.strokeRect(-largura / 2, -46, largura, 92);
  c.fillStyle = cor;
  c.fillText(texto, 0, 3);
  c.restore();
}

function letreiro(c: C, texto: string, x: number, y: number, tam: number, cor: string, alinhar: CanvasTextAlign = "center") {
  c.font = fonte(tam);
  c.textAlign = alinhar;
  c.textBaseline = "middle";
  c.fillStyle = cor;
  c.fillText(texto, x, y);
}

function plenario(c: C, cx: number, cy: number, votou: number, sim: number) {
  let i = 0;
  for (let fila = 0; fila < 7; fila += 1) {
    const raio = 62 + fila * 25;
    const total = 16 + fila * 7;
    for (let k = 0; k < total; k += 1) {
      const angulo = PI + ((k + 0.5) / total) * PI;
      const x = cx + Math.cos(angulo) * raio * 1.72;
      const y = cy + Math.sin(angulo) * raio * 0.88;
      i += 1;
      const ja = acaso(i) < votou;
      c.fillStyle = !ja ? "#1d3238" : acaso(i + 700) < sim ? "#28c98a" : "#ef5b4c";
      if (ja) brilho(c, x, y, 9, c.fillStyle as string, 0.35);
      c.beginPath();
      c.roundRect(x - 4.5, y - 3, 9, 6, 2);
      c.fill();
    }
  }
}

function salaDoPlenario(c: C) {
  ceu(c, "#071216", "#0d2127", "#10272d");
  c.fillStyle = "#0a1a1f";
  c.fillRect(-80, 300, L + 160, 140);
  c.fillStyle = "#16343b";
  c.fillRect(190, 276, 260, 46);
  c.fillStyle = "#0b2025";
  c.fillRect(204, 284, 232, 8);
}

function martelo(c: C, x: number, y: number, angulo: number, e = 1) {
  c.save();
  c.translate(x, y);
  c.rotate(angulo);
  c.scale(e, e);
  c.fillStyle = "#6b3f22";
  c.fillRect(-4, -4, 96, 8);
  c.fillStyle = "#8a5430";
  c.beginPath();
  c.roundRect(82, -24, 30, 48, 5);
  c.fill();
  c.fillStyle = AMARELO;
  c.fillRect(88, -24, 3, 48);
  c.fillRect(103, -24, 3, 48);
  c.restore();
}

function votacao(c: C, t: number, aprovado: boolean) {
  c.save();
  aproximar(c, 1 + trecho(t, 0, 3.4) * 0.09, L / 2, 240);
  salaDoPlenario(c);
  plenario(c, L / 2, 262, trecho(t, 0.2, 3.1), aprovado ? 0.68 : 0.36);
  const batida = t > 3.2 ? 0 : -1.1 + Math.sin(t * 3) * 0.05;
  martelo(c, 240, 272, batida);
  if (t > 3.2 && t < 3.55) brilho(c, 340, 272, 240, "#ffffff", 0.5 * (3.55 - t) / 0.35);
  c.restore();
  carimbo(c, aprovado ? "APROVADO" : "REJEITADO", aprovado ? "#3fe0a2" : "#ff7b6c", t, 3.25);
}

function janelas(c: C, x: number, y: number, l: number, h: number, semente: number, aceso: number) {
  for (let i = 0; i * 12 < l - 6; i += 1) {
    for (let j = 0; j * 14 < h - 8; j += 1) {
      const n = semente + i * 13 + j * 7;
      if (acaso(n) > aceso) continue;
      c.fillStyle = "#ffd890";
      c.fillRect(x + 5 + i * 12, y + 6 + j * 14, 6, 8);
    }
  }
}

function cidade(c: C, base: number, cor: string, aceso: (i: number) => number) {
  for (let i = 0; i < 15; i += 1) {
    const l = 34 + acaso(i) * 28;
    const h = 60 + acaso(i + 30) * 150;
    const x = -20 + i * 46;
    c.fillStyle = cor;
    c.fillRect(x, base - h, l, h);
    janelas(c, x, base - h, l, h, i * 41, aceso(i));
  }
}

function caminhao(c: C, x: number, y: number, e: number, cor: string, alerta: boolean) {
  c.fillStyle = cor;
  c.fillRect(x, y - 44 * e, 96 * e, 34 * e);
  c.fillStyle = "#283a40";
  c.beginPath();
  c.roundRect(x + 98 * e, y - 38 * e, 30 * e, 28 * e, 5 * e);
  c.fill();
  c.fillStyle = "#9fd2e0";
  c.fillRect(x + 110 * e, y - 33 * e, 14 * e, 11 * e);
  c.fillStyle = "#0a1012";
  for (const roda of [18, 72, 112]) circulo(c, x + roda * e, y - 8 * e, 8 * e);
  if (alerta) {
    brilho(c, x + 2 * e, y - 16 * e, 26 * e, "#ffb020", 0.9);
    brilho(c, x + 126 * e, y - 16 * e, 26 * e, "#ffb020", 0.9);
  }
}

function aviao(c: C, x: number, y: number, e: number, angulo: number) {
  c.save();
  c.translate(x, y);
  c.rotate(angulo);
  c.scale(e, e);
  c.fillStyle = "#e6edf0";
  c.beginPath();
  c.roundRect(-70, -9, 140, 18, 9);
  c.fill();
  c.fillStyle = TURQUESA;
  c.fillRect(-62, -1, 124, 3);
  c.fillStyle = "#c2ced3";
  c.beginPath();
  c.moveTo(-54, -7);
  c.lineTo(-72, -32);
  c.lineTo(-60, -32);
  c.lineTo(-32, -7);
  c.fill();
  c.beginPath();
  c.moveTo(-8, 4);
  c.lineTo(-38, 26);
  c.lineTo(-20, 26);
  c.lineTo(22, 4);
  c.fill();
  c.restore();
}

function telefone(c: C, x: number, y: number, tremor: number) {
  c.save();
  c.translate(x + Math.sin(tremor * 60) * 2.4 * (tremor > 0 ? 1 : 0), y);
  c.fillStyle = "#14272c";
  c.beginPath();
  c.roundRect(-34, -12, 68, 28, 5);
  c.fill();
  c.fillStyle = "#1d3a40";
  c.beginPath();
  c.roundRect(-42, -24, 84, 14, 7);
  c.fill();
  c.fillStyle = "#ef5b4c";
  circulo(c, 22, 2, 3.5);
  c.restore();
}

const CENARIOS: Record<TipoCena, (c: C, t: number) => void> = {
  gabinete(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.07, 300, 210);
    ceu(c, "#081318", "#0f1f2a");
    c.fillStyle = "#0f2c3b";
    c.fillRect(70, 34, 330, 200);
    const g = c.createLinearGradient(0, 34, 0, 234);
    g.addColorStop(0, "#0d2240");
    g.addColorStop(1, "#5a3a5e");
    c.fillStyle = g;
    c.fillRect(78, 42, 314, 184);
    congresso(c, 235, 224, 0.72, "#07141d", 0.9);
    c.fillStyle = "#0a1a1f";
    c.fillRect(232, 42, 6, 184);
    brilho(c, 480, 210, 170, "#ffcf7a", 0.55);
    c.fillStyle = "#17120d";
    c.fillRect(-80, 262, L + 160, 140);
    c.fillStyle = "#2a1d13";
    c.fillRect(-80, 256, L + 160, 10);
    c.fillStyle = "#c79a4e";
    c.beginPath();
    c.moveTo(470, 196);
    c.lineTo(520, 196);
    c.lineTo(538, 226);
    c.lineTo(452, 226);
    c.fill();
    c.fillStyle = "#3b2a18";
    c.fillRect(492, 226, 6, 30);
    c.fillStyle = "#e8e4d6";
    for (let i = 0; i < 3; i += 1) c.fillRect(90 + i * 8, 248 - i * 3, 120, 7);
    const toca = t % 1.7 < 0.9 ? t : 0;
    telefone(c, 340, 240, toca);
    if (toca) {
      c.strokeStyle = "rgba(242,193,78,0.8)";
      c.lineWidth = 2;
      for (let i = 1; i < 4; i += 1) {
        c.globalAlpha = 1 - ((t * 2 + i / 3) % 1);
        c.beginPath();
        c.arc(340, 226, i * 12 + ((t * 24) % 12), -2.4, -0.7);
        c.stroke();
      }
      c.globalAlpha = 1;
    }
    c.restore();
  },

  protesto(c, t) {
    c.save();
    aproximar(c, 1.02 + (t / DURACAO) * 0.08, 320, 240);
    ceu(c, "#23133a", "#8e2f47", "#f09a4f");
    brilho(c, 320, 214, 230, "#ffb46a", 0.7);
    congresso(c, 320, 228, 0.82, "#2b1630");
    ministerios(c, 228, "#34193a");
    chao(c, 226, "#3a1b33");
    fumaca(c, 130, 240, t, "#ff5a4a", 9);
    fumaca(c, 520, 236, t + 2, "#ffe4c4", 8);
    multidao(c, 226, 80, 7, "#27112c", t, 3, 8);
    bandeira(c, 170 + Math.sin(t) * 4, 134, 70, 44, t);
    multidao(c, 256, 56, 11, "#1a0b20", t, 11, -14);
    c.fillStyle = "#f1ece0";
    for (const [x, y, l] of [[86, 214, 74], [410, 204, 92]]) {
      const balanco = Math.sin(t * 2.4 + x) * 5;
      c.save();
      c.translate(x + balanco, y + Math.cos(t * 3 + x) * 3);
      c.rotate(balanco * 0.012);
      c.fillStyle = "#f1ece0";
      c.fillRect(0, 0, l, 30);
      c.fillStyle = "#c63d33";
      c.fillRect(8, 8, l - 16, 5);
      c.fillRect(8, 17, l - 30, 5);
      c.fillStyle = "#120710";
      c.fillRect(l / 2 - 2, 30, 4, 46);
      c.restore();
    }
    multidao(c, 296, 30, 18, "#0e0512", t, 23, 18);
    c.restore();
  },

  fogo(c, t) {
    c.save();
    aproximar(c, 1.04 + (t / DURACAO) * 0.09, 320, 240);
    ceu(c, "#0a0710", "#2a0f16", "#7c2413");
    cidade(c, 250, "#130a12", () => 0.16);
    chao(c, 248, "#1a0d0f");
    fumaca(c, 170, 246, t, "#2a2024", 12, 70);
    fumaca(c, 470, 250, t + 1.3, "#2a2024", 12, 70);
    chamas(c, 170, 262, t, 40);
    chamas(c, 470, 268, t + 1, 52);
    chamas(c, 320, 256, t + 2, 28);
    multidao(c, 272, 40, 12, "#0d0508", t, 5, -12);
    multidao(c, 306, 26, 19, "#060204", t, 17, 16);
    c.restore();
    if (Math.sin(t * 13) > 0.8) brilho(c, 320, 200, 400, "#ff8a3a", 0.1);
  },

  aprovado(c, t) {
    votacao(c, t, true);
  },

  rejeitado(c, t) {
    votacao(c, t, false);
  },

  imprensa(c, t) {
    c.save();
    aproximar(c, 1.1 - (t / DURACAO) * 0.07, 320, 200);
    ceu(c, "#0b2340", "#123a5e");
    c.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 9; i += 1) c.fillRect(i * 78 - 10, 0, 34, A);
    brilho(c, 320, 120, 220, "#7fc3ff", 0.4);
    pessoa(c, 320, 300, 196, "#0a1420");
    c.fillStyle = "#1a2c3a";
    c.beginPath();
    c.moveTo(260, 232);
    c.lineTo(380, 232);
    c.lineTo(392, 340);
    c.lineTo(248, 340);
    c.fill();
    c.fillStyle = AMARELO;
    circulo(c, 320, 268, 15);
    c.fillStyle = "#1a2c3a";
    circulo(c, 320, 268, 9);
    c.strokeStyle = "#111";
    c.lineWidth = 3;
    for (const lado of [-26, -10, 10, 26]) {
      linha(c, 320 + lado, 232, 320 + lado * 0.7, 196);
      c.fillStyle = lado % 20 === 0 ? "#b73a30" : "#222";
      circulo(c, 320 + lado * 0.7, 192, 6);
    }
    multidao(c, 296, 16, 26, "#050a10", t, 6);
    c.restore();
    for (let i = 0; i < 12; i += 1) {
      const quando = acaso(i) * DURACAO;
      const idade = t - quando;
      if (idade < 0 || idade > 0.16) continue;
      brilho(c, 40 + acaso(i + 20) * 560, 220 + acaso(i + 30) * 110, 150, "#ffffff", (0.16 - idade) / 0.16);
    }
  },

  queda(c, t) {
    grafico(c, t, false);
  },

  alta(c, t) {
    grafico(c, t, true);
  },

  carestia(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.08, 320, 170);
    ceu(c, "#26221c", "#3a342a");
    for (let fila = 0; fila < 3; fila += 1) {
      c.fillStyle = "#6c5a3f";
      c.fillRect(-20, 96 + fila * 82, L + 40, 8);
      for (let i = 0; i < 16; i += 1) {
        const n = fila * 16 + i;
        const altura = 34 + acaso(n) * 26;
        c.fillStyle = ["#b8452f", "#c98a2c", "#3f7f6a", "#4a6da8", "#d8c9a0"][n % 5];
        c.fillRect(i * 42 + 4, 96 + fila * 82 - altura, 32, altura);
      }
    }
    const preco = 8.9 + trecho(t, 0.4, 4.2) * 15.3;
    c.fillStyle = AMARELO;
    c.beginPath();
    c.roundRect(170, 112, 300, 132, 8);
    c.fill();
    c.fillStyle = "#1a1405";
    c.font = fonte(26);
    c.textAlign = "center";
    c.fillText("CESTA DO DIA", 320, 142);
    letreiro(c, `R$ ${preco.toFixed(2).replace(".", ",")}`, 320, 196, 74, "#b22418");
    const seta = 58 + Math.sin(t * 8) * 4;
    c.fillStyle = "#b22418";
    c.beginPath();
    c.moveTo(442, seta + 80);
    c.lineTo(456, seta + 104);
    c.lineTo(428, seta + 104);
    c.fill();
    c.restore();
    c.strokeStyle = "#0d0b08";
    c.lineWidth = 5;
    const x = -190 + trecho(t, 0.3, 3.2) * 240;
    c.strokeRect(x + 30, 278, 130, 50);
    linha(c, x + 30, 278, x, 256);
    c.fillStyle = "#0d0b08";
    circulo(c, x + 56, 340, 9);
    circulo(c, x + 138, 340, 9);
  },

  posse(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.1, 330, 190);
    ceu(c, "#2a79c4", "#7ec3e8", "#e9f1dc");
    c.fillStyle = "rgba(255,255,255,0.75)";
    for (let i = 0; i < 4; i += 1) {
      const x = ((i * 190 + t * 9) % (L + 200)) - 100;
      c.beginPath();
      c.ellipse(x, 56 + i * 16, 62, 11, 0, 0, PI * 2);
      c.fill();
    }
    chao(c, 236, "#b6b89b");
    palacio(c, 340, 236, 0.92, "#f4f4ee", "#38606f");
    c.fillStyle = "#e8e8e0";
    c.beginPath();
    c.moveTo(120, 226);
    c.lineTo(214, 226);
    c.lineTo(96, 282);
    c.lineTo(-20, 282);
    c.fill();
    const subida = trecho(t, 0.2, 4.2);
    const x = 26 + subida * 130;
    const y = 276 - subida * 49;
    pessoa(c, x, y, 40, "#141a22");
    c.strokeStyle = VERDE;
    c.lineWidth = 3;
    linha(c, x - 6, y - 32, x + 6, y - 18);
    c.strokeStyle = AMARELO;
    c.lineWidth = 1.5;
    linha(c, x - 6, y - 31, x + 6, y - 17);
    bandeira(c, 470, 118, 80, 50, t);
    multidao(c, 300, 44, 12, "#1b2a22", t, 9);
    bandeira(c, 40, 226, 62, 38, t + 1);
    multidao(c, 326, 26, 18, "#0f1a15", t, 21);
    c.restore();
    confete(c, t, 70, [VERDE, AMARELO, "#ffffff", AZUL]);
  },

  urna(c, t) {
    c.save();
    aproximar(c, 1.02 + (t / DURACAO) * 0.1, 320, 180);
    ceu(c, "#1b2a33", "#0d1820");
    c.fillStyle = "#3a2a1c";
    c.fillRect(-80, 300, L + 160, 120);
    c.fillStyle = "#d9d5c6";
    c.beginPath();
    c.roundRect(120, 62, 400, 240, 12);
    c.fill();
    c.fillStyle = "#b9b4a2";
    c.fillRect(120, 280, 400, 22);
    c.fillStyle = "#1a2422";
    c.fillRect(146, 86, 200, 170);
    c.fillStyle = "#dbe7d2";
    c.fillRect(152, 92, 188, 158);
    const fim = t > 3.3;
    if (fim) {
      letreiro(c, "FIM", 246, 172, 76, "#1a2422");
    } else {
      letreiro(c, "SEU VOTO", 246, 118, 26, "#1a2422");
      const digitos = Math.min(2, Math.floor(t / 0.9));
      for (let i = 0; i < 2; i += 1) {
        c.strokeStyle = "#1a2422";
        c.lineWidth = 2;
        c.strokeRect(198 + i * 54, 142, 44, 60);
        if (i < digitos) letreiro(c, "•", 220 + i * 54, 172, 56, "#1a2422");
      }
      c.fillStyle = "#1a2422";
      c.fillRect(172, 222, 148 * trecho(t, 2.4, 3.2), 10);
    }
    for (let i = 0; i < 12; i += 1) {
      const x = 372 + (i % 3) * 44;
      const y = 92 + Math.floor(i / 3) * 40;
      c.fillStyle = "#20282b";
      c.beginPath();
      c.roundRect(x, y, 36, 31, 4);
      c.fill();
    }
    c.fillStyle = "#27a55e";
    c.beginPath();
    c.roundRect(372, 256, 124, 20, 3);
    c.fill();
    c.restore();
    const dedo = t < 1.7 ? [430, 148] : t < 2.5 ? [474, 186] : [440, 272];
    const toque = Math.abs(Math.sin(t * 3.4)) * 12;
    c.fillStyle = "#6e4a33";
    c.beginPath();
    c.roundRect(dedo[0] - 12, dedo[1] + toque, 26, 210, 13);
    c.fill();
    c.beginPath();
    c.roundRect(dedo[0] - 16, dedo[1] + 86 + toque, 86, 200, 26);
    c.fill();
  },

  tribunal(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.09, 320, 170);
    ceu(c, "#101a22", "#1e2d36");
    brilho(c, 320, 90, 260, "#a8c8e0", 0.32);
    c.fillStyle = "#26363f";
    for (let i = 0; i < 7; i += 1) c.fillRect(30 + i * 92, 40, 26, 240);
    c.fillStyle = "#0c151a";
    c.fillRect(-80, 280, L + 160, 120);
    c.fillStyle = "#c9a34a";
    const pende = Math.sin(t * 1.8) * 0.13 * (1 - trecho(t, 2.6, 3.2));
    c.fillRect(316, 54, 8, 180);
    c.fillRect(280, 234, 80, 8);
    c.save();
    c.translate(320, 74);
    c.rotate(pende);
    c.fillRect(-120, -3, 240, 6);
    for (const lado of [-1, 1]) {
      const px = lado * 112;
      c.strokeStyle = "#c9a34a";
      c.lineWidth = 2;
      linha(c, px, 0, px - 28, 74);
      linha(c, px, 0, px + 28, 74);
      c.beginPath();
      c.arc(px, 74, 32, 0, PI);
      c.fill();
    }
    c.restore();
    const batida = t < 2.9 ? -1 - trecho(t, 1.7, 2.9) * 0.3 : 0;
    martelo(c, 396, 298, batida + PI, -1);
    c.fillStyle = "#6b3f22";
    c.fillRect(240, 306, 150, 12);
    c.restore();
    if (t > 2.9 && t < 3.3) brilho(c, 320, 300, 300, "#fff5d8", (3.3 - t) / 0.4);
  },

  obra(c, t) {
    c.save();
    aproximar(c, 1.03 + (t / DURACAO) * 0.06, 340, 210);
    ceu(c, "#f6c177", "#f4e2b8", "#a6d0d8");
    brilho(c, 110, 120, 170, "#fff0b8", 0.9);
    chao(c, 286, "#7a6240");
    const andares = Math.floor(trecho(t, 0.2, 4) * 5) + 2;
    c.fillStyle = "#54646a";
    for (let i = 0; i < andares; i += 1) {
      c.fillRect(300, 270 - i * 30, 190, 7);
      for (let k = 0; k < 5; k += 1) c.fillRect(304 + k * 44, 248 - i * 30 + 7, 6, 23);
    }
    c.strokeStyle = "#d39321";
    c.lineWidth = 7;
    linha(c, 160, 286, 160, 52);
    c.lineWidth = 6;
    linha(c, 90, 58, 480, 58);
    linha(c, 160, 20, 90, 58);
    linha(c, 160, 20, 390, 58);
    const carro = 240 + Math.sin(t * 0.9) * 110;
    const cabo = 150 + Math.sin(t * 1.4) * 34;
    c.strokeStyle = "#2c2c2c";
    c.lineWidth = 1.5;
    linha(c, carro, 58, carro, cabo);
    c.fillStyle = "#b64c28";
    c.fillRect(carro - 44, cabo, 88, 9);
    for (let i = 0; i < 3; i += 1) pessoa(c, 210 + i * 34 + Math.sin(t + i) * 10, 288, 30, "#20282b", i === 1 ? 1 : 0);
    if (Math.sin(t * 11) > 0.3) {
      for (let i = 0; i < 8; i += 1) {
        c.fillStyle = AMARELO;
        circulo(c, 394 + acaso(i + Math.floor(t * 9)) * 26 - 13, 270 - (andares - 1) * 30 + acaso(i * 3 + Math.floor(t * 9)) * 22, 1.3);
      }
    }
    c.restore();
  },

  enchente(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.07, 320, 240);
    ceu(c, "#10171f", "#26333d", "#3a4750");
    if (t > 1.3 && t < 1.55) c.fillStyle = "rgba(235,240,255,0.5)";
    if (t > 1.3 && t < 1.55) c.fillRect(-80, -80, L + 160, A + 160);
    if (t > 1.32 && t < 1.5) {
      c.strokeStyle = "#f4f6ff";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(430, -10);
      c.lineTo(404, 60);
      c.lineTo(432, 74);
      c.lineTo(392, 160);
      c.stroke();
    }
    for (let i = 0; i < 8; i += 1) {
      const x = 10 + i * 82;
      const h = 80 + acaso(i) * 60;
      c.fillStyle = "#1a242c";
      c.fillRect(x, 270 - h, 66, h);
      c.beginPath();
      c.moveTo(x - 6, 270 - h);
      c.lineTo(x + 33, 240 - h);
      c.lineTo(x + 72, 270 - h);
      c.fill();
      janelas(c, x, 270 - h, 66, h - 20, i * 9, 0.28);
    }
    const nivel = 276 - trecho(t, 0.1, 4.4) * 76;
    const g = c.createLinearGradient(0, nivel, 0, A);
    g.addColorStop(0, "#6b5a41");
    g.addColorStop(1, "#2a2418");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-80, A + 80);
    for (let x = -80; x <= L + 80; x += 16) c.lineTo(x, nivel + Math.sin(x * 0.04 + t * 3) * 4);
    c.lineTo(L + 80, A + 80);
    c.fill();
    const bx = -130 + t * 104;
    const by = nivel + 28 + Math.sin(t * 2.6) * 3;
    c.fillStyle = "#e0641f";
    c.beginPath();
    c.moveTo(bx, by);
    c.lineTo(bx + 112, by);
    c.lineTo(bx + 94, by + 20);
    c.lineTo(bx + 14, by + 20);
    c.fill();
    pessoa(c, bx + 36, by + 2, 30, "#101418");
    pessoa(c, bx + 72, by + 2, 30, "#101418", 1);
    c.restore();
    chuva(c, t, 150, 0.5);
  },

  seca(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.08, 320, 250);
    ceu(c, "#e98a2c", "#f5b84e", "#f8e0a0");
    c.fillStyle = "#fff4cd";
    circulo(c, 320, 112, 44 + Math.sin(t * 2) * 2);
    brilho(c, 320, 112, 240, "#fff0a8", 0.9);
    chao(c, 232, "#a86f35");
    c.strokeStyle = "#5e3a19";
    c.lineCap = "round";
    const abre = trecho(t, 0.1, 4.3);
    for (let i = 0; i < 42; i += 1) {
      const x = acaso(i) * L;
      const y = 244 + acaso(i + 50) * 112;
      c.lineWidth = 0.7 + abre * 2.2 * (y / A);
      c.beginPath();
      c.moveTo(x, y);
      for (let k = 1; k < 5; k += 1) c.lineTo(x + k * 18 * (0.4 + abre) * (acaso(i + k) > 0.5 ? 1 : -1), y + (acaso(i * k) - 0.4) * 26);
      c.stroke();
    }
    c.strokeStyle = "#2b1a0c";
    c.lineWidth = 7;
    linha(c, 500, 240, 504, 150);
    c.lineWidth = 4;
    linha(c, 503, 186, 464, 140);
    linha(c, 503, 170, 548, 124);
    c.lineWidth = 2.5;
    linha(c, 476, 154, 450, 158);
    linha(c, 530, 142, 556, 150);
    c.restore();
    c.fillStyle = "rgba(255,240,190,0.08)";
    for (let i = 0; i < 6; i += 1) c.fillRect(0, 190 + i * 9 + Math.sin(t * 5 + i) * 3, L, 3);
  },

  apagao(c, t) {
    c.save();
    aproximar(c, 1.06 - (t / DURACAO) * 0.05, 320, 220);
    ceu(c, "#050a14", "#0e1a2c");
    for (let i = 0; i < 50; i += 1) {
      c.fillStyle = `rgba(255,255,255,${0.15 + acaso(i) * 0.5})`;
      c.fillRect(acaso(i + 9) * L, acaso(i + 19) * 150, 1.4, 1.4);
    }
    const onda = trecho(t, 0.9, 3.7) * 18 - 2;
    const pisca = (i: number) => (i < onda ? 0 : i < onda + 1.5 && Math.sin(t * 30 + i) > 0 ? 0.08 : 0.58);
    cidade(c, 318, "#0a121c", pisca);
    chao(c, 316, "#03060b");
    c.restore();
    if (t > 3.8) {
      for (const [x, fase] of [[170, 0], [430, 2]]) {
        const a = Math.sin(t * 1.5 + fase) * 0.45 - 1.57;
        const g = c.createLinearGradient(x, 330, x + Math.cos(a) * 220, 330 + Math.sin(a) * 220);
        g.addColorStop(0, "rgba(255,240,190,0.45)");
        g.addColorStop(1, "rgba(255,240,190,0)");
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(x, 330);
        c.lineTo(x + Math.cos(a - 0.13) * 230, 330 + Math.sin(a - 0.13) * 230);
        c.lineTo(x + Math.cos(a + 0.13) * 230, 330 + Math.sin(a + 0.13) * 230);
        c.fill();
      }
    }
  },

  estrada(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.09, 340, 240);
    ceu(c, "#2a2040", "#b4552f", "#f2a14c");
    brilho(c, 470, 216, 180, "#ffc27a", 0.8);
    c.fillStyle = "#3f2a2e";
    c.beginPath();
    c.moveTo(-80, 226);
    for (let x = -80; x <= L + 80; x += 40) c.lineTo(x, 214 + Math.sin(x * 0.015) * 12);
    c.lineTo(L + 80, 240);
    c.lineTo(-80, 240);
    c.fill();
    chao(c, 236, "#2a2528");
    c.fillStyle = "#e9c94e";
    for (let i = 0; i < 9; i += 1) c.fillRect(i * 80 - 20, 296, 42, 4);
    const alerta = t % 0.8 < 0.4;
    caminhao(c, 40, 254, 0.8, "#7a3a2c", alerta);
    caminhao(c, 200, 254, 0.8, "#39657a", !alerta);
    caminhao(c, 360, 254, 0.8, "#a07a2c", alerta);
    caminhao(c, 110, 288, 1.3, "#2f5a48", !alerta);
    caminhao(c, 340, 290, 1.3, "#6a3248", alerta);
    fumaca(c, 560, 300, t, "#141014", 12, 62);
    chamas(c, 560, 314, t, 30);
    pessoa(c, 74, 342, 74, "#100c10", 1);
    pessoa(c, 610, 346, 80, "#100c10");
    c.restore();
  },

  policia(c, t) {
    c.save();
    aproximar(c, 1.03 + (t / DURACAO) * 0.07, 320, 200);
    ceu(c, "#050912", "#0c1626");
    for (let i = 0; i < 26; i += 1) {
      const x = -30 + (i % 13) * 54 + acaso(i) * 12;
      const y = 150 + Math.floor(i / 13) * 62 + acaso(i + 5) * 40 + Math.abs(x - 320) * 0.1;
      c.fillStyle = "#121a26";
      c.fillRect(x, y, 56, 110);
      if (acaso(i + 8) > 0.45) {
        c.fillStyle = "#e6c07a";
        c.fillRect(x + 12, y + 12, 8, 10);
      }
    }
    const hx = -90 + t * 150;
    const hy = 66 + Math.sin(t * 1.5) * 8;
    const g = c.createLinearGradient(hx, hy, hx - 60, 340);
    g.addColorStop(0, "rgba(220,235,255,0.5)");
    g.addColorStop(1, "rgba(220,235,255,0)");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(hx - 8, hy + 8);
    c.lineTo(hx - 150, 350);
    c.lineTo(hx + 50, 350);
    c.fill();
    c.fillStyle = "#0c1014";
    c.beginPath();
    c.ellipse(hx, hy, 36, 13, 0, 0, PI * 2);
    c.fill();
    c.fillRect(hx - 76, hy - 4, 50, 5);
    c.fillRect(hx - 2, hy - 20, 4, 8);
    c.fillStyle = "rgba(160,180,200,0.45)";
    c.fillRect(hx - 58 * Math.abs(Math.sin(t * 34)), hy - 21, 116 * Math.abs(Math.sin(t * 34)), 2);
    c.restore();
    const giro = Math.sin(t * 9) > 0;
    brilho(c, 150, 330, 300, giro ? "#ff2f3f" : "#2f6bff", 0.55);
    brilho(c, 500, 335, 300, giro ? "#2f6bff" : "#ff2f3f", 0.55);
    c.fillStyle = "#0a0e14";
    c.beginPath();
    c.roundRect(70, 310, 170, 44, 9);
    c.roundRect(420, 314, 170, 44, 9);
    c.fill();
    c.fillStyle = giro ? "#ff4050" : "#3f7aff";
    c.fillRect(138, 302, 34, 8);
    c.fillStyle = giro ? "#3f7aff" : "#ff4050";
    c.fillRect(488, 306, 34, 8);
  },

  aviao(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.06, 320, 240);
    ceu(c, "#2c3c6a", "#d9734e", "#f8c27a");
    brilho(c, 150, 236, 200, "#ffd9a0", 0.9);
    chao(c, 258, "#2a2a30");
    c.fillStyle = "#e9c94e";
    for (let i = 0; i < 8; i += 1) c.fillRect(i * 90 - 20, 306, 48, 4);
    const p = trecho(t, 0, 3.8);
    aviao(c, 760 - p * 480, 90 + p * 148, 1.35, 0.14 - p * 0.14);
    c.fillStyle = "#b9262c";
    c.fillRect(150, 322, 340, 60);
    bandeira(c, 80, 170, 66, 42, t);
    c.fillStyle = "#3a3f55";
    c.fillRect(556, 212, 4, 100);
    c.fillStyle = "#f4f4f4";
    c.fillRect(560, 212, 56, 12);
    c.fillStyle = "#2c6ec2";
    c.fillRect(560, 224, 56, 12);
    c.fillStyle = "#d8a02c";
    c.fillRect(560, 236, 56, 12);
    pessoa(c, 250, 322, 66, "#14141c");
    pessoa(c, 390, 322, 66, "#14141c");
    pessoa(c, 196, 318, 58, "#1f2029");
    pessoa(c, 444, 318, 58, "#1f2029");
    c.restore();
  },

  porto(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.07, 320, 220);
    ceu(c, "#183a56", "#5da2b4", "#e5d3a7");
    chao(c, 238, "#1b4a5c");
    for (let i = 0; i < 26; i += 1) {
      c.fillStyle = "rgba(255,255,255,0.13)";
      c.fillRect(acaso(i) * L + Math.sin(t + i) * 8, 244 + acaso(i + 4) * 110, 42, 1.5);
    }
    for (const x of [90, 200]) {
      c.strokeStyle = "#c04a2b";
      c.lineWidth = 7;
      linha(c, x, 240, x, 76);
      c.lineWidth = 6;
      linha(c, x - 20, 92, x + 164, 92);
      linha(c, x, 60, x + 134, 92);
    }
    const x = 700 - trecho(t, 0, 3.6) * 450;
    const y = 266 + Math.sin(t * 1.2) * 2;
    c.fillStyle = "#172a36";
    c.beginPath();
    c.moveTo(x - 20, y - 36);
    c.lineTo(x + 390, y - 36);
    c.lineTo(x + 370, y + 22);
    c.lineTo(x + 18, y + 22);
    c.fill();
    c.fillStyle = "#b4302a";
    c.fillRect(x + 5, y + 6, 358, 8);
    c.fillStyle = "#e7ece9";
    c.fillRect(x + 306, y - 86, 60, 50);
    const cores = ["#c9592e", "#2f6d8e", "#c9a12e", "#3f8a68", "#8d3f55"];
    for (let i = 0; i < 26; i += 1) {
      c.fillStyle = cores[Math.floor(acaso(i) * 5)];
      c.fillRect(x + 8 + (i % 9) * 32, y - 54 - Math.floor(i / 9) * 17, 30, 16);
    }
    c.restore();
  },

  petroleo(c, t) {
    c.save();
    aproximar(c, 1.02 + (t / DURACAO) * 0.09, 320, 230);
    ceu(c, "#160b12", "#6c1f1a", "#ed7c2c");
    brilho(c, 320, 250, 320, "#ff9a3a", 0.75);
    chao(c, 262, "#120a0c");
    for (const [x, e, f] of [[90, 0.8, 0], [320, 1.2, 1.2], [560, 0.9, 2.2]]) {
      c.strokeStyle = "#0d0608";
      c.lineWidth = 7 * e;
      linha(c, x - 40 * e, 266, x, 120 * (2 - e * 0.8));
      linha(c, x + 40 * e, 266, x, 120 * (2 - e * 0.8));
      const a = Math.sin(t * 2.4 + f) * 0.28;
      c.save();
      c.translate(x, 150 * (2 - e * 0.8));
      c.rotate(a);
      c.lineWidth = 9 * e;
      linha(c, -72 * e, 0, 72 * e, 0);
      c.restore();
    }
    fumaca(c, 210, 266, t, "#150f12", 12, 70);
    chamas(c, 210, 276, t, 56);
    fumaca(c, 450, 268, t + 1, "#150f12", 12, 60);
    chamas(c, 450, 278, t + 1, 44);
    c.restore();
  },

  impeachment(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.12, L / 2, 220);
    ceu(c, "#100507", "#22090c", "#0e0507");
    const pulso = 0.55 + Math.sin(t * 6.3) * 0.25;
    brilho(c, 320, 150, 300, "#d62a2a", pulso * 0.5);
    plenario(c, L / 2, 262, trecho(t, 0.1, 3.8), 0.3);
    c.fillStyle = "#050203";
    c.fillRect(-80, 296, L + 160, 120);
    c.fillStyle = "#1c0b0e";
    c.beginPath();
    c.roundRect(296, 230, 48, 74, 8);
    c.fill();
    c.fillRect(290, 296, 60, 8);
    const g = c.createLinearGradient(320, -10, 320, 300);
    g.addColorStop(0, "rgba(255,240,220,0.42)");
    g.addColorStop(1, "rgba(255,240,220,0.05)");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(304, -20);
    c.lineTo(336, -20);
    c.lineTo(392, 306);
    c.lineTo(248, 306);
    c.fill();
    c.restore();
    const entra = trecho(t, 2.6, 3.4);
    if (entra > 0) {
      c.globalAlpha = entra;
      letreiro(c, "IMPEACHMENT", L / 2, 66, 66, "#ff6a5c");
      c.globalAlpha = 1;
    }
  },

  hospital(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.07, 340, 230);
    ceu(c, "#07101c", "#14243a");
    c.fillStyle = "#1a2a3a";
    c.fillRect(170, 60, 340, 234);
    janelas(c, 176, 76, 330, 196, 7, 0.75);
    c.fillStyle = "#e7eef2";
    c.fillRect(322, 22, 36, 38);
    c.fillStyle = "#d62a2a";
    c.fillRect(335, 28, 10, 26);
    c.fillRect(327, 36, 26, 10);
    c.fillStyle = "#05090f";
    c.fillRect(294, 240, 92, 54);
    brilho(c, 340, 262, 120, "#a8e0ff", 0.6);
    chao(c, 292, "#0b121c");
    for (let i = 0; i < 12; i += 1) pessoa(c, 150 - i * 15 + Math.sin(t + i) * 1.2, 318 + (i % 2) * 5, 58, "#04070c");
    const x = 760 - trecho(t, 0, 3.4) * 400;
    c.fillStyle = "#e9eef0";
    c.beginPath();
    c.roundRect(x, 262, 178, 66, 8);
    c.fill();
    c.fillStyle = "#d62a2a";
    c.fillRect(x, 298, 178, 7);
    c.fillStyle = "#8fc5da";
    c.fillRect(x + 8, 272, 42, 22);
    c.fillStyle = "#0a0e14";
    circulo(c, x + 40, 330, 13);
    circulo(c, x + 142, 330, 13);
    const giro = Math.sin(t * 13) > 0;
    c.fillStyle = giro ? "#ff3a3a" : "#3a7aff";
    c.fillRect(x + 70, 254, 32, 8);
    brilho(c, x + 86, 258, 150, giro ? "#ff3a3a" : "#3a7aff", 0.7);
    c.restore();
  },

  fogos(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.06, 320, 240);
    ceu(c, "#050817", "#0f1a3a", "#20284d");
    brilho(c, 320, 300, 340, "#3f5fc4", 0.35);
    for (let i = 0; i < 16; i += 1) {
      const inicio = i * 0.28;
      const idade = t - inicio;
      if (idade < 0) continue;
      const x = 60 + acaso(i) * 520;
      const y = 44 + acaso(i + 9) * 120;
      const cor = [AMARELO, "#3fe0a2", "#ffffff", "#ff6a5c", "#7cb6ff"][i % 5];
      if (idade < 0.5) {
        c.fillStyle = "#fff4cd";
        circulo(c, x, 280 - (280 - y) * (idade / 0.5), 1.8);
        continue;
      }
      const p = (idade - 0.5) / 1.5;
      if (p > 1) continue;
      brilho(c, x, y, 170, cor, (1 - p) * 0.42);
      c.fillStyle = cor;
      c.globalAlpha = 1 - p;
      for (let k = 0; k < 36; k += 1) {
        const a = (k / 36) * PI * 2;
        const r = suave(p) * (62 + acaso(k + i) * 34);
        circulo(c, x + Math.cos(a) * r, y + Math.sin(a) * r + p * p * 26, 2.2);
      }
      c.globalAlpha = 1;
    }
    congresso(c, 320, 268, 1.1, "#0a0f22", 0.9);
    ministerios(c, 268, "#0c1228");
    chao(c, 266, "#080c1a");
    multidao(c, 278, 56, 9, "#04060e", t, 13);
    bandeira(c, 112, 208, 70, 44, t);
    multidao(c, 310, 28, 16, "#020308", t, 29);
    c.restore();
  },

  derrota(c, t) {
    c.save();
    aproximar(c, 1.08 - (t / DURACAO) * 0.07, 320, 220);
    ceu(c, "#0a1420", "#18283a", "#2a3a4a");
    brilho(c, 120, 60, 200, "#9fb8d8", 0.35);
    palacio(c, 320, 262, 1.08, "#4a5966", "#101c26");
    for (let i = 0; i < 8; i += 1) {
      if (t > 0.6 + i * 0.42) continue;
      c.fillStyle = "#e9c784";
      c.fillRect(120 + i * 50, 200, 34, 36);
      brilho(c, 137 + i * 50, 218, 58, "#ffcf7a", 0.5);
    }
    chao(c, 262, "#121c26");
    c.fillStyle = "rgba(255,255,255,0.06)";
    c.fillRect(-80, 280, L + 160, 2);
    const x = 300 + t * 40;
    pessoa(c, x, 312 + Math.abs(Math.sin(t * 3)) * 1.5, 58, "#020406");
    c.restore();
    chuva(c, t, 110, 0.32);
  },

  assinatura(c, t) {
    c.save();
    aproximar(c, 1.05 + (t / DURACAO) * 0.08, 320, 200);
    ceu(c, "#3b2616", "#22150c");
    brilho(c, 200, 90, 280, "#ffd79a", 0.4);
    c.save();
    c.translate(320, 182);
    c.rotate(-0.05);
    c.fillStyle = "#ece6d4";
    c.fillRect(-160, -142, 320, 286);
    c.fillStyle = "#9d9684";
    for (let i = 0; i < 8; i += 1) c.fillRect(-126, -92 + i * 19, 252 - (i % 3) * 34, 4);
    c.fillStyle = "#1a1a1a";
    c.font = fonte(26);
    c.textAlign = "center";
    c.fillText("NOMEAÇÃO", 0, -112);
    c.fillStyle = "#555";
    c.fillRect(-100, 94, 200, 2);
    const p = trecho(t, 0.7, 2.7);
    c.strokeStyle = "#143a7a";
    c.lineWidth = 2.6;
    c.lineCap = "round";
    c.beginPath();
    let px = -92;
    let py = 88;
    const total = Math.floor(p * 46);
    for (let i = 0; i <= total; i += 1) {
      px = -92 + i * 4;
      py = 84 + Math.sin(i * 0.72) * (14 - i * 0.2) + Math.sin(i * 0.21) * 6;
      c.lineTo(px, py);
    }
    c.stroke();
    if (t < 2.9) {
      c.fillStyle = "#16181c";
      c.save();
      c.translate(px, py);
      c.rotate(0.7);
      c.fillRect(-4, -150, 8, 136);
      c.fillStyle = AMARELO;
      c.fillRect(-4, -96, 8, 5);
      c.fillStyle = "#16181c";
      c.beginPath();
      c.moveTo(-4, -14);
      c.lineTo(4, -14);
      c.lineTo(0, 0);
      c.fill();
      c.restore();
    }
    c.restore();
    c.restore();
    carimbo(c, "NOMEADO", "#ff7b6c", t, 3.3);
  },

  comicio(c, t) {
    c.save();
    aproximar(c, 1.02 + (t / DURACAO) * 0.09, 320, 170);
    ceu(c, "#0a0f24", "#1a1f4a", "#3a2460");
    const luzes = [["#2dd4bf", 110], ["#f2c14e", 320], ["#ff5a7a", 530]] as const;
    luzes.forEach(([cor, x], i) => {
      const a = Math.sin(t * 1.4 + i * 2) * 0.5;
      c.save();
      c.translate(x, 0);
      c.rotate(a);
      const g = c.createLinearGradient(0, 0, 0, 300);
      g.addColorStop(0, cor);
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.globalAlpha = 0.36;
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(-5, 0);
      c.lineTo(5, 0);
      c.lineTo(66, 320);
      c.lineTo(-66, 320);
      c.fill();
      c.restore();
    });
    c.fillStyle = "#0a0d1e";
    c.fillRect(90, 192, 460, 40);
    c.fillStyle = "#17244e";
    c.fillRect(120, 66, 400, 126);
    c.fillStyle = "#223366";
    c.fillRect(132, 78, 376, 102);
    letreiro(c, "É AGORA", 320, 128, 74, "#f4efe0");
    pessoa(c, 320, 196, 102, "#04060e", Math.sin(t * 3));
    c.strokeStyle = "#04060e";
    c.lineWidth = 3;
    linha(c, 348, 192, 342, 136);
    multidao(c, 248, 60, 9, "#141433", t, 31);
    bandeira(c, 72, 214, 70, 44, t);
    bandeira(c, 494, 208, 70, 44, t + 1.5);
    multidao(c, 284, 40, 14, "#0a0a22", t, 37);
    multidao(c, 322, 24, 21, "#040410", t, 41);
    c.restore();
    confete(c, t, 40, [AMARELO, TURQUESA, "#ffffff"]);
  },

  debate(c, t) {
    c.save();
    aproximar(c, 1.08 - (t / DURACAO) * 0.06, 320, 200);
    ceu(c, "#071a33", "#0b3058", "#0b1c33");
    for (let i = 0; i < 6; i += 1) {
      const a = Math.sin(t * 0.9 + i) * 0.3 + (i - 2.5) * 0.28;
      c.save();
      c.translate(320, -20);
      c.rotate(a);
      c.fillStyle = "rgba(120,190,255,0.09)";
      c.beginPath();
      c.moveTo(-4, 0);
      c.lineTo(4, 0);
      c.lineTo(38, 380);
      c.lineTo(-38, 380);
      c.fill();
      c.restore();
    }
    c.strokeStyle = "rgba(120,190,255,0.5)";
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(320, 310, 300, 44, 0, 0, PI * 2);
    c.stroke();
    letreiro(c, "DEBATE", 320, 74, 58, "#e8f3f1");
    for (const [x, cor] of [[186, TURQUESA], [454, "#f2a14c"]] as const) {
      pessoa(c, x, 262, 138, "#061220");
      c.fillStyle = "#123a60";
      c.beginPath();
      c.moveTo(x - 46, 214);
      c.lineTo(x + 46, 214);
      c.lineTo(x + 56, 322);
      c.lineTo(x - 56, 322);
      c.fill();
      c.fillStyle = cor;
      c.fillRect(x - 46, 214, 92, 6);
    }
    const restante = Math.ceil(30 - t * 2);
    c.fillStyle = "#04101c";
    c.fillRect(280, 262, 80, 38);
    letreiro(c, `0:${String(restante).padStart(2, "0")}`, 320, 282, 28, restante <= 22 ? "#ff7b6c" : "#7cebdc");
    c.restore();
    c.fillStyle = "#ef3b3b";
    if (t % 1 < 0.6) circulo(c, 584, 42, 6);
  },

  redes(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.07, 320, 180);
    ceu(c, "#120a26", "#2a1048", "#3f1457");
    for (let i = 0; i < 26; i += 1) {
      const y = ((acaso(i) * 460 - t * (60 + acaso(i + 3) * 80)) % 460) + 460;
      const x = acaso(i + 8) * L;
      c.globalAlpha = 0.65;
      c.fillStyle = i % 3 === 0 ? "#ff4f7f" : i % 3 === 1 ? TURQUESA : AMARELO;
      coracao(c, x, (y % 460) - 40, 6 + acaso(i) * 8);
    }
    c.globalAlpha = 1;
    c.fillStyle = "#0a0a10";
    c.beginPath();
    c.roundRect(226, 12, 188, 360, 22);
    c.fill();
    c.fillStyle = "#1a1a26";
    c.beginPath();
    c.roundRect(236, 24, 168, 336, 12);
    c.fill();
    c.save();
    c.beginPath();
    c.rect(236, 24, 168, 336);
    c.clip();
    const rolou = (t * 118) % 92;
    for (let i = -1; i < 6; i += 1) {
      const y = 34 + i * 92 - rolou;
      c.fillStyle = "#2a2a3c";
      c.beginPath();
      c.roundRect(246, y, 148, 82, 8);
      c.fill();
      c.fillStyle = ["#2dd4bf", "#f2a14c", "#ff4f7f", "#6f8cf5"][(i + 5 + Math.floor((t * 118) / 92)) % 4];
      circulo(c, 262, y + 16, 8);
      c.fillStyle = "#5b5b78";
      c.fillRect(276, y + 10, 82, 5);
      c.fillRect(276, y + 20, 56, 4);
      c.fillRect(256, y + 36, 128, 5);
      c.fillRect(256, y + 47, 104, 5);
    }
    c.restore();
    c.restore();
    const curtidas = Math.floor(trecho(t, 0.1, 4.4) * 2400) * 1000;
    c.fillStyle = "#ff2f6a";
    c.beginPath();
    c.roundRect(452, 42, 164, 58, 12);
    c.fill();
    letreiro(c, curtidas >= 1000000 ? `${(curtidas / 1000000).toFixed(1).replace(".", ",")} mi` : `${curtidas / 1000} mil`, 534, 72, 34, "#ffffff");
  },

  vazamento(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.1, 320, 180);
    ceu(c, "#060a0c", "#0b1417");
    c.strokeStyle = "rgba(45,212,191,0.1)";
    c.lineWidth = 1;
    for (let i = 0; i < 12; i += 1) linha(c, 0, i * 32, L, i * 32);
    const toca = trecho(t, 0.2, 4.4);
    for (let i = 0; i < 96; i += 1) {
      const x = 40 + i * 5.9;
      const fase = i / 96;
      const altura = (6 + acaso(i * 3) * 76) * (0.45 + Math.abs(Math.sin(i * 0.33)) * 0.6);
      const passou = fase < toca;
      const vivo = passou && Math.abs(fase - toca) < 0.08;
      const h = altura * (vivo ? 1.2 + Math.sin(t * 22 + i) * 0.25 : 1);
      c.fillStyle = passou ? "#ef5b4c" : "#22474c";
      c.fillRect(x, 180 - h, 3.4, h * 2);
    }
    c.fillStyle = "#ffffff";
    c.fillRect(40 + toca * 566, 76, 1.6, 208);
    c.restore();
    c.fillStyle = "#ef3b3b";
    if (t % 1 < 0.6) circulo(c, 56, 48, 7);
    letreiro(c, "GRAVAÇÃO VAZADA", 72, 49, 26, "#f1ece0", "left");
    letreiro(c, `00:0${Math.min(5, Math.floor(t))}`, 584, 49, 26, "#9db7b6", "right");
  },

  barragem(c, t) {
    c.save();
    const treme = t > 1.2 && t < 3.2 ? Math.sin(t * 50) * 2.2 : 0;
    c.translate(treme, -treme * 0.5);
    aproximar(c, 1.02 + (t / DURACAO) * 0.07, 320, 200);
    ceu(c, "#3a3f40", "#6c6b5e", "#8a8267");
    c.fillStyle = "#3d4a3a";
    c.beginPath();
    c.moveTo(-80, 150);
    c.lineTo(160, 96);
    c.lineTo(292, 176);
    c.lineTo(-80, 280);
    c.fill();
    c.beginPath();
    c.moveTo(L + 80, 150);
    c.lineTo(480, 92);
    c.lineTo(348, 176);
    c.lineTo(L + 80, 280);
    c.fill();
    c.fillStyle = "#837b6b";
    c.beginPath();
    c.moveTo(150, 110);
    c.lineTo(490, 110);
    c.lineTo(530, 262);
    c.lineTo(110, 262);
    c.fill();
    const abre = trecho(t, 0.9, 2.6);
    c.strokeStyle = "#231f18";
    c.lineCap = "round";
    c.lineWidth = 1.5 + abre * 3;
    c.beginPath();
    c.moveTo(310, 110);
    c.lineTo(330, 142);
    c.lineTo(304, 176);
    c.lineTo(336, 214);
    c.lineTo(316, 262);
    c.stroke();
    chao(c, 262, "#4e5a3e");
    for (let i = 0; i < 7; i += 1) {
      c.fillStyle = "#28331f";
      c.beginPath();
      c.moveTo(40 + i * 90, 300);
      c.lineTo(62 + i * 90, 248);
      c.lineTo(84 + i * 90, 300);
      c.fill();
    }
    const lama = trecho(t, 1.9, 4.5);
    if (lama > 0) {
      c.fillStyle = "#7a4c22";
      c.beginPath();
      c.moveTo(308 - lama * 26, 128);
      c.lineTo(336 + lama * 26, 128);
      c.lineTo(400 + lama * 300, 270);
      c.lineTo(L + 80, 282 + lama * 90);
      c.lineTo(L + 80, A + 80);
      c.lineTo(-80, A + 80);
      c.lineTo(-80, 282 + lama * 90);
      c.lineTo(240 - lama * 300, 270);
      c.closePath();
      c.fill();
      c.strokeStyle = "#a5713a";
      c.lineCap = "round";
      for (let i = 0; i < 46; i += 1) {
        const vida = (t * 0.9 + acaso(i)) % 1;
        const abertura = (acaso(i + 2) - 0.5) * (30 + vida * 620 * lama);
        const y = 134 + vida * 226;
        c.lineWidth = 1 + vida * 2.4;
        linha(c, 322 + abertura * 0.9, y - 12 - vida * 16, 322 + abertura, y);
      }
      c.fillStyle = "rgba(230,214,180,0.5)";
      for (let i = 0; i < 18; i += 1) {
        const vida = (t * 1.3 + acaso(i + 60)) % 1;
        circulo(c, 322 + (acaso(i) - 0.5) * 70, 130 - vida * 34, 1.4 + vida * 2.4);
      }
    }
    c.restore();
  },

  fronteira(c, t) {
    c.save();
    aproximar(c, 1 + (t / DURACAO) * 0.05, 320, 180);
    ceu(c, "#04100c", "#071a14");
    c.strokeStyle = "rgba(45,212,191,0.16)";
    c.lineWidth = 1;
    for (let i = 0; i < 17; i += 1) linha(c, i * 40, 0, i * 40, A);
    for (let i = 0; i < 10; i += 1) linha(c, 0, i * 40, L, i * 40);
    c.strokeStyle = "rgba(242,193,78,0.8)";
    c.lineWidth = 2;
    c.setLineDash([9, 7]);
    c.beginPath();
    c.moveTo(60, -10);
    c.bezierCurveTo(180, 90, 130, 180, 260, 210);
    c.bezierCurveTo(380, 240, 430, 320, 470, 380);
    c.stroke();
    c.setLineDash([]);
    const cx = 320;
    const cy = 180;
    c.strokeStyle = "rgba(45,212,191,0.45)";
    for (let r = 50; r <= 200; r += 50) {
      c.beginPath();
      c.arc(cx, cy, r, 0, PI * 2);
      c.stroke();
    }
    const a = t * 2.1;
    c.save();
    c.translate(cx, cy);
    c.rotate(a);
    for (let i = 0; i < 24; i += 1) {
      c.fillStyle = `rgba(45,212,191,${0.3 * (1 - i / 24)})`;
      c.beginPath();
      c.moveTo(0, 0);
      c.arc(0, 0, 200, -i * 0.04 - 0.04, -i * 0.04);
      c.fill();
    }
    c.restore();
    c.strokeStyle = TURQUESA;
    linha(c, cx, cy, cx + Math.cos(a) * 200, cy + Math.sin(a) * 200);
    for (let i = 0; i < 7; i += 1) {
      const ang = acaso(i) * PI * 2;
      const r = 70 + acaso(i + 5) * 120;
      const avanco = trecho(t, 0.5, 4.8) * 26;
      const x = cx + Math.cos(ang) * (r - avanco);
      const y = cy + Math.sin(ang) * (r - avanco);
      const volta = ((a - ang) % (PI * 2) + PI * 2) % (PI * 2);
      const visivel = Math.max(0, 1 - volta / 3);
      c.fillStyle = `rgba(255,90,76,${visivel})`;
      circulo(c, x, y, 5);
      brilho(c, x, y, 20, "#ff5a4c", visivel * 0.8);
    }
    c.restore();
    letreiro(c, "ALERTA", 34, 44, 30, "#ff7b6c", "left");
  },
};

function coracao(c: C, x: number, y: number, r: number) {
  c.beginPath();
  c.moveTo(x, y + r);
  c.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.2, x, y - r * 0.3);
  c.bezierCurveTo(x + r * 0.7, y - r * 1.2, x + r * 1.6, y - r * 0.2, x, y + r);
  c.fill();
}

function grafico(c: C, t: number, alta: boolean) {
  const n = 34;
  const visiveis = trecho(t, 0.1, 3.9) * n;
  const fundo = alta ? ["#051a14", "#0a2a22"] : ["#1c0608", "#2c0a0e"];
  const cor = alta ? "#2fe0a0" : "#ff5a4c";
  c.save();
  aproximar(c, 1 + (t / DURACAO) * 0.16, alta ? 520 : 520, alta ? 110 : 270);
  ceu(c, ...fundo);
  c.strokeStyle = "rgba(255,255,255,0.07)";
  c.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) linha(c, 0, 30 + i * 40, L, 30 + i * 40);
  for (let i = 0; i < 12; i += 1) linha(c, 20 + i * 56, 0, 20 + i * 56, A);
  const preco = (i: number) => {
    const direcao = alta ? -1 : 1;
    const inicio = alta ? 280 : 80;
    return inicio + direcao * i * 6.2 + Math.sin(i * 1.1) * 15 + (acaso(i) - 0.5) * 24;
  };
  for (let i = 0; i < Math.floor(visiveis); i += 1) {
    const x = 28 + i * 17.4;
    const abre = preco(i);
    const fecha = preco(i + 1);
    const sobe = fecha < abre;
    const velaCor = sobe ? "#2fe0a0" : "#ff5a4c";
    c.strokeStyle = velaCor;
    c.lineWidth = 1.4;
    linha(c, x, Math.min(abre, fecha) - 9, x, Math.max(abre, fecha) + 9);
    c.fillStyle = velaCor;
    c.fillRect(x - 5, Math.min(abre, fecha), 10, Math.max(3, Math.abs(fecha - abre)));
  }
  const ultimo = Math.max(0, Math.floor(visiveis) - 1);
  brilho(c, 28 + ultimo * 17.4, preco(ultimo), 120, cor, 0.5 + Math.sin(t * 8) * 0.2);
  c.restore();
  if (!alta && Math.sin(t * 7) > 0.5) {
    c.fillStyle = "rgba(255,40,40,0.08)";
    c.fillRect(0, 0, L, A);
  }
  const entra = trecho(t, 3.2, 3.8);
  if (entra > 0) {
    c.globalAlpha = entra;
    letreiro(c, alta ? "RECORDE" : "PÂNICO", 34, 58, 64, cor, "left");
    c.globalAlpha = 1;
  }
}

function acabamento(c: C, t: number) {
  const g = c.createRadialGradient(L / 2, A / 2, A * 0.42, L / 2, A / 2, L * 0.68);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.58)");
  c.fillStyle = g;
  c.fillRect(0, 0, L, A);
  c.fillStyle = "#000";
  c.fillRect(0, 0, L, 14);
  c.fillRect(0, A - 14, L, 14);
  const entrada = 1 - trecho(t, 0, 0.4);
  if (entrada > 0) {
    c.fillStyle = `rgba(0,0,0,${entrada})`;
    c.fillRect(0, 0, L, A);
  }
}

export function pintarCena(c: C, tipo: TipoCena, t: number) {
  c.save();
  c.beginPath();
  c.rect(0, 0, L, A);
  c.clip();
  CENARIOS[tipo](c, t);
  c.globalAlpha = 1;
  acabamento(c, t);
  c.restore();
}
