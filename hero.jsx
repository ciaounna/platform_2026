/* global React, OndaLinea, Icon, Reveal */
// ============================================================
// unna — HERO
// ============================================================

function Hero({ variant = "onda" }) {
  const dark = variant !== "chiaro";
  return (
    <header className={`hero hero--${variant}`} id="top">

      <div className="wrap hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">
            Il movimento che <span className="hero__hl">ri-genera</span><br/>
          </h1>

          <OndaLinea color={dark ? "#FF710C" : "#6A00FF"} height={26} cycles={9} strokeWidth={5} className="hero__rule" />

          <p className="hero__sub">
            Un’onda di persone e luoghi che costruisce comunità, spazi ed occasioni.
Riportiamo vita nei territori e trasformiamo ogni movimento in incontro
          </p>

          <div className="hero__cta">
            <a className="btn btn-light" href="#manifesto">Esplora il progetto <Icon name="arrowR" size={20} /></a>
            <a className="btn btn-accent" href={UNNA.social.instagram} target="_blank" rel="noopener">
              Seguici su Instagram <Icon name="instagram" size={20} />
            </a>
          </div>
        </div>

        <div className="hero__img-wrap">
          <img className="hero__img hero__img--back" src="assets/heroimg2.png" alt="" aria-hidden="true" />
          <img className="hero__img hero__img--front" src="assets/heroimg.jpg" alt="" aria-hidden="true" />
        </div>
      </div>

      <a className="hero__scroll" href="#team" aria-label="Vai al team">
        <span></span>
      </a>
    </header>
  );
}
window.Hero = Hero;
