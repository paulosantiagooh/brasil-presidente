# BRASIL: PRESIDENTE

O documento do projeto é `docs/PROJETO.md`: leia antes de começar uma etapa nova.

- Fale em português, em palavras simples. Quem pede as mudanças não é programador.
- Depois de cada mudança pronta e testada: `npm run typecheck`, `npm run build`, commit e `git push`. O dono do projeto quer tudo sempre atualizado no GitHub.
- Construa uma etapa por vez, na ordem da seção 23 do documento. Cada módulo funciona antes de ser integrado.
- A interface fica em `src/`, com nomes em português. As cores são os tokens de `src/app/globals.css`.
- Identidade própria: escura, com detalhes em verde-turquesa. O jogo PLANALTO serve de referência para o gênero e a organização das informações, mas nunca copie o nome, a arte, os textos ou a aparência dele.
- Partidos e números de urna são reais, conforme a lista em `src/lib/candidato.ts`. Tamanho e posição de cada partido são estimativas do jogo.
- Não use candidatos, resultados ou pessoas reais no cenário de 2030: adversários e vices são fictícios.
- O mapa eleitoral vem da malha oficial do IBGE (`scripts/gerar-mapa-ufs.mjs`). Gráficos seguem as cores `--candidato-*`: a cor acompanha a candidatura, nunca a posição.
- Todo layout tem que funcionar em celular de 375 px de largura, sem rolagem horizontal.
