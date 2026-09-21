import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// O pool é substituído abaixo: nenhum teste unitário conecta ao banco real.
Object.assign(process.env, {
    DB_HOST: "localhost", DB_PORT: "5432", DB_NAME: "test", DB_USER: "test", DB_PASSWORD: "test",
    DB_SSL_CA_PATH: fileURLToPath(import.meta.url),
    JWT_SECRET: "test-secret-only-012345678901234567890123456789",
    JWT_EXPIRES_IN: "1h",
});
const { default: pool } = await import("../config/database.js");
const { default: app } = await import("../app.js");
const { getAuthConfig } = await import("../config/auth.js");
const { default: adminModel } = await import("../models/adminModel.js");
const admin = { id: 1, username: "admin", password_hash: await bcrypt.hash("test-password", 10) };
let server, baseUrl, databaseFailure = false, adminExists = true;
const queries = [];
const originalQuery = pool.query;
pool.query = async (sql, parameters) => {
    queries.push({ sql, parameters });
    if (databaseFailure) throw new Error("sensitive database detail");
    if (sql.includes("password_hash")) {
        return { rows: adminExists && parameters[0] === admin.username ? [admin] : [] };
    }
    return { rows: adminExists && String(parameters[0]) === String(admin.id)
        ? [{ id: admin.id, username: admin.username }] : [] };
};
before(async () => {
    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
    await new Promise((resolve) => server.close(resolve));
    pool.query = originalQuery;
    await pool.end();
});
const login = (body) => fetch(`${baseUrl}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});
const me = (token) => fetch(`${baseUrl}/admin/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});

test("Express entrega landing, assets e rotas React sem interceptar a API", async () => {
    const home = await fetch(baseUrl);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /heroSlideshow/);
    for (const asset of ['/css/site.css', '/js/home.js', '/assets/data/catalog.json']) {
        assert.equal((await fetch(baseUrl + asset)).status, 200);
    }
    for (const route of ['/admin', '/login', '/vitrine', '/product/caderno-sonho-neon']) {
        const response = await fetch(baseUrl + route);
        assert.equal(response.status, 200, `${route}: execute o build do frontend antes dos testes`);
        assert.match(await response.text(), /id="root"/);
    }
    for (const [legacy, target] of [['/admin.html', '/admin'], ['/login.html', '/login'], ['/vitrine.html?cat=arte', '/vitrine?cat=arte'], ['/product.html?id=example', '/product/example'], ['/product?id=example', '/product/example'], ['/index.html', '/']]) {
        const response = await fetch(baseUrl + legacy, { redirect: 'manual' });
        assert.equal(response.status, 301);
        assert.equal(response.headers.get('location'), target);
    }
    assert.equal((await fetch(`${baseUrl}/app-assets/nonexistent.js`)).status, 404);
    assert.equal((await me()).status, 401);
    assert.equal((await fetch(`${baseUrl}/admin/products`)).status, 401);
});

test('páginas públicas entregam conteúdo e SEO sem executar JavaScript', async () => {
    const titles = new Set();
    for (const route of ['/', '/vitrine', '/product/caderno-sonho-neon']) {
        const response = await fetch(baseUrl + route);
        const html = await response.text();
        const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
        assert.match(markup, /Caderno Sonho Neon/);
        assert.match(markup, /<h1[\s>]/);
        assert.match(markup, /name="description"/);
        assert.match(markup, /property="og:title"/);
        assert.match(markup, /rel="canonical"/);
        titles.add(markup.match(/<title>(.*?)<\/title>/)[1]);
    }
    assert.equal(titles.size, 3);
    for (const route of ['/admin', '/login']) {
        const response = await fetch(baseUrl + route);
        assert.match(response.headers.get('x-robots-tag'), /noindex/);
        assert.match(await response.text(), /name="robots" content="noindex, nofollow"/);
    }
    for (const route of ['/product/unknown', '/vitrine/unknown', '/unknown', '/parts.html', '/product2.html']) {
        const response = await fetch(baseUrl + route);
        assert.equal(response.status, 404, route);
        assert.match(response.headers.get('x-robots-tag'), /noindex/);
    }
    const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    const xml = await sitemap.text();
    assert.match(xml, /\/product\/caderno-sonho-neon<\/loc>/);
    assert.doesNotMatch(xml, /\/admin|\/login/);
    const robots = await fetch(`${baseUrl}/robots.txt`);
    assert.equal(robots.status, 200);
    assert.match(await robots.text(), /Sitemap: https?:\/\//);
    const product = await fetch(`${baseUrl}/product/caderno-sonho-neon`);
    const html = await product.text();
    for (const match of html.matchAll(/(?:src|href)="(\/app-assets\/[^"#]+)"/g)) {
        assert.equal((await fetch(baseUrl + match[1])).status, 200, match[1]);
    }
    assert.equal((await fetch(`${baseUrl}/assets/icons.svg`)).status, 200);
});
function sign(payload = {}, options = {}, secret = process.env.JWT_SECRET) {
    const config = getAuthConfig();
    return jwt.sign({ id: 1, username: "admin", role: "admin", ...payload }, secret, {
        subject: "1", expiresIn: "1h", algorithm: "HS256",
        issuer: config.issuer, audience: config.audience, ...options,
    });
}

test("login gera JWT e libera /admin/me sem expor o hash", async () => {
    const response = await login({ username: " admin ", password: "test-password" });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    const payload = jwt.verify(body.token, process.env.JWT_SECRET);
    assert.equal(payload.exp - payload.iat, 3600);
    assert.equal(payload.role, "admin");
    assert.equal(payload.password_hash, undefined);
    const profile = await me(body.token);
    assert.equal(profile.status, 200);
    assert.deepEqual(await profile.json(), { admin: { id: 1, username: "admin" } });
});

for (const body of [undefined, {}, null, [], { username: 1, password: "x" },
    { username: "admin", password: {} }, { username: " ", password: "x" },
    { username: "admin", password: "" }, { username: "x".repeat(256), password: "x" },
    { username: "admin", password: "á".repeat(37) }]) {
    test(`entrada inválida retorna 400: ${JSON.stringify(body)}`, async () => {
        const count = queries.length;
        assert.equal((await login(body)).status, 400);
        assert.equal(queries.length, count);
    });
}

test("JSON malformado retorna 400", async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{",
    });
    assert.equal(response.status, 400);
});

test("usuário inexistente e senha incorreta recebem a mesma resposta", async () => {
    for (const body of [{ username: "unknown", password: "x" }, { username: "admin", password: "wrong" }]) {
        const response = await login(body);
        assert.equal(response.status, 401);
        assert.deepEqual(await response.json(), { error: "Credenciais inválidas" });
    }
});

test("model usa parâmetros SQL e não expõe hash na consulta por ID", async () => {
    const input = "' OR 1=1 --";
    assert.equal(await adminModel.findByUsername(input), undefined);
    assert.equal(queries.at(-1).sql.includes(input), false);
    assert.deepEqual(queries.at(-1).parameters, [input]);
    await adminModel.findById(1);
    assert.equal(queries.at(-1).sql.includes("password_hash"), false);
});

test("JWT ausente, adulterado, expirado ou com claims incorretos é rejeitado", async () => {
    const config = getAuthConfig();
    const tokens = [undefined, "invalid", sign({}, {}, "another-secret"),
        sign({}, { expiresIn: -1 }), sign({}, { algorithm: "HS384" }),
        sign({}, { audience: "other" }), sign({}, { issuer: "other" }),
        sign({ role: "customer" }), sign({}, { subject: "2" }),
        jwt.sign({ id: 1, role: "admin", sub: "1" }, config.secret, { issuer: config.issuer, audience: config.audience })];
    for (const token of tokens) assert.equal((await me(token)).status, 401);
    assert.equal((await fetch(`${baseUrl}/admin/products`)).status, 401);
});

test("administrador removido não pode reutilizar JWT", async () => {
    adminExists = false;
    try { assert.equal((await me(sign())).status, 401); }
    finally { adminExists = true; }
});

test("falha de banco retorna 500 sem expor detalhes", async () => {
    databaseFailure = true;
    try {
        for (const response of [await login({ username: "admin", password: "test-password" }), await me(sign())]) {
            assert.equal(response.status, 500);
            assert.deepEqual(await response.json(), { error: "Erro interno do servidor" });
        }
    } finally { databaseFailure = false; }
});

test("configuração JWT exige segredo forte e expiração positiva, aceitando variável antiga", () => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES_IN;
    const legacy = process.env.JWT_EXPIRES;
    try {
        process.env.JWT_SECRET = "short";
        assert.throws(getAuthConfig, /JWT_SECRET/);
        process.env.JWT_SECRET = secret;
        for (const duration of ["invalid", "0", "-1h", ""]) {
            process.env.JWT_EXPIRES_IN = duration;
            assert.throws(getAuthConfig, /JWT_EXPIRES_IN/);
        }
        process.env.JWT_EXPIRES_IN = "3600";
        assert.equal(getAuthConfig().expiresIn, 3600);
        delete process.env.JWT_EXPIRES_IN;
        process.env.JWT_EXPIRES = "2h";
        assert.equal(getAuthConfig().expiresIn, "2h");
        delete process.env.JWT_EXPIRES;
        assert.equal(getAuthConfig().expiresIn, "1h");
    } finally {
        process.env.JWT_SECRET = secret;
        process.env.JWT_EXPIRES_IN = expires;
        if (legacy === undefined) delete process.env.JWT_EXPIRES;
        else process.env.JWT_EXPIRES = legacy;
    }
});
