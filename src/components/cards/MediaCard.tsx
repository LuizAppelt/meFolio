import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { MediaCardItem, AppTheme, BentoCardSize } from '../../types';

interface MediaCardProps {
  card: MediaCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ 
  card, 
  theme, 
  isVisualEditMode = false,
  onResize 
}) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 h-full ${theme.cardBackground}`}
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

      {/* Embedded Media Player */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 shadow-inner mb-3">
        <iframe
          src={card.embedUrl}
          title={card.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-0.5">
            <Play className="w-3 h-3 fill-current" />
            <span>Vídeo em Destaque</span>
          </div>
          <h4 className={`text-sm font-bold tracking-tight line-clamp-1 ${theme.textPrimary}`}>
            {card.title}
          </h4>
          {card.description && (
            <p className={`text-xs mt-1 line-clamp-2 ${theme.textSecondary}`}>
              {card.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
