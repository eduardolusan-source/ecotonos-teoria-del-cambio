/**
 * Teoría del cambio · Ecotonos del valle de Concá
 * Backend mínimo en Google Apps Script: recibe las respuestas del equipo
 * y las guarda en una hoja de cálculo; también las devuelve para mostrarlas.
 *
 * Pasos (una sola vez):
 * 1. Crea una hoja de cálculo nueva en Google Sheets (p. ej. "Respuestas · Teoría del cambio").
 * 2. Extensiones → Apps Script. Borra lo que haya y pega este archivo completo. Guarda.
 * 3. Implementar → Nueva implementación → tipo "Aplicación web":
 *      Ejecutar como: Yo  ·  Quién tiene acceso: Cualquier persona
 * 4. Autoriza cuando lo pida y copia la URL que termina en /exec.
 * 5. Pega esa URL en la página (constante SHEET_API en el script del HTML).
 *
 * Si cambias este código después, vuelve a "Implementar → Administrar implementaciones → editar → nueva versión";
 * la URL /exec se conserva.
 */

const SHEET_NAME = 'respuestas';
const MAX = { nombre: 80, texto: 2000, id: 64 };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const sh = getSheet_();
    const d = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');
    const row = [
      new Date(),
      clip_(d.nombre, MAX.nombre),
      clip_(d.q1, MAX.texto),
      clip_(d.q2, MAX.texto),
      clip_(d.q3, MAX.texto),
      clip_(d.id, MAX.id)
    ];
    sh.appendRow(row);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const sh = getSheet_();
    const values = sh.getDataRange().getValues();
    const rows = values.slice(1)
      .filter(r => r[1] || r[2] || r[3] || r[4])
      .map(r => ({
        fecha: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        nombre: String(r[1] || ''),
        q1: String(r[2] || ''),
        q2: String(r[3] || ''),
        q3: String(r[4] || ''),
        id: String(r[5] || '')
      }));
    // Si una misma persona (mismo id) respondió varias veces, se devuelve solo su última respuesta.
    const latest = {};
    rows.forEach(r => { const k = r.id || ('anon-' + r.fecha); latest[k] = r; });
    const list = Object.values(latest).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    return out_({ ok: true, rows: list });
  } catch (err) {
    return out_({ ok: false, error: String(err), rows: [] });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['fecha', 'nombre', 'q1_apuesta', 'q2_componente_flojo', 'q3_cambiaria', 'id']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function clip_(v, n) { return String(v == null ? '' : v).trim().slice(0, n); }

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
