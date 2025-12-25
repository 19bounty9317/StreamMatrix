const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Bekannte gültige Code-Hashes für jede Version
// Diese werden bei jedem Release aktualisiert
const VALID_CODE_HASHES = {
  '1.4.6': 'b8c5a2d1e3f4a5b6', // Echter Hash für v1.4.6 (SHA-256 von "1.4.6")
  '1.4.7': '44e873fe5d23d5b2', // Echter Hash für v1.4.7 (SHA-256 von "1.4.7")
  '1.4.10': 'a7f3c9e2d8b4f1a5', // Hash für v1.4.10
  '1.4.11': 'c2e8f5a9d3b7e1f4', // Hash für v1.4.11
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
    const oldData = change.before.exists ? change.before.data() : null;
    const userId = context.params.userId;
    
    // WICHTIG: Verhindere Endlosschleife!
    // Wenn das Update von dieser Function kam (validated=true und validatedAt wurde gerade gesetzt),
    // dann nicht erneut validieren
    if (oldData && oldData.validated === true && newData.validated === true) {
      // Prüfe ob nur Validierungs-Felder geändert wurden
      const oldValidatedAt = oldData.validatedAt?.toMillis() || 0;
      const newValidatedAt = newData.validatedAt?.toMillis() || 0;
      
      // Wenn validatedAt sich gerade geändert hat (innerhalb der letzten 5 Sekunden),
      // dann kam das Update von dieser Function → Überspringe
      if (Math.abs(newValidatedAt - Date.now()) < 5000) {
        console.log(`⏭️ Überspringe Re-Validierung für User ${userId} (bereits validiert)`);
        return null;
      }
    }
    
    console.log(`📊 Validiere Analytics für User: ${userId}`);

    // Prüfe ob User auf Whitelist ist (Admin/Entwickler)
    if (ADMIN_WHITELIST.includes(newData.channelName)) {
      console.log(`✅ User ${newData.channelName} ist auf Whitelist - Überspringe Validierung`);
      
      // Nur updaten wenn noch nicht als Admin markiert
      if (!newData.isAdmin) {
        await change.after.ref.update({
          isAdmin: true,
          validated: true,
          validatedAt: admin.firestore.FieldValue.serverTimestamp(),
          validVersion: true,
          validHash: true,
          validConsent: true,
          suspicious: false,
          banned: false
        });
      }
      
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

    // Nur updaten wenn sich etwas geändert hat
    const needsUpdate = !oldData || 
      oldData.validated !== true ||
      oldData.validVersion !== updates.validVersion ||
      oldData.validHash !== updates.validHash ||
      oldData.validConsent !== updates.validConsent ||
      oldData.suspicious !== updates.suspicious;

    if (needsUpdate) {
      // Speichere Validierungs-Ergebnisse
      await change.after.ref.update(updates);
      console.log(`✅ Validierung abgeschlossen für User ${userId}:`, checks);
    } else {
      console.log(`⏭️ Keine Änderungen nötig für User ${userId}`);
    }
    
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

// ============================================
// STREAMER DIRECTORY FUNCTIONS
// ============================================

// Twitch API Credentials (Backend App - nur für Cloud Functions)
// Beide werden via Firebase Config gesetzt
const TWITCH_CLIENT_ID = functions.config().twitch?.client_id || '29m9wd4tyae2dgkvgr8ddqv45rxpwk';
const TWITCH_CLIENT_SECRET = functions.config().twitch?.client_secret || '';

let twitchAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Holt Twitch Access Token (OAuth Client Credentials Flow)
 */
async function getTwitchAccessToken() {
  // Prüfe ob Token noch gültig ist
  if (twitchAccessToken && Date.now() < tokenExpiresAt) {
    return twitchAccessToken;
  }

  console.log('🔑 Hole neuen Twitch Access Token...');

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });

    twitchAccessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 Min Puffer

    console.log('✅ Twitch Access Token erhalten');
    return twitchAccessToken;
  } catch (error) {
    console.error('❌ Fehler beim Holen des Twitch Access Token:', error.message);
    throw error;
  }
}

/**
 * Holt Twitch Stream-Daten für mehrere User
 */
async function getTwitchStreams(userIds) {
  if (!userIds || userIds.length === 0) {
    return [];
  }

  const token = await getTwitchAccessToken();
  
  // Twitch API erlaubt max 100 User-IDs pro Request
  const chunks = [];
  for (let i = 0; i < userIds.length; i += 100) {
    chunks.push(userIds.slice(i, i + 100));
  }

  const allStreams = [];

  for (const chunk of chunks) {
    try {
      const params = new URLSearchParams();
      chunk.forEach(id => params.append('user_id', id));

      const response = await axios.get('https://api.twitch.tv/helix/streams', {
        params: params,
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`
        }
      });

      allStreams.push(...response.data.data);
    } catch (error) {
      console.error('❌ Fehler beim Holen der Twitch Streams:', error.message);
    }
  }

  return allStreams;
}

/**
 * Holt Twitch User-Daten (Profilbilder, etc.)
 */
async function getTwitchUsers(userIds) {
  if (!userIds || userIds.length === 0) {
    return [];
  }

  const token = await getTwitchAccessToken();
  
  const chunks = [];
  for (let i = 0; i < userIds.length; i += 100) {
    chunks.push(userIds.slice(i, i + 100));
  }

  const allUsers = [];

  for (const chunk of chunks) {
    try {
      const params = new URLSearchParams();
      chunk.forEach(id => params.append('id', id));

      const response = await axios.get('https://api.twitch.tv/helix/users', {
        params: params,
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`
        }
      });

      allUsers.push(...response.data.data);
    } catch (error) {
      console.error('❌ Fehler beim Holen der Twitch User:', error.message);
    }
  }

  return allUsers;
}

/**
 * Cloud Function: Update Streamer Status (alle 5 Minuten)
 * Holt aktuelle Twitch-Daten für alle Streamer im Verzeichnis
 */
exports.updateStreamerStatus = functions.pubsub
  .schedule('every 5 minutes')
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    console.log('🎮 Starte Streamer-Status-Update...');

    const db = admin.firestore();
    
    try {
      // Hole alle Streamer die Tracking zugestimmt haben
      const streamersSnapshot = await db.collection('streamers')
        .where('consent', '==', true)
        .get();

      if (streamersSnapshot.empty) {
        console.log('ℹ️ Keine Streamer im Verzeichnis');
        return null;
      }

      console.log(`📊 ${streamersSnapshot.size} Streamer gefunden`);

      const userIds = [];
      const streamerDocs = {};

      streamersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId) {
          userIds.push(data.userId);
          streamerDocs[data.userId] = doc;
        }
      });

      // Hole aktuelle Stream-Daten von Twitch
      const streams = await getTwitchStreams(userIds);
      const users = await getTwitchUsers(userIds);

      console.log(`🔴 ${streams.length} Live-Streams gefunden`);

      // Erstelle Maps für schnellen Zugriff
      const streamMap = {};
      streams.forEach(stream => {
        streamMap[stream.user_id] = stream;
      });

      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = user;
      });

      // Update alle Streamer
      const batch = db.batch();
      let updatedCount = 0;

      for (const userId of userIds) {
        const doc = streamerDocs[userId];
        const stream = streamMap[userId];
        const user = userMap[userId];

        const updates = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          isLive: !!stream
        };

        // Update User-Daten wenn verfügbar
        if (user) {
          updates.displayName = user.display_name;
          updates.profileImageUrl = user.profile_image_url;
          updates.broadcasterType = user.broadcaster_type;
        }

        // Update Stream-Daten wenn live
        if (stream) {
          updates.streamData = {
            title: stream.title,
            gameName: stream.game_name,
            gameId: stream.game_id,
            viewerCount: stream.viewer_count,
            thumbnailUrl: stream.thumbnail_url,
            startedAt: admin.firestore.Timestamp.fromDate(new Date(stream.started_at)),
            language: stream.language,
            tags: stream.tags || []
          };
          updates.lastStreamAt = admin.firestore.FieldValue.serverTimestamp();
        } else {
          // Wenn offline, lösche streamData
          updates.streamData = admin.firestore.FieldValue.delete();
        }

        batch.update(doc.ref, updates);
        updatedCount++;
      }

      await batch.commit();
      console.log(`✅ ${updatedCount} Streamer aktualisiert`);

    } catch (error) {
      console.error('❌ Fehler beim Update der Streamer:', error);
    }

    return null;
  });

/**
 * Cloud Function: Bereinige inaktive Streamer (täglich)
 * Entfernt Streamer die seit 30 Tagen nicht mehr gesehen wurden
 */
exports.cleanupInactiveStreamers = functions.pubsub
  .schedule('every day 03:00')
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    console.log('🧹 Bereinige inaktive Streamer...');

    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const inactiveSnapshot = await db.collection('streamers')
        .where('lastSeen', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      if (inactiveSnapshot.empty) {
        console.log('ℹ️ Keine inaktiven Streamer gefunden');
        return null;
      }

      const batch = db.batch();
      inactiveSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`✅ ${inactiveSnapshot.size} inaktive Streamer entfernt`);

    } catch (error) {
      console.error('❌ Fehler beim Bereinigen:', error);
    }

    return null;
  });

/**
 * HTTP Function: Manueller Trigger für Streamer-Update (für Testing)
 */
exports.triggerStreamerUpdate = functions.https.onRequest(async (req, res) => {
  console.log('🔧 Manueller Streamer-Update getriggert');
  
  try {
    // Rufe die Update-Funktion auf
    await exports.updateStreamerStatus.run();
    res.status(200).send('✅ Streamer-Update erfolgreich');
  } catch (error) {
    console.error('❌ Fehler:', error);
    res.status(500).send('❌ Fehler beim Update');
  }
});
