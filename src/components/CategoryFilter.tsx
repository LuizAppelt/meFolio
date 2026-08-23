import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, FolderGit2, Share2, Play } from 'lucide-react';
import type { CategoryFilterType, AppTheme } from '../types';

interface CategoryFilterProps {
  activeCategory: CategoryFilterType;
  onSelectCategory: (category: CategoryFilterType) => void;
  theme: AppTheme;
  counts: Record<CategoryFilterType, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  theme,
  counts
}) => {
  const categories: { id: CategoryFilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'reviews', label: 'Reviews', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projetos', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: 'socials', label: 'Redes', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'media', label: 'Mídia', icon: <Play className="w-3.5 h-3.5" /> },
  ];

  const isLight = theme.id === 'nordic-clean' || theme.id === 'neo-brutalism';

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
              isActive
                ? `${theme.accent} shadow-md scale-105`
                : isLight
                ? 'bg-zinc-200/90 text-zinc-900 hover:text-black hover:bg-zinc-300 border border-zinc-300 font-semibold'
                : 'bg-zinc-900/80 text-zinc-200 hover:text-white hover:bg-zinc-800 border border-zinc-700/80 font-medium'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-2xl -z-10 bg-transparent"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <span className={isActive ? 'opacity-100' : 'opacity-90'}>
              {cat.icon}
            </span>
            
            <span>{cat.label}</span>

            {/* Counter pill */}
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ml-0.5 ${
                isActive
                  ? 'bg-black/30 text-white'
                  : isLight
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
