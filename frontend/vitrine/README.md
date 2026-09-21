# Frontend — Papelaria Itapira

A landing fica em `api/public/index.html`. Vitrine, produto, login e administração
ficam nesta aplicação React. O Express serve ambos; o frontend não acessa o banco.

## Executar

1. Instale as dependências com `npm ci` em `api` e em `frontend/vitrine`.
2. Configure a API conforme `api/README.md` e copie `.env.example` deste diretório
   para `.env`, ajustando os valores necessários.
3. Neste diretório, execute `npm run build`.
4. Em `api`, execute `npm start` e abra `http://localhost:3000`.

Para desenvolver o React, mantenha a API em execução e rode `npm run dev` aqui.
Abra `http://localhost:3001/vitrine`. A raiz continua sendo a landing do Express.
CSS, fontes, imagens e autenticação são encaminhados à API pelo proxy do Vite.
`npm run preview` revisa o bundle React; a verificação de SEO e dos códigos HTTP
deve ser feita pelo Express, depois do build.

## Rotas

| URL | Responsável |
| --- | --- |
| `/` | Landing estática |
| `/vitrine` | React, com categoria, busca e ordenação na URL |
| `/product/:id` | React, com galeria e contato |
| `/login` | React, formulário ligado a `/auth/login` |
| `/admin` | React, sessão verificada por `/admin/me` |
| `/sitemap.xml`, `/robots.txt` | Arquivos gerados no build, servidos pelo Express |

Os endereços antigos `.html` redirecionam para as rotas atuais.
`/product?id=...` também redireciona diretamente para `/product/:id`.
Páginas e produtos inexistentes retornam HTTP 404. APIs desconhecidas retornam
JSON, sem cair no HTML da aplicação. O acesso aos endpoints `/admin/*` continua
exigindo o JWT existente.

## Catálogo e publicação

O catálogo atual é **demonstrativo**, em `api/public/assets/data/catalog.json`.
O painel permite consultar e buscar esses produtos; a API de CRUD ainda não foi
implementada. Não há checkout. Sem `VITE_WHATSAPP_NUMBER`, o contato aponta para
a seção de contato da landing.

Antes de publicar, configure `VITE_SITE_URL` com a origem definitiva (por exemplo,
`https://seu-dominio.com.br`) e `VITE_WHATSAPP_NUMBER` com país, DDD e número.
Essas variáveis são públicas e incorporadas ao build: não coloque segredos nelas.
Refaça `npm run build` depois de mudar esses valores ou o catálogo.

## Build e SEO

O build gera o bundle em `dist`, compila uma entrada temporária em `dist-ssr` e
pré-renderiza os mesmos componentes com React DOM Server. Os HTMLs completos
ficam em `dist/pages`; o Express escolhe o arquivo pela rota. O navegador hidrata
esse HTML e mantém a interação React. Na vitrine com filtros na query string,
o cliente monta a seleção solicitada sobre o HTML inicial da vitrine completa.

O build também atualiza os trechos delimitados `seo` e `highlights` da landing e
gera `api/public/assets/icons.svg`. Edite o conteúdo comum da landing normalmente;
edite o catálogo/componentes ou `src/utils/metadata.js` para mudar esses trechos
gerados. Publique `api/public` e `frontend/vitrine/dist` juntos.

Há títulos e descrições por página, canonical, Open Graph, sitemap e dados
estruturados da loja. Não são anunciadas ofertas/estoque fictícios em Schema.org.
Login e administração recebem `noindex` no HTML e no cabeçalho HTTP. A proteção
de acesso continua independente dessa configuração de indexação.

Essa geração no build atende ao catálogo estático atual. Quando houver CRUD real,
será necessário atualizar a geração junto das alterações do catálogo ou reavaliar
a entrega de HTML pelo Express para evitar páginas desatualizadas.

## Visual e arquivos preservados

`api/public/css/site.css` compartilha a identidade entre landing e React. Tailwind
continua disponível no bundle. Os ícones são da família Material Design de
`react-icons`; a landing usa SVGs gerados da mesma biblioteca, sem outra dependência.

`parts.html` e `product2.html` foram preservados sem edição em `api/public`, por
solicitação. Não são usados como referência nem entregues como páginas do site.
A pasta temporária `public2` foi removida após a consolidação.

## Validação

```sh
# frontend/vitrine
npm run lint
npm run build

# api (após o build)
npm test
```

Os testes verificam autenticação com banco simulado, entrega dos assets, rotas,
redirecionamentos, HTML indexável, metadados, exclusão administrativa da indexação,
sitemap e HTTP 404. O build é obrigatório antes dos testes de integração.

Referências: [React DOM Server](https://react.dev/reference/react-dom/server/renderToString),
[pré-renderização com Vite](https://vite.dev/guide/ssr#pre-rendering-ssg).
