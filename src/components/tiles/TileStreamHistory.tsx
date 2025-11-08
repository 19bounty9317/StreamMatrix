import { useState, useEffect } from 'react';

interface StreamSession {
  date: string; // YYYY-MM-DD
  startTime: Date;
  endTime: Date;
  duration: number; // Minuten
  avgViewers: number;
  peakViewers: number;
  newFollowers: number;
  newSubs: number;
}

export default function TileStreamHistory() {
  const [sessions, setSessions] = useState<StreamSession[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(() => {
    const saved = localStorage.getItem('stream-history-last-sync');
    return saved ? new Date(saved) : null;
  });

  useEffect(() => {
    loadStreamHistory();
    
    // Prüfe ob Sync nötig ist (älter als 1 Stunde)
    const needsSync = !lastSync || (Date.now() - lastSync.getTime()) > 60 * 60 * 1000;
    if (needsSync) {
      syncWithTwitch();
    }
  }, []);

  const loadStreamHistory = () => {
    // Lade gespeicherte Stream-Sessions aus localStorage
    const saved = localStorage.getItem('stream-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sessions = parsed.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime)
        }));
        setSessions(sessions);
      } catch (error) {
        console.error('Fehler beim Laden der Stream-Historie:', error);
      }
    }
  };

  const syncWithTwitch = async () => {
    setIsLoading(true);
    try {
      const { TwitchService } = await import('../../services/TwitchService');
      const user = TwitchService.getUserFromStorage();
      const token = TwitchService.getStoredToken();

      if (!user || !token) {
        console.warn('Kein User oder Token für Twitch API');
        setIsLoading(false);
        return;
      }

      console.log('🔄 Synchronisiere Stream-Historie mit Twitch...');

      // Hole Videos (VODs) der letzten 90 Tage
      const response = await fetch(
        `https://api.twitch.tv/helix/videos?user_id=${user.id}&type=archive&first=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );

      if (!response.ok) {
        console.error('Fehler beim Laden der Videos:', response.status);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const videos = data.data || [];

      console.log(`📊 ${videos.length} VODs von Twitch geladen`);

      // Konvertiere VODs zu Sessions
      const twitchSessions: StreamSession[] = videos.map((video: any) => {
        const startTime = new Date(video.created_at);
        const duration = parseDuration(video.duration); // z.B. "3h45m12s"
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        return {
          date: startTime.toISOString().split('T')[0],
          startTime,
          endTime,
          duration,
          avgViewers: video.view_count || 0, // Approximation
          peakViewers: video.view_count || 0, // Approximation
          newFollowers: 0, // Nicht verfügbar von API
          newSubs: 0 // Nicht verfügbar von API
        };
      });

      // Merge mit bestehenden Sessions (behalte lokale Daten wenn vorhanden)
      const saved = localStorage.getItem('stream-history');
      const existingSessions = saved ? JSON.parse(saved) : [];
      const existingDates = new Set(existingSessions.map((s: any) => s.date));

      const newSessions = twitchSessions.filter(s => !existingDates.has(s.date));
      const merged = [...existingSessions, ...newSessions];

      // Sortiere nach Datum
      merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Behalte nur letzte 90 Tage
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const filtered = merged.filter((s: any) => new Date(s.date) >= ninetyDaysAgo);

      // Speichere
      localStorage.setItem('stream-history', JSON.stringify(filtered));
      localStorage.setItem('stream-history-last-sync', new Date().toISOString());
      
      setLastSync(new Date());
      loadStreamHistory();

      console.log(`✅ ${newSessions.length} neue Sessions von Twitch hinzugefügt`);
    } catch (error) {
      console.error('Fehler beim Sync mit Twitch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse Twitch Duration Format (z.B. "3h45m12s" -> Minuten)
  const parseDuration = (duration: string): number => {
    let totalMinutes = 0;
    
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    const secondsMatch = duration.match(/(\d+)s/);

    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
    if (secondsMatch) totalMinutes += Math.round(parseInt(secondsMatch[1]) / 60);

    return totalMinutes;
  };

  // Hole alle Tage im aktuellen Monat
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  // Formatiere Datum zu YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Hole Session für einen bestimmten Tag
  const getSessionForDay = (date: Date): StreamSession | undefined => {
    const dateStr = formatDate(date);
    return sessions.find(s => s.date === dateStr);
  };

  // Formatiere Dauer
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Berechne Durchschnittswerte für den Monat
  const getMonthStats = () => {
    const monthSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate.getMonth() === currentMonth.getMonth() &&
             sessionDate.getFullYear() === currentMonth.getFullYear();
    });

    if (monthSessions.length === 0) {
      return {
        totalStreams: 0,
        avgDuration: 0,
        avgViewers: 0,
        totalFollowers: 0,
        totalSubs: 0
      };
    }

    return {
      totalStreams: monthSessions.length,
      avgDuration: Math.round(monthSessions.reduce((sum, s) => sum + s.duration, 0) / monthSessions.length),
      avgViewers: Math.round(monthSessions.reduce((sum, s) => sum + s.avgViewers, 0) / monthSessions.length),
      totalFollowers: monthSessions.reduce((sum, s) => sum + s.newFollowers, 0),
      totalSubs: monthSessions.reduce((sum, s) => sum + s.newSubs, 0)
    };
  };

  // Berechne Streak (aufeinanderfolgende Tage)
  const getCurrentStreak = () => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate = sessionDate;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  };

  // Bestimme Farbe basierend auf Performance
  const getPerformanceColor = (session: StreamSession, avgViewers: number) => {
    if (avgViewers === 0) return 'green'; // Wenn keine Vergleichsdaten, immer grün
    
    const performance = session.avgViewers / avgViewers;
    
    if (performance >= 1.2) return 'green'; // 20% über Durchschnitt
    if (performance >= 0.8) return 'yellow'; // ±20% vom Durchschnitt
    return 'red'; // Unter 80% vom Durchschnitt
  };

  const monthStats = getMonthStats();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfWeek = daysInMonth[0].getDay(); // 0 = Sonntag
  const currentStreak = getCurrentStreak();
  
  // Hover-State für Vorschau
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // Vorherigen Monat
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Nächsten Monat
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const selectedSession = selectedDay ? sessions.find(s => s.date === selectedDay) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header mit Monat-Navigation */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b theme-border">
        <button
          onClick={previousMonth}
          className="px-3 py-1 theme-button rounded hover:opacity-80 transition-opacity"
        >
          ←
        </button>
        <h3 className="text-lg font-bold theme-text">
          {currentMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextMonth}
          className="px-3 py-1 theme-button rounded hover:opacity-80 transition-opacity"
        >
          →
        </button>
      </div>

      {/* Sync-Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs theme-text-secondary">
          {lastSync ? (
            <>Letzter Sync: {lastSync.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</>
          ) : (
            <>Noch nicht synchronisiert</>
          )}
        </div>
        <button
          onClick={syncWithTwitch}
          disabled={isLoading}
          className="px-3 py-1 text-xs rounded theme-button hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isLoading ? '🔄 Lädt...' : '🔄 Sync'}
        </button>
      </div>

      {/* Streak-Anzeige */}
      {currentStreak > 0 && (
        <div className="mb-3 p-2 rounded bg-orange-500/20 border border-orange-500/50">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold theme-text">
              {currentStreak} Tag{currentStreak > 1 ? 'e' : ''} Streak!
            </span>
          </div>
        </div>
      )}

      {/* Monats-Statistiken */}
      <div className="grid grid-cols-5 gap-2 mb-4 text-xs">
        <div className="text-center p-2 rounded theme-tile-content">
          <div className="theme-text-secondary">Streams</div>
          <div className="text-lg font-bold theme-text">{monthStats.totalStreams}</div>
        </div>
        <div className="text-center p-2 rounded theme-tile-content">
          <div className="theme-text-secondary">Ø Dauer</div>
          <div className="text-sm font-bold theme-text">{formatDuration(monthStats.avgDuration)}</div>
        </div>
        <div className="text-center p-2 rounded theme-tile-content">
          <div className="theme-text-secondary">Ø Viewer</div>
          <div className="text-lg font-bold theme-text">{monthStats.avgViewers}</div>
        </div>
        <div className="text-center p-2 rounded theme-tile-content">
          <div className="theme-text-secondary">Follower</div>
          <div className="text-lg font-bold text-blue-400">+{monthStats.totalFollowers}</div>
        </div>
        <div className="text-center p-2 rounded theme-tile-content">
          <div className="theme-text-secondary">Subs</div>
          <div className="text-lg font-bold text-purple-400">+{monthStats.totalSubs}</div>
        </div>
      </div>

      {/* Kalender */}
      <div className="flex-1 overflow-y-auto">
        {/* Wochentage */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold theme-text-secondary py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Tage */}
        <div className="grid grid-cols-7 gap-1">
          {/* Leere Zellen für Tage vor dem 1. des Monats */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Tage des Monats */}
          {daysInMonth.map(day => {
            const session = getSessionForDay(day);
            const dateStr = formatDate(day);
            const isToday = formatDate(new Date()) === dateStr;
            const isSelected = selectedDay === dateStr;
            const isHovered = hoveredDay === dateStr;
            
            // Bestimme Farbe basierend auf Performance
            let colorClass = 'bg-green-500/30 border-green-500';
            if (session && monthStats.avgViewers > 0) {
              const color = getPerformanceColor(session, monthStats.avgViewers);
              if (color === 'green') {
                colorClass = 'bg-green-500/30 border-green-500';
              } else if (color === 'yellow') {
                colorClass = 'bg-yellow-500/30 border-yellow-500';
              } else {
                colorClass = 'bg-red-500/30 border-red-500';
              }
            }

            return (
              <div key={dateStr} className="relative">
                <button
                  onClick={() => setSelectedDay(session ? dateStr : null)}
                  onMouseEnter={() => setHoveredDay(session ? dateStr : null)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-full aspect-square p-1 rounded text-xs transition-all ${
                    session
                      ? isSelected
                        ? 'bg-green-600 text-white ring-2 ring-green-400'
                        : `${colorClass} hover:opacity-80 border-2 theme-text`
                      : isToday
                        ? 'border-2 border-blue-500 theme-text'
                        : 'theme-tile-content theme-text-secondary hover:theme-tile-content-hover'
                  }`}
                  disabled={!session}
                >
                  <div className="font-semibold">{day.getDate()}</div>
                  {session && (
                    <div className="text-[10px] mt-0.5">
                      {session.avgViewers}👁️
                    </div>
                  )}
                </button>

                {/* Hover-Vorschau */}
                {isHovered && session && (
                  <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 rounded shadow-lg border theme-tile-content theme-border whitespace-nowrap text-xs">
                    <div className="font-bold theme-text mb-1">
                      {day.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="space-y-0.5 theme-text-secondary">
                      <div>⏱️ {formatDuration(session.duration)}</div>
                      <div>👁️ Ø {session.avgViewers} (Peak: {session.peakViewers})</div>
                      <div>👥 +{session.newFollowers} Follower</div>
                      <div>⭐ +{session.newSubs} Subs</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details für ausgewählten Tag */}
      {selectedSession && (
        <div className="mt-4 p-3 rounded border-2 border-green-500 bg-green-500/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold theme-text">
              {new Date(selectedSession.date).toLocaleDateString('de-DE', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </h4>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-xs theme-text-secondary hover:theme-text"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="theme-text-secondary">Dauer:</span>
              <span className="ml-2 font-semibold theme-text">{formatDuration(selectedSession.duration)}</span>
            </div>
            <div>
              <span className="theme-text-secondary">Ø Viewer:</span>
              <span className="ml-2 font-semibold theme-text">{selectedSession.avgViewers}</span>
            </div>
            <div>
              <span className="theme-text-secondary">Peak:</span>
              <span className="ml-2 font-semibold theme-text">{selectedSession.peakViewers}</span>
            </div>
            <div>
              <span className="theme-text-secondary">Start:</span>
              <span className="ml-2 font-semibold theme-text">
                {selectedSession.startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="theme-text-secondary">Follower:</span>
              <span className="ml-2 font-semibold text-blue-400">+{selectedSession.newFollowers}</span>
            </div>
            <div>
              <span className="theme-text-secondary">Subs:</span>
              <span className="ml-2 font-semibold text-purple-400">+{selectedSession.newSubs}</span>
            </div>
          </div>
        </div>
      )}

      {/* Keine Daten Hinweis */}
      {sessions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center theme-text-secondary">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-sm text-center">
            Noch keine Stream-Daten vorhanden.<br />
            Starte einen Stream um Daten zu sammeln!
          </div>
        </div>
      )}
    </div>
  );
}
