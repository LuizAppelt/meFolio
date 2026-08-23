import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles, Layers } from 'lucide-react';
import type { TechStackCardItem, AppTheme, BentoCardSize, TechSkillItem } from '../../types';

interface TechStackCardProps {
  card: TechStackCardItem;
  theme: AppTheme;
  isVisualEditMode?: boolean;
  onResize?: (size: BentoCardSize) => void;
}

// Brand colors and accents for popular technologies
const getTechStyle = (name: string, customColor?: string) => {
  if (customColor) return { color: customColor, border: `${customColor}40`, bg: `${customColor}15` };

  const lower = name.toLowerCase();
  if (lower.includes('react')) return { color: '#61DAFB', border: '#61DAFB40', bg: '#61DAFB15' };
  if (lower.includes('typescript') || lower.includes('ts')) return { color: '#3178C6', border: '#3178C640', bg: '#3178C615' };
  if (lower.includes('javascript') || lower.includes('js')) return { color: '#F7DF1E', border: '#F7DF1E40', bg: '#F7DF1E15' };
  if (lower.includes('next')) return { color: '#ffffff', border: '#ffffff40', bg: '#ffffff15' };
  if (lower.includes('tailwind')) return { color: '#38BDF8', border: '#38BDF840', bg: '#38BDF815' };
  if (lower.includes('figma')) return { color: '#F24E1E', border: '#F24E1E40', bg: '#F24E1E15' };
  if (lower.includes('node')) return { color: '#339933', border: '#33993340', bg: '#33993315' };
  if (lower.includes('python')) return { color: '#3776AB', border: '#3776AB40', bg: '#3776AB15' };
  if (lower.includes('docker')) return { color: '#2496ED', border: '#2496ED40', bg: '#2496ED15' };
  if (lower.includes('postgres') || lower.includes('sql')) return { color: '#4169E1', border: '#4169E140', bg: '#4169E115' };
  if (lower.includes('vue')) return { color: '#4FC08D', border: '#4FC08D40', bg: '#4FC08D15' };
  if (lower.includes('graphql')) return { color: '#E10098', border: '#E1009840', bg: '#E1009815' };
  if (lower.includes('git')) return { color: '#F05032', border: '#F0503240', bg: '#F0503215' };

  return { color: '#818cf8', border: '#818cf840', bg: '#818cf815' };
};

export const TechStackCard: React.FC<TechStackCardProps> = ({
  card,
  theme,
  isVisualEditMode = false,
  onResize
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<TechSkillItem | null>(null);

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
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
                {card.title || 'Tech Arsenal'}
              </h3>
              {card.subtitle && (
                <p className={`text-xs ${theme.textSecondary}`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Stack</span>
          </span>
        </div>

        {/* Skills Pills Grid */}
        <div className="flex flex-wrap gap-2 pt-2">
          {card.skills && card.skills.map((skill) => {
            const style = getTechStyle(skill.name, skill.color);

            return (
              <div
                key={skill.id || skill.name}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="relative group/pill"
              >
                <div
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-default shadow-sm backdrop-blur-md"
                  style={{
                    backgroundColor: style.bg,
                    borderColor: style.border,
                    color: style.color
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full animate-pulse shrink-0" 
                    style={{ backgroundColor: style.color }} 
                  />
                  <span className="font-mono tracking-tight font-bold">{skill.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Floating Tooltip at Bottom */}
      <div className="pt-3 border-t border-zinc-800/60 mt-3 flex items-center justify-between text-xs text-zinc-400">
        <AnimatePresence mode="wait">
          {hoveredSkill ? (
            <motion.div
              key={hoveredSkill.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center justify-between w-full"
            >
              <span className="text-white font-bold">{hoveredSkill.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/30">
                {hoveredSkill.level || 'Avançado'}
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Passe o mouse para ver o nível de domínio</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
