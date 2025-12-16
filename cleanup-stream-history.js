/**
 * Cleanup Script für Stream-Historie
 * 
 * Führe diesen Code in der Browser-Konsole aus (F12 → Console)
 * um alte Test-Daten aus der Stream-Historie zu entfernen.
 */

(function cleanupStreamHistory() {
  console.log('🧹 Starte Stream-Historie Cleanup...');
  
  // Lade aktuelle Historie
  const saved = localStorage.getItem('stream-history');
  if (!saved) {
    console.log('❌ Keine Stream-Historie gefunden');
    return;
  }
  
  try {
    const history = JSON.parse(saved);
    console.log(`📊 Gefundene Sessions: ${history.length}`);
    
    // Zeige alle Sessions
    console.log('\n📋 Aktuelle Sessions:');
    history.forEach((session, index) => {
      console.log(`${index + 1}. ${session.date} - ${session.duration}min, ${session.avgViewers} Viewer, isReal: ${session.isReal || 'undefined'}`);
    });
    
    // Filtere Sessions
    const filtered = history.filter(session => {
      // Entferne Sessions ohne isReal Flag (alte Test-Daten)
      if (session.isReal === undefined || session.isReal === false) {
        console.log(`🗑️ Entferne Test-Session: ${session.date}`);
        return false;
      }
      
      // Entferne Sessions mit unrealistischen Werten
      if (session.newFollowers > 50 || session.newSubs > 50) {
        console.log(`🗑️ Entferne unrealistische Session: ${session.date} (${session.newFollowers} Follower, ${session.newSubs} Subs)`);
        return false;
      }
      
      // Entferne sehr kurze Sessions (< 5 Min)
      if (session.duration < 5) {
        console.log(`🗑️ Entferne zu kurze Session: ${session.date} (${session.duration}min)`);
        return false;
      }
      
      return true;
    });
    
    console.log(`\n✅ Bereinigte Sessions: ${filtered.length} (${history.length - filtered.length} entfernt)`);
    
    // Speichere bereinigte Historie
    localStorage.setItem('stream-history', JSON.stringify(filtered));
    
    console.log('\n✅ Cleanup abgeschlossen!');
    console.log('🔄 Lade die Seite neu (F5) um die Änderungen zu sehen.');
    
    // Zeige bereinigte Sessions
    if (filtered.length > 0) {
      console.log('\n📋 Verbleibende Sessions:');
      filtered.forEach((session, index) => {
        console.log(`${index + 1}. ${session.date} - ${session.duration}min, ${session.avgViewers} Viewer`);
      });
    }
    
  } catch (error) {
    console.error('❌ Fehler beim Cleanup:', error);
  }
})();

// Alternative: Komplette Historie löschen
// Führe diese Funktion aus, wenn du ALLES löschen willst:
function deleteAllHistory() {
  if (confirm('⚠️ Möchtest du wirklich die GESAMTE Stream-Historie löschen?\n\nDies kann nicht rückgängig gemacht werden!')) {
    localStorage.removeItem('stream-history');
    console.log('🗑️ Gesamte Stream-Historie gelöscht');
    console.log('🔄 Lade die Seite neu (F5)');
  }
}

console.log('\n💡 Tipp: Um die gesamte Historie zu löschen, führe aus: deleteAllHistory()');
