# /grillme Backend (Cloudflare Worker)

Die Webseite läuft auf GitHub Pages und kann keine Schlüssel verbergen. Deshalb ruft sie diesen kleinen Worker auf.
Nur der Worker kennt den API-Schlüssel.

## Einrichten
1. `npm i -g wrangler` und `wrangler login`
2. Modell prüfen: `MODEL` in `wrangler.toml` muss bei deinem Konto verfügbar sein
3. In diesem Ordner: `wrangler secret put ANTHROPIC_API_KEY` (Schlüssel einfügen)
4. `ALLOWED_ORIGIN` in `wrangler.toml` auf deine Seite setzen (ohne Pfad)
5. `wrangler deploy` und die Worker-Adresse notieren, z. B. `https://hr-unlearn-grillme.<name>.workers.dev`
6. In `grillme-config.js` (im Hauptordner der Webseite) `endpoint` auf diese Adresse plus `/api/grillme` setzen
7. Dateien auf GitHub hochladen

## Was der Worker tut
- `POST /api/round` liefert eine Runden-ID; `POST /api/grillme` nimmt `avatar` (sophie, markus, lea, tim), `mode` (`grill` oder `chat`), `round_id` und `messages` entgegen
- die vier System-Prompts (aus `avatars/*.system.txt`) werden unverändert verwendet und liegen nur hier; der Prüfgegenstand wird als Daten gekennzeichnet
- Grill-Runde: pro Avatar ein eigener Modellaufruf, Antwort als JSON mit Stärke, Einwand, blindem Fleck, Challenge-Frage, nächstem Schritt; ungültige Antworten werden einmal wiederholt, sonst als Fehler gemeldet (nie erfunden)
- lehnt E-Mail-Adressen, Telefon- und IBAN-Muster sowie Texte über 1200 Zeichen ab
- begrenzt Anfragen pro Minute und IP (best effort), erlaubt nur die eingetragenen Seiten
- antwortet nur mit `{avatar, text}`, nie mit dem Schlüssel oder Fehlerdetails des Anbieters

## Datenschutz
Der Text wird an den KI-Anbieter gesendet. Keine echten Personen, Personalakten oder vertraulichen Daten eingeben.
Die automatische Erkennung findet nur einfache Muster (E-Mail, Telefon, IBAN, Sozialversicherungsnummer), keine Namen.
Vor dem Einsatz mit Teilnehmenden Datenschutz und Auftragsverarbeitung prüfen. [Juristische Prüfung ausstehend]
