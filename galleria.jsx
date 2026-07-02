/* global React, ReactDOM, Icon, Reveal */
// ============================================================
// unna — Galleria fotografica
// ============================================================

const GALLERIA_LIMIT = 8;

function GalleriaLightbox({ foto, onClose }) {
  React.useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="gal-lb" onClick={onClose} role="dialog" aria-modal="true">
      <button className="gal-lb__close" onClick={onClose} aria-label="Chiudi">
        <Icon name="close" size={22} />
      </button>
      <div className="gal-lb__inner" onClick={e => e.stopPropagation()}>
        <div className="gal-lb__media">
          <img src={foto.src} alt={foto.descrizione || foto.luogo || "Foto"} />
        </div>
        <div className="gal-lb__body">
          <div className="gal-lb__meta">
            {foto.luogo && <span className="gal-lb__luogo"><Icon name="pin" size={13} /> {foto.luogo}</span>}
            {foto.data && <span className="gal-lb__date">{foto.data}</span>}
          </div>
          {foto.descrizione && <p className="gal-lb__desc">{foto.descrizione}</p>}
          {foto.tags && foto.tags.length > 0 && (
            <div className="gal-lb__tags">
              {foto.tags.map(t => <span key={t} className="gal-lb__tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleriaCard({ foto, onClick }) {
  return (
    <div className="gal-card" onClick={onClick} role="button" tabIndex={0}
         onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(); }}
         aria-label={foto.descrizione || "Apri foto"}>
      <div className="gal-card__media">
        <img src={foto.src} alt={foto.descrizione || foto.luogo || "Foto unna"} loading="lazy" />
      </div>
    </div>
  );
}

function GalleriaCarousel({ loading = false }) {
  const trackRef = React.useRef(null);
  const [selected, setSelected] = React.useState(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);
  const foto = (UNNA.galleria || []).slice(0, GALLERIA_LIMIT);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const check = () => {
      setCanLeft(track.scrollLeft > 4);
      setCanRight(track.scrollLeft < track.scrollWidth - track.clientWidth - 4);
    };
    const t = setTimeout(check, 80);
    track.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      clearTimeout(t);
      track.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [foto.length, loading]);

  function scroll(dir) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".gal-card");
    track.scrollBy({ left: dir * ((card ? card.offsetWidth : 300) + 20), behavior: "smooth" });
  }

  return (
    <section className="section gal-sec" id="galleria">
      <div className="wrap">
        <div className="gal-carousel-wrap">
          {canLeft && (
            <button className="gal-arrow gal-arrow--prev" onClick={() => scroll(-1)} aria-label="Scorri a sinistra">
              <Icon name="arrowR" size={20} />
            </button>
          )}

          {loading ? (
            <div className="gal-track">
              {[1, 2, 3].map(i => (
                <div key={i} className="gal-card gal-card--skeleton">
                  <div className="gal-card__media skeleton-pulse" />
                </div>
              ))}
            </div>
          ) : foto.length === 0 ? (
            <p className="gal-empty">Le prime foto arriveranno presto!</p>
          ) : (
            <div className="gal-track" ref={trackRef}>
              {foto.map((f, i) => (
                <Reveal as="div" key={f.id || i} delay={50 * i}>
                  <GalleriaCard foto={f} onClick={() => setSelected(f)} />
                </Reveal>
              ))}
            </div>
          )}

          {canRight && (
            <button className="gal-arrow gal-arrow--next" onClick={() => scroll(1)} aria-label="Scorri a destra">
              <Icon name="arrowR" size={20} />
            </button>
          )}
        </div>

        <div className="gal-sec__foot">
          <a className="eventi__all" href="galleria.html">Vedi tutte le foto <Icon name="arrowR" size={16} /></a>
        </div>
      </div>

      {selected && <GalleriaLightbox foto={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function GalleriaPage() {
  const [loading, setLoading] = React.useState(!!window.UNNA_API_URL && !!UNNA._galleriaLoading);
  const [galleria, setGalleria] = React.useState(UNNA.galleria || []);
  const [activeTag, setActiveTag] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    const handler = () => {
      setGalleria([...(UNNA.galleria || [])]);
      setLoading(false);
    };
    if (!UNNA._galleriaLoading) { setLoading(false); return; }
    window.addEventListener("unna:galleria", handler);
    return () => window.removeEventListener("unna:galleria", handler);
  }, []);

  const allTags = [...new Set(galleria.flatMap(f => f.tags || []))].sort();
  const filtered = activeTag ? galleria.filter(f => (f.tags || []).includes(activeTag)) : galleria;

  return (
    <div>
      <header className="ev-top">
        <div className="wrap ev-top__inner">
          <a className="nav__logo" href="index.html">unna<span style={{ color: "var(--arancio)" }}>.</span></a>
        </div>
      </header>

      <div className="tge-head">
        <div className="wrap">
          <button className="ev-back tge-back" onClick={() => history.back()}>
            <span className="ev-back__ico" aria-hidden="true"><Icon name="arrowR" size={18} /></span>
            Torna indietro
          </button>
          <h1 className="tge-head__title">I nostri <em>momenti</em></h1>
          <p className="tge-head__lead">Una raccolta di istanti dalla Sicilia interna — comunità, territorio, bellezza.</p>
        </div>
      </div>

      {!loading && allTags.length > 0 && (
        <div className="wrap gal-filters" role="group" aria-label="Filtra per tag">
          <button className={`gal-filter${!activeTag ? " gal-filter--active" : ""}`} onClick={() => setActiveTag(null)}>Tutte</button>
          {allTags.map(t => (
            <button key={t} className={`gal-filter${activeTag === t ? " gal-filter--active" : ""}`}
              onClick={() => setActiveTag(activeTag === t ? null : t)}>{t}</button>
          ))}
        </div>
      )}

      <main className="wrap gal-grid" id="main">
        {loading
          ? [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="gal-card gal-card--skeleton">
                <div className="gal-card__media skeleton-pulse" />
              </div>
            ))
          : filtered.length === 0
          ? <p className="gal-empty gal-empty--page">Nessuna foto trovata.</p>
          : filtered.map((f, i) => <GalleriaCard key={f.id || i} foto={f} onClick={() => setSelected(f)} />)
        }
      </main>

      <footer className="ev-foot">
        <div className="wrap ev-foot__inner">
          <span className="footer__logo">unna</span>
          <a href="index.html">Torna alla home</a>
        </div>
      </footer>

      {selected && <GalleriaLightbox foto={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

window.GalleriaCard = GalleriaCard;
window.GalleriaCarousel = GalleriaCarousel;
window.GalleriaPage = GalleriaPage;
