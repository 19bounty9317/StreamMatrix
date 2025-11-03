import { useState } from 'react';
import { TwitchChatService } from '../../services/TwitchChatService';

interface QuickAction {
  id: string;
  label: string;
  message: string;
  icon: string;
}

export default function TileQuickActions() {
  const [actions, setActions] = useState<QuickAction[]>([
    { id: '1', label: 'BRB', message: 'Bin gleich zurück! ⏰', icon: '⏰' },
    { id: '2', label: 'Danke', message: 'Vielen Dank für den Support! ❤️', icon: '❤️' },
    { id: '3', label: 'Pause', message: '5 Minuten Pause! Bleibt dran! ☕', icon: '☕' },
    { id: '4', label: 'Social Media', message: 'Folgt mir auf Twitter & Instagram! 📱', icon: '📱' },
  ]);

  const [newAction, setNewAction] = useState({ label: '', message: '', icon: '💬' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  const sendMessage = async (message: string) => {
    try {
      const chatService = TwitchChatService.getInstance();
      await chatService.sendMessage(message);
      
      setFeedback('✓ Gesendet!');
      setTimeout(() => setFeedback(''), 2000);
    } catch (error) {
      setFeedback('✗ Fehler beim Senden');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const addAction = () => {
    if (!newAction.label || !newAction.message) return;
    
    const action: QuickAction = {
      id: Date.now().toString(),
      ...newAction
    };
    
    const updated = [...actions, action];
    setActions(updated);
    localStorage.setItem('quick-actions', JSON.stringify(updated));
    
    setNewAction({ label: '', message: '', icon: '💬' });
    setShowAddForm(false);
  };

  const deleteAction = (id: string) => {
    const updated = actions.filter(a => a.id !== id);
    setActions(updated);
    localStorage.setItem('quick-actions', JSON.stringify(updated));
  };

  return (

    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Quick Messages</div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 rounded text-xs bg-twitch-purple hover:bg-purple-600"
        >
          {showAddForm ? '✕ Abbrechen' : '+ Neu'}
        </button>
      </div>

      {feedback && (
        <div className="mb-2 p-2 bg-green-600 rounded text-sm text-center">
          {feedback}
        </div>
      )}

      {showAddForm && (
        <div className="mb-3 p-3 theme-tile-content-bg rounded space-y-2">
          <input
            type="text"
            placeholder="Label (z.B. BRB)"
            value={newAction.label}
            onChange={(e) => setNewAction({ ...newAction, label: e.target.value })}
            className="w-full px-3 py-2 bg-twitch-gray border border-twitch-lightgray rounded text-sm"
          />
          <input
            type="text"
            placeholder="Icon (Emoji)"
            value={newAction.icon}
            onChange={(e) => setNewAction({ ...newAction, icon: e.target.value })}
            className="w-full px-3 py-2 bg-twitch-gray border border-twitch-lightgray rounded text-sm"
          />
          <textarea
            placeholder="Nachricht..."
            value={newAction.message}
            onChange={(e) => setNewAction({ ...newAction, message: e.target.value })}
            className="w-full px-3 py-2 bg-twitch-gray border border-twitch-lightgray rounded text-sm"
            rows={2}
          />
          <button
            onClick={addAction}
            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Hinzufügen
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">
        {actions.map((action) => (
          <div
            key={action.id}
            className="theme-tile-content-bg p-3 rounded flex items-center justify-between theme-button transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{action.icon}</span>
                <span className="font-semibold theme-text">{action.label}</span>
              </div>
              <div className="text-sm theme-text-secondary truncate">
                {action.message}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => sendMessage(action.message)}
                className="px-3 py-1 rounded text-xs"
                style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
              >
                Senden
              </button>
              <button
                onClick={() => deleteAction(action.id)}
                className="px-2 py-1 rounded text-xs"
                style={{ backgroundColor: 'var(--color-error)', color: '#FFFFFF' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
