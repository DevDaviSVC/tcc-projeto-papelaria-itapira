const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    document.getElementById('siteNav').classList.toggle('is-open', open);
    menuButton.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
    menuButton.querySelector('use').setAttribute('href', `/assets/icons.svg#${open ? 'close' : 'menu'}`);
});

const slides = [...document.querySelectorAll('#heroSlideshow img')];
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let current = 0;
    setInterval(() => {
        slides[current].style.opacity = '0';
        current = (current + 1) % slides.length;
        slides[current].style.opacity = '1';
    }, 5000);
}


const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir navegação');
    menuButton.querySelector('use').setAttribute('href', '/assets/icons.svg#menu');
    document.getElementById('siteNav').classList.remove('is-open');
};
document.getElementById('siteNav').addEventListener('click', closeMenu);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
    }
});
