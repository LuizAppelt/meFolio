import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react';
import type { GithubCardItem, AppTheme, BentoCardSize } from '../../types';

interface GithubCardProps {
  card: GithubCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

export const GithubCard: React.FC<GithubCardProps> = ({ 
  card, 
  theme, 
  isVisualEditMode = false,
  onResize 
}) => {
  const showStars = card.showStars !== false;
  const showForks = card.showForks !== false;
  const showLanguage = card.showLanguage !== false;

  return (
    <motion.a
      layout
      href={isVisualEditMode ? undefined : card.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={isVisualEditMode ? undefined : { y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-3xl flex flex-col justify-between transition-all duration-300 h-full ${theme.cardBackground}`}
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

      {/* Optional Project Banner / OpenGraph Preview */}
      {card.bannerImage && (
        <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-zinc-950">
          <img
            src={card.bannerImage}
            alt={card.repoName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
      )}

      {/* Content Body */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-zinc-400">{card.repoOwner} /</span>
            </div>

            {!isVisualEditMode && (
              <div className="w-7 h-7 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <h3 className={`text-base font-bold tracking-tight group-hover:text-indigo-400 transition-colors ${theme.textPrimary}`}>
            {card.repoName}
          </h3>

          <p className={`mt-1.5 text-xs line-clamp-2 leading-relaxed ${theme.textSecondary}`}>
            {card.description}
          </p>

          {/* Topic Badges */}
          {card.topics && card.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {card.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 text-[10px] font-mono border border-zinc-700/50"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Metrics */}
        <div className="flex items-center gap-3 pt-3 border-t border-zinc-800/60 mt-4 text-xs text-zinc-400">
          {showLanguage && card.language && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>{card.language}</span>
            </div>
          )}

          {showStars && (
            <div className="flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{card.stars}</span>
            </div>
          )}

          {showForks && card.forks !== undefined && (
            <div className="flex items-center gap-1 font-mono">
              <GitFork className="w-3.5 h-3.5 text-zinc-400" />
              <span>{card.forks}</span>
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
};
