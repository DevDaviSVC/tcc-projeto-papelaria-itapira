import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import RequireAdmin from './components/RequireAdmin';
import Showcase from './pages/Showcase';
import Product from './pages/Product';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function LegacyProduct() {
  const [params] = useSearchParams();
  const id = params.get('id');
  return <Navigate replace to={id ? `/product/${encodeURIComponent(id)}` : '/vitrine'} />;
}

export default function App() {
  return <Routes>
    <Route element={<SiteLayout />}>
      <Route path="/vitrine" element={<Showcase />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/product" element={<LegacyProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<RequireAdmin>{(admin) => <Admin admin={admin} />}</RequireAdmin>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}
