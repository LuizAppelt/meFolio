import React from 'react';
import { Sparkles, Layers, FolderGit2, Share2, Play, Briefcase } from 'lucide-react';
import type { CategoryFilterType, AppTheme } from '../types';

interface CategoryFilterProps {
  activeCategory: CategoryFilterType;
  onSelectCategory: (cat: CategoryFilterType) => void;
  theme: AppTheme;
}

const categories: { id: CategoryFilterType; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'career', label: 'Carreira & Stack', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'projects', label: 'Projetos', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
  { id: 'reviews', label: 'Destaques', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'socials', label: 'Redes', icon: <Share2 className="w-3.5 h-3.5" /> },
  { id: 'media', label: 'Mídia', icon: <Play className="w-3.5 h-3.5" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  theme,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap active:scale-95 shadow-sm ${
              isActive
                ? `${theme.accent} shadow-md`
                : 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700 hover:text-white border border-zinc-600/60'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
