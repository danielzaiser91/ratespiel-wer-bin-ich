# Ratespiel "Wer bin ich?" – Aufgabenliste

## Phase 1: Projekt-Setup & Repository

- [ ] Neues GitHub-Repository erstellen (`ratespiel-wer-bin-ich`) und lokal initialisieren
- [ ] Grundlegende Projektstruktur anlegen:
  ```
  /
  ├── index.html
  ├── style.css
  ├── app.js
  ├── data.js        (Kategorie-Daten & Wortlisten)
  ├── i18n.js        (Übersetzungen DE/EN)
  ├── manifest.json
  ├── sw.js          (Service Worker)
  └── icons/         (PWA-Icons)
  ```
- [ ] GitHub Pages in Repository-Einstellungen aktivieren (Branch: main, Ordner: root)
- [ ] `.gitignore` anlegen

## Phase 2: PWA-Grundgerüst

- [ ] `manifest.json` konfigurieren (Name, Icons, `display: fullscreen`, `orientation: landscape`)
- [ ] Service Worker (`sw.js`) für Offline-Betrieb des App-Shells (HTML/CSS/JS) implementieren
- [ ] App-Icons erstellen (192×192 und 512×512 PNG)
- [ ] Meta-Tags im HTML: viewport, theme-color, apple-mobile-web-app-capable, etc.

## Phase 3: Spielinhalt / Kategorien-Daten (`data.js`)

- [ ] Datenstruktur definieren: `{ id, labelDE, labelEN, onlyDE, words: { de: [], en: [] } }`
- [ ] Wortlisten befüllen (~30–50 Einträge je Kategorie):
  - Berühmte Personen (DE/EN)
  - Berufe (DE/EN)
  - Verben (DE/EN)
  - Obst (DE/EN)
  - Gemüse (DE/EN)
  - Speisen (DE/EN)
  - Getränke (DE/EN)
  - Marken (DE/EN)
  - Berühmte Orte / Sehenswürdigkeiten (DE/EN)
  - Länder (DE/EN)
  - Große Städte Deutschlands >200k (`onlyDE: true`)
- [ ] Kategorie-Flag `onlyDE: true` für deutsche Städte setzen (wird bei EN-Sprachauswahl ausgeblendet)

## Phase 4: Übersetzungssystem (`i18n.js`)

- [ ] Übersetzungsobjekte für alle UI-Texte in DE und EN
- [ ] Hilfsfunktion `t(key)` die anhand der aktuellen Sprache den richtigen Text zurückgibt
- [ ] Alle Kategorienamen zweisprachig hinterlegen

## Phase 5: UI – Screens & Layout

### Startscreen
- [ ] Sprachauswahl (DE / EN) – Flags oder Text-Buttons
- [ ] Spielmodus-Auswahl: **Wort** (Text auf Bildschirm) vs. **Bild** (Foto von Wikimedia)
- [ ] **Modus-Auswahl**: drei styled Checkbox-Buttons:
  - `Unendlich` – spielt bis Spieler manuell beendet
  - `Auf Zeit` – zeigt Timer-Optionen: `30s | 60s | 90s | Custom` (Custom = Inputfeld 1–3600s, nur sichtbar wenn "Custom" ausgewählt)
  - `X Karten` – zeigt Karten-Optionen: `5 | 10 | 20 | Custom` (Custom = Inputfeld, nur sichtbar wenn "Custom" ausgewählt)
- [ ] "Weiter"-Button führt zur Kategorieauswahl

### Kategoriescreen
- [ ] Kategorien als Kacheln/Buttons anzeigen
- [ ] `onlyDE`-Kategorien bei EN-Sprachauswahl ausblenden
- [ ] "Spiel starten"-Button nach Kategorieauswahl

### Spielscreen (Querformat-optimiert)
- [ ] Großes zentriertes Wort (Wort-Modus) oder Foto (Bild-Modus) im Vollbild
- [ ] Aktueller Punktestand oben anzeigen
- [ ] Fortschrittsanzeige (bei X-Karten-Modus: "3 / 10")
- [ ] Timer-Anzeige (bei Zeit-Modus: Countdown sichtbar)
- [ ] "Beenden"-Button (für Unendlich-Modus / vorzeitiger Abbruch)

### Ergebnis-/Summary-Screen
- [ ] Gespielte Zeit anzeigen
- [ ] Karten richtig / falsch anzeigen
- [ ] Endpunktzahl (`+1` pro richtiger Karte, `+0` pro falscher)
- [ ] "Nochmal spielen"- und "Zurück zum Start"-Button

### Allgemein
- [ ] Querformat erzwingen via CSS (`@media (orientation: portrait)`) + Overlay "Bitte Handy drehen" bei Hochformat
- [ ] Animierter Kartenwechsel (kurzer Slide/Fade-Übergang)
- [ ] Grüner Flash-Overlay bei Richtig, Roter bei Falsch

## Phase 6: Spiellogik (`app.js`)

- [ ] State-Management: aktuelle Sprache, Modus, Kategorie, Punktestand, Kartenliste, Index
- [ ] Kartenliste aus gewählter Kategorie zufällig mischen (Fisher-Yates)
- [ ] Spielende-Erkennung je Modus:
  - Unendlich: nur manuell via "Beenden"-Button
  - Auf Zeit: wenn Countdown auf 0 läuft
  - X Karten: wenn `index >= gewählteAnzahl`
- [ ] Countdown-Timer implementieren (läuft im Hintergrund, aktualisiert Anzeige jede Sekunde)
- [ ] Gespielte Zeit messen (Startzeit speichern, bei Spielende Differenz berechnen)

## Phase 7: Neigungssteuerung (DeviceOrientation)

- [ ] `DeviceOrientationEvent`-Listener implementieren
- [ ] iOS-Permission-Request: `DeviceOrientationEvent.requestPermission()` – Button "Sensor erlauben" auf Startscreen
- [ ] Kalibrierung: Neutralposition beim Spielstart erfassen (Handy an Stirn = Beta ~0°)
- [ ] Vorwärtskippen (Beta sinkt deutlich unter Neutral) → Richtig auslösen (+1)
- [ ] Rückwärtskippen (Beta steigt deutlich über Neutral) → Falsch/Überspringen auslösen (+0)
- [ ] Debounce: nach Auslösen mind. 1 Sekunde Sperrzeit, kein versehentliches Doppel-Kippen
- [ ] Vibrations-Feedback: `navigator.vibrate(100)` bei Richtig, `navigator.vibrate([100,50,100])` bei Falsch

## Phase 8: Sound-Feedback

- [ ] Kurzen positiven Ton bei Richtig (Web Audio API, kein externes File nötig)
- [ ] Kurzen negativen Ton bei Falsch (Web Audio API)
- [ ] Sound nur abspielen wenn `document.visibilityState === 'visible'`

## Phase 9: Bild-Modus (Wikimedia Commons API)

- [ ] API-Aufruf implementieren: `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&...`
- [ ] Pro Wort/Person das erste verfügbare Thumbnail laden
- [ ] Lade-Spinner während Bild geladen wird
- [ ] Fallback bei fehlendem Bild: Platzhalter mit Fragezeichen oder Icon
- [ ] Nächstes Bild im Hintergrund vorladen (während aktuelles angezeigt wird)

## Phase 10: Feinschliff & Testing

- [ ] Alle UI-Texte in DE und EN auf Vollständigkeit prüfen
- [ ] Alle Kategorien auf Wortlistengröße prüfen (mind. 20 Einträge)
- [ ] Auf echtem Android testen (Neigungssensor, PWA-Install-Banner)
- [ ] Auf echtem iOS testen (Permission-Dialog für Sensor, Safari PWA-Verhalten)
- [ ] Verschiedene Querformat-Auflösungen testen (klein: 667×375, groß: 926×428)
- [ ] PWA-Installation auf Homescreen testen (iOS + Android)
- [ ] Offline-Verhalten testen (App-Shell lädt ohne Netz)
- [ ] Lighthouse-Audit: PWA-Score, Performance, Accessibility

## Phase 11: Deployment

- [ ] Finalen Stand committen und auf GitHub pushen
- [ ] GitHub Pages URL verifizieren: `https://<user>.github.io/ratespiel-wer-bin-ich`
- [ ] URL auf echtem Gerät aufrufen und Endtest durchführen

---

## Entscheidungen (bereits geklärt)

| Thema | Entscheidung |
|---|---|
| Bild-Quelle | Wikimedia Commons API (live, kein lokaler Speicher) |
| Timer-Optionen | 30s / 60s / 90s / Custom (1–3600s) als styled Checkbox-Buttons |
| Karten-Optionen | 5 / 10 / 20 / Custom als styled Checkbox-Buttons |
| Rundenende | Summary mit Zeit, Karten richtig/falsch, Endpunktzahl |
| Sound | Ja, einfache Töne via Web Audio API |
| Mehrere Spieler | Kein getrenntes Tracking; jeder spielt eine eigene Session |
| Sprachen | DE und EN; Kategorie "Dt. Städte" nur bei DE sichtbar |
| Orientierung | Querformat erzwungen; Hinweis-Overlay bei Hochformat |
