# 🗑️ Alte GitHub Releases löschen

## 🎯 Ziel: Nur 3 Releases behalten

**Behalten:**
- ✅ v1.4.8 (neueste)
- ✅ v1.4.7
- ✅ v1.4.6

**Löschen:**
- ❌ v1.4.5
- ❌ v1.4.4
- ❌ Alle älteren

---

## 🚀 Option 1: Automatisches Script (empfohlen)

### Voraussetzung: GitHub CLI installiert

**Prüfe ob installiert:**
```powershell
gh --version
```

**Falls nicht installiert:**
- Download: https://cli.github.com/
- Oder: `winget install GitHub.cli`

**Login (falls noch nicht):**
```powershell
gh auth login
```

### Script ausführen:

```powershell
.\cleanup-old-releases.ps1
```

**Das Script:**
1. Zeigt alle Releases an
2. Fragt nach Bestätigung
3. Löscht alle außer v1.4.8, v1.4.7, v1.4.6
4. Zeigt verbleibende Releases

---

## 🖱️ Option 2: Manuell über GitHub Website

### Schritt-für-Schritt:

1. **Gehe zu Releases:**
   ```
   https://github.com/19bounty9317/StreamMatrix/releases
   ```

2. **Für jedes alte Release (v1.4.5, v1.4.4, etc.):**
   
   a) Klicke auf den Release-Titel
   
   b) Klicke rechts oben auf **"..."** (3 Punkte)
   
   c) Wähle **"Delete release"**
   
   d) Bestätige mit **"Delete this release"**

3. **Wiederhole für alle alten Releases**

### Zu löschende Releases:

- [ ] v1.4.5
- [ ] v1.4.4
- [ ] v1.4.3 (falls vorhanden)
- [ ] v1.4.2 (falls vorhanden)
- [ ] v1.4.1 (falls vorhanden)
- [ ] v1.4.0 (falls vorhanden)
- [ ] Alle älteren

---

## 🔍 Option 3: GitHub CLI (manuell)

### Einzelne Releases löschen:

```powershell
# v1.4.5 löschen
gh release delete v1.4.5 --repo 19bounty9317/StreamMatrix --yes

# v1.4.4 löschen
gh release delete v1.4.4 --repo 19bounty9317/StreamMatrix --yes

# Weitere...
```

### Alle Releases anzeigen:

```powershell
gh release list --repo 19bounty9317/StreamMatrix
```

---

## ⚠️ Wichtige Hinweise:

### Was wird gelöscht?
- ✅ Der Release (Beschreibung, Binaries)
- ❌ **NICHT** der Git Tag (bleibt erhalten)

### Git Tags bleiben erhalten!
Die Tags (v1.4.5, v1.4.4, etc.) bleiben im Repository.
Das ist OK und normal.

### Falls du auch Tags löschen willst:

```powershell
# Lokal löschen
git tag -d v1.4.5

# Remote löschen
git push origin :refs/tags/v1.4.5
```

**Aber:** Tags zu löschen ist **nicht nötig** und kann Probleme verursachen!

---

## ✅ Prüfen ob erfolgreich:

### Website prüfen:
```
https://github.com/19bounty9317/StreamMatrix/releases
```

**Sollte zeigen:**
- v1.4.8
- v1.4.7
- v1.4.6
- (Keine älteren)

### CLI prüfen:
```powershell
gh release list --repo 19bounty9317/StreamMatrix
```

---

## 🐛 Troubleshooting:

### "gh: command not found"
- GitHub CLI nicht installiert
- Installiere von: https://cli.github.com/

### "HTTP 404: Not Found"
- Nicht eingeloggt: `gh auth login`
- Oder: Falscher Repository-Name

### "Release not found"
- Release wurde bereits gelöscht
- Oder: Falsche Version angegeben

### "Permission denied"
- Nicht als Owner eingeloggt
- Login prüfen: `gh auth status`

---

## 📝 Nach dem Löschen:

### Dokumentation aktualisieren:

Alte Release-Docs archivieren:
```powershell
mkdir -p archive/releases
mv GITHUB-RELEASE-v1.4.5.md archive/releases/
mv GITHUB-RELEASE-v1.4.4.md archive/releases/
```

### Commit:
```powershell
git add archive/
git commit -m "Archive old release docs"
git push
```

---

## ✅ Fertig!

Nach dem Cleanup:
- ✅ Nur 3 Releases auf GitHub
- ✅ Übersichtlicher für Nutzer
- ✅ Weniger Verwirrung
- ✅ Aktuellste Versionen prominent

**Cleanup abgeschlossen!** 🎉
