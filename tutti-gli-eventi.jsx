/* global React, ReactDOM, EventoCard, Icon */
// ============================================================
// unna — Tutti gli eventi
// ============================================================

function TuttiGliEventiPage() {
  const [, refresh] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    window.addEventListener("unna:refresh", refresh);
    return () => window.removeEventListener("unna:refresh", refresh);
  }, []);

  const eventi = UNNA.eventi;
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
        {eventi.map((e) => <EventoCard key={e.id} evento={e} />)}
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
