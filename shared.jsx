/* global React */
// ============================================================
// unna — primitive condivise (placeholder, onda, reveal, icone)
// ============================================================
const { useState, useEffect, useRef } = React;

// ---- Tinte di brand -----------------------------------------
const TINTE = {
  "viola":      { bg: "#6A00FF", fg: "#F6F6F6", soft: "#E1CCFF", ink: "#3a0088" },
  "viola-300":  { bg: "#8833FF", fg: "#F6F6F6", soft: "#EADBFF", ink: "#4a0fa0" },
  "arancio":    { bg: "#FF710C", fg: "#231104", soft: "#FFE8D8", ink: "#8a3a00" },
  "arancio-2":  { bg: "#FF9A48", fg: "#231104", soft: "#FFEEDD", ink: "#8a4a10" },
  "inchiostro": { bg: "#1B2026", fg: "#F6F6F6", soft: "#DBDBDC", ink: "#000" },
};
function tinta(name) { return TINTE[name] || TINTE.viola; }
window.tinta = tinta;

// ---- Reveal on scroll ---------------------------------------
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, as = "div", delay = 0, className = "", ...rest }) {
  const ref = useReveal();
  const Tag = as;
  return <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Tag>;
}
window.Reveal = Reveal;
window.useReveal = useReveal;

// ---- Onda SVG fluida (linea sinusoidale) --------------------
// genera un path d'onda largo `w` con `cycles` creste
function wavePath(w, h, cycles, phase = 0) {
  const mid = h / 2;
  const amp = h / 2 - 2;
  const step = w / (cycles * 2);
  let d = `M 0 ${mid}`;
  for (let i = 0; i < cycles * 2; i++) {
    const dir = (i % 2 === 0) ? -1 : 1;
    const x1 = step * i + step / 2;
    const x2 = step * (i + 1);
    d += ` Q ${x1} ${mid + dir * amp * Math.cos(phase)} ${x2} ${mid}`;
  }
  return d;
}
window.wavePath = wavePath;

// onda animata che "respira" — usata come firma decorativa
function OndaLinea({ color = "#6A00FF", height = 40, cycles = 7, strokeWidth = 4, className = "", style = {} }) {
  const w = 1200;
  return (
    <svg className={`onda-linea ${className}`} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
         style={{ width: "100%", height, display: "block", ...style }} aria-hidden="true">
      <path d={wavePath(w, height, cycles)} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
window.OndaLinea = OndaLinea;

// ---- Avatar-blob anticonvenzionale --------------------------
function BlobAvatar({ member, size = 132, active = false }) {
  const t = tinta(member.tinta);
  const initials = member.nome.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className={`blob ${active ? "blob--active" : ""}`} style={{ width: size, height: size, "--blob-bg": t.bg, "--blob-fg": t.fg, "--blob-ink": t.ink }} aria-hidden="true">
      {member.foto
        ? <img className="blob__photo" src={member.foto} alt={member.nome} />
        : <span className="blob__init" style={{ fontSize: size * 0.34 }}>{initials}</span>
      }
    </div>
  );
}
window.BlobAvatar = BlobAvatar;

// ---- Media placeholder evento (duotone + onda) --------------
function EventoMedia({ evento, className = "", style = {}, label = true }) {
  const t = tinta(evento.tinta);
  if (evento.immagine) {
    return (
      <div className={`evento-media ${className}`} style={style} role="img" aria-label={evento.titolo}>
        <img src={evento.immagine} alt={evento.titolo} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }
  return (
    <div className={`evento-media ${className}`} style={{ background: t.bg, "--em-fg": t.fg, "--em-ink": t.ink, ...style }} role="img" aria-label={`Immagine evento: ${evento.titolo}`}>
      <div className="evento-media__stripes" aria-hidden="true"></div>
      <svg className="evento-media__onda" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <path d={wavePath(400, 120, 4)} fill="none" stroke={t.fg} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
        <path d={wavePath(400, 120, 4, Math.PI)} fill="none" stroke={t.fg} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      </svg>
      {label && <span className="evento-media__label">foto · {evento.luogo.toLowerCase()}</span>}
    </div>
  );
}
window.EventoMedia = EventoMedia;

// ---- Icone --------------------------------------------------
function Icon({ name, size = 22, stroke = 2 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "instagram": return <svg {...common}><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>;
    case "mail": return <svg {...common}><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3 7 9 6 9-6"/></svg>;
    case "arrow": return <svg {...common}><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>;
    case "arrowR": return <svg {...common}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
    case "linkedin": return <svg {...common}><rect x="2.5" y="2.5" width="19" height="19" rx="4"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 13v4"/></svg>;
    case "pin": return <svg {...common}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case "calendar": return <svg {...common}><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>;
    case "menu": return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "close": return <svg {...common}><path d="M6 6 18 18M18 6 6 18"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    default: return null;
  }
}
window.Icon = Icon;
