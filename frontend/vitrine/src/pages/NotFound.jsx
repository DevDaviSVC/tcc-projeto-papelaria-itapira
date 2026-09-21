import Icon from '../components/Icon';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main id="main" className="container section"><div className="empty-state"><span className="eyebrow">404 · Vamos por outro caminho</span><h1>Página não encontrada</h1><p>Este endereço ou produto não está disponível. Que tal explorar nossa vitrine?</p><Link className="button button-accent" to="/vitrine">Ver os produtos <Icon name="forward" /></Link></div></main>;
}
