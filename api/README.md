# API — Papelaria Itapira

## Banco de dados

O Express acessa o PostgreSQL do Supabase usando `pg`. O frontend deve acessar apenas a API Node.

1. Instale as dependências na pasta `api` com `npm ci`.
2. Se ainda não existir `.env`, copie `.env.example` para `.env` e preencha os parâmetros do Session pooler disponíveis em **Connect** no Supabase. Preserve um `.env` existente.
3. Use a senha do banco em `DB_PASSWORD`, entre aspas. Não use o hash de senha do administrador.
4. Baixe o certificado em **Database → Settings → SSL Configuration**. Salve como `prod-ca-2021.crt` na raiz do projeto ou configure `DB_SSL_CA_PATH`. Caminhos relativos são resolvidos a partir de `api`, independentemente do diretório de execução.
5. Execute `npm run db:check`. O comando executa somente `SELECT 1`, valida o certificado TLS e encerra a conexão.
6. Execute `npm run dev` para desenvolvimento ou `npm start` para execução normal.

O servidor só começa a atender após confirmar a conexão. O pool usa até cinco conexões, com limites de espera e encerramento em SIGINT/SIGTERM. O teste não cria tabelas nem modifica dados. Inclua o certificado no ambiente de publicação; não desative a validação TLS.

Erros comuns: `28P01` indica falha de autenticação; `SELF_SIGNED_CERT_IN_CHAIN` indica uma cadeia de certificados não confiável; `ENOENT` pode indicar um arquivo ausente. Confira as variáveis e o certificado sem publicar a senha.

## Estrutura observada

- `admins`: `id`, `username`, `password_hash`, `created_at`.
- `products`: `id`, `name`, `description`, `price`, `image`, `created_at`, `updated_at`.

## Login do administrador

O login usa a tabela `public.admins`, bcrypt e JWT emitido pela API Node. O campo
`password_hash` deve conter um hash bcrypt da senha. Não há cadastro público de administradores.

Configure `JWT_SECRET` com um segredo aleatório de pelo menos 32 caracteres e
`JWT_EXPIRES_IN=1h`. Para gerar um segredo, execute:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

`JWT_EXPIRES_IN` aceita duração com unidade (`1h`, `30m`) ou segundos inteiros (`3600`).
A variável antiga `JWT_EXPIRES` continua sendo aceita quando `JWT_EXPIRES_IN` não existe;
sem ambas, a duração padrão é uma hora. O `.env` existente foi preservado.
O servidor valida essa configuração antes de começar a atender.

Inicie com `npm start` ou `npm run dev` dentro de `api`. O ponto de entrada é
`server.js`; `app.js` exporta o Express para permitir os testes sem iniciar outro servidor.

Envie `POST /auth/login` com `Content-Type: application/json`:

```json
{
  "username": "seu-usuario",
  "password": "sua-senha"
}
```

A resposta de sucesso é `200` com `{ "message": "Login realizado com sucesso", "token": "..." }`.
O username é aparado; a senha é comparada exatamente como recebida. A API rejeita
senhas maiores que 72 bytes para evitar o truncamento do bcrypt.

Para consultar o administrador autenticado, envie `GET /admin/me` com o cabeçalho:

```http
Authorization: Bearer <token recebido no login>
```

A resposta contém somente `{ "admin": { "id": 1, "username": "seu-usuario" } }`
(o tipo de `id` acompanha o banco). Todas as rotas sob `/admin` passam pelo middleware,
incluindo o roteador de produtos em `/admin/products`, ainda sem endpoints de CRUD.
O middleware valida assinatura HS256, emissor, destinatário, expiração e papel de
administrador, além de confirmar que o cadastro ainda existe no banco.

- `400`: campos inválidos ou JSON malformado.
- `401`: credenciais incorretas ou token ausente, inválido ou expirado.
- `413`: corpo da requisição acima de 16 KB.
- `500`: erro interno, sem detalhes do banco na resposta.

O token não contém senha nem hash. Após expirar, é necessário fazer login novamente.
O logout do cliente consiste em descartar o token; uma cópia continua válida até
expirar, salvo remoção do administrador ou troca do segredo. A autenticação implementada
é da API; a interface visual de login não faz parte destes endpoints.

## Testes

Execute primeiro `npm run build` em `frontend/vitrine`, depois `npm test` em `api`.
Os testes de páginas exigem o HTML gerado e também verificam SEO, 404 e redirecionamentos.
Os testes usam HTTP local, bcrypt e JWT reais, substituindo somente
as consultas ao banco, sem depender das credenciais do Supabase. Cobrem login, validação
de entrada, consultas parametrizadas, acesso protegido, tokens inválidos e falhas do banco.

Referências: [conexão PostgreSQL no Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres)
e [assinatura e verificação com jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme).
