export default function CatalogState({ error }) {
  return <div className="empty-state" role={error ? 'alert' : 'status'}>
    <p>{error || 'Carregando produtos…'}</p>
    {error && <button className="button button-quiet" onClick={() => window.location.reload()}>Tentar novamente</button>}
  </div>;
}
