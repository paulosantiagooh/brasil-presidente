// Gera o site e envia para a branch gh-pages, que o GitHub Pages coloca no ar.
// Uso: npm run publicar
import { execSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CAMINHO_DO_SITE = "/brasil-presidente";
const pasta = "out";
const rodar = (comando, opcoes = {}) =>
  execSync(comando, { stdio: "inherit", ...opcoes });
const ler = (comando) => execSync(comando, { encoding: "utf8" }).trim();

const origem = ler("git remote get-url origin");
const nome = ler("git config user.name");
const email = ler("git config user.email");
const versao = ler("git rev-parse --short HEAD");

rodar("npx next build", {
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: CAMINHO_DO_SITE },
});

// Sem este arquivo, o GitHub Pages ignora a pasta _next, onde ficam os scripts do jogo.
writeFileSync(join(pasta, ".nojekyll"), "");
rmSync(join(pasta, ".git"), { recursive: true, force: true });

const noSite = { cwd: pasta };
rodar("git init -q -b gh-pages", noSite);
rodar(`git config user.name "${nome}"`, noSite);
rodar(`git config user.email "${email}"`, noSite);
rodar("git add -A", noSite);
rodar(`git commit -q -m "Publica a versao ${versao}"`, noSite);
rodar(`git push -q -f "${origem}" gh-pages`, noSite);
rmSync(join(pasta, ".git"), { recursive: true, force: true });
console.log(`Versão ${versao} enviada para o GitHub Pages.`);
