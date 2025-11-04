/**
 * StreamMatrix - Twitch Dashboard für Streamer
 * Copyright (c) 2025 Michael Mader. Alle Rechte vorbehalten.
 * 
 * Diese Software ist urheberrechtlich geschützt.
 * Siehe LICENSE Datei für Details.
 */

export default function CopyrightNotice() {
  return (
    <div className="fixed bottom-2 right-2 text-xs opacity-50 hover:opacity-100 transition-opacity"
         style={{ color: 'var(--color-text-secondary)', zIndex: 9999 }}>
      <div className="flex items-center gap-2 px-3 py-1 rounded"
           style={{ backgroundColor: 'var(--color-tile)' }}>
        <span>© 2025 StreamMatrix</span>
        <span>•</span>
        <span>v1.3.3</span>
        <span>•</span>
        <a 
          href="https://github.com/19bounty9317/StreamMatrix" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
