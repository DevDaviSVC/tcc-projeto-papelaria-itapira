import { useState } from 'react';
import { MdAutoAwesome, MdBackpack, MdBrush, MdEdit, MdInventory2 } from 'react-icons/md';

const icons = { escritorio: MdBackpack, arte: MdBrush, canetas: MdEdit, adesivos: MdAutoAwesome };

export default function ProductImage({ product, badge = false, priority = false }) {
  const [failed, setFailed] = useState(false);
  const Icon = icons[product.category] || MdInventory2;
  return <div className="product-image">
    {product.image && !failed
      ? <img src={product.image} alt={product.alt || product.name} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} onError={() => setFailed(true)} />
      : <Icon className="product-symbol" aria-label={product.name} role="img" />}
    {badge && product.badge && <span className="pill">{product.badge}</span>}
  </div>;
}
