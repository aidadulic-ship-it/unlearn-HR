# HR UNLEARN – Webseite

Alle Dateien liegen flach (ohne Ordner) im Hauptverzeichnis des Repositorys:

index.html, qr.html, uebungen.html, prompts.html, fragen.html, ki-karte.html, buchen.html,
roadmap.html, reality-check.html, perspective-switch.html, site.css, site.js,
marlies.jpg, aida.png, .nojekyll, README.md

## Veröffentlichen (GitHub Pages)
1. Repository öffnen (Name: HR-Unlearn), "Add file" > "Upload files", alle Dateien hineinziehen, "Commit changes".
2. Settings > Pages > Branch "main", Ordner "/ (root)", Save.
3. Nach ein bis zwei Minuten erreichbar unter https://aidadulic-ship-it.github.io/HR-Unlearn/

Hinweis: Die Datei .nojekyll ist unsichtbar und geht beim Hochladen manchmal verloren. Die Seite funktioniert auch ohne.

## QR-Codes
qr.html zeigt auf .../reality-check.html#teilnahme, ki-karte.html auf .../ki-karte.html.
Bei anderem Repo-Namen müssen beide QR-Codes neu erzeugt werden.

## Noch zu ergänzen (steht als [Platzhalter] auf buchen.html)
Termin, Ort, Dauer, Gruppengröße, Preis, Storno, E-Mail-Adresse, Impressum, Rollen und Referenzen,
juristische Prüfung (Datenschutz, Betriebsrat, EU-AI-Act).

## Hinweis zur Demo
Die Demo-Apps speichern nur im Browser des jeweiligen Geräts. Für den Live-Einsatz mit gemeinsamen Antworten
ist ein Backend nötig (nicht Teil dieses Pakets).

## /grillme (KI-Challenger)
Die Seite `grillme.html` zeigt vier fiktive KI-Figuren (Sophie, Markus, Lea, Tim). Ohne Server läuft sie im Demo-Modus mit vorgeschriebenen Beispielantworten.
Für echte KI-Antworten den Server aus `grillme-backend/` einrichten (siehe dortige README) und die Adresse in `grillme-config.js` eintragen. Den API-Schlüssel niemals in die Webseite schreiben.
Die Fotos (`sophie.jpg`, `markus.jpg`, `lea.jpg`, `tim.jpg`) lassen sich durch gleich benannte Dateien ersetzen.

Die System-Prompts der vier Figuren stammen aus dem Avatar-Export (Version 1.0.0, 29.10.2026) und werden unverändert verwendet. Laut dessen README sind sie neu ausgearbeitete Fassungen, keine wortgetreuen Originale.
