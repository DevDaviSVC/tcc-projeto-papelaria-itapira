import Icon from '../components/Icon';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (error) {
      setError(error instanceof TypeError ? 'Não foi possível conectar ao servidor. Tente novamente.' : error.message);
    } finally { setPending(false); }
  }
  return <main id="main" className="login-layout"><section className="login-card">
    <span className="eyebrow">Área administrativa</span><h1>Bem-vindo de volta!</h1><p>Entre com sua conta para acessar o painel da Papelaria Itapira.</p>
    <form id="loginForm" onSubmit={handleSubmit}>
      <div className="field"><label htmlFor="username">Usuário</label><input id="username" name="username" autoComplete="username" placeholder="Seu usuário" required maxLength={255} value={username} onChange={(event) => setUsername(event.target.value)} /></div>
      <div className="field"><label htmlFor="password">Senha</label><input id="password" name="password" type="password" autoComplete="current-password" placeholder="Sua senha" required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
      {error && <p id="loginError" className="error-message" role="alert">{error}</p>}
      <button className="button button-accent" disabled={pending}>{pending ? 'Entrando…' : 'Entrar no painel'}</button>
    </form><p style={{ marginTop: 28 }}><Link className="text-link" to="/vitrine"><Icon name="back" /> Voltar para a loja</Link></p>
  </section></main>;
}
