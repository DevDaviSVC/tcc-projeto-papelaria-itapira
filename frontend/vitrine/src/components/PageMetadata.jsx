import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useCatalog from '../hooks/useCatalog';
import { getMetadata } from '../utils/metadata';

export default function PageMetadata() {
  const { pathname } = useLocation();
  const { catalog } = useCatalog();
  useEffect(() => {
    const metadata = getMetadata(pathname, catalog);
    document.title = metadata.title;
    const values = {
      description: metadata.description, robots: metadata.noindex ? 'noindex, nofollow' : 'index, follow',
      'og:title': metadata.title, 'og:description': metadata.description,
      'og:url': metadata.url, 'og:image': metadata.image, 'og:type': 'website',
    };
    for (const [name, content] of Object.entries(values)) {
      const attribute = name.startsWith('og:') ? 'property' : 'name';
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.append(element);
      }
      element.content = content;
    }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = metadata.url;
    document.getElementById('structured-data')?.remove();
    if (metadata.structuredData) {
      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(metadata.structuredData);
      document.head.append(script);
    }
  }, [pathname, catalog]);
  return null;
}
