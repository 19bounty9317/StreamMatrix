# 📥 Download-Anleitung - StreamMatrix

## ⚠️ Wichtig: Windows Defender Warnung

StreamMatrix ist **nicht code-signiert** (kostet ~300€/Jahr). Deshalb erscheinen Sicherheitswarnungen.

**Die App ist sicher!** Sie enthält keinen schädlichen Code.

---

## 🌐 Download-Methoden

### Methode 1: Direkter Download (Empfohlen)

#### Schritt 1: Download starten
1. Klicke auf den Download-Link
2. Datei: `StreamMatrix Setup 1.3.0.exe` (74 MB)

#### Schritt 2: Browser-Warnung umgehen

**Chrome:**
```
1. Download wird blockiert
2. Klicke auf "^" (Pfeil nach oben) neben der Warnung
3. Klicke "Trotzdem behalten"
4. Bestätige mit "Behalten"
```

**Edge:**
```
1. Download wird blockiert
2. Klicke auf "..." (Drei Punkte)
3. Klicke "Trotzdem herunterladen"
4. Bestätige mit "Trotzdem herunterladen"
```

**Firefox:**
```
1. Download wird blockiert
2. Klicke auf "Downloads anzeigen"
3. Rechtsklick auf die Datei
4. Klicke "Datei entsperren"
```

#### Schritt 3: Windows Defender umgehen
```
1. Doppelklick auf die heruntergeladene EXE
2. Windows Defender Warnung erscheint:
   "Windows hat den PC geschützt"
3. Klicke "Weitere Informationen"
4. Klicke "Trotzdem ausführen"
5. Installation startet
```

---

### Methode 2: ZIP-Download (Alternative)

Wenn der direkte Download abbricht:

1. **Download:** `StreamMatrix-v1.3.0.zip`
2. **Entpacken:** Rechtsklick → "Alle extrahieren"
3. **Ausführen:** `StreamMatrix Setup 1.3.0.exe`
4. **Windows Defender:** Siehe Schritt 3 oben

**Vorteil:** ZIP-Dateien werden seltener blockiert

---

### Methode 3: Portable Version (Ohne Installer)

Für Nutzer die keine Installation wollen:

1. **Download:** `StreamMatrix-Portable-v1.3.0.zip`
2. **Entpacken:** In einen Ordner deiner Wahl
3. **Ausführen:** `StreamMatrix.exe` direkt
4. **Keine Installation** nötig

**Vorteil:** Keine Admin-Rechte erforderlich

---

## 🔐 Sicherheit verifizieren

### SHA-256 Hash prüfen

**Windows PowerShell:**
```powershell
Get-FileHash "StreamMatrix Setup 1.3.0.exe" -Algorithm SHA256
```

**Erwarteter Hash:**
```
AC329E4312A5B78FC75296B93B0BAB2366A8F29745DC0A751A1D98138B5B96DC
```

**Wenn der Hash übereinstimmt:** Datei ist original und unverändert!

---

## 🐛 Probleme beim Download

### Problem 1: Download bricht ab
**Ursache:** Browser oder Antivirus blockiert

**Lösung:**
1. Versuche anderen Browser (Chrome → Firefox)
2. Deaktiviere Antivirus temporär
3. Nutze ZIP-Version
4. Nutze Portable-Version

### Problem 2: "Datei ist beschädigt"
**Ursache:** Download wurde unterbrochen

**Lösung:**
1. Lösche die Datei
2. Leere Browser-Cache
3. Download erneut starten
4. Prüfe SHA-256 Hash

### Problem 3: Antivirus löscht Datei
**Ursache:** False-Positive (Fehlalarm)

**Lösung:**
1. Füge Ausnahme in Antivirus hinzu
2. Ordner: `C:\Users\[Dein Name]\Downloads`
3. Datei: `StreamMatrix Setup 1.3.0.exe`
4. Download erneut

### Problem 4: "Keine Berechtigung"
**Ursache:** Keine Admin-Rechte

**Lösung:**
1. Rechtsklick auf EXE
2. "Als Administrator ausführen"
3. Oder: Nutze Portable-Version

---

## 📋 Schritt-für-Schritt (Komplett)

### Für Anfänger:

**1. Download**
- Klicke auf Download-Link
- Warte bis Download fertig (74 MB)

**2. Browser-Warnung**
- Chrome: "Trotzdem behalten"
- Edge: "Trotzdem herunterladen"
- Firefox: "Datei entsperren"

**3. Datei finden**
- Öffne Downloads-Ordner
- Suche: `StreamMatrix Setup 1.3.0.exe`

**4. Ausführen**
- Doppelklick auf die Datei
- Windows Defender Warnung erscheint

**5. Windows Defender**
- Klicke "Weitere Informationen"
- Klicke "Trotzdem ausführen"

**6. Installation**
- Folge dem Installations-Assistenten
- Wähle Installationsordner
- Klicke "Installieren"

**7. Fertig!**
- App startet automatisch
- Melde dich mit Twitch an
- Viel Spaß! 🎉

---

## ❓ Häufige Fragen

**Q: Ist die App wirklich sicher?**  
A: Ja! Der Code ist Open-Source und kann geprüft werden. Die Warnungen erscheinen nur weil die App nicht code-signiert ist (kostet 300€/Jahr).

**Q: Warum nicht code-signieren?**  
A: Code-Signierung kostet ~300€/Jahr. Für ein kostenloses Open-Source-Projekt ist das zu teuer.

**Q: Kann ich den Quellcode sehen?**  
A: Ja! Der komplette Code ist verfügbar und kann geprüft werden.

**Q: Wird mein Antivirus die App löschen?**  
A: Möglich. Füge eine Ausnahme hinzu oder deaktiviere ihn temporär beim Download.

**Q: Gibt es eine Mac/Linux Version?**  
A: Aktuell nur Windows. Mac/Linux sind geplant.

**Q: Muss ich bei jedem Update neu herunterladen?**  
A: Ja, aktuell gibt es keine Auto-Update-Funktion. Geplant für v1.4.0.

---

## 🔗 Alternative Download-Quellen

### GitHub Releases (Empfohlen)
```
https://github.com/[dein-repo]/releases
```
- Automatische Virus-Scans
- Vertrauenswürdig
- Keine Download-Limits

### Dropbox
```
https://dropbox.com/[dein-link]
```
- Einfach zu teilen
- Keine Registrierung nötig

### Google Drive
```
https://drive.google.com/[dein-link]
```
- Große Dateien möglich
- Einfaches Teilen

---

## 📞 Support

### Bei Problemen:
1. Prüfe diese Anleitung nochmal
2. Versuche andere Download-Methode
3. Prüfe SHA-256 Hash
4. Kontaktiere Support

### Bekannte Probleme:
- ⚠️ Windows Defender Warnung (normal)
- ⚠️ Browser blockiert Download (normal)
- ⚠️ Antivirus löscht Datei (Fehlalarm)

**Alle Warnungen sind normal und können ignoriert werden!**

---

## ✅ Checkliste

- [ ] Download gestartet
- [ ] Browser-Warnung umgangen
- [ ] Datei heruntergeladen (74 MB)
- [ ] SHA-256 Hash geprüft (optional)
- [ ] Windows Defender umgangen
- [ ] Installation gestartet
- [ ] App läuft
- [ ] Mit Twitch angemeldet
- [ ] Fertig! 🎉

---

**Viel Erfolg beim Download!** 📥✨
