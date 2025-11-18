# Ban-System für StreamMatrix

## 🔒 Übersicht

Das Ban-System ermöglicht es Admins, User zu sperren und zu entsperren. Gebannte User werden sofort ausgeloggt und können sich nicht mehr einloggen.

## ✅ Features

1. **Admin-Dashboard**
   - Ban/Unban-Buttons für jeden User
   - Ban-Grund eingeben
   - Ban-Status sichtbar

2. **App-Seite**
   - Ban-Prüfung beim App-Start
   - Ban-Prüfung beim Login
   - Ban-Prüfung alle 30 Minuten (Heartbeat)
   - Sofortiger Logout bei Ban
   - Kontakt-Informationen anzeigen

3. **Cloud Functions**
   - Automatische Ban-Erkennung bei Code-Manipulation
   - Ban-Status wird in Firestore gespeichert

## 📋 Wie es funktioniert

### 1. Admin bannt User

**Im Admin-Dashboard (`docs/admin/index.html`):**

1. Öffne: `docs/admin/index.html` im Browser
2. Login mit Firebase-Account
3. Finde User in der Liste
4. Klicke "🚫 Bannen"
5. Gib Ban-Grund ein (z.B. "Code-Manipulation", "AGB-Verstoß")
6. Bestätige

**Was passiert:**
- User wird in Firestore als `banned: true` markiert
- `banReason` wird gespeichert
- `bannedAt` Timestamp wird gesetzt

### 2. User wird ausgeloggt

**In der App:**

- **Beim nächsten App-Start:** Ban-Prüfung → Logout
- **Beim nächsten Login-Versuch:** Ban-Prüfung → Login blockiert
- **Beim nächsten Heartbeat (max. 30 Min):** Ban-Prüfung → Logout

**User sieht:**
```
🚫 Dein StreamMatrix Account wurde gesperrt.

Grund: Code-Manipulation

📧 Support kontaktieren:
• Email: streammatrix@web.de
• Discord: https://discord.gg/streammatrix (Ticket öffnen)

Bei Fragen oder Einspruch wende dich bitte an den Support.
Du wirst jetzt ausgeloggt.
```

### 3. Admin entbannt User

**Im Admin-Dashboard:**

1. Finde gebannten User (rot markiert)
2. Klicke "✅ Entbannen"
3. Bestätige

**Was passiert:**
- `banned: false` in Firestore
- `banReason` wird gelöscht
- User kann sich wieder einloggen

### 4. User kann sich wieder einloggen

- User startet App
- Login funktioniert wieder
- Voller Zugriff auf alle Features

## 🔧 Technische Details

### Ban-Prüfung in der App

**3 Prüfpunkte:**

1. **App-Start** (`src/App.tsx`)
```typescript
const isBanned = await analyticsService.checkBanStatus();
if (isBanned) {
  analyticsService.startHeartbeat(); // Nur wenn nicht gebannt
}
```

2. **Login** (`src/App.tsx`)
```typescript
const isBanned = await analyticsService.checkBanStatus();
if (isBanned) {
  TwitchService.clearToken();
  return; // Login abbrechen
}
```

3. **Heartbeat** (`src/services/AnalyticsService.ts`)
```typescript
// Alle 30 Minuten
if (userDoc.exists() && userDoc.data().banned) {
  this.handleBan(userDoc.data().banReason);
  return;
}
```

### Ban-Handling

**`handleBan()` Funktion:**
- Zeigt Dialog mit Ban-Grund
- Zeigt Kontakt-Informationen
- Löscht localStorage
- Reload nach 3 Sekunden

### Firestore-Struktur

**User-Dokument:**
```javascript
{
  userIdHash: "abc123...",
  channelName: "username",
  banned: true,              // ← Ban-Status
  banReason: "Code-Manipulation", // ← Ban-Grund
  bannedAt: Timestamp,       // ← Ban-Zeitpunkt
  // ... andere Felder
}
```

### Cloud Functions

**Automatischer Ban bei Code-Manipulation:**

```javascript
// functions/index.js
if (!checks.validHash && checks.validVersion) {
  updates.banned = true;
  updates.banReason = 'Code-Manipulation erkannt';
  updates.bannedAt = admin.firestore.FieldValue.serverTimestamp();
}
```

## 📊 Admin-Dashboard Features

### User-Liste

**Farb-Codierung:**
- 🟢 Grün: Alles OK
- 🟡 Gelb: Verdächtig (suspicious)
- 🔴 Rot: Gebannt

**Spalten:**
- Channel (mit Twitch-Link)
- App-Version
- OS
- Letzter Login
- Status (OK / Verdächtig / Gebannt)
- Aktionen (Ban / Unban)

### Ban-Button

**Funktionalität:**
```javascript
async function banUser(userId, channelName) {
  const reason = prompt(`Grund für Ban von ${channelName}:`, 'Code-Manipulation / AGB-Verstoß');
  if (!reason) return;
  
  await db.collection('users').doc(userId).update({
    banned: true,
    banReason: reason,
    bannedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  alert(`✅ ${channelName} wurde gebannt`);
  loadUsers(); // Refresh
}
```

### Unban-Button

**Funktionalität:**
```javascript
async function unbanUser(userId, channelName) {
  if (!confirm(`Wirklich ${channelName} entbannen?`)) return;
  
  await db.collection('users').doc(userId).update({
    banned: false,
    banReason: firebase.firestore.FieldValue.delete(),
    bannedAt: firebase.firestore.FieldValue.delete()
  });
  
  alert(`✅ ${channelName} wurde entbannt`);
  loadUsers(); // Refresh
}
```

## 🚨 Ban-Gründe (Beispiele)

### Automatische Bans (Cloud Functions)
- "Code-Manipulation erkannt"
- "Ungültiger Code-Hash"

### Manuelle Bans (Admin)
- "AGB-Verstoß"
- "Missbrauch der App"
- "Spam / Belästigung"
- "Mehrfach-Accounts"
- "Betrug"

## 📧 Support-Kontakt

**User können sich wenden an:**

1. **Email:** streammatrix@web.de
2. **Discord:** https://discord.gg/streammatrix
   - Ticket im #support Channel öffnen
   - Admin wird benachrichtigt

## ✅ Best Practices

### Für Admins

1. **Immer Ban-Grund angeben**
   - Klar und präzise
   - Nachvollziehbar
   - Dokumentiert

2. **Vor Ban prüfen**
   - Ist es wirklich ein Verstoß?
   - Gibt es Beweise?
   - Ist eine Warnung ausreichend?

3. **Kommunikation**
   - User über Ban informieren (Email/Discord)
   - Einspruch-Möglichkeit geben
   - Fair bleiben

4. **Dokumentation**
   - Ban-Grund in Firestore
   - Zusätzliche Notizen in Admin-Tool
   - Screenshot bei Bedarf

### Für User

1. **Bei Ban:**
   - Ruhe bewahren
   - Support kontaktieren
   - Ban-Grund erfragen
   - Einspruch einlegen wenn berechtigt

2. **Vermeidung:**
   - AGBs einhalten
   - Keine Code-Manipulation
   - Keine Mehrfach-Accounts
   - Respektvoller Umgang

## 🔄 Workflow

### Ban-Prozess

```
1. Admin erkennt Verstoß
   ↓
2. Admin bannt User im Dashboard
   ↓
3. User wird in Firestore markiert
   ↓
4. User startet App / macht Login
   ↓
5. Ban-Prüfung schlägt an
   ↓
6. User wird ausgeloggt
   ↓
7. Ban-Nachricht wird angezeigt
   ↓
8. User kontaktiert Support
```

### Unban-Prozess

```
1. User kontaktiert Support
   ↓
2. Admin prüft Fall
   ↓
3. Admin entscheidet: Unban oder nicht
   ↓
4. Admin entbannt im Dashboard
   ↓
5. User wird in Firestore aktualisiert
   ↓
6. User kann sich wieder einloggen
   ↓
7. Voller Zugriff wiederhergestellt
```

## 🧪 Testing

### Test-Szenario 1: Ban

1. Öffne Admin-Dashboard
2. Banne Test-User
3. Starte App als Test-User
4. → Sollte sofort ausloggen
5. Versuche Login
6. → Sollte blockiert werden

### Test-Szenario 2: Unban

1. Entbanne Test-User im Dashboard
2. Starte App als Test-User
3. Login
4. → Sollte funktionieren
5. App läuft normal
6. → Voller Zugriff

## 📈 Monitoring

### Gebannte User finden

**Im Admin-Dashboard:**
- Filter: "Nur gebannte User"
- Sortierung: Nach Ban-Datum
- Export: CSV-Download

**In Firestore:**
```javascript
db.collection('users')
  .where('banned', '==', true)
  .orderBy('bannedAt', 'desc')
  .get()
```

### Statistiken

**Cloud Functions erstellen täglich:**
- Anzahl gebannter User
- Ban-Gründe (Verteilung)
- Unban-Rate
- Durchschnittliche Ban-Dauer

## ⚖️ Rechtliches

### DSGVO-Konformität

- ✅ User werden über Ban informiert
- ✅ Ban-Grund wird genannt
- ✅ Einspruch-Möglichkeit gegeben
- ✅ Daten können gelöscht werden (auf Anfrage)

### AGBs

**Wichtig in AGBs aufnehmen:**
- Gründe für Bans
- Ban-Prozess
- Einspruch-Möglichkeit
- Dauer von Bans
- Löschung von Daten

## 🎯 Zusammenfassung

**Das Ban-System ist:**
- ✅ Vollständig funktionsfähig
- ✅ Sofort wirksam
- ✅ Reversibel (Unban möglich)
- ✅ Transparent (Ban-Grund sichtbar)
- ✅ Fair (Support-Kontakt möglich)
- ✅ DSGVO-konform

**User-Erfahrung:**
- Klare Kommunikation
- Kontakt-Möglichkeiten
- Einspruch möglich
- Schnelle Reaktion

**Admin-Erfahrung:**
- Einfache Bedienung
- Ein-Klick Ban/Unban
- Übersichtliche Liste
- Automatische Bans bei Manipulation
