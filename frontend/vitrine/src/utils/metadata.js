export const siteUrl = (import.meta.env.VITE_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export function getMetadata(pathname, catalog) {
  pathname = pathname.replace(/\/$/, '') || '/';
  const product = catalog?.products.find((item) => pathname === `/product/${item.id}`);
  const pages = {
    '/': ['Papelaria Itapira — criatividade para todos os dias', 'Papelaria Itapira: materiais escolares, de escritório e muita criatividade. Conheça nossa loja e explore os produtos.'],
    '/vitrine': ['Materiais escolares e papelaria | Papelaria Itapira', 'Explore cadernos, canetas, materiais de arte e escritório da Papelaria Itapira. Consulte preços e disponibilidade com a loja.'],
    '/login': ['Login administrativo | Papelaria Itapira', 'Acesso exclusivo à administração da Papelaria Itapira.'],
    '/admin': ['Administração | Papelaria Itapira', 'Painel administrativo da Papelaria Itapira.'],
  };
  const page = product ? [`${product.name} | Papelaria Itapira`, product.description] : pages[pathname];
  const noindex = !page || ['/login', '/admin'].includes(pathname);
  return {
    title: page?.[0] || 'Página não encontrada | Papelaria Itapira',
    description: page?.[1] || 'Este endereço não está disponível. Explore os produtos da Papelaria Itapira.',
    noindex,
    url: `${siteUrl}${pathname}`,
    image: product?.image || `${siteUrl}/assets/images/papelaria-itapira-fachada.jpg`,
    // O catálogo é demonstrativo: não anunciamos ofertas nem estoque fictício.
    structuredData: !noindex && !product ? {
      '@context': 'https://schema.org', '@type': 'Store',
      name: 'Papelaria Itapira', url: siteUrl,
      image: `${siteUrl}/assets/images/papelaria-itapira-fachada.jpg`,
      address: { '@type': 'PostalAddress', addressLocality: 'Itapira', addressRegion: 'SP', addressCountry: 'BR' },
    } : null,
  };
}
