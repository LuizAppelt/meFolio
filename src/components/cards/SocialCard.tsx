import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { SocialCardItem, AppTheme, BentoCardSize } from '../../types';
import { SocialIcon } from '../SocialIcon';

interface SocialCardProps {
  card: SocialCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const SocialCard: React.FC<SocialCardProps> = ({ 
  card, 
  theme, 
  isVisualEditMode = false,
  onResize 
}) => {
  return (
    <motion.a
      layout
      href={isVisualEditMode ? undefined : card.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={isVisualEditMode ? undefined : { y: -4, scale: 1.02 }}
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

      {/* Glow on hover */}
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition duration-500 pointer-events-none"
        style={{ backgroundColor: card.customColor || '#6366f1' }}
      />

      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg text-white"
          style={{ 
            backgroundColor: card.customColor ? `${card.customColor}` : '#27272a',
            boxShadow: card.customColor ? `0 8px 16px -4px ${card.customColor}40` : undefined
          }}
        >
          <SocialIcon platform={card.platform} className="w-6 h-6" />
        </div>

        {!isVisualEditMode && (
          <div className="w-7 h-7 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="mt-4">
        <h3 className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
          {card.title}
        </h3>
        {card.handleOrCount && (
          <p className={`text-xs font-medium mt-0.5 truncate ${theme.textSecondary}`}>
            {card.handleOrCount}
          </p>
        )}
      </div>
    </motion.a>
  );
};
