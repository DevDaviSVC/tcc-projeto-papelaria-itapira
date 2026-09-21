import Icon from './Icon';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }) {
  return <article className="product-card" data-category={product.category}>
    <Link to={`/product/${product.id}`} aria-label={`Ver ${product.name}`}><ProductImage product={product} badge /></Link>
    <div className="product-body"><span className="eyebrow">{product.categoryLabel}</span><h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3><p>{product.description}</p><div className="product-bottom"><span className="price">{formatPrice(product.price)}</span><Link className="button button-quiet button-small" to={`/product/${product.id}`}>Ver produto <Icon name="arrow" /></Link></div></div>
  </article>;
}
