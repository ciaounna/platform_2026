/* global React, Icon, OndaLinea */
// ============================================================
// unna — Header sticky con scroll-spy + menu mobile + Footer
// ============================================================
const { useState: useStateN, useEffect: useEffectN } = React;

const NAV = [
  { id: "galleria", label: "Galleria" },
  { id: "team", label: "Team" },
  { id: "eventi", label: "Eventi" },
  { id: "manifesto", label: "Manifesto" },
  { id: "contatti", label: "Contatti" },
];

function Header({ heroDark }) {
  const [scrolled, setScrolled] = useStateN(false);
  const [active, setActive] = useStateN("top");
  const [open, setOpen] = useStateN(false);

  useEffectN(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffectN(() => {
    const ids = ["top", ...NAV.map((n) => n.id)];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffectN(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  function go(e, id) {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  }

  const lightText = heroDark && !scrolled;
  return (
    <>
      <header className={`nav ${scrolled ? "nav--solid" : ""} ${lightText ? "nav--light" : ""}`}>
        <div className="wrap nav__inner">
          <a className="nav__logo" href="#top" onClick={(e) => go(e, "top")} aria-label="unna — torna su">
            unna
          </a>
          <nav className="nav__links" aria-label="Navigazione principale">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => go(e, n.id)}
                 className={active === n.id ? "is-active" : ""} aria-current={active === n.id ? "true" : undefined}>{n.label}</a>
            ))}
          </nav>
          <a className="btn btn-accent nav__cta" href={UNNA.social.instagram} target="_blank" rel="noopener">
            Instagram <Icon name="instagram" size={18} />
          </a>
          <button className="nav__burger" aria-label="Apri il menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Icon name="menu" size={26} />
          </button>
        </div>
      </header>

      {/* Menu mobile fullscreen */}
      <div className={`menu ${open ? "menu--open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <button className="menu__close" aria-label="Chiudi il menu" onClick={() => setOpen(false)}><Icon name="close" size={28} /></button>
        <nav className="menu__links">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => go(e, n.id)} style={{ transitionDelay: open ? `${0.08 * i + 0.1}s` : "0s" }}>
              <span className="menu__num">0{i + 1}</span>{n.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-accent menu__ig" href={UNNA.social.instagram} target="_blank" rel="noopener">Seguici su Instagram <Icon name="instagram" size={20} /></a>
        <div className="menu__band" aria-hidden="true"><OndaLinea color="rgba(106,0,255,0.4)" height={60} cycles={6} strokeWidth={5} /></div>
      </div>
    </>
  );
}
window.Header = Header;

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">unna</span>
          <p>L'onda del cambiamento nella Sicilia interna.</p>
        </div>
        <div className="footer__cols">
          <div>
            <h4>Vai a</h4>
            {NAV.map((n) => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}
            <a href="galleria.html">Tutte le foto</a>
          </div>
          <div>
            <h4>Contatti</h4>
            <a href={UNNA.social.instagram} target="_blank" rel="noopener">{UNNA.social.instagramHandle}</a>
            <a href={`mailto:${UNNA.social.email}`}>{UNNA.social.email}</a>
          </div>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>© 2026 unna · Moviti fermu</span>
        <span>Siamo unna, siamo tante.</span>
      </div>
    </footer>
  );
}
window.Footer = Footer;
