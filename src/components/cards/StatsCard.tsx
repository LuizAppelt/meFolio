import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Users } from 'lucide-react';
import type { StatsCardItem, AppTheme, BentoCardSize } from '../../types';

interface StatsCardProps {
  card: StatsCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  card, 
  theme, 
  isVisualEditMode = false,
  onResize 
}) => {
  const getIcon = () => {
    switch (card.icon) {
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-400" />;
      case 'Users': return <Users className="w-5 h-5 text-sky-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 h-full ${theme.cardBackground}`}
    >
      {/* Visual Resize Controls */}
      {isVisualEditMode && onResize && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-xl border border-zinc-700 shadow-xl">
          {(['1x1', '2x1', '1x2', '2x2', 'full'] as BentoCardSize[]).map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.stopPropagation();
                onResize(size);
              }}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                card.size === size
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {/* Top Icon */}
      <div className="w-10 h-10 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shadow-inner">
        {getIcon()}
      </div>

      {/* Metric Value & Label */}
      <div className="mt-4">
        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight block ${theme.textPrimary}`}>
          {card.value}
        </span>
        <h4 className={`text-xs font-semibold mt-1 ${theme.textSecondary}`}>
          {card.title}
        </h4>
        {card.subtitle && (
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {card.subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};
