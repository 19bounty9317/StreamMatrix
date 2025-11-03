# 🧪 Auto-Update Testen - Anleitung

## ⚠️ WICHTIG: Auto-Update funktioniert NUR in installierten Apps!

Auto-Update funktioniert **NICHT** wenn du die App mit `npm run dev` startest!

## 📋 Voraussetzungen

1. ✅ GitHub Release muss **published** sein (nicht draft)
2. ✅ Release muss **public** sein
3. ✅ `.exe` Datei muss hochgeladen sein
4. ✅ App muss **installiert** sein (nicht Development-Modus)

## 🔧 Test-Setup

### Schritt 1: Baue v1.3.2 (alte Version)
```bash
# Ändere Version in package.json auf 1.3.2
npm run build:win
```

### Schritt 2: Installiere v1.3.2
1. Gehe zu `release` Ordner
2. Führe `StreamMatrix Setup 1.3.2.exe` aus
3. Installiere die App
4. **Schließe die App** nach Installation

### Schritt 3: Erstelle GitHub Release v1.3.3
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases/new
2. **Tag**: `v1.3.3`
3. **Title**: `StreamMatrix v1.3.3`
4. **Upload**: `StreamMatrix Setup 1.3.3.exe`
5. **Publish release** (NICHT als Draft!)

### Schritt 4: Teste Auto-Update
1. **Starte die installierte App** (aus Startmenü oder Desktop)
2. **Öffne DevTools**: Drücke F12
3. **Schaue in Console** nach Logs:
   ```
   🔄 Auto-Update aktiviert
   📦 Repository: 19bounty9317/StreamMatrix
   📍 App-Version: 1.3.2
   🔍 Erste Update-Prüfung...
   ```

4. **Öffne Settings** → Updates
5. **Klicke** "Nach Updates suchen"
6. **Erwarte in Console**:
   ```
   🔍 Manuelle Update-Prüfung gestartet...
   📍 Aktuelle Version: 1.3.2
   📦 Prüfe: https://github.com/19bounty9317/StreamMatrix/releases
   ✅ Update verfügbar: 1.3.3
   ```

7. **Erwarte im UI**:
   - 🔍 "Suche nach Updates..."
   - 🎉 "Update 1.3.3 verfügbar! Download startet..."
   - 📥 "Update wird heruntergeladen: X%"
   - ✅ "Update 1.3.3 bereit zur Installation!"

8. **Dialog erscheint**: "Update bereit"
9. **Klicke** "Jetzt neu starten"
10. **App startet neu** mit v1.3.3

## 🐛 Fehlerbehebung

### "Auto-Update ist im Development-Modus deaktiviert"
**Problem**: Du startest die App mit `npm run dev`  
**Lösung**: Installiere die App mit dem Installer

### "Keine Updates verfügbar" obwohl v1.3.3 existiert
**Mögliche Ursachen**:
1. Release ist noch Draft → Publish Release
2. Release ist Private → Mache Public
3. Version in package.json ist falsch → Prüfe Version
4. `.exe` Datei fehlt → Lade hoch

### Console zeigt Fehler
**Prüfe**:
1. Internet-Verbindung
2. GitHub ist erreichbar
3. Repository-Name ist korrekt (19bounty9317/StreamMatrix)
4. Release ist published

### Update wird nicht heruntergeladen
**Prüfe**:
1. Firewall blockiert Download
2. Antivirus blockiert Download
3. Nicht genug Speicherplatz
4. GitHub API Rate Limit erreicht

## 📊 Erwartete Console-Logs

### Erfolgreicher Update-Check:
```
🔄 Auto-Update aktiviert
📦 Repository: 19bounty9317/StreamMatrix
📍 App-Version: 1.3.2
🔍 Erste Update-Prüfung...
✅ Update verfügbar: 1.3.3
📥 Download: 0%
📥 Download: 25%
📥 Download: 50%
📥 Download: 75%
📥 Download: 100%
✅ Update heruntergeladen: 1.3.3
```

### Kein Update verfügbar:
```
🔄 Auto-Update aktiviert
📦 Repository: 19bounty9317/StreamMatrix
📍 App-Version: 1.3.3
🔍 Erste Update-Prüfung...
✅ Keine Updates verfügbar
```

### Development-Modus:
```
⚠️ Auto-Update ist im Development-Modus deaktiviert
💡 Installiere die App mit dem Installer um Updates zu testen
```

## ✅ Test-Checkliste

- [ ] v1.3.2 gebaut
- [ ] v1.3.2 installiert (mit Installer!)
- [ ] App geschlossen
- [ ] GitHub Release v1.3.3 erstellt
- [ ] Release ist published (nicht draft)
- [ ] .exe hochgeladen
- [ ] App gestartet (installierte Version!)
- [ ] DevTools geöffnet (F12)
- [ ] Console zeigt "Auto-Update aktiviert"
- [ ] "Nach Updates suchen" geklickt
- [ ] Update gefunden
- [ ] Download gestartet
- [ ] Dialog erschienen
- [ ] "Jetzt neu starten" geklickt
- [ ] App neu gestartet
- [ ] Footer zeigt v1.3.3
- [ ] Settings zeigt v1.3.3

## 🎯 Zusammenfassung

**Auto-Update funktioniert nur wenn:**
1. ✅ App ist **installiert** (nicht `npm run dev`)
2. ✅ GitHub Release ist **published**
3. ✅ Release ist **public**
4. ✅ `.exe` ist hochgeladen
5. ✅ Version ist höher als aktuelle

**Teste immer mit installierter App, nicht im Development-Modus!**
