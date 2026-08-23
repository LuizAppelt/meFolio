import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Share2, 
  Check 
} from 'lucide-react';
import type { ContentReviewCardItem, AppTheme } from '../../types';
import { SocialIcon } from '../SocialIcon';
import { triggerConfetti } from '../../utils/confetti';

interface ReviewModalProps {
  card: ContentReviewCardItem | null;
  theme: AppTheme;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  card, 
  onClose 
}) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setCurrentImageIdx(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onClose]);

  if (!card) return null;

  const images = card.gallery && card.gallery.length > 0 ? card.gallery : [card.coverImage];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCopyPostLink = () => {
    navigator.clipboard.writeText(card.url);
    setCopiedLink(true);
    triggerConfetti();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-700/80 shadow-2xl z-10 text-zinc-100 flex flex-col"
        >
          {/* Header Close & Share bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
                <SocialIcon platform={card.platform} className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-300">
                {card.platformLabel || card.platform.toUpperCase()}
              </span>
              {card.badge && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {card.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPostLink}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
                title="Copiar link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Gallery Showcase */}
          <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black overflow-hidden select-none">
            <img
              key={currentImageIdx}
              src={images[currentImageIdx]}
              alt={card.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Gallery Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnails indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Title Section */}
            <div>
              {card.subtitle && (
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                  {card.subtitle}
                </p>
              )}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {card.title}
              </h2>
            </div>

            {/* Review Section */}
            <div className="p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/60">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Review & O que você vai encontrar
                </h4>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {card.fullReview || card.shortReview}
              </p>
            </div>

            {/* Highlights List */}
            {card.highlights && card.highlights.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Destaques deste conteúdo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {card.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/40 text-xs text-zinc-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-950/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{card.buttonText || `Acessar no ${card.platform.toUpperCase()}`}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
