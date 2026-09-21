import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import CatalogContext from './context/CatalogContext';
import ProductCard from './components/ProductCard';
import Icon from './components/Icon';
export { getMetadata, siteUrl } from './utils/metadata';

export function render(path, catalog) {
  return renderToString(<CatalogContext.Provider value={catalog}><StaticRouter location={path}><App /></StaticRouter></CatalogContext.Provider>);
}

export function renderHighlights(catalog) {
  return renderToStaticMarkup(<StaticRouter location="/">{catalog.products.filter((product) => product.featured).map((product) => <ProductCard key={product.id} product={product} />)}</StaticRouter>);
}

export function renderIcons() {
  const names = ['arrow', 'forward', 'back', 'sparkle', 'edit', 'heart', 'home', 'inventory', 'category', 'logout', 'menu', 'close', 'price', 'star'];
  return `<svg xmlns="http://www.w3.org/2000/svg">${names.map((name) => {
    const svg = renderToStaticMarkup(<Icon name={name} />);
    return svg.replace(/^<svg[^>]*>/, `<symbol id="${name}" viewBox="0 0 24 24" fill="currentColor">`).replace('</svg>', '</symbol>');
  }).join('')}</svg>`;
}
