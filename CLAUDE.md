# Ratespiel – Wer bin ich? · Projektregeln

## PFLICHT bei jeder Änderung: Version bumpen

Bei **jeder** Änderung am Spiel (Bug fix, Feature, Styling, Daten) MÜSSEN folgende drei Stellen gleichzeitig aktualisiert werden:

1. **`index.html`** – `<span class="version-label">vX.Y</span>` (sichtbar im Startscreen)
2. **`sw.js`** – `const CACHE = 'ratespiel-vN';` (N ist eine fortlaufende Ganzzahl, unabhängig von X.Y)
3. **`CLAUDE.md`** (diese Datei) – aktuelle Version unten in der Tabelle eintragen

Nie vergessen. Keine Ausnahme.

## Aktuelle Versionen

| App-Version | SW-Cache   | Datum      | Beschreibung                        |
|-------------|------------|------------|-------------------------------------|
| v1.0        | v5         | 2026-06-23 | Launch                              |
| v1.1        | v6         | 2026-06-23 | Kalibrierungs-UI redesign           |
| v1.2        | v7         | 2026-06-23 | Tiltrichtung korrigiert, Cooldown 300ms |
| v1.3        | v8         | 2026-06-23 | Kalibrierung als geführter 3-Schritt-Wizard, Tilt-Hint entfernt |
| v1.4        | v9         | 2026-06-23 | Berufe-Bild-Suche mit imageSearchSuffix " Beruf" disambiguiert |
| v1.5        | v10        | 2026-06-24 | Tilt: 3D-Richtungsvektor (beta+gamma) statt nur beta-Achse |
| v1.6        | v11        | 2026-06-24 | Versionslabel position:fixed statt absolute (kein Layout-Shift) |
| v1.7        | v12        | 2026-06-24 | Kalibrierung: OK-Klick für neutral, Auto-Detect für vorne/hinten; Schwelle 40°, Cooldown 1,2s |
| v1.8        | v13        | 2026-06-24 | Kalibrierung: Rückwärts-Schritt entfernt; nur neutral+vorwärts nötig, backward=−forward |
| v1.9        | v14        | 2026-06-24 | Sensor-Debug-Overlay: live β/γ/Projektion/Richtung zum Testen |
| v2.0        | v15        | 2026-06-24 | Debug-Neutral auto-detect beim Öffnen; screen.orientation.lock landscape |
| v2.1        | v16        | 2026-06-24 | Orientation-Lock erst bei Calib-OK/Spielstart; Toggle-Button auf Startscreen |
| v2.2        | v17        | 2026-06-24 | devicemotion statt deviceorientation (kein Gimbal Lock); lockLandscape Fix |
| v2.3        | v18        | 2026-06-24 | Zwei Startbuttons: kalibriert vs. auto (Y-Achse aus screen.orientation.angle) |
| v2.4        | v19        | 2026-06-24 | lockLandscape: requestFullscreen() vor orientation.lock() (Browser-Tab Support) |

## Projekt-Übersicht

- **Repo:** https://github.com/danielzaiser91/ratespiel-wer-bin-ich
- **Live:** https://danielzaiser91.github.io/ratespiel-wer-bin-ich/
- **Stack:** Vanilla HTML/CSS/JS, PWA, GitHub Pages
- **Sprachen:** DE + EN (i18n via `i18n.js`)
- **Bilder:** Wikimedia Commons API (live, network-first)
- **Tilt:** DeviceOrientationEvent, kalibrierbar, invertierbar, gespeichert in localStorage
