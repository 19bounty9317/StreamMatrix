# Automatisches Release-Cleanup

## 🗑️ Übersicht

GitHub Actions löscht automatisch alte Releases und behält nur die **3 neuesten Versionen**.

## ✨ Features

- ✅ **Automatisch**: Läuft bei jedem neuen Release
- ✅ **Behält 3 neueste**: Immer die aktuellsten Versionen verfügbar
- ✅ **Löscht alte**: Releases UND Git-Tags werden entfernt
- ✅ **Manuell auslösbar**: Kann auch manuell gestartet werden
- ✅ **Sicher**: Nur alte Releases werden gelöscht

## 🔄 Wie es funktioniert

### Automatisch

**Bei jedem neuen Release:**
1. Neues Release wird veröffentlicht
2. GitHub Actions startet automatisch
3. Alle Releases werden geholt
4. Nach Datum sortiert (neueste zuerst)
5. Die 3 neuesten werden behalten
6. Alle älteren werden gelöscht
7. Git-Tags werden auch entfernt

### Manuell

**Manuelles Auslösen:**
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/actions
2. Wähle "Cleanup Old Releases"
3. Klicke "Run workflow"
4. Wähle Branch "main"
5. Klicke "Run workflow"

## 📋 Beispiel

**Vor dem Cleanup:**
- v1.4.7 (neueste)
- v1.4.6
- v1.4.5
- v1.4.4
- v1.4.3
- v1.4.2
- v1.4.1
- v1.4.0

**Nach dem Cleanup:**
- v1.4.7 ✅ (behalten)
- v1.4.6 ✅ (behalten)
- v1.4.5 ✅ (behalten)
- v1.4.4 ❌ (gelöscht)
- v1.4.3 ❌ (gelöscht)
- v1.4.2 ❌ (gelöscht)
- v1.4.1 ❌ (gelöscht)
- v1.4.0 ❌ (gelöscht)

## 🔧 Konfiguration

### Anzahl der behaltenen Releases ändern

In `.github/workflows/cleanup-old-releases.yml`:

```yaml
# Behalte nur die 3 neuesten
const keepCount = 3;  // ← Hier ändern (z.B. auf 5)
```

### Workflow deaktivieren

**Option 1: Workflow löschen**
```bash
git rm .github/workflows/cleanup-old-releases.yml
git commit -m "Disable release cleanup"
git push
```

**Option 2: In GitHub deaktivieren**
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/actions
2. Wähle "Cleanup Old Releases"
3. Klicke "..." (oben rechts)
4. Klicke "Disable workflow"

## 📊 Logs

**Logs anzeigen:**
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/actions
2. Wähle "Cleanup Old Releases"
3. Klicke auf den letzten Run
4. Klicke auf "cleanup"

**Beispiel-Log:**
```
📦 Hole alle Releases für 19bounty9317/StreamMatrix...
✅ 8 Releases gefunden

🔒 Behalte die 3 neuesten Releases:
  1. v1.4.7 (StreamMatrix v1.4.7 - Analytics & Ban-System)
  2. v1.4.6 (StreamMatrix v1.4.6 - Stability Update)
  3. v1.4.5 (StreamMatrix v1.4.5 - Bug Fixes)

🗑️ Lösche 5 alte Releases:
  ❌ Lösche: v1.4.4 (StreamMatrix v1.4.4)
    ✅ Tag v1.4.4 gelöscht
  ❌ Lösche: v1.4.3 (StreamMatrix v1.4.3)
    ✅ Tag v1.4.3 gelöscht
  ❌ Lösche: v1.4.2 (StreamMatrix v1.4.2)
    ✅ Tag v1.4.2 gelöscht
  ❌ Lösche: v1.4.1 (StreamMatrix v1.4.1)
    ✅ Tag v1.4.1 gelöscht
  ❌ Lösche: v1.4.0 (StreamMatrix v1.4.0)
    ✅ Tag v1.4.0 gelöscht

✅ Cleanup abgeschlossen!
📊 Verbleibende Releases: 3
```

## ⚠️ Wichtige Hinweise

### Was wird gelöscht?
- ✅ Release auf GitHub
- ✅ Git-Tag
- ✅ Release-Assets (Installer, etc.)
- ✅ Release-Notes

### Was wird NICHT gelöscht?
- ❌ Git-Commits (bleiben erhalten)
- ❌ Code im Repository
- ❌ Branches

### Wiederherstellung

**Gelöschte Releases können NICHT wiederhergestellt werden!**

Aber du kannst ein neues Release mit dem gleichen Tag erstellen:
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases/new
2. Tag: `v1.4.4` (oder welche Version)
3. Target: Wähle den Commit
4. Titel und Beschreibung eingeben
5. Assets hochladen
6. Publish

## 🎯 Best Practices

### Wann sollte man mehr als 3 Releases behalten?

**Behalte 5+ Releases wenn:**
- Viele User nutzen alte Versionen
- Breaking Changes zwischen Versionen
- Downgrade-Möglichkeit wichtig ist

**Behalte 3 Releases wenn:**
- Auto-Update funktioniert gut
- User sind meist auf neuester Version
- Wenig Speicherplatz auf GitHub

### Empfehlung für StreamMatrix

**Aktuell: 3 Releases** ✅

**Warum?**
- Auto-Update funktioniert
- User updaten schnell
- Weniger Verwirrung
- Übersichtliche Release-Liste

## 🔄 Workflow-Trigger

### Automatisch

**Trigger:**
```yaml
on:
  release:
    types: [published]
```

**Wann:** Bei jedem neuen Release

### Manuell

**Trigger:**
```yaml
on:
  workflow_dispatch:
```

**Wann:** Manuell über GitHub Actions UI

## 📈 Statistiken

**Vorteile:**
- ✅ Übersichtliche Release-Liste
- ✅ Weniger Verwirrung für User
- ✅ Automatische Wartung
- ✅ Kein manuelles Löschen nötig

**Nachteile:**
- ❌ Alte Versionen nicht mehr verfügbar
- ❌ Downgrade schwieriger
- ❌ Historische Releases verloren

## 🛠️ Troubleshooting

### Workflow läuft nicht

**Problem:** Workflow startet nicht bei neuem Release

**Lösung:**
1. Prüfe ob Workflow aktiviert ist
2. Prüfe GitHub Actions Permissions
3. Prüfe Workflow-Syntax

### Fehler beim Löschen

**Problem:** "Resource not accessible by integration"

**Lösung:**
1. Gehe zu: Settings → Actions → General
2. Workflow permissions: "Read and write permissions"
3. Speichern

### Zu viele Releases gelöscht

**Problem:** Mehr als gewollt gelöscht

**Lösung:**
1. Ändere `keepCount` in Workflow
2. Erstelle gelöschte Releases neu (siehe Wiederherstellung)

## ✅ Zusammenfassung

**Das Cleanup-System:**
- Läuft automatisch bei jedem Release
- Behält die 3 neuesten Versionen
- Löscht alte Releases und Tags
- Kann manuell ausgelöst werden
- Ist konfigurierbar

**Für StreamMatrix:**
- Perfekt für Auto-Update-Szenario
- Hält Release-Liste übersichtlich
- Reduziert Wartungsaufwand
- Verhindert Verwirrung bei Usern

**Aktivierung:**
- Workflow ist bereits committed
- Läuft beim nächsten Release automatisch
- Keine weitere Konfiguration nötig
