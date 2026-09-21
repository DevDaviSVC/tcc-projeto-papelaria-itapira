import Icon from '../components/Icon';
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import CatalogState from "../components/CatalogState";
import { formatPrice, getContactLink } from "../utils/format";
import NotFound from "./NotFound";

function ProductGallery({ product }) {
  const images = product.images?.length
    ? product.images
    : [product.image].filter(Boolean);
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <ProductImage
        key={images[selected] || product.id}
        product={{ ...product, image: images[selected] }}
        badge
        priority
      />
      {images.length > 1 && (
        <div className="thumbnail-row">
          {images.map((image, index) => (
            <button
              key={image}
              className={selected === index ? "active" : ""}
              aria-label={`Ver imagem ${index + 1} de ${product.name}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const { catalog, error } = useCatalog();
  if (!catalog)
    return (
      <main id="main" className="container section">
        <CatalogState error={error} />
      </main>
    );
  const product = catalog.products.find((item) => item.id === id);
  if (!product) return <NotFound />;
  const contactLink = getContactLink(product);
  const related = catalog.products
    .filter((item) => item.id !== id && item.category === product.category)
    .slice(0, 3);
  return (
    <main id="main" className="container">
      <nav className="breadcrumb" aria-label="Caminho da página">
        <a href="/">Início</a>
        <span>/</span>
        <Link to="/vitrine">Produtos</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <section className="product-detail">
        <ProductGallery key={product.id} product={product} />
        <div className="product-details">
          <Link className="eyebrow" to={`/vitrine?cat=${product.category}`}>
            {product.categoryLabel}
          </Link>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price">{formatPrice(product.price)}</div>
          <p className="fine-print">
            Consulte a disponibilidade e o preço com a loja.
          </p>
          <div className="actions">
            <a
              className="button button-accent"
              href={contactLink}
              target={contactLink.startsWith("https:") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {contactLink.startsWith("https:")
                ? "Conversar no WhatsApp"
                : "Consultar com a loja"} <Icon name="arrow" />
            </a>
            <Link className="text-link" to="/vitrine">
              Voltar à vitrine
            </Link>
          </div>
          <div className="product-description">
            <h2>Feito para sua rotina</h2>
            <p>
              Conte com nosso atendimento para escolher seus materiais. A compra
              é combinada diretamente com a papelaria.
            </p>
          </div>
        </div>
      </section>
      <p className="notice">
        Este produto faz parte do catálogo de demonstração do projeto.
      </p>
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <h2>Combine com suas ideias</h2>
            <Link className="text-link" to="/vitrine">
              Explorar a loja <Icon name="forward" />
            </Link>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
