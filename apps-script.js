// ============================================================
// unna — Google Apps Script
// Incolla questo codice nell'editor di Apps Script del tuo foglio.
// Poi clicca "Distribuisci > Nuova distribuzione" come "App web",
// accesso: "Chiunque". Copia l'URL e incollalo in api.js.
// ============================================================

function doGet(e) {
  const action = e.parameter.action || "eventi";

  if (action === "eventi") {
    return jsonResponse(getEventi());
  }

  if (action === "iscrizione") {
    if (e.parameter.email) {
      saveIscrizione({ nome: e.parameter.nome || "", email: e.parameter.email });
    }
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Azione sconosciuta" });
}

const FOGLIO_ID = "1tdgHYMaVIGlK_TC44yE0KRTkHbhh3ia1CTFE5EQjIqg";

function getEventi() {
  const sheet = SpreadsheetApp.openById(FOGLIO_ID).getSheetByName("eventi");
  if (!sheet) return [];
  const rows    = sheet.getDataRange().getValues();
  const headers = rows[0];

  return rows.slice(1)
    .filter(r => r[0]) // salta righe vuote
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });

      // ── tags: stringa CSV → array
      if (typeof obj.tags === "string") {
        obj.tags = obj.tags.split(",").map(t => t.trim()).filter(Boolean);
      }

      // ── programma: colonne prog1_titolo / prog1_body … prog6_titolo / prog6_body
      obj.programma = [];
      for (let n = 1; n <= 6; n++) {
        const t = (obj[`prog${n}_titolo`] || "").toString().trim();
        const b = (obj[`prog${n}_body`]   || "").toString().trim();
        if (t || b) obj.programma.push({ titolo: t, body: b });
        delete obj[`prog${n}_titolo`];
        delete obj[`prog${n}_body`];
      }

      // ── info: colonne info1_etichetta / info1_valore … info10_etichetta / info10_valore
      // Ogni evento può avere etichette diverse — basta riempire le colonne che servono.
      obj.info = [];
      for (let n = 1; n <= 10; n++) {
        const k = (obj[`info${n}_etichetta`] || "").toString().trim();
        const v = (obj[`info${n}_valore`]    || "").toString().trim();
        if (k && v) obj.info.push({ k, v });
        delete obj[`info${n}_etichetta`];
        delete obj[`info${n}_valore`];
      }

      // ── contatti: colonne contatti_tel / contatti_email
      obj.contatti = {
        tel:   (obj.contatti_tel   || "").toString().trim(),
        email: (obj.contatti_email || "").toString().trim(),
      };
      delete obj.contatti_tel;
      delete obj.contatti_email;

      return obj;
    });
}

function saveIscrizione(data) {
  const ss  = SpreadsheetApp.openById(FOGLIO_ID);
  let sheet = ss.getSheetByName("iscrizioni");
  if (!sheet) {
    sheet = ss.insertSheet("iscrizioni");
    sheet.appendRow(["timestamp", "nome", "email"]);
  }
  sheet.appendRow([new Date().toISOString(), data.nome, data.email]);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// STRUTTURA DEL FOGLIO "eventi" — intestazioni riga 1
//
// CAMPI BASE (obbligatori):
//   id | titolo | sommario | luogo | provincia | data | dataBreve | dataISO | tags | descrizione | immagine
//   (tinta assegnata automaticamente dal sito in base all'id — non serve nel foglio)
//
// PROGRAMMA — fino a 6 passi (lascia vuoto se non serve):
//   prog1_titolo | prog1_body | prog2_titolo | prog2_body | ... | prog6_titolo | prog6_body
//
// INFO LATERALI — fino a 10 righe, etichetta libera per ogni evento:
//   info1_etichetta | info1_valore | info2_etichetta | info2_valore | ... | info10_etichetta | info10_valore
//
//   Esempio evento A:  info1_etichetta = "Prenotazione"   info1_valore = "Su prenotazione"
//   Esempio evento B:  info1_etichetta = "Prima data"     info1_valore = "12 set — Piazza Armerina"
//   → Ogni evento sceglie le proprie etichette. Le colonne vuote vengono ignorate.
//
// CONTATTI:
//   contatti_tel | contatti_email
//
// VALORI SPECIALI:
//   tinta    → viola | arancio | viola-300 | arancio-2 | inchiostro
//   dataISO  → 2026-09-06  (formato YYYY-MM-DD, usato per ordinare gli eventi)
//   tags     → Laboratorio, Artigianato, Comunità  (valori separati da virgola)
//   immagine → URL pubblica (Google Drive: https://drive.google.com/uc?export=view&id=FILE_ID)
// ============================================================
