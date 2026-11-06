"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = {
  aberta: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
};

export function Janela({ aberta, titulo, aoFechar, children }: Props) {
  const referencia = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const janela = referencia.current;
    if (!janela) return;
    if (aberta && !janela.open) janela.showModal();
    if (!aberta && janela.open) janela.close();
  }, [aberta]);

  return (
    <dialog
      ref={referencia}
      className="janela"
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      onClick={(evento) => {
        if (evento.target === referencia.current) aoFechar();
      }}
    >
      <div className="janela-corpo">
        <header className="janela-topo">
          <h2 id={idTitulo}>{titulo}</h2>
          <button type="button" className="botao-fechar" onClick={aoFechar} aria-label="Fechar">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
