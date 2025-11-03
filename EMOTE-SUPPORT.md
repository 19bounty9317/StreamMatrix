# 😀 Emote-Unterstützung in StreamMatrix

## Unterstützte Emote-Plattformen

StreamMatrix unterstützt **alle gängigen Emote-Plattformen**:

### ✅ Twitch Native
- **Global Emotes**: Kappa, LUL, PogChamp, etc.
- **Channel Emotes**: Alle Subscriber-Emotes deines Channels
- **Bits Emotes**: Cheer-Emotes

### ✅ BetterTTV (BTTV)
- **Global Emotes**: monkaS, KEKW, Sadge, etc.
- **Channel Emotes**: Channel-spezifische BTTV-Emotes
- **Shared Emotes**: Von anderen Channels geteilte Emotes

### ✅ FrankerFaceZ (FFZ)
- **Channel Emotes**: FFZ-Emotes deines Channels
- **Global Emotes**: FFZ Global Emotes

### ✅ 7TV
- **Global Emotes**: 7TV Global Emotes
- **Channel Emotes**: 7TV Channel Emotes

## Wie funktioniert es?

### Automatisches Laden
Beim Start des Chats werden **automatisch alle Emotes geladen**:
1. Twitch Global Emotes
2. Twitch Channel Emotes (dein Channel)
3. BTTV Global + Channel Emotes
4. FFZ Channel Emotes
5. 7TV Global + Channel Emotes

### Anzeige im Chat
- **Emotes werden als Bilder angezeigt** (28px Höhe)
- **Hover-Tooltip** zeigt den Emote-Namen
- **Inline-Darstellung** mit Text gemischt
- **Automatische Erkennung** in Chat-Nachrichten

## Beispiele

### Twitch Emotes
```
Kappa → 🖼️ (Twitch Kappa Emote)
LUL → 🖼️ (Twitch LUL Emote)
PogChamp → 🖼️ (Twitch PogChamp Emote)
```

### BTTV Emotes
```
monkaS → 🖼️ (BTTV monkaS Emote)
KEKW → 🖼️ (BTTV KEKW Emote)
Sadge → 🖼️ (BTTV Sadge Emote)
```

### Gemischte Nachrichten
```
"Das war PogChamp KEKW" → "Das war 🖼️ 🖼️"
```

## Technische Details

### EmoteService
- **Singleton-Pattern**: Ein Service für alle Emotes
- **Caching**: Emotes werden einmal geladen und gecacht
- **Performance**: Schnelles Parsing mit Map-Datenstruktur

### Parsing-Logik
1. **Twitch IRC Tags**: Native Emotes aus IRC-Nachricht
2. **Position-basiert**: Exakte Position im Text
3. **Third-Party**: Wort-basierte Erkennung
4. **Priorität**: Twitch > BTTV > FFZ > 7TV

### API-Endpunkte
```typescript
// Twitch Global
GET https://api.twitch.tv/helix/chat/emotes/global

// Twitch Channel
GET https://api.twitch.tv/helix/chat/emotes?broadcaster_id={id}

// BTTV Global
GET https://api.betterttv.net/3/cached/emotes/global

// BTTV Channel
GET https://api.betterttv.net/3/cached/users/twitch/{id}

// FFZ Channel
GET https://api.frankerfacez.com/v1/room/id/{id}

// 7TV Global
GET https://7tv.io/v3/emote-sets/global

// 7TV Channel
GET https://7tv.io/v3/users/twitch/{username}
```

## Fehlerbehebung

### Emotes werden nicht angezeigt
1. **Prüfe Console**: Öffne DevTools (F12) und prüfe Fehler
2. **Token gültig**: Stelle sicher, dass dein Twitch-Token gültig ist
3. **Internet**: Emotes werden von externen APIs geladen
4. **Channel-ID**: Stelle sicher, dass die Channel-ID korrekt ist

### Nur Twitch-Emotes funktionieren
- **BTTV/FFZ/7TV**: Diese APIs können manchmal langsam sein
- **Warte 5-10 Sekunden** nach Chat-Start
- **Prüfe Console**: Schaue nach Fehlermeldungen

### Performance-Probleme
- **Zu viele Emotes**: Bei sehr vielen Emotes kann das Laden länger dauern
- **Lösung**: Emotes werden gecacht, nur beim ersten Laden langsam

## Zukünftige Features

- [ ] **Emote-Picker**: UI zum Auswählen von Emotes
- [ ] **Emote-Autocomplete**: Vorschläge beim Tippen
- [ ] **Animated Emotes**: Unterstützung für GIF-Emotes
- [ ] **Custom Emote-Größe**: Einstellbare Emote-Größe
- [ ] **Emote-Statistiken**: Meist verwendete Emotes

## Code-Beispiel

```typescript
import { emoteService } from './services/EmoteService';

// Lade Emotes
await emoteService.loadEmotes(channelId, channelName);

// Parse Nachricht mit Emotes
const html = emoteService.parseMessageWithEmotes(
  "Kappa KEKW PogChamp",
  "25:0-4" // Twitch IRC Emote-Tags
);

// Ergebnis: HTML mit <img> Tags für Emotes
```

---

**Version**: 1.3.2  
**Letzte Aktualisierung**: November 2025
