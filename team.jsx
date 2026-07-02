/* global React, BlobAvatar, OndaLinea, Icon, Reveal, tinta */
// ============================================================
// unna — TEAM interattivo "Moviti fermu"
// Le persone sono nodi su un'onda-rete. Selezione → dettaglio.
// Layout tweakable: "onda" (firma) | "griglia"
// ============================================================
const { useState: useStateT, useRef: useRefT } = React;

function TeamNode({ member, i, active, onSelect, refCb }) {
  const t = tinta(member.tinta);
  return (
    <button
      ref={refCb}
      className={`team-node ${active ? "team-node--active" : ""}`}
      style={{ "--node-bg": t.bg, "--node-fg": t.fg }}
      aria-pressed={active}
      aria-label={`${member.nome}, ${member.ruolo}`}
      onClick={() => onSelect(i)}
      onMouseEnter={() => onSelect(i)}
    >
      <BlobAvatar member={member} size={104} active={active} />
      <span className="team-node__name">{member.nome.split(" ")[0]}</span>
    </button>
  );
}

function TeamDetail({ member }) {
  const t = tinta(member.tinta);
  return (
    <div className="team-detail" key={member.id} style={{ "--td-bg": t.bg, "--td-fg": t.fg, "--td-soft": t.soft, "--td-ink": t.ink }}>
      <div className="team-detail__media" aria-hidden="true">
        <BlobAvatar member={member} size={168} active={true} />
        <span className="team-detail__parola">{member.parola}</span>
      </div>
      <div className="team-detail__body">
        <span className="team-detail__role">{member.ruolo}</span>
        <h3 className="team-detail__name">{member.nome}</h3>
        <p className="team-detail__bio">{member.bio}</p>
        {member.linkedin && <a className="team-detail__link" href={member.linkedin} target="_blank" rel="noopener">
          <Icon name="linkedin" size={20} /> Profilo LinkedIn <Icon name="arrow" size={16} />
        </a>}
      </div>
    </div>
  );
}

function Team({ layout = "onda" }) {
  const team = UNNA.team;
  const [sel, setSel] = useStateT(0);
  const refs = useRefT([]);

  function onKey(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); const n = (sel + 1) % team.length; setSel(n); refs.current[n]?.focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); const n = (sel - 1 + team.length) % team.length; setSel(n); refs.current[n]?.focus(); }
  }

  return (
    <section className="section team-sec" id="team" aria-labelledby="team-h">
      <div className="wrap">
        <Reveal className="section-head team-head">
          <div>
            <h2 id="team-h" className="section-title">Siamo unna,<br/>siamo <em>tante</em>.</h2>
          </div>
          <p className="section-lead">Mix di esperienze, competenze e passioni a servizio della ri-generazione. Ognuna è un nodo dell'onda — passa con il mouse o clicca per conoscerle.</p>
        </Reveal>

        {layout === "onda" ? (
          <Reveal className="team-wave" delay={120}>
            <OndaLinea color="var(--viola-100)" height={120} cycles={team.length} strokeWidth={3} className="team-wave__line" />
            <div className="team-nodes" role="tablist" aria-label="Membri del team" onKeyDown={onKey}>
              {team.map((m, i) => (
                <TeamNode key={m.id} member={m} i={i} active={i === sel} onSelect={setSel} refCb={(el) => (refs.current[i] = el)} />
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal className="team-grid" delay={120} role="tablist" aria-label="Membri del team" onKeyDown={onKey}>
            {team.map((m, i) => (
              <button key={m.id} ref={(el) => (refs.current[i] = el)} className={`team-card ${i === sel ? "team-card--active" : ""}`}
                      style={{ "--node-bg": tinta(m.tinta).bg, "--node-fg": tinta(m.tinta).fg }}
                      aria-pressed={i === sel} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)}>
                <BlobAvatar member={m} size={88} active={i === sel} />
                <span className="team-card__name">{m.nome}</span>
                <span className="team-card__role">{m.ruolo}</span>
              </button>
            ))}
          </Reveal>
        )}

        <Reveal className="team-detail-wrap" delay={180} aria-live="polite">
          <TeamDetail member={team[sel]} />
        </Reveal>

        {/* Carousel mobile — nascosto su desktop */}
        <div className="team-mobile" aria-label="Membri del team">
          {team.map((m) => {
            const t = tinta(m.tinta);
            return (
              <div key={m.id} className="team-mobile__card" style={{ "--td-bg": t.bg, "--td-fg": t.fg, "--td-soft": t.soft, "--td-ink": t.ink }}>
                <div className="team-mobile__top">
                  <BlobAvatar member={m} size={80} active={true} />
                  {m.parola && <span className="team-mobile__parola">{m.parola}</span>}
                </div>
                <span className="team-mobile__role">{m.ruolo}</span>
                <h3 className="team-mobile__name">{m.nome}</h3>
                <p className="team-mobile__bio">{m.bio}</p>
                {m.linkedin && <a className="team-mobile__link" href={m.linkedin} target="_blank" rel="noopener">
                  <Icon name="linkedin" size={18} /> LinkedIn <Icon name="arrow" size={14} />
                </a>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.Team = Team;
