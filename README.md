# Card Explorer

**Card Explorer** é uma aplicação web para explorar cartas de **Magic: The Gathering**. Você pode buscar cartas, ver detalhes completos, filtrar resultados, sortear uma carta aleatória e salvar favoritos — tudo com dados da API pública do [Scryfall](https://scryfall.com/).

Projeto criado por **Késia Coelho**.

## O que o projeto faz

### Página inicial

- Hero com busca e atalhos de termos populares.
- Vitrine com cartas em destaque e um leque visual no hero.
- **Draw a card**: sorteia uma carta aleatória e abre o painel de detalhes.

### Explorar (`/explore`)

- Busca por nome e filtros (cores, tipo, raridade, custo de mana, etc.).
- Grade de cartas com visualização rápida e modal de detalhes.

### Favoritos (`/favorites`)

- Lista de cartas salvas no **localStorage** do navegador (não exige login).
- Contador na barra de navegação quando há pelo menos uma carta favorita.

### Detalhes da carta

- Imagem, texto de regras, flavor, set, raridade, artista e link para a carta no Scryfall.

## Tecnologias

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Lucide React](https://lucide.dev/) (ícones)
- API [Scryfall](https://scryfall.com/docs/api) (sem chave de API)

## Pré-requisitos

- [Node.js](https://nodejs.org/) **18.18** ou superior (recomendado: versão LTS atual)
- npm (incluído com o Node) ou outro gerenciador de pacotes compatível

## Como rodar o projeto

1. **Entre na pasta do projeto**

   ```bash
   cd card-explorer
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Abra no navegador**

   [http://localhost:3000](http://localhost:3000)

   As alterações nos arquivos são recarregadas automaticamente.

### Outros comandos

| Comando        | Descrição                                      |
| -------------- | ---------------------------------------------- |
| `npm run build` | Gera a versão de produção                      |
| `npm run start` | Sobe o servidor após o `build` (porta 3000)   |
| `npm run lint`  | Executa o ESLint                               |

Para testar a build de produção localmente:

```bash
npm run build
npm run start
```

## Estrutura (resumo)

- `src/app/` — rotas (início, explore, favorites) e layout global
- `src/components/` — interface (hero, busca, modais, favoritos, etc.)
- `src/lib/` — integração com Scryfall, tipos, favoritos e filtros

## Observações

- É necessário **conexão com a internet** para carregar cartas e imagens do Scryfall.
- Favoritos ficam apenas no navegador em que foram salvos; limpar dados do site remove a lista.
- Imagens e dados de cartas são de propriedade dos respectivos detentores; o Scryfall é a fonte oficial usada por este app.

## Licença

Projeto privado (`private` no `package.json`). Consulte o autor para uso e distribuição.
