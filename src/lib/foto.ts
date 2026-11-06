const LARGURA = 320;
const ALTURA = 400;

// Recorta a imagem no centro e reduz o tamanho, para caber nas partidas salvas no aparelho.
export async function prepararFoto(arquivo: File) {
  const imagem = await createImageBitmap(arquivo);
  const proporcao = LARGURA / ALTURA;
  const largura = Math.min(imagem.width, imagem.height * proporcao);
  const altura = largura / proporcao;
  const tela = document.createElement("canvas");
  tela.width = LARGURA;
  tela.height = ALTURA;
  const contexto = tela.getContext("2d");
  if (!contexto) throw new Error("Sem suporte a imagens");
  contexto.drawImage(
    imagem,
    (imagem.width - largura) / 2,
    (imagem.height - altura) / 2,
    largura,
    altura,
    0,
    0,
    LARGURA,
    ALTURA,
  );
  imagem.close();
  return tela.toDataURL("image/jpeg", 0.82);
}
