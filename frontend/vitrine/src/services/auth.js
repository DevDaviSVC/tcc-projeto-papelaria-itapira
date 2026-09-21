const tokenKey = 'papelaria_admin_token';

export const getToken = () => sessionStorage.getItem(tokenKey);
export const clearToken = () => sessionStorage.removeItem(tokenKey);

export async function login(username, password) {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Não foi possível entrar. Tente novamente.');
  sessionStorage.setItem(tokenKey, body.token);
}

export async function getAdmin(signal) {
  const response = await fetch('/admin/me', {
    headers: { Authorization: `Bearer ${getToken()}` }, signal,
  });
  if (response.status === 401) {
    clearToken();
    return null;
  }
  if (!response.ok) throw new Error('Não foi possível verificar sua sessão. Tente novamente.');
  return (await response.json()).admin;
}
