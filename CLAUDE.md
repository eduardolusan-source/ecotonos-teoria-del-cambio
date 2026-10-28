# Teoría del cambio · Ecotonos del valle de Concá — traspaso

Viene de una sesión de Claude Code en la nube (27–28 de octubre de 2026) con Eduardo Luna Sánchez,
profesor-investigador de la UAQ Campus Concá (Laboratorio de Desarrollo Rural, labrural.org).
Léelo completo antes de tocar nada. Eduardo pide que se le vaya preguntando paso a paso.

## Qué es esta carpeta

Repositorio git listo para publicarse en GitHub Pages. Es la versión web de la página «El valle se cuida
desde adentro»: un recorrido de 15 pasos para que el equipo entienda la lógica del proyecto antes de la
reunión. El contenido sale del marco lógico versión 3.1 (Eduardo tiene el Word y el Markdown en su zip
original `ecotonos-teoria-del-cambio.zip`, carpeta `docs/`; no están aquí).

- `index.html` — la página completa. Desde el 27 oct 2026 tiene 16 pasos: el segundo es «En un minuto»
  (`data-id="minuto"`), una balanza animada (parcela contra lote) que resume toda la lógica en cinco toques
  con lenguaje llano; sus textos están en el arreglo `SUMCAP` del script. Pedido por Eduardo para enganchar
  antes del recorrido largo. Es documento HTML entero (doctype, charset utf-8, viewport); las
  imágenes se cargan desde `img/` por ruta relativa. Funciona abierta como archivo local.
- `img/` — ocho fotografías del proyecto (EURC, FONFIVE FI-2024-18) y de los talleres. Las de taller
  muestran caras reconocibles: antes de compartir fuera del equipo, confirmar que el grupo las acepta.
- `apps-script.gs` (y copia `apps-script.txt`) — backend en Google Apps Script. YA ESTÁ DESPLEGADO por
  Eduardo como aplicación web (ejecutar como él, acceso: cualquier persona). Su URL es la constante
  `SHEET_API` dentro del script de `index.html`:
  https://script.google.com/macros/s/AKfycbx_vPF5igLudRladfnj68WJ4xvApX0DeHxDBRwsgtB1OIFbrtKHGkViSvES0SMHv_q8Ag/exec
- `.nojekyll` — para que GitHub Pages sirva los archivos tal cual.

## Cómo funciona la parte del equipo (último paso de la página)

- Campo de nombre libre + tres preguntas (q1, q2, q3). Decisión de Eduardo: nombre libre, sin cuenta.
- Borrador en localStorage (`tdc3-nombre`, `tdc3-q1..q3`). Botones «Copiar mis respuestas» y «Borrar».
- Id por navegador en localStorage (`tdc3-id`), generado con crypto.randomUUID. El backend se queda con la
  última respuesta por id, así que la misma persona puede corregir la suya.
- Guardar: `fetch(SHEET_API, {method:'POST', body: JSON.stringify({nombre,q1,q2,q3,id})})` SIN cabecera
  Content-Type (petición simple, sin preflight; el /exec redirige y la respuesta final permite CORS).
- Leer: `fetch(SHEET_API).then(r=>r.json())` → `{ok, rows:[{fecha,nombre,q1,q2,q3,id}]}`; se pinta en
  `#team` / `#ans` / `#teamcount`. Botón «Actualizar» (`#reload`). Decisión de Eduardo: las respuestas se
  muestran en la página a quien tenga el enlace.
- Si `SHEET_API` está vacía, la sección del equipo no aparece y la página queda como copia local.
- La hoja de Google se llama con pestaña `respuestas`; columnas: fecha, nombre, q1_apuesta,
  q2_componente_flojo, q3_cambiaria, id.

## Estado de las pruebas

- Probado en Chromium (390 px) contra un backend simulado con la misma interfaz: imágenes cargan, sin
  errores de JS, guardar y releer funciona, guardar dos veces con el mismo id reemplaza y no duplica.
- Probado contra el Apps Script real el 27 de octubre de 2026 desde la máquina de Eduardo (Claude Code de
  escritorio, carpeta `/home/eduardo/Claude/Projects/ecotonos-teoria-del-cambio`, servida por http local):
  GET devuelve `{ok:true, rows:[...]}` con CORS correcto; guardar desde la página funciona; guardar dos veces
  desde el mismo navegador reemplaza en la lista y no duplica. Quedaron DOS filas de prueba en la hoja
  (nombre «PRUEBA Claude (borrar)»): hay que borrarlas a mano en la hoja de Google.

## Lo que falta (en orden)

1. HECHO (27 oct 2026): la prueba real pasó. Falta solo borrar las dos filas «PRUEBA Claude (borrar)» en la
   pestaña `respuestas` de la hoja de Google.
2. HECHO (27 oct 2026): repo público https://github.com/eduardolusan-source/ecotonos-teoria-del-cambio con
   Pages activo desde main / (root). La página vive en
   https://eduardolusan-source.github.io/ecotonos-teoria-del-cambio/ . Cada push a main la actualiza solo.
3. Confirmar con el equipo que aceptan las fotos de taller con caras antes de compartir fuera.

## Qué no cambiar sin preguntar

El texto del propósito y del fin; la estructura de seis componentes y sus nombres cortos; el orden de los
pasos; la paleta (teal #0F6E56, mint #E1F5EE, ámbar #E8A85A; ecotonos agua #4A90B8, agrícola #0F6E56,
natural #7A8B4F, urbano #B0764A) y las tipografías (Fraunces + Instrument Sans). Sin Sello Concá ni IMPI;
el componente 2 son solo los reglamentos; mesa cuatrimestral; el calendario no va en la página; solo tres
preguntas al equipo. Si algo del contenido cambia, la fuente es `docs/marco-logico-v3.1.md` del zip original.
