/* global React, ReactDOM, Icon, Reveal */
// ============================================================
// unna — Galleria fotografica
// Esporta: GalleriaCarousel (home) + GalleriaPage (galleria.html)
// ============================================================

const GALLERIA_LIMIT = 8;

function GalleriaCard({ foto }) {
  return (
    <div className="gal-card">
      <div className="gal-card__media">
        <img src={foto.src} alt={foto.descrizione || foto.luogo || "Foto unna"} loading="lazy" />
      </div>
      <div className="gal-card__body">
        <div className="gal-card__meta">
          {foto.luogo && <span className="gal-card__luogo"><Icon name="pin" size={13} /> {foto.luogo}</span>}
          {foto.data && <span className="gal-card__date">{foto.data}</span>}
        </div>
        {foto.descrizione && <p className="gal-card__desc">{foto.descrizione}</p>}
        {foto.tags && foto.tags.length > 0 && (
          <div className="gal-card__tags">
            {foto.tags.map(t => <span key={t} className="gal-card__tag">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleriaCarousel({ loading = false }) {
  const trackRef = React.useRef(null);
  const foto = (UNNA.galleria || []).slice(0, GALLERIA_LIMIT);

  function scroll(dir) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".gal-card");
    const cardW = card ? card.offsetWidth + 20 : 300;
    track.scrollBy({ left: dir * cardW * 2, behavior: "smooth" });
  }

  return (
    <section className="section gal-sec" id="galleria" aria-labelledby="gal-h">
      <div className="wrap">
        <Reveal className="section-head gal-head">
          <div>
            <h2 id="gal-h" className="section-title">I momenti <em>che restano</em></h2>
            <a className="eventi__all" href="galleria.html">Vedi tutte le foto <Icon name="arrowR" size={16} /></a>
          </div>
          <p className="section-lead">Ogni scatto racconta un pezzo di comunità. Istanti dalla Sicilia interna.</p>
        </Reveal>

        <div className="gal-carousel-wrap">
          <button className="gal-arrow gal-arrow--prev" onClick={() => scroll(-1)} aria-label="Scorri a sinistra">
            <Icon name="arrowR" size={20} />
          </button>

          {loading ? (
            <div className="gal-track">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="gal-card gal-card--skeleton">
                  <div className="gal-card__media skeleton-pulse" />
                  <div className="gal-card__body">
                    <div className="skeleton-pulse skeleton-line skeleton-line--short" style={{ marginBottom: 8 }} />
                    <div className="skeleton-pulse skeleton-line skeleton-line--med" />
                  </div>
                </div>
              ))}
            </div>
          ) : foto.length === 0 ? (
            <p className="gal-empty">Le prime foto arriveranno presto!</p>
          ) : (
            <div className="gal-track" ref={trackRef}>
              {foto.map((f, i) => (
                <Reveal as="div" key={f.id || i} delay={50 * i}>
                  <GalleriaCard foto={f} />
                </Reveal>
              ))}
            </div>
          )}

          <button className="gal-arrow gal-arrow--next" onClick={() => scroll(1)} aria-label="Scorri a destra">
            <Icon name="arrowR" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

function GalleriaPage() {
  const [loading, setLoading] = React.useState(!!window.UNNA_API_URL && !!UNNA._galleriaLoading);
  const [galleria, setGalleria] = React.useState(UNNA.galleria || []);
  const [activeTag, setActiveTag] = React.useState(null);

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
          <button
            className={`gal-filter${!activeTag ? " gal-filter--active" : ""}`}
            onClick={() => setActiveTag(null)}
          >Tutte</button>
          {allTags.map(t => (
            <button
              key={t}
              className={`gal-filter${activeTag === t ? " gal-filter--active" : ""}`}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
            >{t}</button>
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
          : filtered.map((f, i) => <GalleriaCard key={f.id || i} foto={f} />)
        }
      </main>

      <footer className="ev-foot">
        <div className="wrap ev-foot__inner">
          <span className="footer__logo">unna</span>
          <a href="index.html">Torna alla home</a>
        </div>
      </footer>
    </div>
  );
}

window.GalleriaCard = GalleriaCard;
window.GalleriaCarousel = GalleriaCarousel;
window.GalleriaPage = GalleriaPage;
