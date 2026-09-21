export const formatPrice = (price) => price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Preencha VITE_WHATSAPP_NUMBER com país + DDD + número no .env do frontend.
export function getContactLink(product) {
  const phone = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (!phone) return '/#contact';
  return `https://wa.me/${phone}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${product.name}.`)}`;
}
