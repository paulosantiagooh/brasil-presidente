"use client";

import { useId, useState, type ChangeEvent } from "react";
import { prepararFoto } from "@/lib/foto";

type Props = {
  rotulo: string;
  foto: string | null;
  aoMudar: (foto: string | null) => void;
};

export function CampoFoto({ rotulo, foto, aoMudar }: Props) {
  const id = useId();
  const [erro, setErro] = useState("");

  async function aoEscolher(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    try {
      aoMudar(await prepararFoto(arquivo));
      setErro("");
    } catch {
      setErro("Não consegui abrir essa imagem. Tente um arquivo JPG ou PNG.");
    }
  }

  return (
    <div className="campo-foto">
      <div className="foto foto-grande">
        {/* A foto é uma imagem local do jogador, sem otimização de servidor. */}
        {foto ? <img src={foto} alt={rotulo} /> : <span>Sem foto</span>}
      </div>
      <div className="campo-foto-acoes">
        <p className="rotulo">{rotulo}</p>
        <p className="ajuda">A imagem é recortada no centro e fica salva só neste aparelho.</p>
        <div className="acoes">
          <label className="botao" htmlFor={id}>
            {foto ? "Trocar foto" : "Enviar foto"}
          </label>
          <input
            id={id}
            className="arquivo"
            type="file"
            accept="image/*"
            onChange={aoEscolher}
          />
          {foto && (
            <button type="button" className="botao" onClick={() => aoMudar(null)}>
              Remover
            </button>
          )}
        </div>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}
