/* global React, ReactDOM, Header, Hero, GalleriaCarousel, Team, Eventi, Manifesto, Contatti, Footer,
   useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSlider */
// ============================================================
// unna — App (home). Compone le sezioni + Tweaks per le varianti.
// ============================================================
const { useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "onda",
  "teamLayout": "onda",
  "accent": "#FF710C",
  "motion": 1
}/*EDITMODE-END*/;

const ACCENT_SOFT = {
  "#FF710C": "#FFE8D8",
  "#8833FF": "#EADBFF",
  "#01AA66": "#D6F5E8",
  "#0068D9": "#D8E9FF",
};

function App() {
  const [eventiLoading, setEventiLoading] = React.useState(!!window.UNNA_API_URL);
  useEffectA(() => {
    if (!UNNA._loading) { setEventiLoading(false); return; }
    const handler = () => setEventiLoading(false);
    window.addEventListener("unna:refresh", handler);
    return () => window.removeEventListener("unna:refresh", handler);
  }, []);

  const [galleriaLoading, setGalleriaLoading] = React.useState(!!window.UNNA_API_URL);
  useEffectA(() => {
    if (!UNNA._galleriaLoading) { setGalleriaLoading(false); return; }
    const handler = () => setGalleriaLoading(false);
    window.addEventListener("unna:galleria", handler);
    return () => window.removeEventListener("unna:galleria", handler);
  }, []);

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectA(() => {
    const hash = window.location.hash;
    if (!hash || eventiLoading || galleriaLoading) return;
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (!el) return;
      const navH = document.querySelector(".nav") ? document.querySelector(".nav").offsetHeight : 70;
      window.scrollTo({ top: el.offsetTop - navH, behavior: "smooth" });
    }, 120);
    return () => clearTimeout(t);
  }, [eventiLoading, galleriaLoading]);

  useEffectA(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-soft", ACCENT_SOFT[t.accent] || "#FFE8D8");
    root.style.setProperty("--motion", String(t.motion));
  }, [t.accent, t.motion]);

  const heroDark = t.heroVariant !== "chiaro";

  return (
    <>
      <Header heroDark={heroDark} />
      <main id="main">
        <Hero variant={t.heroVariant} />
        <GalleriaCarousel loading={galleriaLoading} />
        <Team layout={t.teamLayout} />
        <Eventi loading={eventiLoading} />
        <Manifesto />
        <Contatti />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Hero" />
        <TweakRadio label="Trattamento" value={t.heroVariant}
          options={[{ value: "onda", label: "Onda" }, { value: "chiaro", label: "Chiaro" }, { value: "rete", label: "Rete" }]}
          onChange={(v) => setTweak("heroVariant", v)} />
        <TweakSection label="Team" />
        <TweakRadio label="Layout" value={t.teamLayout}
          options={[{ value: "onda", label: "Onda" }, { value: "griglia", label: "Griglia" }]}
          onChange={(v) => setTweak("teamLayout", v)} />
        <TweakSection label="Stile" />
        <TweakColor label="Accento" value={t.accent}
          options={["#FF710C", "#8833FF", "#01AA66", "#0068D9"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSlider label="Movimento" value={t.motion} min={0.4} max={1.6} step={0.2}
          onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </>
  );
}

unnaInit(() => ReactDOM.createRoot(document.getElementById("root")).render(<App />));
