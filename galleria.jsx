/* global React, ReactDOM, Icon, Reveal */
// ============================================================
// unna — Galleria fotografica
// ============================================================

const GALLERIA_LIMIT = 5;

const MESI = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
function formatData(str) {
  if (!str) return "";
  const s = String(str).slice(0, 10);
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return str;
  return `${parseInt(d)} ${MESI[parseInt(m) - 1]} ${y}`;
}

// Lightbox con navigazione frecce tra le foto
function GalleriaLightbox({ fotos, index, onClose, onChange }) {
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft"  && index > 0)              onChange(index - 1);
      if (e.key === "ArrowRight" && index < fotos.length - 1) onChange(index + 1);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [index, fotos.length, onClose, onChange]);

  const foto = fotos[index];

  return (
    <div className="gal-lb" onClick={onClose} role="dialog" aria-modal="true">
      <button className="gal-lb__close" onClick={onClose} aria-label="Chiudi">
        <Icon name="close" size={22} />
      </button>

      {index > 0 && (
        <button className="gal-lb__nav gal-lb__nav--prev"
          onClick={e => { e.stopPropagation(); onChange(index - 1); }}
          aria-label="Foto precedente">
          <Icon name="arrowR" size={22} />
        </button>
      )}
      {index < fotos.length - 1 && (
        <button className="gal-lb__nav gal-lb__nav--next"
          onClick={e => { e.stopPropagation(); onChange(index + 1); }}
          aria-label="Foto successiva">
          <Icon name="arrowR" size={22} />
        </button>
      )}

      <div className="gal-lb__inner" onClick={e => e.stopPropagation()}>
        <div className="gal-lb__media">
          <img src={foto.src} alt={foto.descrizione || foto.luogo || "Foto"} />
        </div>
        <div className="gal-lb__body">
          <div className="gal-lb__meta">
            {foto.luogo && <span className="gal-lb__luogo"><Icon name="pin" size={13} /> {foto.luogo}</span>}
            {foto.data && <span className="gal-lb__date">{formatData(foto.data)}</span>}
          </div>
          {foto.descrizione && <p className="gal-lb__desc">{foto.descrizione}</p>}
          {foto.tags && foto.tags.length > 0 && (
            <div className="gal-lb__tags">
              {foto.tags.map(t => <span key={t} className="gal-lb__tag">{t}</span>)}
            </div>
          )}
          <div className="gal-lb__counter">{index + 1} / {fotos.length}</div>
        </div>
      </div>
    </div>
  );
}

// Card: solo foto, click apre lightbox
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

// Home: bento layout (1 grande + 4 piccole), max 5 foto più recenti
function GalleriaCarousel({ loading = false }) {
  const [selectedIdx, setSelectedIdx] = React.useState(null);
  const foto = (UNNA.galleria || []).slice(0, GALLERIA_LIMIT);
  const [first, ...rest] = foto;

  return (
    <section className="section gal-sec" id="galleria">
      <div className="wrap">
        {loading ? (
          <div className="gal-bento">
            <div className="gal-bento__feat">
              <div className="gal-card gal-card--skeleton"><div className="gal-card__media skeleton-pulse" /></div>
            </div>
            <div className="gal-bento__rest">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="gal-card gal-card--skeleton"><div className="gal-card__media skeleton-pulse" /></div>
              ))}
            </div>
          </div>
        ) : foto.length === 0 ? (
          <p className="gal-empty">Le prime foto arriveranno presto!</p>
        ) : (
          <div className="gal-bento">
            <Reveal as="div" className="gal-bento__feat">
              <GalleriaCard foto={first} onClick={() => setSelectedIdx(0)} />
            </Reveal>
            <div className="gal-bento__rest">
              {rest.map((f, i) => (
                <Reveal as="div" key={f.id || i} delay={80 * (i + 1)}>
                  <GalleriaCard foto={f} onClick={() => setSelectedIdx(i + 1)} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="gal-sec__foot">
          <a className="eventi__all" href="galleria.html">Sfoglia galleria <Icon name="arrowR" size={16} /></a>
        </div>
      </div>

      {selectedIdx !== null && (
        <GalleriaLightbox
          fotos={foto}
          index={selectedIdx}
          onClose={() => setSelectedIdx(null)}
          onChange={setSelectedIdx}
        />
      )}
    </section>
  );
}

// Pagina dedicata: griglia completa con filtri tag
function GalleriaPage() {
  const [loading, setLoading] = React.useState(!!window.UNNA_API_URL && !!UNNA._galleriaLoading);
  const [galleria, setGalleria] = React.useState(UNNA.galleria || []);
  const [selectedIdx, setSelectedIdx] = React.useState(null);

  React.useEffect(() => {
    const handler = () => {
      setGalleria([...(UNNA.galleria || [])]);
      setLoading(false);
    };
    if (!UNNA._galleriaLoading) { setLoading(false); return; }
    window.addEventListener("unna:galleria", handler);
    return () => window.removeEventListener("unna:galleria", handler);
  }, []);

  const filtered = galleria;

  return (
    <div>
      <header className="ev-top">
        <div className="wrap ev-top__inner">
          <a className="nav__logo" href="index.html">unna</a>
        </div>
      </header>

      <div className="tge-head">
        <div className="wrap">
          <button className="ev-back tge-back" onClick={() => history.back()}>
            <span className="ev-back__ico" aria-hidden="true"><Icon name="arrowR" size={18} /></span>
            Torna indietro
          </button>
          <h1 className="tge-head__title">I nostri <em>momenti</em></h1>
          <p className="tge-head__lead">Una raccolta di istanti — comunità, territorio, bellezza.</p>
        </div>
      </div>

      <main className="wrap gal-grid" id="main">
        {loading
          ? [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="gal-card gal-card--skeleton">
                <div className="gal-card__media skeleton-pulse" />
              </div>
            ))
          : filtered.length === 0
          ? <p className="gal-empty gal-empty--page">Nessuna foto trovata.</p>
          : filtered.map((f, i) => (
              <GalleriaCard key={f.id || i} foto={f} onClick={() => setSelectedIdx(i)} />
            ))
        }
      </main>

      <footer className="ev-foot">
        <div className="wrap ev-foot__inner">
          <span className="footer__logo">unna</span>
          <a href="index.html">Torna alla home</a>
        </div>
      </footer>

      {selectedIdx !== null && (
        <GalleriaLightbox
          fotos={filtered}
          index={selectedIdx}
          onClose={() => setSelectedIdx(null)}
          onChange={setSelectedIdx}
        />
      )}
    </div>
  );
}

window.GalleriaCard = GalleriaCard;
window.GalleriaCarousel = GalleriaCarousel;
window.GalleriaPage = GalleriaPage;
