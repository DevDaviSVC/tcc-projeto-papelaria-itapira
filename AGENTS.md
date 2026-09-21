# Papelaria Itapira — TCC

## Projeto

Sistema web desenvolvido como TCC de Análise e Desenvolvimento
de Sistemas para uma papelaria.

Funcionalidades principais:
- Landing page
- Vitrine de produtos
- Página de produto
- Área administrativa
- CRUD de produtos
- Autenticação do administrador
- Redirecionamento de compra para WhatsApp

Não existe checkout ou pagamento online.

## SEO e acessibilidade

O site será publicado e deverá ser desenvolvido considerando
boas práticas de SEO (Search Engine Optimization).

Priorizar:

- HTML semântico;
- títulos (`title`) descritivos e únicos;
- meta descriptions adequadas;
- hierarquia correta de headings (`h1`, `h2`, `h3`);
- URLs legíveis e estáveis;
- conteúdo textual indexável;
- atributos `alt` em imagens;
- acessibilidade;
- bom desempenho e carregamento rápido;
- responsividade/mobile-first;
- Open Graph quando apropriado;
- sitemap.xml;
- robots.txt;
- dados estruturados (Schema.org) quando aplicáveis.

Evitar depender de JavaScript para disponibilizar conteúdo
essencial para indexação quando houver alternativa simples.

As páginas públicas importantes devem ser desenvolvidas
considerando sua indexação por mecanismos de busca.

A área administrativa não deve ser indexada.

Mudanças de arquitetura relacionadas a SEO devem preservar
a simplicidade e o baixo custo do projeto.

## Stack

- Node.js
- Express
- PostgreSQL
- Supabase para hospedagem do banco
- React para a vitrine
- HTML/CSS/JavaScript para páginas estáticas
- Tailwind CSS
- bcrypt
- JWT

## Ícones e emojis

Para elementos visuais da interface, priorizar bibliotecas de ícones em vez de emojis Unicode inseridos diretamente no HTML ou JSX.

Diretrizes:

- evitar emojis como `🛒`, `👤`, `🔍`, `📦`, `✏️` e `🗑️` para representar ações ou elementos da interface;
- utilizar preferencialmente uma biblioteca de ícones consistente em toda a aplicação;
- na aplicação React, preferir uma biblioteca leve e consolidada, como `lucide-react`, caso já esteja instalada ou sua adição seja justificável;
- evitar instalar múltiplas bibliotecas de ícones para a mesma finalidade;
- manter tamanho, alinhamento e estilo dos ícones consistentes;
- ícones utilizados como botões devem possuir identificação acessível (`aria-label` ou texto associado);
- emojis podem ser utilizados quando fizerem parte do conteúdo textual e não estiverem substituindo elementos funcionais da interface;
- não adicionar uma nova dependência apenas para um único ícone simples quando uma solução já existente no projeto puder ser reutilizada.

Priorizar consistência visual, acessibilidade, baixo impacto no desempenho e simplicidade.

## Arquitetura

Rotas divididas em:
- publicRoutes
- authRoutes
- adminRoutes

Rotas administrativas devem exigir autenticação.

O frontend deve acessar os dados através da API Node,
não diretamente através do banco de dados.

## Entrega da aplicação React

O projeto utiliza uma arquitetura híbrida entre páginas estáticas e React.

O servidor Node.js/Express é o ponto de entrada principal da aplicação e deve ser responsável por servir tanto o conteúdo estático quanto o build da aplicação React em produção.

### Páginas estáticas

A Home e outras páginas institucionais simples permanecem como HTML estático dentro de `public` e são servidas diretamente pelo Express.

A rota raiz `/` deve continuar sendo responsabilidade do Express e NÃO deve ser substituída pela aplicação React.

### Aplicação React

A aplicação React deve ser utilizada somente nas áreas dinâmicas do sistema, incluindo:

- vitrine de produtos;
- página individual de produto;
- área administrativa.

Essas páginas devem ser acessíveis através de rotas específicas do servidor, como:

- `/vitrine`
- `/produto/:id`
- `/admin`

O React Router é responsável pela navegação interna dessas páginas.

### Desenvolvimento

Durante o desenvolvimento, o Vite pode executar em uma porta própria e utilizar proxy para encaminhar requisições necessárias ao servidor Express.

O servidor Vite existe apenas como ferramenta de desenvolvimento.

### Produção

Em produção, não deve ser necessário executar um servidor Vite separado.

O Vite deve gerar o build da aplicação React, e o Node.js/Express deve servir esse build para as rotas pertencentes ao React.

O Express deve possuir o fallback necessário para que rotas controladas pelo React Router possam ser acessadas diretamente pelo navegador sem resultar em erro 404.

Esse fallback deve ser limitado às rotas pertencentes ao React e não deve interferir em:

- `/`;
- páginas estáticas;
- endpoints da API;
- autenticação;
- arquivos estáticos;
- demais rotas do Express.

### Princípio arquitetural

Manter a seguinte separação:

`Express → ponto de entrada, páginas estáticas, API e entrega do build React`

`React → interfaces dinâmicas`

`React Router → navegação das interfaces React`

`PostgreSQL/Supabase → persistência dos dados`

Não transformar todo o projeto em uma SPA React sem uma justificativa arquitetural explícita.

## Diretrizes

Priorizar:
- simplicidade
- baixo custo
- segurança
- legibilidade
- boas práticas
- valor acadêmico

Evitar:
- overengineering
- dependências desnecessárias
- mudanças grandes de arquitetura
- funcionalidades fora do escopo

Utilizar inglês para nomes de:
- variáveis
- funções
- arquivos
- endpoints

Antes de realizar uma grande alteração arquitetural,
explicar por que ela seria necessária.