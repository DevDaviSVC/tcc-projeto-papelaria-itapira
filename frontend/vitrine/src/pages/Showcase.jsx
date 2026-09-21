import Icon from '../components/Icon';
import { useSearchParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import ProductCard from "../components/ProductCard";
import CatalogState from "../components/CatalogState";

export default function Showcase() {
  const { catalog, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const category = params.get("cat") || "todos";
  const query = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const updateFilter = (key, value, replace = false) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace });
  };
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const products =
    catalog?.products.filter(
      (product) =>
        (category === "todos" || product.category === category) &&
        normalize(`${product.name} ${product.categoryLabel}`).includes(
          normalize(query),
        ),
    ) || [];
  products.sort((a, b) =>
    sort === "price-low"
      ? a.price - b.price
      : sort === "price-high"
        ? b.price - a.price
        : Number(b.featured) - Number(a.featured),
  );

  return (
    <main id="main" className="container">
      <div className="page-intro">
        <span className="eyebrow">Sua próxima ideia começa aqui</span>
        <h1>Um mundo de possibilidades</h1>
        <p>
          Materiais para estudar, criar e organizar. Encontre seus favoritos e
          converse com a gente.
        </p>
      </div>
      <div className="catalog-banner">
        <div>
          <span className="eyebrow">Um toque de cor na rotina</span>
          <h2>Pequenos detalhes. Grandes ideias.</h2>
          <p>Explore nossas coleções e encontre o que combina com você.</p>
        </div>
        <span className="ornament" aria-hidden="true">
          <Icon name="sparkle" /><Icon name="edit" />
        </span>
      </div>
      {!catalog ? (
        <CatalogState error={error} />
      ) : (
        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <h2>Coleções</h2>
            <nav
              id="categoryFilters"
              className="category-list"
              aria-label="Categorias de produtos"
            >
              {catalog.categories.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className={`category-button ${category === item.slug ? "active" : ""}`}
                  aria-pressed={category === item.slug}
                  onClick={() =>
                    updateFilter("cat", item.slug === "todos" ? "" : item.slug)
                  }
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true"><Icon name="arrow" /></span>
                </button>
              ))}
            </nav>
          </aside>
          <section aria-label="Produtos">
            <div className="filter-toolbar">
              <div className="field">
                <label htmlFor="productSearch">Encontre seu material</label>
                <input
                  id="productSearch"
                  type="search"
                  placeholder="Buscar produtos…"
                  value={query}
                  onChange={(event) =>
                    updateFilter("q", event.target.value, true)
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="productSort">Ordenar por</label>
                <select
                  id="productSort"
                  value={sort}
                  onChange={(event) => updateFilter("sort", event.target.value)}
                >
                  <option value="featured">Destaques</option>
                  <option value="price-low">Menor preço</option>
                  <option value="price-high">Maior preço</option>
                </select>
              </div>
            </div>
            <p className="results-count" aria-live="polite">
              {products.length}{" "}
              {products.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>
            <div id="productsGrid" className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {!products.length && (
                <div className="empty-state">
                  <h2>Nenhum produto por aqui</h2>
                  <p>Tente outra palavra ou explore todas as coleções.</p>
                  <button
                    className="button button-quiet"
                    onClick={() => setParams({})}
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      <p className="notice">
        Catálogo de demonstração do projeto. Consulte preços e disponibilidade
        com a loja.
      </p>
    </main>
  );
}
