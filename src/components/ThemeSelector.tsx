import React from 'react';
import { Palette } from 'lucide-react';
import type { AppTheme } from '../types';
import { themes } from '../data/initialData';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onSelectTheme 
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-xl">
      <div className="px-2 text-zinc-400">
        <Palette className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-1">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTheme(t)}
            title={t.name}
            className={`w-6 h-6 rounded-full transition-transform ${
              currentTheme.id === t.id ? 'scale-110 ring-2 ring-white' : 'opacity-70 hover:opacity-100 hover:scale-105'
            } bg-gradient-to-tr ${t.previewGradient} border border-white/20`}
          />
        ))}
      </div>
    </div>
  );
};
