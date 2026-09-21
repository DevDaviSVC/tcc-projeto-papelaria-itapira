import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getAdmin } from '../services/auth';

export default function RequireAdmin({ children }) {
  const [session, setSession] = useState({ loading: true, admin: null, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function verify() {
      try {
        const admin = getToken() ? await getAdmin(controller.signal) : null;
        if (!controller.signal.aborted) setSession({ loading: false, admin, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setSession({ loading: false, admin: null, error: error.message });
      }
    }
    verify();
    const timer = window.setInterval(verify, 60000);
    window.addEventListener('focus', verify);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('focus', verify); };
  }, [attempt]);
  if (session.loading) return <main id="main" className="container section" role="status">Verificando acesso…</main>;
  if (session.error) return <main id="main" className="container section"><div className="empty-state" role="alert"><p>Não foi possível verificar sua sessão. Confira sua conexão.</p><button className="button" onClick={() => setAttempt(attempt + 1)}>Tentar novamente</button></div></main>;
  if (!session.admin) return <Navigate to="/login" replace />;
  return children(session.admin);
}
