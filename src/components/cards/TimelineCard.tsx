import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Sparkles } from 'lucide-react';
import type { TimelineCardItem, AppTheme, BentoCardSize } from '../../types';

interface TimelineCardProps {
  card: TimelineCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  card,
  theme,
  isVisualEditMode = false,
  onResize
}) => {
  return (
    <motion.div
      layout
      whileHover={isVisualEditMode ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 h-full ${theme.cardBackground}`}
    >
      {/* Visual Resize Controls */}
      {isVisualEditMode && onResize && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-xl border border-zinc-700 shadow-xl">
          {(['1x1', '2x1', '1x2', '2x2', 'full'] as BentoCardSize[]).map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.preventDefault();
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

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
                {card.title || 'Trajetória & Carreira'}
              </h3>
              {card.subtitle && (
                <p className={`text-xs ${theme.textSecondary}`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Carreira</span>
          </span>
        </div>

        {/* Timeline Items List */}
        <div className="relative pl-6 space-y-4 pt-2 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-500/40 before:to-transparent">
          {card.items && card.items.map((item, idx) => (
            <div key={item.id || idx} className="relative group/item">
              {/* Node indicator */}
              <div 
                className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 transition-transform group-hover/item:scale-125 ${
                  item.current 
                    ? 'bg-emerald-500 border-zinc-950 ring-4 ring-emerald-500/30 animate-pulse' 
                    : 'bg-indigo-500 border-zinc-950 ring-2 ring-indigo-500/20'
                }`} 
              />

              {/* Period Badge & Current Tag */}
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>{item.period}</span>
                </span>

                {item.current && (
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold font-mono border border-emerald-500/40">
                    Atual
                  </span>
                )}

                {item.badge && !item.current && (
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold font-mono">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Role & Company */}
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {item.role}
              </h4>
              <p className="text-xs font-semibold text-indigo-400">
                {item.company}
              </p>

              {/* Description */}
              {item.description && (
                <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${theme.textSecondary}`}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
