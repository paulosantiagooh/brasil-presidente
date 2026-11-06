import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const fonteTitulo = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--fonte-titulo",
});

const fonteTexto = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-texto",
});

const fonteDado = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fonte-dado",
});

export const metadata: Metadata = {
  title: "BRASIL: PRESIDENTE",
  description:
    "Simulador político: dispute a eleição presidencial de 2026 e governe o Brasil por quatro anos.",
};

export const viewport: Viewport = {
  themeColor: "#071012",
  width: "device-width",
  initialScale: 1,
};

// Aplica as configurações antes da primeira pintura, para a tela não piscar.
const aplicarConfig = `try{var c=JSON.parse(localStorage.getItem('bp:config')||'{}'),d=document.documentElement;if(c.texto)d.dataset.texto=c.texto;if(c.movimento)d.dataset.movimento=c.movimento}catch(e){}`;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${fonteTitulo.variable} ${fonteTexto.variable} ${fonteDado.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: aplicarConfig }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
