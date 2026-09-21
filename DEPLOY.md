# Deploy da DEMO no Render

## 1. Alterações realizadas

Preparação para um único Web Service Node/Express. O servidor respeita `PORT` e
escuta em `0.0.0.0`. Home, API e assets continuam no Express; o fallback React ficou
limitado às áreas React. O build usa `RENDER_EXTERNAL_URL` automaticamente para SEO,
salvo quando `VITE_SITE_URL` é informado. Node limitado à linha 22.

Mantidos o Session Pooler existente, SSL com certificado validado, JWT/bcrypt,
catálogo demonstrativo, build e pré-renderização atuais. Nenhuma migração ou
alteração de dados/políticas foi realizada. O utilitário de hash deixou de ter uma
senha de exemplo fixa; ele usa `GENERATED_PASSWORD` somente quando executado localmente.

Validação local: instalação limpa dos dois projetos, build, lint e 20 testes
aprovados. Express iniciado com `NODE_ENV=production` e `PORT=10000`, sem Vite,
conectado ao Supabase real com SSL. Home, páginas React, assets, autenticação
rejeitando login inválido e endpoints protegidos foram conferidos por HTTP.
As credenciais locais conhecidas não foram encontradas nos arquivos versionados
nem nas diferenças dos nove commits existentes. Isso não substitui a conferência
do que será enviado ao Git. O login com a conta real deve ser ensaiado por você.

## 2. Arquivos criados/modificados

- Criados: `render.yaml`, `.node-version`, `DEPLOY.md`.
- Modificados: `.gitignore`, `api/app.js`, `api/server.js`,
  `api/tests/auth.test.js`, `api/utils/generatePassword.js`,
  `frontend/vitrine/vite.config.js`.

## 3. Variáveis no Render

Obrigatórias/configuradas para esta aplicação:

```text
NODE_ENV
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
DB_SSL_CA_PATH
JWT_SECRET
```

Opcionais:

```text
JWT_EXPIRES_IN
VITE_WHATSAPP_NUMBER
VITE_SITE_URL
```

Use `NODE_ENV=production`. Copie os parâmetros do **Session Pooler** do projeto
atual no Supabase, em **Connect**, preservando a porta 5432. A configuração local
já usa essa modalidade compatível com IPv4; não é necessário introduzir
`DATABASE_URL` nem trocar o banco. Nunca use a senha do administrador no lugar
da senha do PostgreSQL. O JWT exige um segredo aleatório de pelo menos 32 caracteres;
a expiração padrão é `1h`.

Defina `DB_SSL_CA_PATH=/etc/secrets/prod-ca-2021.crt`. O arquivo precisa ser
cadastrado no painel, conforme o item 7; não basta definir o caminho.

`VITE_WHATSAPP_NUMBER` é o número público com país e DDD. Sem ele, o botão abre o
contato da Home. `VITE_SITE_URL` só é necessário para substituir a URL automática
do Render, por exemplo ao usar domínio próprio. Essas variáveis entram no build:
ao mudá-las, faça **Save, rebuild, and deploy**. Nunca coloque segredos em `VITE_*`.

`PORT` e `RENDER_EXTERNAL_URL` são fornecidas pelo Render; não copie `PORT=3000`
do ambiente local. `VITE_API_TARGET` é apenas para o proxy de desenvolvimento.
`GENERATED_PASSWORD` não é necessária no Web Service.

## 4. Build Command

Execute a partir da raiz do repositório:

```sh
npm ci --prefix api && npm ci --prefix frontend/vitrine --include=dev && npm run build --prefix frontend/vitrine && npm test --prefix api
```

`--include=dev` instala o Vite e as ferramentas de build mesmo com ambiente de
produção. Os testes usam banco simulado; não precisam do certificado real durante
o build. O build gera os arquivos nos diretórios já usados pelo Express, sem cópia
manual. O aviso de `/css/site.css` externo ao Vite é esperado: o Express o serve.

## 5. Start Command

```sh
npm start --prefix api
```

Não use `npm run dev`, `vite` ou `vite preview` em produção.

## 6. Root Directory

**Deixe vazio**, usando a raiz do repositório. Não selecione `api`, pois o build
também precisa de `frontend/vitrine`. O arquivo `.node-version` seleciona Node 22;
o ambiente local validado usa 22.14.0. O Render pode instalar um patch mais recente
da mesma linha.

## 7. Criar o Web Service

1. Revise, faça commit e envie as alterações ao repositório que será conectado.
   Não envie `.env`, certificado, `node_modules`, `dist` ou `dist-ssr`.
2. No Render, selecione **New → Web Service**, conecte o repositório e selecione
   a branch contendo estas mudanças. Use a linguagem **Node**, raiz vazia e os
   comandos acima. Selecione uma região próxima ao banco e o plano desejado.
3. Cadastre as variáveis do item 3. Em **Environment → Secret Files**, adicione
   o arquivo `prod-ca-2021.crt`, colando o conteúdo do certificado CA baixado nas
   configurações SSL do Supabase (o mesmo certificado usado localmente).
   Não envie chave privada. O certificado será montado em `/etc/secrets/`.
4. Se a tela inicial ainda não permitir adicionar o arquivo, crie o serviço,
   adicione-o imediatamente em **Environment** e faça um novo deploy. A primeira
   inicialização falhará com segurança enquanto o certificado estiver ausente.
5. Use `/` como Health Check Path. Aguarde o deploy terminar.

`render.yaml` registra a mesma configuração e oferece a alternativa **New →
Blueprint**. Os segredos marcados com `sync: false` são preenchidos por você no
painel; o Secret File continua sendo um passo manual. Não foi criado nenhum
serviço externo automaticamente.

## 8. Conferir os logs

O build deve mostrar `HTML gerado para 13 páginas públicas` e os 20 testes sem
falhas. Na inicialização, procure:

```text
Banco conectado. Servidor ligado na porta ...!
```

A porta será a fornecida pelo Render. Esse log aparece somente depois do `SELECT 1`
com SSL. Confirme também o estado **Live** e a resposta da Home.

Se falhar: certificado ausente exige revisar o Secret File/caminho; `28P01` exige
revisar usuário e senha do banco; timeout exige conferir host do Session Pooler,
disponibilidade do projeto e eventuais restrições de rede existentes. Não desative
a validação SSL para contornar o problema. Nunca compartilhe os valores dos secrets.

## 9. URLs para testar e limitações

Substitua a origem pela URL exibida no painel:

```text
https://SEU-SERVICO.onrender.com/
https://SEU-SERVICO.onrender.com/vitrine
https://SEU-SERVICO.onrender.com/product/caderno-sonho-neon
https://SEU-SERVICO.onrender.com/admin
https://SEU-SERVICO.onrender.com/sitemap.xml
```

Abra `/admin` em uma janela sem sessão: deve ir para `/login`. Entre com sua conta
existente e confirme o painel, logout e atualização direta das páginas. Confira
se o sitemap usa a origem pública, sem `localhost`. `/admin/me` sem token deve
retornar 401; uma URL desconhecida deve retornar 404. Nenhuma URL pública foi
criada por esta tarefa; o endereço real será conhecido após criar o serviço.

Limitações da DEMO: catálogo estático, CRUD ainda não implementado e imagens de
produtos externas. Mudanças no catálogo exigem novo build. A conferência desta
tarefa foi automatizada/HTTP; não houve revisão visual em navegador nem login
manual com a conta real. O serviço Free dorme após 15 minutos sem tráfego e pode
levar cerca de um minuto para voltar: abra e teste o site antes da apresentação.
A conexão verificada é local; a rede específica do Render só será validada no deploy.

Fontes: [deploy Express](https://render.com/docs/deploy-node-express-app),
[porta e host](https://render.com/docs/web-services#port-binding),
[Secret Files](https://render.com/docs/configure-environment-variables#secret-files),
[Node](https://render.com/docs/node-version),
[variáveis automáticas](https://render.com/docs/environment-variables),
[limitações Free](https://render.com/docs/free),
[conexão Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).
