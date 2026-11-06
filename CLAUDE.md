# BRASIL: PRESIDENTE

O documento do projeto é `docs/PROJETO.md`: leia antes de começar uma etapa nova.

- Fale em português, em palavras simples. Quem pede as mudanças não é programador.
- Depois de cada mudança pronta e testada: `npm run typecheck`, `npm run build`, commit, `git push` e `npm run publicar`. O dono do projeto quer tudo sempre atualizado no GitHub e no ar.
- O repositório é público e o jogo roda em https://paulosantiagooh.github.io/brasil-presidente/ (GitHub Pages, branch `gh-pages`). Nunca coloque segredo ou dado pessoal no código.
- Construa uma etapa por vez, na ordem da seção 23 do documento. Cada módulo funciona antes de ser integrado.
- A interface fica em `src/`, com nomes em português. As cores são os tokens de `src/app/globals.css`.
- Identidade própria: escura, com detalhes em verde-turquesa. O jogo PLANALTO serve de referência para o gênero e a organização das informações, mas nunca copie o nome, a arte, os textos ou a aparência dele.
- Partidos e números de urna são reais, conforme a lista em `src/lib/candidato.ts`. Tamanho e posição de cada partido são estimativas do jogo.
- O jogo começa na eleição de 2026, em uma história alternativa. Adversários, vices e ministros são políticos reais em um cenário hipotético, a pedido do dono do projeto. Confira cargo e partido antes de citar alguém.
- A lista de deputados e senadores vem dos dados abertos do Congresso (`scripts/gerar-parlamentares.mjs`). Nomes destacados ficam em `src/lib/pessoas.ts`.
- Pessoas reais: nunca invente crime, escândalo, fala ou opinião, não use foto delas sem licença e mantenha o aviso de simulação nas telas. Eventos negativos inventados só para o personagem do jogador.
- Ao jogar com um político real, o jogo não define a ideologia dele nem inventa denúncia: a ideologia é escolha do jogador, e eventos negativos ficam neutros.
- O Congresso em 3D fica em `src/components/congresso/` e carrega o Three.js só quando a tela abre.
- O drama do mandato fica em `src/lib/drama.ts`: personagens fictícios, histórias em capítulos, crises urgentes, missões e conquistas. Histórias de corrupção levam `sensivel: true` e nunca aparecem quando o jogador é uma pessoa real.
- Atributos de ministros reais vêm do tipo de cargo e do alinhamento na partida, nunca de uma nota pessoal. Técnicos são personagens fictícios.
- As bancadas de `src/lib/governo.ts` partem da Câmara eleita em 2026 e da projeção do Senado para 2027.
- O mandato (`src/lib/mandato.ts` e `mandato-dados.ts`) anda por meses. Valores econômicos são simulados, e os nomes técnicos para cargos são fictícios. Eventos nunca citam pessoas reais.
- O mapa eleitoral vem da malha oficial do IBGE (`scripts/gerar-mapa-ufs.mjs`). Gráficos seguem as cores `--candidato-*`: a cor acompanha a candidatura, nunca a posição.
- Todo layout tem que funcionar em celular de 375 px de largura, sem rolagem horizontal.
