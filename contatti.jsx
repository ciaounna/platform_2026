/* global React, Icon, Reveal, OndaLinea */
// ============================================================
// unna — CONTATTI
// ============================================================
const { useState: useStateC } = React;

function Contatti() {
  const [email, setEmail] = useStateC("");
  const [nome, setNome] = useStateC("");
  const [stato, setStato] = useStateC("idle");
  const valida = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function submit(e) {
    e.preventDefault();
    if (!valida(email)) { setStato("error"); return; }
    const url = window.UNNA_API_URL;
    if (url) {
      try {
        const params = new URLSearchParams({ action: "iscrizione", nome, email });
        await fetch(`${url}?${params}`);
      } catch (_) {}
    }
    setStato("ok");
  }

  const voci = [
    "Abiti un territorio che ti piacerebbe vedere più attivo, più vivo.",
    "Attraversi i territori e vorresti conoscere la comunità e lasciare un impatto positivo.",
    "Condividi i nostri valori.",
    "Lavori nel turismo e cerchi un modello che abbia senso.",
    "Vorresti mettere le tue passioni e le tue competenze a favore della comunità: ti piace disegnare? Ricamare? Girare video? Faccelo sapere.",
  ];

  return (
    <section className="section contatti" id="contatti" aria-labelledby="con-h">

      {/* Titolo full-width */}
      <div className="wrap">
        <Reveal>
          <h2 id="con-h" className="contatti__intro-title">Voglio partecipare</h2>
        </Reveal>
      </div>

      {/* Griglia principale: lista a sx, form a dx */}
      <div className="wrap contatti__main">
        <Reveal className="contatti__left">
          <p className="contatti__intro-sub">Sei nell'asse spazio-temporale giusto se:</p>
          <ul className="contatti__lista">
            {voci.map((v, i) => (
              <li key={i} className="contatti__lista-item">
                <span className="contatti__lista-dot" aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>
          <p className="contatti__intro-chiusura">Sei nell'asse spazio-temporale giusto.</p>
        </Reveal>

        <Reveal className="contatti__form-wrap" delay={100}>

          {stato === "ok" ? (
            <div className="contatti__ok" role="status">
              <span className="contatti__ok-mark" aria-hidden="true">✓</span>
              <div>
                <strong>Sei dei nostri{nome ? `, ${nome.split(" ")[0]}` : ""}!</strong>
                <p>Ti abbiamo aggiunta all'onda. A presto.</p>
              </div>
            </div>
          ) : (
            <form className="contatti__form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="c-nome">Nome <span className="field__opt">(facoltativo)</span></label>
                <input id="c-nome" type="text" autoComplete="name" value={nome}
                       onChange={(e) => setNome(e.target.value)} placeholder="Come ti chiami?" />
              </div>
              <div className="field">
                <label htmlFor="c-email">E-mail</label>
                <input id="c-email" type="email" autoComplete="email" required
                       aria-invalid={stato === "error"} aria-describedby={stato === "error" ? "c-err" : undefined}
                       value={email} onChange={(e) => { setEmail(e.target.value); if (stato === "error") setStato("idle"); }}
                       placeholder="latua@email.it" />
                {stato === "error" && <span id="c-err" className="field__err">Inserisci un indirizzo e-mail valido.</span>}
              </div>
              <button type="submit" className="btn btn-primary contatti__submit">
                Iscrivimi all'onda <Icon name="arrowR" size={20} />
              </button>
              <p className="contatti__priv">I tuoi dati saranno trattati nel rispetto del GDPR e usati solo per scriverti quando c'è qualcosa che conta: nuovi eventi, mappe e modi di fare la tua parte. E puoi cancellarti quando vuoi.</p>
            </form>
          )}
        </Reveal>
      </div>

      {/* Bottoni social in basso */}
      <div className="wrap contatti__bottom">
        <Reveal className="contatti__ig" delay={80}>
          <a className="ig-card" href={UNNA.social.instagram} target="_blank" rel="noopener">
            <div className="ig-card__top">
              <span className="ig-card__icon"><Icon name="instagram" size={30} /></span>
              <span className="ig-card__arrow"><Icon name="arrow" size={22} /></span>
            </div>
            <div className="ig-card__foot">
              <span className="ig-card__handle">{UNNA.social.instagramHandle}</span>
              <span className="ig-card__cta">Segui il nostro viaggio</span>
            </div>
          </a>
          <a className="mail-card" href={`mailto:${UNNA.social.email}`}>
            <Icon name="mail" size={22} />
            <span>{UNNA.social.email}</span>
          </a>
        </Reveal>
      </div>

    </section>
  );
}
window.Contatti = Contatti;
