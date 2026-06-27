# Wer bin ich? 🎭

Ein mobiles Heads-Up-Ratespiel für Gruppen — als Progressive Web App, direkt im Browser, ohne Installation.

**[▶ Jetzt spielen](https://danielzaiser91.github.io/ratespiel-wer-bin-ich/)**

---

## Spielprinzip

1. Handy im Querformat ans Stirn halten — der Spieler sieht den Begriff nicht
2. Die anderen beschreiben, was auf dem Bildschirm steht
3. Handy nach vorne kippen → **Richtig** (+1)
4. Handy nach hinten kippen → **Weiter** (überspringen)

## Features

- **11 Kategorien:** Personen, Berufe, Verben, Früchte, Gemüse, Essen, Getränke, Marken, Orte, Länder, Deutsche Städte
- **Bildmodus:** Zeigt Wikipedia-Bilder statt Text (netzwerkabhängig)
- **3 Rundenmodi:** Endlos (mit hochzählendem Timer), Zeitlimit, feste Kartenzahl
- **Kalibrierung:** Geführter Wizard speichert die Kipprichtung in localStorage — einmalig, bleibt erhalten
- **Zweisprachig:** Deutsch & Englisch (i18n via `i18n.js`)
- **PWA:** Installierbar auf iOS & Android, funktioniert offline

## Stack

| Was | Wie |
|---|---|
| Frontend | Vanilla HTML / CSS / JS — kein Framework |
| Hosting | GitHub Pages |
| Bilder | Wikimedia Commons API (network-first) |
| Offline | Service Worker mit Cache-Busting bei jedem Deploy |
| Tilt | `devicemotion` → `accelerationIncludingGravity` (kein Gimbal Lock) |

## Lokale Entwicklung

Kein Build-Schritt nötig — einfach die Dateien mit einem lokalen HTTP-Server ausliefern:

```bash
npx serve .
# oder
python -m http.server 8080
```

Dann `http://localhost:8080` im Browser öffnen.

> **Hinweis:** `devicemotion` erfordert HTTPS oder `localhost`. Auf einem anderen Gerät im lokalen Netz muss der Server über HTTPS erreichbar sein (z. B. via ngrok).

## Projektstruktur

```
index.html      Einzige HTML-Seite, alle Screens per show/hide
app.js          Komplette Spiellogik, Kalibrierung, Tilt-Erkennung
style.css       Styling (CSS-Variablen, Dark Theme)
data.js         Alle Wortlisten nach Kategorie und Sprache
i18n.js         Übersetzungen DE/EN
sw.js           Service Worker (network-first, Cache-Busting)
manifest.json   PWA-Manifest (fullscreen landscape)
discord/        GitHub Actions Discord-Notifications
icons/          App-Icons (192×192, 512×512)
```

## Deployment

Jeder Push auf `main` triggert GitHub Pages automatisch. Nach ~2–3 Minuten ist die neue Version live.

Der Service Worker Cache wird bei jedem Release mit einer neuen Cache-ID (`ratespiel-vN`) invalidiert — alle Clients laden beim nächsten Besuch die aktualisierte Version.
