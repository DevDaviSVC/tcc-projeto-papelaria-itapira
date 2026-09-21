import Icon from '../components/Icon';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import CatalogState from "../components/CatalogState";
import { clearToken } from "../services/auth";
import { formatPrice } from "../utils/format";

function StatCard({ label, value, icon }) {
  return (
    <article className="stat-card">
      <span className="eyebrow" aria-hidden="true">
        {icon}
      </span>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export default function Admin({ admin }) {
  const { catalog, error } = useCatalog();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const products = catalog?.products || [];
  const filtered = products.filter((product) =>
    product.name
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR")),
  );
  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };
  return (
    <main id="main" className="container">
      <div className="page-intro admin-heading">
        <div>
          <span className="eyebrow">Papelaria Itapira · Administração</span>
          <h1 id="boasVindas">Olá, {admin.username}!</h1>
          <p>Um olhar sobre os produtos e as coleções da nossa loja.</p>
        </div>
        <button
          id="authLogoutBtn"
          className="button button-quiet"
          onClick={logout}
        >
          Sair da conta <Icon name="logout" />
        </button>
      </div>
      {!catalog ? (
        <CatalogState error={error} />
      ) : (
        <>
          <p className="demo-label">
            Visão geral do catálogo de demonstração. Estes números não
            representam o estoque ou as vendas da loja.
          </p>
          <div id="statsCards" className="stat-grid">
            <StatCard
              label="Produtos no catálogo"
              value={products.length}
              icon={<Icon name="inventory" />}
            />
            <StatCard
              label="Categorias"
              value={new Set(products.map((product) => product.category)).size}
              icon={<Icon name="category" />}
            />
            <StatCard
              label="Destaques na página inicial"
              value={products.filter((product) => product.featured).length}
              icon={<Icon name="star" />}
            />
            <StatCard
              label="Preço médio do catálogo"
              value={formatPrice(
                products.reduce((sum, product) => sum + product.price, 0) /
                  (products.length || 1),
              )}
              icon={<Icon name="price" />}
            />
          </div>
          <section className="table-panel">
            <div className="section-heading">
              <h2>Produtos do catálogo</h2>
              <Link className="text-link" to="/vitrine">
                Ver na loja <Icon name="forward" />
              </Link>
            </div>
            <div className="field">
              <label htmlFor="adminSearch">Buscar produto</label>
              <input
                id="adminSearch"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nome do produto…"
              />
            </div>
            <div className="table-scroll">
              <table>
                <caption className="visually-hidden">
                  Produtos do catálogo demonstrativo
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Selo</th>
                  </tr>
                </thead>
                <tbody id="productsTableBody">
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Link to={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </td>
                      <td>{product.categoryLabel}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        {product.badge ? (
                          <span className="pill">{product.badge}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={4}>Nenhum produto encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
