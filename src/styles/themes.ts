export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    background: string;
    sidebar: string;
    tile: string;
    tileHeader: string;
    tileBorder: string;
    tileContent: string; // Neu: für Inhalte innerhalb der Tiles
    text: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'twitch-dark',
    name: 'Twitch Dark',
    emoji: '🎮',
    colors: {
      background: '#0E0E10',
      sidebar: '#18181B',
      tile: '#18181B',
      tileHeader: '#1F1F23',
      tileBorder: '#9146FF',
      tileContent: '#0E0E10',
      text: '#FFFFFF',
      textSecondary: '#ADADB8',
      accent: '#9146FF',
      accentHover: '#772CE8',
      border: '#2C2C34',
      success: '#00F593',
      warning: '#FFA500',
      error: '#FF4444'
    }
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    emoji: '🌙',
    colors: {
      background: '#0A1929',
      sidebar: '#132F4C',
      tile: '#1A2027',
      tileHeader: '#132F4C',
      tileBorder: '#3399FF',
      tileContent: '#0D1B2A',
      text: '#FFFFFF',
      textSecondary: '#B2BAC2',
      accent: '#3399FF',
      accentHover: '#0072E5',
      border: '#1E3A5F',
      success: '#1DB954',
      warning: '#FFB020',
      error: '#F44336'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    emoji: '🌅',
    colors: {
      background: '#1A0F0A',
      sidebar: '#2D1810',
      tile: '#2D1810',
      tileHeader: '#3D2418',
      tileBorder: '#FF6B35',
      tileContent: '#1A0F0A',
      text: '#FFFFFF',
      textSecondary: '#D4A59A',
      accent: '#FF6B35',
      accentHover: '#E85D2A',
      border: '#4A2F20',
      success: '#4CAF50',
      warning: '#FFA726',
      error: '#EF5350'
    }
  },
  {
    id: 'light-modern',
    name: 'Light Modern',
    emoji: '☀️',
    colors: {
      background: '#F5F5F7',
      sidebar: '#FFFFFF',
      tile: '#FFFFFF',
      tileHeader: '#F5F5F7',
      tileBorder: '#007AFF',
      tileContent: '#F9F9FB',
      text: '#000000',
      textSecondary: '#3C3C43',
      accent: '#007AFF',
      accentHover: '#0051D5',
      border: '#D2D2D7',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30'
    }
  },
  {
    id: 'cyber-purple',
    name: 'Cyber Purple',
    emoji: '💜',
    colors: {
      background: '#0D0221',
      sidebar: '#1A0B2E',
      tile: '#160B28',
      tileHeader: '#1A0B2E',
      tileBorder: '#7B2CBF',
      tileContent: '#0D0221',
      text: '#E0AAFF',
      textSecondary: '#C77DFF',
      accent: '#7B2CBF',
      accentHover: '#5A189A',
      border: '#240046',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    }
  }
];

export function getTheme(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0];
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  // Speichere Theme-ID für spätere Verwendung
  root.setAttribute('data-theme', theme.id);
  
  // Setze CSS-Variablen (werden nur für spezielle Elemente verwendet)
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-sidebar', theme.colors.sidebar);
  root.style.setProperty('--color-tile', theme.colors.tile);
  root.style.setProperty('--color-tile-header', theme.colors.tileHeader);
  root.style.setProperty('--color-tile-border', theme.colors.tileBorder);
  root.style.setProperty('--color-tile-content', theme.colors.tileContent);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-accent-hover', theme.colors.accentHover);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-error', theme.colors.error);
  
  // Wende Farben auf body an
  document.body.style.backgroundColor = theme.colors.background;
  document.body.style.color = theme.colors.text;
}
