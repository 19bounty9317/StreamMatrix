import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

export default function TileStreamSettings() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [gameId, setGameId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryResults, setCategoryResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Lade aktuelle Stream-Infos
  useEffect(() => {
    loadStreamInfo();
  }, []);

  const loadStreamInfo = async () => {
    setIsLoading(true);
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) return;

      const channelInfo = await TwitchService.getChannelInfo(user.id);
      if (channelInfo) {
        setTitle(channelInfo.title || '');
        setCategory(channelInfo.game_name || '');
        setGameId(channelInfo.game_id || '');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Stream-Info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Suche nach Kategorien/Spielen
  const searchCategories = async (query: string) => {
    if (query.length < 2) {
      setCategoryResults([]);
      return;
    }

    try {
      const results = await TwitchService.searchCategories(query);
      setCategoryResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Fehler bei Kategorie-Suche:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategorySearch(value);
    setCategory(value);
    searchCategories(value);
  };

  const selectCategory = (cat: any) => {
    setCategory(cat.name);
    setGameId(cat.id);
    setCategorySearch(cat.name);
    setShowResults(false);
    setCategoryResults([]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) {
        setMessage({ type: 'error', text: 'Benutzer nicht gefunden' });
        return;
      }

      await TwitchService.updateChannelInfo(user.id, {
        title: title,
        game_id: gameId
      });

      setMessage({ type: 'success', text: '✓ Erfolgreich auf Twitch gespeichert!' });
      
      // Nachricht nach 3 Sekunden ausblenden
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Fehler beim Speichern' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Lade Stream-Infos...</div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-4">
      <div>
        <label className="theme-text-secondary text-sm block mb-2">Stream-Titel</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dein Stream-Titel"
          maxLength={140}
          className="w-full theme-input px-3 py-2 rounded text-sm"
        />
        <div className="text-xs theme-text-secondary mt-1">{title.length}/140 Zeichen</div>
      </div>

      <div className="relative">
        <label className="theme-text-secondary text-sm block mb-2">Kategorie / Spiel</label>
        <input
          type="text"
          value={categorySearch || category}
          onChange={handleCategoryChange}
          onFocus={() => categoryResults.length > 0 && setShowResults(true)}
          placeholder="Suche nach Spiel oder Kategorie..."
          className="w-full theme-input px-3 py-2 rounded text-sm"
        />
        
        {showResults && categoryResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 theme-tile-content-bg rounded shadow-lg max-h-48 overflow-y-auto" style={{ border: '1px solid var(--color-border)' }}>
            {categoryResults.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat)}
                className="w-full text-left px-3 py-2 theme-button theme-text text-sm flex items-center gap-2"
              >
                {cat.box_art_url && (
                  <img 
                    src={cat.box_art_url.replace('{width}', '40').replace('{height}', '53')} 
                    alt={cat.name}
                    className="w-6 h-8 object-cover rounded"
                  />
                )}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={handleSave}
        disabled={isSaving || !title || !gameId}
        className="w-full bg-twitch-purple hover:bg-purple-600 text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Speichere...
          </>
        ) : (
          'Auf Twitch speichern'
        )}
      </button>

      {message && (
        <div className={`p-3 rounded text-sm ${
          message.type === 'success' 
            ? 'bg-green-900/50 border border-green-500 text-green-200' 
            : 'bg-red-900/50 border border-red-500 text-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
