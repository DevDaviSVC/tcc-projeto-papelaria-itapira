import { useContext, useEffect, useState } from 'react';
import CatalogContext from '../context/CatalogContext';

export default function useCatalog() {
  const initialCatalog = useContext(CatalogContext);
  const [catalog, setCatalog] = useState(initialCatalog);
  const [error, setError] = useState('');
  useEffect(() => {
    if (initialCatalog) return;
    const controller = new AbortController();
    fetch('/assets/data/catalog.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Catalog unavailable');
        return response.json();
      })
      .then(setCatalog)
      .catch((error) => {
        if (error.name !== 'AbortError') setError('Não foi possível carregar o catálogo. Atualize a página para tentar novamente.');
      });
    return () => controller.abort();
  }, [initialCatalog]);
  return { catalog, error };
}
