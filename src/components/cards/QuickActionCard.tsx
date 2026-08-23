import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Check } from 'lucide-react';
import type { QuickActionCardItem, AppTheme, BentoCardSize } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface QuickActionCardProps {
  card: QuickActionCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  card, 
  theme, 
  isVisualEditMode = false,
  onResize 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!card.pixKey) return;
    navigator.clipboard.writeText(card.pixKey);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
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

      {/* Top Details */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-400/30" />
          </div>
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Apoio ao Criador</span>
        </div>

        <h3 className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
          {card.title}
        </h3>

        {card.subtitle && (
          <p className={`mt-1 text-xs leading-relaxed ${theme.textSecondary}`}>
            {card.subtitle}
          </p>
        )}
      </div>

      {/* Copy Button */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[150px]">
          {card.pixKey}
        </span>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
            copied
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Apoio Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copiar Chave</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
