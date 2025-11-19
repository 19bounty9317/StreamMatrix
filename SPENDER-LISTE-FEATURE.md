# 💜 Spender-Liste Feature

## ✅ Was wurde implementiert:

### Neues Segment in den Einstellungen:
- **💜 Unterstütze StreamMatrix** Sektion
- Erklärung warum Spenden benötigt werden
- PayPal Spenden-Button
- Dankes-Bereich für Spender

## 🎯 Features:

### 1. **Erklärung (kurz & präzise):**
```
StreamMatrix ist 100% kostenlos und Open Source.

Ich entwickle diese App in meiner Freizeit, um Streamern zu helfen. 
Um die Windows-Sicherheitswarnung beim Download zu entfernen, 
benötige ich ein Code-Signierungszertifikat (300€/Jahr).

Mit deiner Spende hilfst du, die App professioneller zu machen!
```

### 2. **Spenden-Button:**
- Lila Gradient (StreamMatrix-Farben)
- Hover-Effekt (hebt sich an)
- Öffnet PayPal in neuem Tab
- Link: https://www.paypal.com/donate?campaign_id=F69NRSXHU8W7N

### 3. **Spender-Liste:**
- Dankes-Box mit Gradient-Hintergrund
- Platzhalter: "Noch keine Spenden erhalten. Sei der Erste! 🌟"
- Bereit für dynamische Daten

## 🔧 Spender-Liste dynamisch machen:

### Option 1: Manuell pflegen (einfach)

Ersetze in `Settings.tsx`:

```tsx
<div className="text-xs theme-text-secondary italic">
  Noch keine Spenden erhalten. Sei der Erste! 🌟
</div>
```

Mit:

```tsx
<div className="space-y-1">
  <div className="flex items-center gap-2">
    <span>💝</span>
    <span className="theme-text">MaxMustermann</span>
    <span className="theme-text-secondary">- 10€</span>
  </div>
  <div className="flex items-center gap-2">
    <span>💝</span>
    <span className="theme-text">JohnDoe</span>
    <span className="theme-text-secondary">- 25€</span>
  </div>
</div>
```

### Option 2: Aus localStorage (dynamisch)

1. **Spender hinzufügen:**
```typescript
// In Settings.tsx
const [donors, setDonors] = useState<Array<{name: string, amount: number}>>(() => {
  const saved = localStorage.getItem('donors-list');
  return saved ? JSON.parse(saved) : [];
});

const addDonor = (name: string, amount: number) => {
  const newDonors = [...donors, { name, amount }];
  setDonors(newDonors);
  localStorage.setItem('donors-list', JSON.stringify(newDonors));
};
```

2. **Anzeigen:**
```tsx
{donors.length === 0 ? (
  <div className="text-xs theme-text-secondary italic">
    Noch keine Spenden erhalten. Sei der Erste! 🌟
  </div>
) : (
  <div className="space-y-1">
    {donors.map((donor, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <span>💝</span>
        <span className="theme-text">{donor.name}</span>
        <span className="theme-text-secondary">- {donor.amount}€</span>
      </div>
    ))}
  </div>
)}
```

3. **Spender manuell hinzufügen (Dev-Tools):**
```javascript
// In Browser Console
localStorage.setItem('donors-list', JSON.stringify([
  { name: 'MaxMustermann', amount: 10 },
  { name: 'JohnDoe', amount: 25 },
  { name: 'Anonymous', amount: 5 }
]));
```

### Option 3: PayPal API (automatisch)

**Hinweis:** PayPal API ist komplex und benötigt Backend!

1. **PayPal Webhooks einrichten**
2. **Backend erstellt** (Node.js/Express)
3. **Webhook empfängt** Spenden-Events
4. **Speichert in Datenbank**
5. **App lädt** Spender-Liste von API

**Zu komplex für den Anfang!** Bleib bei Option 1 oder 2.

## 🎨 Design:

```
┌─────────────────────────────────────┐
│ 💜 Unterstütze StreamMatrix         │
├─────────────────────────────────────┤
│                                     │
│ StreamMatrix ist 100% kostenlos... │
│ [Erklärung]                         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💜 Jetzt spenden via PayPal     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Jeder Betrag hilft! ☕              │
│                                     │
├─────────────────────────────────────┤
│ 🙏 Vielen Dank an alle Unterstützer!│
│                                     │
│ 💝 Spender-Liste:                   │
│ ┌─────────────────────────────────┐ │
│ │ Noch keine Spenden...           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ❤️ Danke für deine Unterstützung!   │
└─────────────────────────────────────┘
```

## 📝 Spender-Etikette:

### Was anzeigen:
- ✅ Vorname oder Nickname (mit Erlaubnis!)
- ✅ Betrag (optional)
- ✅ "Anonymous" für anonyme Spender

### Was NICHT anzeigen:
- ❌ Volle Namen ohne Erlaubnis
- ❌ E-Mail-Adressen
- ❌ PayPal-IDs
- ❌ Persönliche Daten

### Beispiel-Einträge:
```
💝 Max M. - 10€
💝 Anonymous - 25€
💝 StreamerPro - 50€
💝 Community Member - 5€
```

## 🚀 Verwendung:

### Für Nutzer:
1. Öffne **Einstellungen** (⚙️)
2. Scrolle zu **💜 Unterstütze StreamMatrix**
3. Lies die Erklärung
4. Klicke **💜 Jetzt spenden via PayPal**
5. Spende beliebigen Betrag
6. Danke! ❤️

### Für Entwickler (Spender hinzufügen):
1. Öffne `src/components/Settings.tsx`
2. Suche nach `{/* TODO: Später dynamisch aus localStorage laden */}`
3. Ersetze mit Spender-Liste (siehe Option 1 oder 2)
4. Commit & Push

## 💡 Ideen für später:

### Spender-Belohnungen:
- **5€+:** Name in Credits
- **25€+:** Exklusives Discord-Role
- **50€+:** Feature-Request-Priorität
- **100€+:** Persönliches Dankeschön

### Fortschrittsanzeige:
```tsx
<div className="mb-3">
  <div className="flex justify-between text-xs mb-1">
    <span>Fortschritt</span>
    <span>150€ / 300€</span>
  </div>
  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
      style={{ width: '50%' }}
    />
  </div>
</div>
```

### Spender-Statistiken:
- Anzahl Spender
- Gesamtbetrag
- Durchschnittsspende
- Ziel-Fortschritt

## ✅ Fertig!

Das Spenden-Segment ist jetzt in den Einstellungen verfügbar! 🎉

**Teste es:**
1. Starte die App
2. Öffne Einstellungen
3. Scrolle zu "💜 Unterstütze StreamMatrix"
4. Klicke auf den Spenden-Button

Viel Erfolg mit der Kampagne! 💜🚀
