# Google Analytics Setup für StreamMatrix Website

## 🎯 Übersicht

Google Analytics (GA4) für die StreamMatrix Website einrichten.

## 📋 Setup-Schritte

### 1. Google Analytics Account erstellen

1. **Gehe zu:** https://analytics.google.com/
2. **Klicke:** "Start measuring"
3. **Account-Name:** StreamMatrix
4. **Property-Name:** StreamMatrix Website
5. **Zeitzone:** Deutschland
6. **Währung:** EUR
7. **Branche:** Software / Technology
8. **Unternehmensgröße:** Klein
9. **Verwendungszweck:** Alle auswählen

### 2. Datenstream erstellen

1. **Plattform:** Web
2. **Website-URL:** https://streammatrix.de
3. **Stream-Name:** StreamMatrix Website
4. **Klicke:** "Create stream"

### 3. Measurement ID kopieren

Nach dem Erstellen siehst du:
```
Measurement ID: G-XXXXXXXXXX
```

**Kopiere diese ID!**

### 4. Google Analytics in Website einbinden

**Option A: Automatisch (empfohlen)**

Ich füge den Code automatisch ein, sobald du mir die Measurement ID gibst.

**Option B: Manuell**

Füge in `docs/index.html` im `<head>` ein:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Ersetze `G-XXXXXXXXXX` mit deiner echten Measurement ID.

### 5. Auch in andere Seiten einbinden

Füge den gleichen Code in:
- `docs/app.html`
- `docs/datenschutz.html`
- `docs/impressum.html`
- `docs/admin/index.html`

## 📊 Was wird getrackt?

### Automatisch (ohne Code)
- ✅ Seitenaufrufe
- ✅ Verweildauer
- ✅ Absprungrate
- ✅ Geräte (Desktop/Mobile)
- ✅ Browser
- ✅ Land/Stadt
- ✅ Traffic-Quellen

### Mit Custom Events (optional)
- Download-Button-Klicks
- Discord-Link-Klicks
- GitHub-Link-Klicks
- Feature-Interaktionen

## 🔧 Custom Events hinzufügen (Optional)

### Download-Tracking

In `docs/index.html`, beim Download-Button:

```html
<a href="https://github.com/19bounty9317/StreamMatrix/releases/latest" 
   onclick="gtag('event', 'download', {
     'event_category': 'engagement',
     'event_label': 'windows_installer'
   });">
  Download für Windows
</a>
```

### Discord-Tracking

```html
<a href="https://discord.gg/streammatrix"
   onclick="gtag('event', 'click', {
     'event_category': 'social',
     'event_label': 'discord'
   });">
  Discord beitreten
</a>
```

### GitHub-Tracking

```html
<a href="https://github.com/19bounty9317/StreamMatrix"
   onclick="gtag('event', 'click', {
     'event_category': 'social',
     'event_label': 'github'
   });">
  GitHub
</a>
```

## 🔐 Datenschutz

### DSGVO-Konformität

**Wichtig:** Du brauchst ein Cookie-Banner!

**Empfohlene Lösung: Cookiebot**

1. **Gehe zu:** https://www.cookiebot.com/
2. **Erstelle kostenlosen Account** (bis 100 Seiten kostenlos)
3. **Füge Domain hinzu:** streammatrix.de
4. **Kopiere den Script-Code**
5. **Füge in `<head>` ein** (VOR Google Analytics)

**Beispiel:**

```html
<!-- Cookiebot -->
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="DEINE-COOKIEBOT-ID" type="text/javascript" async></script>

<!-- Google Analytics (wird von Cookiebot gesteuert) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" data-cookieconsent="statistics"></script>
<script data-cookieconsent="statistics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true
  });
</script>
```

### Datenschutzerklärung aktualisieren

In `docs/datenschutz.html` hinzufügen:

```html
<h2>Google Analytics</h2>
<p>
  Diese Website nutzt Google Analytics, einen Webanalysedienst der Google LLC.
  Google Analytics verwendet Cookies, um die Nutzung der Website zu analysieren.
</p>
<p>
  Die durch das Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden
  in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
</p>
<p>
  Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer
  Browser-Software verhindern oder durch unser Cookie-Banner widersprechen.
</p>
```

## 📈 Analytics Dashboard

### Wichtige Metriken

**Traffic:**
- Besucher pro Tag/Woche/Monat
- Neue vs. wiederkehrende Besucher
- Seitenaufrufe

**Verhalten:**
- Beliebteste Seiten
- Durchschnittliche Verweildauer
- Absprungrate

**Akquisition:**
- Traffic-Quellen (Google, Discord, GitHub, etc.)
- Suchbegriffe (Google Search Console)
- Referrer

**Conversions:**
- Downloads (wenn Event-Tracking eingerichtet)
- Discord-Beitritte
- GitHub-Stars

## 🎯 Ziele einrichten (Optional)

### Download-Ziel

1. **Gehe zu:** Admin → Events → Create event
2. **Event-Name:** download
3. **Mark as conversion:** Ja

### Discord-Ziel

1. **Event-Name:** discord_join
2. **Mark as conversion:** Ja

## 🔍 Monitoring

### Echtzeit-Daten

**Gehe zu:** Reports → Realtime

Siehst du:
- Aktive Besucher gerade jetzt
- Welche Seiten sie besuchen
- Woher sie kommen

### Berichte

**Gehe zu:** Reports → Acquisition → Traffic acquisition

Siehst du:
- Woher Besucher kommen
- Welche Kanäle am besten funktionieren
- Conversion-Raten

## ✅ Checkliste

- [ ] Google Analytics Account erstellt
- [ ] Property erstellt
- [ ] Measurement ID kopiert
- [ ] GA-Code in alle HTML-Dateien eingefügt
- [ ] Cookie-Banner eingerichtet (Cookiebot)
- [ ] Datenschutzerklärung aktualisiert
- [ ] Custom Events eingerichtet (optional)
- [ ] Ziele definiert (optional)
- [ ] Erste Daten in GA sichtbar

## 🚀 Quick Start

**Gib mir deine Measurement ID und ich füge Google Analytics automatisch in alle Seiten ein!**

Beispiel: `G-ABC123XYZ`

Dann mache ich:
1. ✅ Code in alle HTML-Dateien einfügen
2. ✅ IP-Anonymisierung aktivieren
3. ✅ Cookie-Consent vorbereiten
4. ✅ Custom Events für Downloads/Links
5. ✅ Commit und Push

**Bereit? Gib mir deine Measurement ID! 🎯**
