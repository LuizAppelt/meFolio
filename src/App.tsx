import { useState, useMemo, useEffect } from 'react';
import { Settings, Share2, Move, Eye, Palette, Lock, UserCheck } from 'lucide-react';
import type { 
  UserProfile, 
  AnyBentoCard, 
  AppTheme, 
  ContentReviewCardItem, 
  TypographyConfig, 
  CategoryFilterType, 
  BentoCardSize,
  VisibilityConfig,
  CustomThemeConfig,
  AnalyticsData
} from './types';
import { 
  initialProfile, 
  initialCards, 
  themes, 
  defaultTypography, 
  availableFonts,
  defaultVisibility,
  defaultCustomTheme,
  defaultAnalytics
} from './data/initialData';
import { ProfileHeader } from './components/ProfileHeader';
import { BentoGrid } from './components/BentoGrid';
import { CategoryFilter } from './components/CategoryFilter';
import { ReviewModal } from './components/modals/ReviewModal';
import { ShareModal } from './components/modals/ShareModal';
import { EditModal } from './components/modals/EditModal';
import { ContactModal } from './components/modals/ContactModal';
import { ThemeModal } from './components/modals/ThemeModal';
import { CardEditModal } from './components/modals/CardEditModal';

export function App() {
  // LocalStorage keys
  const PROFILE_KEY = 'bento_bio_profile_v5';
  const CARDS_KEY = 'bento_bio_cards_v5';
  const THEME_KEY = 'bento_bio_theme_v5';
  const TYPO_KEY = 'bento_bio_typography_v5';
  const VIS_KEY = 'bento_bio_visibility_v5';
  const CUSTOM_THEME_KEY = 'bento_bio_custom_theme_v5';
  const ANALYTICS_KEY = 'bento_bio_analytics_v5';

  // State initialization with persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [cards, setCards] = useState<AnyBentoCard[]>(() => {
    const saved = localStorage.getItem(CARDS_KEY);
    return saved ? JSON.parse(saved) : initialCards;
  });

  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      const found = themes.find(t => t.id === saved);
      if (found) return found;
    }
    return themes[0];
  });

  const [typography, setTypography] = useState<TypographyConfig>(() => {
    const saved = localStorage.getItem(TYPO_KEY);
    return saved ? JSON.parse(saved) : defaultTypography;
  });

  const [visibility, setVisibility] = useState<VisibilityConfig>(() => {
    const saved = localStorage.getItem(VIS_KEY);
    return saved ? JSON.parse(saved) : defaultVisibility;
  });

  const [customTheme, setCustomTheme] = useState<CustomThemeConfig>(() => {
    const saved = localStorage.getItem(CUSTOM_THEME_KEY);
    return saved ? JSON.parse(saved) : defaultCustomTheme;
  });

  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = localStorage.getItem(ANALYTICS_KEY);
    return saved ? JSON.parse(saved) : defaultAnalytics;
  });

  // Visitor Preview Mode
  const [isVisitorMode, setIsVisitorMode] = useState(false);

  // Track page visit on mount
  useEffect(() => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        pageViews: prev.pageViews + 1,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Update browser title & favicon dynamically
  useEffect(() => {
    document.title = `${profile.name} (${profile.handle}) — meFolio`;
    if (profile.logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = profile.logoUrl;
    }
  }, [profile.name, profile.handle, profile.logoUrl]);

  // Active filters and expansion
  const [activeCategory, setActiveCategory] = useState<CategoryFilterType>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);

  // Modals state
  const [selectedReviewCard, setSelectedReviewCard] = useState<ContentReviewCardItem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [cardModalState, setCardModalState] = useState<{
    isOpen: boolean;
    card: AnyBentoCard | null;
    isNew: boolean;
  }>({
    isOpen: false,
    card: null,
    isNew: false
  });

  // Live Sync handlers
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
  };

  const handleSaveCards = (newCards: AnyBentoCard[]) => {
    setCards(newCards);
    localStorage.setItem(CARDS_KEY, JSON.stringify(newCards));
  };

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme.id);
  };

  const handleSaveTypography = (newTypo: TypographyConfig) => {
    setTypography(newTypo);
    localStorage.setItem(TYPO_KEY, JSON.stringify(newTypo));
  };

  const handleSaveVisibility = (newVis: VisibilityConfig) => {
    setVisibility(newVis);
    localStorage.setItem(VIS_KEY, JSON.stringify(newVis));
  };

  const handleSaveCustomTheme = (newCustom: CustomThemeConfig) => {
    setCustomTheme(newCustom);
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(newCustom));
  };

  const handleResetAnalytics = () => {
    const resetData: AnalyticsData = {
      pageViews: 1,
      totalClicks: 0,
      linkClicks: {},
      donationCopies: 0,
      whatsappClicks: 0,
      contactMessages: 0,
      lastUpdated: new Date().toISOString()
    };
    setAnalytics(resetData);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(resetData));
  };

  const handleResetDefaults = () => {
    setProfile(initialProfile);
    setCards(initialCards);
    setTheme(themes[0]);
    setTypography(defaultTypography);
    setVisibility(defaultVisibility);
    setCustomTheme(defaultCustomTheme);
    setAnalytics(defaultAnalytics);
    localStorage.clear();
  };

  // Direct Grid Card Operations (Add, Edit, Delete)
  const handleOpenAddCard = () => {
    const defaultNewCard: AnyBentoCard = {
      id: `card-${Date.now()}`,
      type: 'tech_stack',
      size: '2x1',
      order: cards.length + 1,
      category: 'career',
      title: 'Tech Arsenal',
      subtitle: 'Tecnologias & Ferramentas',
      skills: [
        { id: 's1', name: 'React', level: 'Especialista' },
        { id: 's2', name: 'TypeScript', level: 'Avançado' },
        { id: 's3', name: 'Tailwind CSS', level: 'Especialista' },
        { id: 's4', name: 'Figma', level: 'Especialista' }
      ]
    };

    setCardModalState({
      isOpen: true,
      card: defaultNewCard,
      isNew: true
    });
  };

  const handleOpenEditCard = (card: AnyBentoCard) => {
    setCardModalState({
      isOpen: true,
      card,
      isNew: false
    });
  };

  const handleSaveCardFromModal = (savedCard: AnyBentoCard) => {
    if (cardModalState.isNew) {
      handleSaveCards([...cards, savedCard]);
    } else {
      const updated = cards.map(c => c.id === savedCard.id ? savedCard : c);
      handleSaveCards(updated);
    }
  };

  const handleDeleteCardFromModal = (cardId: string) => {
    const updated = cards.filter(c => c.id !== cardId);
    updated.forEach((c, idx) => (c.order = idx + 1));
    handleSaveCards(updated);
  };

  // Analytics tracking handlers
  const handleTrackCardClick = (cardId: string) => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        linkClicks: {
          ...prev.linkClicks,
          [cardId]: (prev.linkClicks[cardId] || 0) + 1
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleTrackDonationCopy = () => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        donationCopies: prev.donationCopies + 1,
        totalClicks: prev.totalClicks + 1,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleTrackWhatsAppClick = () => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        whatsappClicks: prev.whatsappClicks + 1,
        totalClicks: prev.totalClicks + 1,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleTrackContactMessage = () => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        contactMessages: prev.contactMessages + 1,
        totalClicks: prev.totalClicks + 1,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Card resize in-place
  const handleResizeCard = (cardId: string, newSize: BentoCardSize) => {
    const updated = cards.map(c => c.id === cardId ? { ...c, size: newSize } : c);
    handleSaveCards(updated);
  };

  // Card expansion in-place
  const handleToggleExpand = (cardId: string) => {
    setExpandedCardId(prev => (prev === cardId ? null : cardId));
  };

  // Current typography family strings
  const currentHeadingFont = availableFonts.find(f => f.id === typography.headingFontId)?.family || "'Plus Jakarta Sans', sans-serif";
  const currentBodyFont = availableFonts.find(f => f.id === typography.bodyFontId)?.family || "'Plus Jakarta Sans', sans-serif";

  // Dynamic Theme Resolution
  const activeThemeObject: AppTheme = useMemo(() => {
    if (!customTheme.isCustom) return theme;
    
    return {
      id: 'custom-theme-live',
      name: 'Tema Personalizado',
      previewGradient: 'from-indigo-600 to-violet-600',
      pageBackground: `text-zinc-100`,
      cardBackground: `${customTheme.cardBorderRadius} backdrop-blur-[${customTheme.cardBlur}px] border shadow-2xl transition-all`,
      cardBorder: 'border-zinc-800',
      cardHoverBorder: 'hover:border-zinc-600',
      accent: 'bg-indigo-600 text-white',
      accentText: 'text-indigo-400',
      textPrimary: 'text-white',
      textSecondary: 'text-zinc-400',
      badgeBg: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      glowEffect: customTheme.glowColor
    };
  }, [theme, customTheme]);

  const customPageBgStyle = useMemo(() => {
    if (!customTheme.isCustom) return undefined;

    if (customTheme.pageBgType === 'dots') {
      return {
        backgroundColor: customTheme.pageBgColor1,
        backgroundImage: `radial-gradient(${customTheme.pageBgColor2} 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      };
    }

    if (customTheme.pageBgType === 'solid') {
      return {
        backgroundColor: customTheme.pageBgColor1
      };
    }

    if (customTheme.pageBgType === 'mesh') {
      return {
        backgroundColor: customTheme.pageBgColor1,
        backgroundImage: `radial-gradient(at 0% 0%, ${customTheme.accentColor}30 0px, transparent 50%), radial-gradient(at 100% 100%, ${customTheme.glowColor}25 0px, transparent 50%)`
      };
    }

    return {
      background: `linear-gradient(135deg, ${customTheme.pageBgColor1} 0%, ${customTheme.pageBgColor2} 100%)`
    };
  }, [customTheme]);

  return (
    <div 
      className={`min-h-screen relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-400 ${
        !customTheme.isCustom ? theme.pageBackground : ''
      }`}
      style={{ 
        fontFamily: currentBodyFont,
        ...customPageBgStyle
      }}
    >
      <style>{`
        h1, h2, h3, h4, h5, h6 {
          font-family: ${currentHeadingFont} !important;
        }
      `}</style>

      {/* Dynamic Ambient Background Gradients */}
      {visibility.showGlowEffect && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            className="absolute -top-40 left-1/3 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-30 animate-pulse-subtle"
            style={{ background: activeThemeObject.glowEffect || 'rgba(99, 102, 241, 0.4)' }}
          />
          <div 
            className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-25"
            style={{ background: activeThemeObject.glowEffect || 'rgba(168, 85, 247, 0.3)' }}
          />
        </div>
      )}

      {/* Top Navigation Control Bar */}
      <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between pointer-events-none">
        {/* Visitor Mode Indicator / Mode Switch */}
        <div className="pointer-events-auto">
          <button
            onClick={() => {
              setIsVisitorMode(!isVisitorMode);
              if (!isVisitorMode) setIsVisualEditMode(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl border text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95 ${
              isVisitorMode
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400 ring-2 ring-emerald-400/40'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
            title="Alternar entre visualização pública do visitante e modo de edição do dono"
          >
            {isVisitorMode ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>👁️ Visão do Visitante (Ativa)</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>✏️ Modo Dono</span>
              </>
            )}
          </button>
        </div>

        {/* Owner Controls (Hidden in Visitor Mode) */}
        {!isVisitorMode && (
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Unified Themes Button */}
            <button
              onClick={() => setIsThemeOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold shadow-xl transition-all hover:scale-105"
              title="Escolher estilo ou criar tema"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Temas</span>
            </button>

            {/* Direct Visual Grid Adjust Toggle */}
            <button
              onClick={() => setIsVisualEditMode(!isVisualEditMode)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl border text-xs font-semibold shadow-xl transition-all hover:scale-105 ${
                isVisualEditMode
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold ring-2 ring-amber-400/50'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title="Adicionar, excluir e arrastar blocos diretamente na grade"
            >
              {isVisualEditMode ? <Eye className="w-3.5 h-3.5" /> : <Move className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{isVisualEditMode ? 'Visualizar Página' : 'Ajustar Grade'}</span>
            </button>

            {/* Share Button */}
            {visibility.showShareButton && (
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold shadow-xl transition-all hover:scale-105"
                title="Compartilhar página e QR Code com logo"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
            )}

            {/* General Customizer Button */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-xl shadow-indigo-950/40 transition-all hover:scale-105 active:scale-95"
              title="Abrir Central de Personalização"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Personalizar</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container: 1/3 Fixed Left Sidebar & 2/3 Scrollable Right Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-start min-h-screen">
        
        {/* LEFT COLUMN: Fixed Full-Height 1/3 Sidebar */}
        <div className="w-full lg:w-1/3 shrink-0 p-4 sm:p-6 lg:p-8">
          <ProfileHeader 
            profile={profile} 
            theme={activeThemeObject}
            visibility={visibility}
            onShareClick={() => setIsShareOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
            onTrackDonationCopy={handleTrackDonationCopy}
            onTrackSocialClick={handleTrackCardClick}
            onTrackWhatsAppClick={handleTrackWhatsAppClick}
          />
        </div>

        {/* RIGHT COLUMN: 2/3 Scrollable Content */}
        <main className="w-full lg:w-2/3 p-4 sm:p-6 lg:p-8 flex-1 space-y-4">
          {/* Category Filter Bar */}
          {visibility.showCategoryFilters && (
            <CategoryFilter 
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              theme={activeThemeObject}
            />
          )}

          {/* Bento Grid */}
          <BentoGrid 
            cards={cards} 
            theme={activeThemeObject}
            activeCategory={activeCategory}
            isVisualEditMode={!isVisitorMode && isVisualEditMode}
            expandedCardId={expandedCardId}
            onToggleExpand={handleToggleExpand}
            onResizeCard={handleResizeCard}
            onReorderCards={handleSaveCards}
            onTrackCardClick={handleTrackCardClick}
            onAddNewCard={handleOpenAddCard}
            onEditCard={handleOpenEditCard}
            onDeleteCard={handleDeleteCardFromModal}
          />
        </main>

      </div>

      {/* MODALS */}
      <ReviewModal 
        card={selectedReviewCard} 
        theme={activeThemeObject}
        onClose={() => setSelectedReviewCard(null)} 
      />

      <ShareModal 
        isOpen={isShareOpen} 
        profile={profile} 
        onClose={() => setIsShareOpen(false)} 
      />

      <ContactModal 
        isOpen={isContactOpen} 
        profile={profile} 
        theme={activeThemeObject}
        onClose={() => {
          setIsContactOpen(false);
          handleTrackContactMessage();
        }} 
      />

      <ThemeModal
        isOpen={isThemeOpen}
        currentTheme={theme}
        customTheme={customTheme}
        onSelectTheme={handleSelectTheme}
        onSaveCustomTheme={handleSaveCustomTheme}
        onClose={() => setIsThemeOpen(false)}
      />

      <CardEditModal
        isOpen={cardModalState.isOpen}
        card={cardModalState.card}
        isNew={cardModalState.isNew}
        onSave={handleSaveCardFromModal}
        onDelete={handleDeleteCardFromModal}
        onClose={() => setCardModalState({ isOpen: false, card: null, isNew: false })}
      />

      <EditModal 
        isOpen={isEditOpen} 
        profile={profile} 
        cards={cards}
        typography={typography}
        visibility={visibility}
        analytics={analytics}
        onSaveProfile={handleSaveProfile} 
        onSaveTypography={handleSaveTypography}
        onSaveVisibility={handleSaveVisibility}
        onResetAnalytics={handleResetAnalytics}
        onResetDefaults={handleResetDefaults} 
        onClose={() => setIsEditOpen(false)} 
      />
    </div>
  );
}

export default App;
