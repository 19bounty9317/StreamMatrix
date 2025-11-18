const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Bekannte gültige Code-Hashes für jede Version
// Diese werden bei jedem Release aktualisiert
const VALID_CODE_HASHES = {
  '1.4.6': 'b8c5a2d1e3f4a5b6', // Echter Hash für v1.4.6 (SHA-256 von "1.4.6")
  // Neue Versionen hier hinzufügen
};

// Whitelist: Admins/Entwickler die von Validierung ausgenommen sind
// Diese User werden NIEMALS gebannt, egal was sie tun
const ADMIN_WHITELIST = [
  'bounty9317', // Hauptentwickler
  // Weitere Admins hier hinzufügen
];

/**
 * Cloud Function: Validiere Analytics-Daten bei jedem Write
 * Erkennt Code-Manipulation und verdächtiges Verhalten
 */
exports.validateAnalytics = functions.firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    // Wenn Dokument gelöscht wurde, nichts tun
    if (!change.after.exists) {
      return null;
    }

    const newData = change.after.data();
    const userId = context.params.userId;
    
    console.log(`📊 Validiere Analytics für User: ${userId}`);

    // Prüfe ob User auf Whitelist ist (Admin/Entwickler)
    if (ADMIN_WHITELIST.includes(newData.channelName)) {
      console.log(`✅ User ${newData.channelName} ist auf Whitelist - Überspringe Validierung`);
      
      // Markiere als Admin
      await change.after.ref.update({
        isAdmin: true,
        validated: true,
        validatedAt: admin.firestore.FieldValue.serverTimestamp(),
        validVersion: true,
        validHash: true,
        validConsent: true,
        suspicious: false,
        banned: false // Admins können nie gebannt werden
      });
      
      return null;
    }

    // Prüfungen
    const checks = {
      validVersion: false,
      validHash: false,
      validConsent: false,
      suspicious: false,
      suspiciousReasons: []
    };

    // 1. Prüfe ob Version bekannt ist
    if (VALID_CODE_HASHES[newData.appVersion]) {
      checks.validVersion = true;
    } else {
      checks.suspiciousReasons.push(`Unknown version: ${newData.appVersion}`);
      console.warn(`⚠️ Unbekannte Version: ${newData.appVersion} von User ${userId}`);
    }

    // 2. Prüfe Code-Integrität
    const expectedHash = VALID_CODE_HASHES[newData.appVersion];
    if (expectedHash && newData.codeHash === expectedHash) {
      checks.validHash = true;
    } else if (expectedHash) {
      checks.suspiciousReasons.push(`Code hash mismatch: expected ${expectedHash}, got ${newData.codeHash}`);
      console.error(`🚨 Code-Manipulation erkannt bei User ${userId}`);
    }

    // 3. Prüfe Consent
    if (newData.optedIn === true && newData.agbsAccepted === true) {
      checks.validConsent = true;
    } else {
      checks.suspiciousReasons.push('Missing consent but sending analytics');
      console.warn(`⚠️ User ${userId} sendet Analytics ohne Consent`);
    }

    // 4. Prüfe ob Code-Integrität als invalid markiert ist
    if (newData.codeIntegrity === false) {
      checks.suspiciousReasons.push('Code integrity check failed');
    }

    // Entscheide ob User verdächtig ist
    checks.suspicious = checks.suspiciousReasons.length > 0;

    // Update Dokument mit Validierungs-Ergebnissen
    const updates = {
      validated: true,
      validatedAt: admin.firestore.FieldValue.serverTimestamp(),
      validVersion: checks.validVersion,
      validHash: checks.validHash,
      validConsent: checks.validConsent
    };

    // Wenn verdächtig, markiere als suspicious
    if (checks.suspicious) {
      updates.suspicious = true;
      updates.suspiciousReasons = checks.suspiciousReasons;
      
      // Optional: Automatische Sperre bei schwerwiegender Manipulation
      // Nur bei Code-Manipulation, nicht bei fehlender Version
      if (!checks.validHash && checks.validVersion) {
        updates.banned = true;
        updates.banReason = 'Code-Manipulation erkannt';
        updates.bannedAt = admin.firestore.FieldValue.serverTimestamp();
        console.error(`🚫 User ${userId} wurde automatisch gesperrt: Code-Manipulation`);
      }
    } else {
      // Wenn alles OK, entferne suspicious-Flag falls vorhanden
      updates.suspicious = false;
      updates.suspiciousReasons = admin.firestore.FieldValue.delete();
    }

    // Speichere Validierungs-Ergebnisse
    await change.after.ref.update(updates);

    console.log(`✅ Validierung abgeschlossen für User ${userId}:`, checks);
    return null;
  });

/**
 * Cloud Function: Erkenne inaktive User (täglich)
 * Markiert User als verdächtig wenn sie lange keine Analytics senden
 */
exports.detectInactiveUsers = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    console.log('🔍 Starte Inaktivitäts-Check...');
    
    const db = admin.firestore();
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    // Hole alle User die opted-in sind
    const usersSnapshot = await db.collection('users')
      .where('optedIn', '==', true)
      .get();
    
    let inactiveCount = 0;
    const batch = db.batch();
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const lastSeen = data.lastSeen?.toDate();
      
      if (!lastSeen) {
        return; // Überspringe User ohne lastSeen
      }
      
      const lastSeenTimestamp = lastSeen.getTime();
      
      // User hat seit 30 Tagen keine Analytics gesendet
      if (lastSeenTimestamp < thirtyDaysAgo) {
        batch.update(doc.ref, {
          suspicious: true,
          suspiciousReasons: admin.firestore.FieldValue.arrayUnion(
            `No analytics for ${Math.floor((now - lastSeenTimestamp) / (24 * 60 * 60 * 1000))} days despite opt-in`
          ),
          inactiveSince: lastSeen
        });
        inactiveCount++;
        console.log(`⚠️ User ${doc.id} ist seit ${Math.floor((now - lastSeenTimestamp) / (24 * 60 * 60 * 1000))} Tagen inaktiv`);
      }
    });
    
    await batch.commit();
    console.log(`✅ Inaktivitäts-Check abgeschlossen: ${inactiveCount} inaktive User gefunden`);
    
    return null;
  });

/**
 * Cloud Function: Statistiken generieren (täglich)
 * Erstellt tägliche Statistiken über User-Aktivität
 */
exports.generateDailyStats = functions.pubsub
  .schedule('every day 00:00')
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    console.log('📊 Generiere tägliche Statistiken...');
    
    const db = admin.firestore();
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Hole alle User
    const usersSnapshot = await db.collection('users').get();
    
    const stats = {
      date: today,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      totalUsers: usersSnapshot.size,
      activeUsers: 0,
      optedInUsers: 0,
      suspiciousUsers: 0,
      bannedUsers: 0,
      validUsers: 0,
      versions: {},
      platforms: {}
    };
    
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Zähle opted-in User
      if (data.optedIn) {
        stats.optedInUsers++;
      }
      
      // Zähle aktive User (letzte 24h)
      const lastSeen = data.lastSeen?.toDate();
      if (lastSeen && lastSeen.getTime() > oneDayAgo) {
        stats.activeUsers++;
      }
      
      // Zähle verdächtige User
      if (data.suspicious) {
        stats.suspiciousUsers++;
      }
      
      // Zähle gesperrte User
      if (data.banned) {
        stats.bannedUsers++;
      }
      
      // Zähle valide User (validHash + validConsent)
      if (data.validHash && data.validConsent) {
        stats.validUsers++;
      }
      
      // Zähle Versionen
      if (data.appVersion) {
        stats.versions[data.appVersion] = (stats.versions[data.appVersion] || 0) + 1;
      }
      
      // Zähle Plattformen
      if (data.os) {
        stats.platforms[data.os] = (stats.platforms[data.os] || 0) + 1;
      }
    });
    
    // Speichere Statistiken
    await db.collection('stats').doc(today).set(stats);
    
    console.log('✅ Tägliche Statistiken generiert:', stats);
    return null;
  });

/**
 * Cloud Function: Bereinige alte Statistiken (monatlich)
 * Löscht Statistiken die älter als 90 Tage sind
 */
exports.cleanupOldStats = functions.pubsub
  .schedule('0 0 1 * *') // Am 1. jeden Monats um 00:00
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    console.log('🧹 Bereinige alte Statistiken...');
    
    const db = admin.firestore();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];
    
    const oldStatsSnapshot = await db.collection('stats')
      .where('date', '<', cutoffDate)
      .get();
    
    const batch = db.batch();
    oldStatsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ ${oldStatsSnapshot.size} alte Statistiken gelöscht`);
    
    return null;
  });
