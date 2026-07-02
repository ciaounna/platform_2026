/* global React, Reveal, OndaLinea, Icon */
// ============================================================
// unna — MANIFESTO + trinacria astratta (3 forze) + descrizione
// I tre pilastri sono accennati come forze di una trinacria,
// senza essere nominati esplicitamente.
// ============================================================


function Manifesto() {
  return (
    <section className="section manifesto" id="manifesto" aria-labelledby="man-h">
      <div className="wrap manifesto__inner">
        <Reveal className="manifesto__head">
          <h2 id="man-h" className="manifesto__claim">
            Ospitare è un <span className="manifesto__hl">atto politico</span>.<br/>
          </h2>
        </Reveal>

        <div className="manifesto__grid">
          <Reveal className="manifesto__text" delay={100}>
            <p>
              unna è una rete viva di persone e luoghi: un'onda che ridistribuisce i flussi nello spazio e nel tempo.
            </p>
            <p>
              Riscopriamo, mappiamo e attiviamo il territorio insieme, per imparare a guardare con occhi nuovi quello che già ci circonda.
            </p>
            <p>
              <strong>Moviti fermu.</strong> Perché ti muovi anche quando pensi di essere fermo/a.
            </p>
            <p>
              La rigenerazione non è solo un'idea. È una pratica quotidiana, concreta, replicabile, che nasce sempre da un dialogo e si compie nell'azione di chi sceglie di farne parte.
            </p>
            <a className="manifesto__cta" href="#contatti">Unisciti all'onda <Icon name="arrowR" size={20} /></a>
          </Reveal>

          <Reveal className="manifesto__trina" delay={200}>
            <img className="trinacria" src="assets/trinacria.svg" alt="" aria-hidden="true" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
window.Manifesto = Manifesto;
