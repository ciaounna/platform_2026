/* global React, EventoMedia, Icon, Reveal, tinta, SkeletonCard */
// ============================================================
// unna — EVENTI. Card esterne → pagina di dettaglio.
// Bento: una card in evidenza + griglia.
// ============================================================

function EventoCard({ evento, featured }) {
  const t = tinta(evento.tinta);
  return (
    <a className={`evento-card ${featured ? "evento-card--big" : ""}`} href={`evento.html?id=${evento.id}`}
       style={{ "--ev-bg": t.bg, "--ev-fg": t.fg, "--ev-ink": t.ink, "--ev-soft": t.soft }}>
      <div className="evento-card__media">
        <EventoMedia evento={evento} />
        <span className="evento-card__date"><Icon name="calendar" size={15} /> {evento.dataBreve}</span>
      </div>
      <div className="evento-card__body">
        <span className="evento-card__place"><Icon name="pin" size={15} /> {evento.luogo} · {evento.provincia}</span>
        <h3 className="evento-card__title">{evento.titolo}</h3>
        <p className="evento-card__sum">{evento.sommario}</p>
        <div className="evento-card__foot">
          <div className="evento-card__tags">
            {evento.tags.slice(0, featured ? 3 : 2).map((tg) => <span key={tg} className="evento-card__tag">{tg}</span>)}
          </div>
          <span className="evento-card__go" aria-hidden="true"><Icon name="arrow" size={20} /></span>
        </div>
      </div>
    </a>
  );
}

function Eventi() {
  const today = new Date();
  const eventi = [...UNNA.eventi]
    .sort((a, b) => Math.abs(new Date(a.dataISO) - today) - Math.abs(new Date(b.dataISO) - today))
    .slice(0, 5);
  const [first, ...rest] = eventi;
  return (
    <section className="section eventi-sec" id="eventi" aria-labelledby="eventi-h">
      <div className="wrap">
        <Reveal className="section-head eventi-head">
          <div>
            <h2 id="eventi-h" className="section-title">Chi ha detto che qui non c’è niente da fare? <br/><em>I prossimi incontri</em></h2>
            <a className="eventi__all" href="tutti-gli-eventi.html">Tutti gli eventi <Icon name="arrowR" size={16} /></a>
          </div>
          <p className="section-lead">Laboratori, talk, e momenti che attivano la comunità e i territori. 
Ogni tappa è un’esperienza che arricchisce: scopri dove e quando.  
</p>
        </Reveal>

        {UNNA._loading ? (
          <div className="eventi-grid">
            <div className="eventi-grid__feat"><SkeletonCard featured /></div>
            <div className="eventi-grid__rest">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          </div>
        ) : (
          <div className="eventi-grid">
            <Reveal as="div" className="eventi-grid__feat"><EventoCard evento={first} featured /></Reveal>
            <div className="eventi-grid__rest">
              {rest.map((e, i) => (
                <Reveal as="div" key={e.id} delay={80 * (i + 1)}><EventoCard evento={e} /></Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
window.EventoCard = EventoCard;
window.Eventi = Eventi;
