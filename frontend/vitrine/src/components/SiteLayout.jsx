import PageMetadata from './PageMetadata';
import Icon from './Icon';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return <>
    <PageMetadata />
    <a className="skip-link" href="#main">Pular para o conteúdo</a>
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <div className="container header-inner">
        <a className="brand" href="/">Papelaria Itapira<small>Ideias ganham vida aqui</small></a>
        <nav id="siteNav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal" onClick={() => setMenuOpen(false)}>
          <a href="/">Início</a><NavLink to="/vitrine">Produtos</NavLink><a href="/#about">Nossa história</a><a href="/#contact">Contato</a>
        </nav>
        <div className="header-actions">
          <div id="authNavArea"><Link className="button button-quiet button-small" to="/admin">Área do admin <Icon name="arrow" /></Link></div>
          <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? "Fechar navegação" : "Abrir navegação"} aria-expanded={menuOpen} aria-controls="siteNav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
        </div>
      </div>
    </header>
    <Outlet />
    <footer className="site-footer"><div className="container">
      <div className="footer-grid">
        <div><a className="brand" href="/">Papelaria Itapira</a><p>Sua referência em materiais escolares e papelaria em Itapira. Qualidade, variedade e atendimento que faz a diferença.</p></div>
        <div><h3>Explore a loja</h3><nav className="footer-links" aria-label="Produtos"><Link to="/vitrine">Todos os produtos</Link><Link to="/vitrine?cat=cadernos">Cadernos e agendas</Link><Link to="/vitrine?cat=arte">Arte e pintura</Link></nav></div>
        <div><h3>Conte com a gente</h3><nav className="footer-links" aria-label="Institucional"><a href="/#about">Nossa história</a><a href="/#contact">Fale conosco</a><Link to="/admin">Área administrativa</Link></nav></div>
      </div>
      <div className="footer-bottom"><span>© Papelaria Itapira. Todos os direitos reservados.</span><span>Feito para estudar, criar e imaginar.</span></div>
    </div></footer>
  </>;
}
