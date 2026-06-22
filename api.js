// ============================================================
// unna — API
// ============================================================
window.UNNA_API_URL = "https://script.google.com/macros/s/AKfycbxytemwdhYr3vbkuMUFORWZ8FPoCqkR5L4zf1k2Cy9FTvlOTK320kb9Sc822btXCLp-pw/exec";

// Assegna una tinta in modo deterministico dall'id dell'evento
// (stesso id → stesso colore sempre, ma appare casuale tra eventi diversi)
const _TINTE = ["viola", "arancio", "viola-300", "arancio-2", "inchiostro"];
function _tintaPerEvento(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return _TINTE[h % _TINTE.length];
}
function _applicaTinte(eventi) {
  eventi.forEach(e => { e.tinta = _tintaPerEvento(e.id); });
  return eventi;
}

// Mostra skeleton durante il caricamento, poi aggiorna con i dati reali.
window.unnaInit = function (renderFn) {
  const url = window.UNNA_API_URL;
  UNNA._loading = !!url;
  _applicaTinte(UNNA.eventi);
  renderFn();

  if (!url) return;

  fetch(url + "?action=eventi")
    .then(r => r.json())
    .then(eventi => {
      if (Array.isArray(eventi) && eventi.length) {
        UNNA.eventi = _applicaTinte(eventi);
      }
      UNNA._loading = false;
      window.dispatchEvent(new CustomEvent("unna:refresh"));
    })
    .catch(() => {
      UNNA._loading = false;
      window.dispatchEvent(new CustomEvent("unna:refresh"));
    });
};
