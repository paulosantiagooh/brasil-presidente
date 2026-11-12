// Gravações dos hinos, guardadas em public/audio. Elas tocam como são: o jogo não corta nem faz arranjo.
export type IdHino = "nacional" | "bandeira" | "independencia";

export const HINOS: Record<IdHino, { nome: string; arquivo: string; credito: string; inteiro: boolean }> = {
  nacional: {
    nome: "Hino Nacional Brasileiro",
    arquivo: "hino-nacional.mp3",
    credito: "Música de Francisco Manuel da Silva, letra de Osório Duque Estrada. Execução integral.",
    // A Lei 5.700/1971 manda executar o Hino Nacional sempre inteiro.
    inteiro: true,
  },
  bandeira: {
    nome: "Hino à Bandeira",
    arquivo: "hino-a-bandeira.mp3",
    credito: "Música de Francisco Braga, letra de Olavo Bilac. Gravação da Banda Sinfônica do Corpo de Fuzileiros Navais.",
    inteiro: false,
  },
  independencia: {
    nome: "Hino da Independência",
    arquivo: "hino-da-independencia.mp3",
    credito: "Música de D. Pedro I, letra de Evaristo da Veiga.",
    inteiro: false,
  },
};

export function enderecoDoHino(id: IdHino) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/audio/${HINOS[id].arquivo}`;
}
