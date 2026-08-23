import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Plus, Edit3, Trash2, Check } from 'lucide-react';
import type { 
  AnyBentoCard, 
  AppTheme, 
  CategoryFilterType, 
  BentoCardSize 
} from '../types';
import { SocialCard } from './cards/SocialCard';
import { ContentReviewCard } from './cards/ContentReviewCard';
import { MediaCard } from './cards/MediaCard';
import { GithubCard } from './cards/GithubCard';
import { StatsCard } from './cards/StatsCard';
import { QuickActionCard } from './cards/QuickActionCard';
import { TimelineCard } from './cards/TimelineCard';
import { TechStackCard } from './cards/TechStackCard';
import { TiltCardWrapper } from './effects/TiltCardWrapper';

interface BentoGridProps {
  cards: AnyBentoCard[];
  theme: AppTheme;
  activeCategory: CategoryFilterType;
  isVisualEditMode?: boolean;
  expandedCardId?: string | null;
  onToggleExpand: (cardId: string) => void;
  onResizeCard?: (cardId: string, newSize: BentoCardSize) => void;
  onReorderCards?: (newCards: AnyBentoCard[]) => void;
  onTrackCardClick?: (cardId: string) => void;
  onAddNewCard?: () => void;
  onEditCard?: (card: AnyBentoCard) => void;
  onDeleteCard?: (cardId: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  cards,
  theme,
  activeCategory,
  isVisualEditMode = false,
  expandedCardId,
  onToggleExpand,
  onResizeCard,
  onReorderCards,
  onTrackCardClick,
  onAddNewCard,
  onEditCard,
  onDeleteCard
}) => {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [confirmDeleteCardId, setConfirmDeleteCardId] = useState<string | null>(null);

  // Filter cards by category
  const filteredCards = cards.filter((card) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'reviews') return card.type === 'content_review' || card.type === 'quick_action';
    if (activeCategory === 'projects') return card.type === 'github' || card.type === 'stats' || card.type === 'tech_stack' || (card.type === 'content_review' && card.platform === 'behance');
    if (activeCategory === 'socials') return card.type === 'social';
    if (activeCategory === 'media') return card.type === 'media' || (card.type === 'content_review' && card.platform === 'youtube');
    if (activeCategory === 'career') return card.type === 'timeline' || card.type === 'tech_stack';
    return true;
  });

  // Calculate CSS grid column & row spans with standard row unit
  const getSizeClasses = (size: BentoCardSize, isExpanded: boolean) => {
    if (isExpanded) {
      return 'col-span-1 sm:col-span-2 md:col-span-3 min-h-[380px]';
    }

    switch (size) {
      case '1x1':
        return 'col-span-1 min-h-[180px]';
      case '2x1':
        return 'col-span-1 sm:col-span-2 min-h-[180px]';
      case '1x2':
        return 'col-span-1 row-span-2 min-h-[376px]';
      case '2x2':
        return 'col-span-1 sm:col-span-2 row-span-2 min-h-[376px]';
      case 'full':
        return 'col-span-1 sm:col-span-2 md:col-span-3 min-h-[180px]';
      default:
        return 'col-span-1 min-h-[180px]';
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (!isVisualEditMode) return;
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent, cardId: string) => {
    if (!isVisualEditMode || draggedCardId === cardId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCardId !== cardId) {
      setDragOverCardId(cardId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCardId(null);
  };

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    if (!isVisualEditMode) return;
    e.preventDefault();
    setDragOverCardId(null);

    const sourceId = draggedCardId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetCardId) return;

    const sourceIdx = cards.findIndex(c => c.id === sourceId);
    const targetIdx = cards.findIndex(c => c.id === targetCardId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    const newCards = [...cards];
    const [movedItem] = newCards.splice(sourceIdx, 1);
    newCards.splice(targetIdx, 0, movedItem);

    newCards.forEach((c, idx) => {
      c.order = idx + 1;
    });

    if (onReorderCards) {
      onReorderCards(newCards);
    }

    setDraggedCardId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmDeleteCardId === cardId) {
      // Confirmed delete
      onDeleteCard?.(cardId);
      setConfirmDeleteCardId(null);
    } else {
      // First click asks confirmation
      setConfirmDeleteCardId(cardId);
      setTimeout(() => {
        setConfirmDeleteCardId((prev) => (prev === cardId ? null : prev));
      }, 3000);
    }
  };

  const renderCardContent = (card: AnyBentoCard) => {
    switch (card.type) {
      case 'social':
        return (
          <SocialCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'content_review':
        return (
          <ContentReviewCard
            card={card}
            theme={theme}
            isExpanded={expandedCardId === card.id}
            onToggleExpand={() => onToggleExpand(card.id)}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'media':
        return (
          <MediaCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'github':
        return (
          <GithubCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'stats':
        return (
          <StatsCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'quick_action':
        return (
          <QuickActionCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'timeline':
        return (
          <TimelineCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      case 'tech_stack':
        return (
          <TechStackCard
            card={card}
            theme={theme}
            isVisualEditMode={isVisualEditMode}
            onResize={(size) => onResizeCard?.(card.id, size)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px] gap-4"
      >
        <AnimatePresence>
          {filteredCards.map((card) => {
            const isExpanded = expandedCardId === card.id;
            const sizeClass = getSizeClasses(card.size, isExpanded);
            const isBeingDragged = draggedCardId === card.id;
            const isDropTarget = dragOverCardId === card.id;
            const isConfirmingDelete = confirmDeleteCardId === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ 
                  opacity: isBeingDragged ? 0.4 : 1, 
                  scale: isDropTarget ? 1.03 : 1 
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 350, damping: 30 }}
                className={`relative group ${sizeClass} ${
                  isVisualEditMode ? 'cursor-grab active:cursor-grabbing' : ''
                } ${
                  isDropTarget 
                    ? 'ring-2 ring-indigo-500 rounded-3xl shadow-xl' 
                    : ''
                }`}
                {...({
                  draggable: isVisualEditMode,
                  onDragStart: (e: React.DragEvent) => handleDragStart(e, card.id),
                  onDragOver: (e: React.DragEvent) => handleDragOver(e, card.id),
                  onDragLeave: handleDragLeave,
                  onDrop: (e: React.DragEvent) => handleDrop(e, card.id),
                } as any)}
                onClick={() => onTrackCardClick?.(card.id)}
              >
                {/* Visual Edit Mode Overlay Controls */}
                {isVisualEditMode && (
                  <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md px-2 py-1 rounded-xl border border-zinc-700 shadow-xl">
                    {/* Minimal Grip handle without numbers */}
                    <div 
                      className="flex items-center text-zinc-400 hover:text-white cursor-grab"
                      title="Arrastar e soltar bloco"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Quick Edit button */}
                    {onEditCard && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditCard(card);
                        }}
                        className="p-1 rounded-lg bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white transition-colors"
                        title="Editar conteúdo deste bloco"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Quick Delete button (Solid 2-step confirmation) */}
                    {onDeleteCard && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(e, card.id)}
                        className={`px-1.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                          isConfirmingDelete
                            ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-400'
                            : 'bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white'
                        }`}
                        title={isConfirmingDelete ? 'Clique novamente para confirmar exclusão' : 'Excluir bloco'}
                      >
                        {isConfirmingDelete ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Confirmar?</span>
                          </>
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Card Component with 3D Tilt & Spotlight Wrap */}
                <TiltCardWrapper 
                  disabled={isVisualEditMode || isExpanded} 
                  glowColor={theme.glowEffect || 'rgba(99, 102, 241, 0.18)'}
                >
                  {renderCardContent(card)}
                </TiltCardWrapper>
              </motion.div>
            );
          })}

          {/* "+ Adicionar Novo Bloco" Card in Visual Edit Mode */}
          {isVisualEditMode && onAddNewCard && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={onAddNewCard}
              className={`col-span-1 min-h-[180px] rounded-3xl border-2 border-dashed border-indigo-500/50 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all group hover:scale-[1.02] shadow-xl`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md mb-2">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Adicionar Novo Bloco
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Timeline, Tech Stack, Review, GitHub ou Doação
              </p>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
