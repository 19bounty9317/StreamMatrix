# 🎮 StreamMatrix Streamer Directory - Implementierung

## 🎯 Ziel: https://streammatrix.de/streamer

Eine Übersichtsseite aller StreamMatrix-Nutzer die dem Tracking zugestimmt haben.

## 📋 Features:

### Live-Streamer (oben):
- ✅ Twitch Vorschau-Video (muted)
- ✅ Kanal-Icon
- ✅ Kanal-Name
- ✅ Stream-Titel
- ✅ Kategorie/Game
- ✅ Viewer-Anzahl
- ✅ "🔴 LIVE" Badge

### Offline-Streamer (unten):
- ✅ Kanal-Icon
- ✅ Kanal-Name
- ✅ "Letzter Stream vor X Stunden/Tagen"
- ✅ Kein Video (Platzhalter)

## 🏗️ Architektur:

```
┌─────────────────────────────────────────┐
│ StreamMatrix App (Electron)             │
│ - Nutzer stimmt Tracking zu             │
│ - Sendet Daten an Firebase               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Firebase Firestore                      │
│ Collection: "streamers"                 │
│ - userId, username, lastSeen, etc.      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Firebase Cloud Function                 │
│ - Läuft alle 5 Minuten                  │
│ - Holt Twitch API Daten                 │
│ - Updated Live-Status                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Website: streammatrix.de/streamer       │
│ - Liest aus Firestore                   │
│ - Zeigt Live/Offline Streamer           │
│ - Twitch Embed für Videos               │
└─────────────────────────────────────────┘
```

## 📦 Benötigte Komponenten:

### 1. Firebase Setup
- Firestore Database
- Cloud Functions
- Twitch API Integration

### 2. App-Integration
- Tracking-Consent in Settings
- Daten-Upload zu Firebase
- Heartbeat alle 5 Minuten

### 3. Website
- `/streamer` Seite
- Twitch Embed Integration
- Live/Offline Sortierung

## 🚀 Implementierungs-Schritte:

### Phase 1: Firebase Setup (30 Min)
1. Firebase Projekt erstellen
2. Firestore Database einrichten
3. Security Rules konfigurieren
4. Twitch API Credentials

### Phase 2: Firestore Schema (15 Min)
```javascript
// Collection: streamers
{
  userId: "123456789",
  username: "MaxMustermann",
  displayName: "Max Mustermann",
  profileImageUrl: "https://...",
  isLive: false,
  lastSeen: Timestamp,
  streamData: {
    title: "Coding Stream",
    gameName: "Software Development",
    viewerCount: 42,
    thumbnailUrl: "https://...",
    startedAt: Timestamp
  },
  consent: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Phase 3: Cloud Function (45 Min)
```javascript
// functions/updateStreamStatus.js
// Läuft alle 5 Minuten
// Holt Twitch API Daten für alle Streamer
// Updated isLive, streamData, etc.
```

### Phase 4: App-Integration (60 Min)
```typescript
// src/services/StreamerDirectoryService.ts
// - Tracking-Consent verwalten
// - Daten an Firebase senden
// - Heartbeat alle 5 Minuten
```

### Phase 5: Website (90 Min)
```html
<!-- docs/streamer/index.html -->
<!-- Zeigt alle Streamer -->
<!-- Live oben, Offline unten -->
<!-- Twitch Embed für Videos -->
```

## 💰 Kosten:

### Firebase Free Tier:
- ✅ 50.000 Reads/Tag (ausreichend!)
- ✅ 20.000 Writes/Tag
- ✅ 10 GB Storage
- ✅ Cloud Functions: 2M Invocations/Monat

**Für StreamMatrix: Komplett kostenlos!** 🎉

### Twitch API:
- ✅ Kostenlos
- ✅ Rate Limit: 800 Requests/Minute

## 🔐 Datenschutz (DSGVO):

### Opt-In System:
```
┌─────────────────────────────────────────┐
│ Einstellungen                           │
│                                         │
│ ☐ Im Streamer-Verzeichnis anzeigen     │
│                                         │
│ Wenn aktiviert:                         │
│ - Dein Kanal wird auf streammatrix.de  │
│   angezeigt                             │
│ - Andere können dich finden             │
│ - Du unterstützt die Community          │
│                                         │
│ Gespeicherte Daten:                     │
│ - Twitch Username                       │
│ - Kanal-Icon                            │
│ - Live-Status                           │
│ - Stream-Titel & Kategorie              │
│                                         │
│ Jederzeit widerrufbar!                  │
└─────────────────────────────────────────┘
```

### Datenschutzerklärung Update:
- Erklärung des Streamer-Verzeichnisses
- Opt-In Mechanismus
- Daten-Löschung auf Anfrage

## 📝 Implementierungs-Reihenfolge:

### Schritt 1: Firebase Setup ✅
Ich erstelle:
- `STREAMER-DIRECTORY-FIREBASE-SETUP.md`
- Firebase Config
- Firestore Rules
- Cloud Function Template

### Schritt 2: App-Integration ✅
Ich erstelle:
- `StreamerDirectoryService.ts`
- Settings-Integration
- Heartbeat-System

### Schritt 3: Cloud Function ✅
Ich erstelle:
- `functions/updateStreamStatus.js`
- Twitch API Integration
- Cron Job Setup

### Schritt 4: Website ✅
Ich erstelle:
- `docs/streamer/index.html`
- CSS Styling
- JavaScript für Firestore

### Schritt 5: Testing & Deployment ✅
- Lokales Testing
- Firebase Deploy
- Website Deploy

## ⏱️ Zeitaufwand:

- **Setup:** 30 Min
- **Backend:** 60 Min
- **Frontend:** 90 Min
- **Testing:** 30 Min
- **Total:** ~3-4 Stunden

## 🎯 Nächster Schritt:

Soll ich anfangen mit:

**A) Firebase Setup** - Ich erstelle alle Config-Files und Anleitungen

**B) Alles auf einmal** - Ich implementiere das komplette System (dauert länger)

**C) Schritt-für-Schritt** - Ich mache einen Schritt, du testest, dann weiter

Was bevorzugst du? 🤔

---

## 💡 Bonus-Features (später):

- 🔍 Suche nach Streamern
- 🏆 Top-Streamer (nach Viewern)
- 📊 Statistiken (Anzahl Live-Streamer)
- 🎨 Filter nach Kategorie/Game
- ⭐ Favoriten-System
- 💬 Direktlink zu Twitch-Chat
- 📱 Mobile-optimiert
- 🌐 Mehrsprachig (DE/EN)

---

**Bereit für die Implementierung?** 🚀
