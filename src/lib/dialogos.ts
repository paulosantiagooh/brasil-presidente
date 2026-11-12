import type { TipoCena } from "./cenas";
import type { Efeito } from "./mandato-dados";

// Cenas com diálogo: reunião ministerial, entrevista e pronunciamento. Quem fala é sempre personagem fictício
// ou o próprio jogador, por escolha dele: ministros reais nunca recebem falas inventadas.
export type IdDialogo = "reuniao" | "entrevista" | "pronunciamento";

export type Dialogo = {
  id: IdDialogo;
  fundo: TipoCena | "palco";
  sobretitulo: string;
  titulo: string;
  quem: { nome: string; papel: string; cor: string };
  falas: string[];
  opcoes: { texto: string; efeito: Efeito }[];
};

export function montarDialogo(id: IdDialogo, contexto: string | null): Dialogo {
  if (id === "reuniao") {
    return {
      id,
      fundo: "gabinete",
      sobretitulo: "Reunião ministerial · Fazenda",
      titulo: "A arrecadação veio menor",
      quem: { nome: "Secretaria-executiva da Fazenda", papel: "Equipe técnica (personagem fictício)", cor: "#3d7be0" },
      falas: [
        "Presidente, os números do trimestre chegaram. A arrecadação ficou abaixo do previsto.",
        "Se nada for feito, a meta fiscal do ano fica em risco e o mercado vai perceber.",
        "A equipe preparou três caminhos. Todos têm custo.",
      ],
      opcoes: [
        { texto: "Cortar despesas que não são obrigatórias.", efeito: { "e.primario": 0.1, aprovacao: -0.5 } },
        { texto: "Adiar parte das emendas dos parlamentares.", efeito: { "e.primario": 0.08, congresso: -2 } },
        { texto: "Manter tudo e aceitar um déficit maior.", efeito: { "e.primario": -0.05, "e.confianca": -1.5 } },
      ],
    };
  }
  if (id === "entrevista") {
    const tema = contexto ? `sobre "${contexto.replace(/\.$/, "")}"` : "sobre as últimas decisões do governo";
    return {
      id,
      fundo: "imprensa",
      sobretitulo: "Entrevista coletiva · Diário da Capital",
      titulo: "A pergunta incômoda",
      quem: { nome: "Renata Lobo", papel: "Repórter do Diário da Capital (personagem fictício)", cor: "#d94f8e" },
      falas: [
        `Presidente, uma pergunta ${tema}.`,
        "Os críticos dizem que a decisão foi tomada sem ouvir quem vai pagar a conta. O que você responde?",
      ],
      opcoes: [
        { texto: "Defender a decisão com números e prazos.", efeito: { aprovacao: 1, congresso: -0.5 } },
        { texto: "Reconhecer falhas e prometer ajustes.", efeito: { aprovacao: 0.5, "s.confianca": 1 } },
        { texto: "Acusar a imprensa de perseguição.", efeito: { aprovacao: 0.5, "s.confianca": -2, pressao: 3 } },
      ],
    };
  }
  return {
    id,
    fundo: "palco",
    sobretitulo: "Cadeia nacional de rádio e TV",
    titulo: "Pronunciamento à nação",
    quem: { nome: "Locução oficial", papel: "Empresa pública de comunicação (personagem fictício)", cor: "#009c3b" },
    falas: [
      "Boa noite. Em cadeia nacional de rádio e televisão, o pronunciamento do presidente da República.",
      contexto ?? "O país atravessa dias difíceis, e todos esperam uma palavra do Palácio do Planalto.",
      "A câmera acende. Qual será a sua mensagem?",
    ],
    opcoes: [
      { texto: "União e calma: o país vai sair disso junto.", efeito: { pressao: -5, aprovacao: 1 } },
      { texto: "Medidas firmes, com prazo e responsáveis.", efeito: { aprovacao: 1.5, congresso: -1, "e.confianca": 1 } },
      { texto: "A culpa é dos adversários, que travam o país.", efeito: { aprovacao: 0.5, pressao: 3, congresso: -2 } },
    ],
  };
}
