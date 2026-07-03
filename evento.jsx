/* global React, ReactDOM, EventoMedia, Icon, tinta */
// ============================================================
// unna — Pagina dettaglio EVENTO (?id=...)
// Layout: contenuto a sinistra + sidebar "Informazioni" a destra
// ============================================================

function getEvento() {
  const id = new URLSearchParams(location.search).get("id");
  return UNNA.eventi.find((e) => e.id === id) || UNNA.eventi[0];
}

function NotFound() {
  return (
    <div className="ev-empty">
      <h1>Evento non trovato</h1>
      <a className="btn btn-primary" href="index.html#eventi">Torna agli eventi <Icon name="arrowR" size={20} /></a>
    </div>
  );
}

function EventoSkeleton() {
  return (
    <div>
      <header className="ev-top">
        <div className="wrap ev-top__inner">
          <a className="nav__logo" href="index.html">unna</a>
        </div>
      </header>
      <main className="wrap ev-layout" id="main">
        <article className="ev-main">
          <div className="skeleton-pulse skeleton-line skeleton-line--short" style={{marginBottom:"20px",height:"16px"}} />
          <div className="skeleton-pulse" style={{height:"clamp(2.4rem,6vw,4rem)",borderRadius:"8px",marginBottom:"18px"}} />
          <div className="skeleton-pulse skeleton-line skeleton-line--med" style={{marginBottom:"28px",height:"16px"}} />
          <div className="skeleton-pulse" style={{aspectRatio:"16/10",borderRadius:"var(--r-xl)",marginBottom:"32px"}} />
          <div className="skeleton-pulse skeleton-line" style={{marginBottom:"10px"}} />
          <div className="skeleton-pulse skeleton-line" style={{marginBottom:"10px"}} />
          <div className="skeleton-pulse skeleton-line skeleton-line--med" />
        </article>
        <aside className="ev-side">
          <div className="skeleton-pulse" style={{height:"320px",borderRadius:"var(--r-xl)"}} />
        </aside>
      </main>
    </div>
  );
}

function EventoPage() {
  const [loading, setLoading] = React.useState(!!window.UNNA_API_URL);

  React.useEffect(() => {
    if (!UNNA._loading) { setLoading(false); return; }
    const handler = () => setLoading(false);
    window.addEventListener("unna:refresh", handler);
    return () => window.removeEventListener("unna:refresh", handler);
  }, []);

  if (loading) return <EventoSkeleton />;

  const ev = getEvento();
  if (!ev) return <NotFound />;
  const t = tinta(ev.tinta);
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.luogo);
  const rootStyle = { "--ev-bg": t.bg, "--ev-fg": t.fg, "--ev-ink": t.ink, "--ev-soft": t.soft };

  return (
    <div style={rootStyle}>
      {/* Topbar */}
      <header className="ev-top">
        <div className="wrap ev-top__inner">
          <a className="nav__logo" href="index.html">unna</a>
        </div>
      </header>

      <main className="wrap ev-layout" id="main">
        {/* Colonna contenuto */}
        <article className="ev-main">
          <button className="ev-back ev-back--inline" onClick={() => history.back()}><span className="ev-back__ico" aria-hidden="true"><Icon name="arrowR" size={18} /></span> Torna indietro</button>
          <h1 className="ev-title">{ev.titolo}</h1>
          <p className="ev-place"><Icon name="pin" size={18} /> {ev.luogo} · {ev.provincia} &nbsp;•&nbsp; <Icon name="calendar" size={17} /> {ev.data}</p>

          <div className="ev-media"><EventoMedia evento={ev} /></div>

          <p className="ev-desc">{ev.descrizione}</p>

          {/* Tags */}
          <div className="ev-tags">
            {ev.tags.map((tg) => <span key={tg} className="ev-tag">{tg}</span>)}
          </div>

          {/* Ulteriori informazioni: lista titoletto + body */}
          <section className="ev-block" aria-labelledby="prog-h">
            <h2 id="prog-h" className="ev-block__h">Il programma</h2>
            <ul className="ev-list">
              {ev.programma.map((p, i) => (
                <li key={i} className="ev-list__item">
                  <span className="ev-list__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="ev-list__t">{p.titolo}</h3>
                    <p className="ev-list__b">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Disclaimer unna */}
          <div className="ev-disclaimer">
            <p>Ogni evento sarà accompagnato da un momento dedicato alla conoscenza reciproca, alla socialità e allo scambio di idee. Attraverso attività partecipative e conversazioni aperte, i/le partecipanti potranno conoscere il progetto unna, condividere esigenze e aspirazioni per il territorio e contribuire a immaginare insieme una comunità più attiva, inclusiva e sostenibile.</p>
            <a href={`mailto:${ev.contatti.email || "unna.city@gmail.com"}`} className="ev-disclaimer__cta">Contattaci per riservare il tuo posto o chiedere ulteriori informazioni →</a>
          </div>

          {/* Contatti */}
          <section className="ev-contatti" aria-labelledby="cont-h">
            <h2 id="cont-h" className="ev-contatti__h">Contatti</h2>
            <div className="ev-contatti__rows">
              <a href={`tel:${ev.contatti.tel.replace(/\s/g, "")}`}>{ev.contatti.tel}</a>
              <a href={`mailto:${ev.contatti.email}`}>{ev.contatti.email}</a>
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="ev-side">
          <div className="ev-card">
            <h2 className="ev-card__h">Informazioni</h2>
            <dl className="ev-info">
              {ev.info.map((row, i) => (
                <div className="ev-info__row" key={i}>
                  <dt>{row.k}</dt>
                  <dd>{row.v}</dd>
                </div>
              ))}
            </dl>

            <div className="ev-map">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(ev.luogo)}&output=embed&z=14`}
                loading="lazy"
                title={`Mappa di ${ev.luogo}`}
                allowFullScreen
              />
            </div>
          </div>

          <a className="ev-ig" href={UNNA.social.instagram} target="_blank" rel="noopener">
            <Icon name="instagram" size={22} /> Seguici per gli aggiornamenti
          </a>
        </aside>
      </main>

      {/* Altri eventi */}
      <section className="wrap ev-altri" aria-labelledby="altri-h">
        <h2 id="altri-h" className="ev-altri__h">Altri incontri</h2>
        <div className="ev-altri__grid">
          {UNNA.eventi.filter((e) => e.id !== ev.id).map((e) => {
            const et = tinta(e.tinta);
            return (
              <a key={e.id} className="ev-altri__card" href={`evento.html?id=${e.id}`} style={{ "--ev-bg": et.bg, "--ev-fg": et.fg, "--ev-ink": et.ink }}>
                <div className="ev-altri__media"><EventoMedia evento={e} label={false} /></div>
                <div className="ev-altri__body">
                  <span className="ev-altri__date">{e.data}</span>
                  <h3>{e.titolo}</h3>
                  <span className="ev-altri__place"><Icon name="pin" size={14} /> {e.luogo}</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <footer className="ev-foot">
        <div className="wrap ev-foot__inner">
          <span className="footer__logo">unna</span>
          <a href="index.html">Torna alla home</a>
        </div>
      </footer>
    </div>
  );
}

unnaInit(() => ReactDOM.createRoot(document.getElementById("root")).render(<EventoPage />));
