import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Share2
} from 'lucide-react';
import type { ContentReviewCardItem, AppTheme, BentoCardSize } from '../../types';
import { SocialIcon } from '../SocialIcon';
import { triggerConfetti } from '../../utils/confetti';

interface ContentReviewCardProps {
  card: ContentReviewCardItem;
  theme: AppTheme;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const ContentReviewCard: React.FC<ContentReviewCardProps> = ({ 
  card, 
  theme, 
  isExpanded,
  onToggleExpand,
  isVisualEditMode = false,
  onResize
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = card.gallery && card.gallery.length > 0 ? card.gallery : [card.coverImage];
  const is2x2 = card.size === '2x2';
  const is1x2 = card.size === '1x2';
  const is2x1 = card.size === '2x1';

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.url);
    setCopiedLink(true);
    triggerConfetti();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`group relative overflow-hidden rounded-3xl transition-all duration-300 flex flex-col justify-between h-full ${
        isExpanded ? 'border-2 border-indigo-500/80 shadow-2xl shadow-indigo-950/50' : ''
      } ${theme.cardBackground}`}
    >
      {/* Visual Resize Controls Toolbar (when in visual edit mode) */}
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

      {/* Cover / Gallery Showcase Area */}
      <motion.div 
        layout="position"
        className={`relative w-full overflow-hidden select-none ${
          isExpanded 
            ? 'aspect-video sm:aspect-[21/9] max-h-80' 
            : is2x2 || is1x2
            ? 'h-48 sm:h-56' 
            : is2x1 
            ? 'h-32 sm:h-36' 
            : 'h-24'
        }`}
      >
        <img 
          src={images[activeImageIdx]} 
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

        {/* Badges on top */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-white text-xs font-medium border border-zinc-700/50 shadow-md">
            <SocialIcon platform={card.platform} className="w-3.5 h-3.5" />
            <span>{card.platformLabel || card.platform.toUpperCase()}</span>
          </div>

          {card.badge && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 backdrop-blur-md">
              {card.badge}
            </span>
          )}
        </div>

        {/* Top Right Buttons: In-place expand toggle & share */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {isExpanded && (
            <button
              onClick={handleCopyLink}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center backdrop-blur-md border border-zinc-700/50 transition-colors"
              title="Copiar link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isExpanded 
                ? 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500 scale-105' 
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isExpanded ? 'Recolher bloco' : 'Expandir e ver review'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Gallery Navigation Arrows (if in expanded mode and multiple photos) */}
        {isExpanded && images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeImageIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Multiple photos count badge when collapsed */}
        {!isExpanded && images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 text-[11px] border border-white/10">
            <Layers className="w-3 h-3" />
            <span>+{images.length} fotos</span>
          </div>
        )}
      </motion.div>

      {/* Content / Review Body */}
      <motion.div layout="position" className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-2">
        <div>
          {card.subtitle && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-0.5">
              {card.subtitle}
            </p>
          )}

          <h3 className={`font-bold tracking-tight ${isExpanded ? 'text-xl sm:text-2xl' : is2x2 ? 'text-lg' : 'text-sm sm:text-base'} ${theme.textPrimary}`}>
            {card.title}
          </h3>

          {/* Short review when collapsed */}
          {!isExpanded && (
            <p className={`mt-1.5 text-xs line-clamp-2 leading-relaxed ${theme.textSecondary}`}>
              {card.shortReview}
            </p>
          )}

          {/* EXPANDED IN-PLACE CONTENT */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4 pt-4 border-t border-zinc-800/80"
              >
                {/* Full Review Box */}
                <div className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                      Review Completo & O que você vai encontrar
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {card.fullReview || card.shortReview}
                  </p>
                </div>

                {/* Highlights List */}
                {card.highlights && card.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Destaques
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {card.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/40 text-xs text-zinc-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Recolher</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Expandir Review</span>
              </>
            )}
          </button>

          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isExpanded
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            <span>{card.buttonText || 'Abrir'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
