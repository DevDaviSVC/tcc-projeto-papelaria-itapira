import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "./index.css";
import CatalogContext from './context/CatalogContext';

const initialCatalog = JSON.parse(document.getElementById('catalog-data')?.textContent || 'null');
const app = (
  <StrictMode>
    <CatalogContext.Provider value={initialCatalog}>
      <BrowserRouter><App /></BrowserRouter>
    </CatalogContext.Provider>
  </StrictMode>
);
const root = document.getElementById('root');
// Filtros na URL diferem da vitrine completa gerada no build.
if (root.hasChildNodes() && !window.location.search) hydrateRoot(root, app);
else createRoot(root).render(app);
