"use client";

import { useEffect } from "react";

// Registra o modo offline do jogo no site publicado.
export function Instalavel({ caminho }: { caminho: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`${caminho}/sw.js`).catch(() => undefined);
  }, [caminho]);
  return null;
}
