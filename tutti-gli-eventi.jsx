/* global React, ReactDOM, EventoCard, Icon, SkeletonCard */
// ============================================================
// unna — Tutti gli eventi
// ============================================================

function TuttiGliEventiPage() {
  const [loading, setLoading] = React.useState(!!window.UNNA_API_URL);

  React.useEffect(() => {
    if (!UNNA._loading) { setLoading(false); return; }
    const handler = () => setLoading(false);
    window.addEventListener("unna:refresh", handler);
    return () => window.removeEventListener("unna:refresh", handler);
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = [...UNNA.eventi].filter(e => new Date(e.dataISO) >= today).sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));
  const past     = [...UNNA.eventi].filter(e => new Date(e.dataISO) <  today).sort((a, b) => new Date(b.dataISO) - new Date(a.dataISO));
  const eventi = [...upcoming, ...past];
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
          <h1 className="tge-head__title">Tutti gli <em>eventi</em></h1>
          <p className="tge-head__lead">Sagre, cammini e incontri che attivano i territori della Sicilia interna.</p>
        </div>
      </div>

      <main className="wrap tge-grid" id="main">
        {loading
          ? [1,2,3,4].map(i => <SkeletonCard key={i} />)
          : eventi.map((e) => <EventoCard key={e.id} evento={e} past={new Date(e.dataISO) < today} />)
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

unnaInit(() => ReactDOM.createRoot(document.getElementById("root")).render(<TuttiGliEventiPage />));
