import { useState, useMemo, useEffect } from 'react';
import { Settings, Share2, Move, Eye, Palette, Lock, UserCheck, LogOut, Sparkles, Loader2 } from 'lucide-react';
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
import { useAuth } from './context/AuthContext';
import { profileService } from './services/profileService';

export function App() {
  const { user, loading: authLoading, isConfigured, signInWithGoogle, signOut } = useAuth();

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

  // URL Query / Handle Parsing
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [isOwner, setIsOwner] = useState(true);

  // Visitor Preview Mode
  const [isVisitorMode, setIsVisitorMode] = useState(false);

  // 1. Detect handle from URL (e.g. ?u=alexandre or /u/alexandre)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uParam = params.get('u');
    if (uParam) {
      setTargetHandle(uParam);
    } else {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'u' && pathParts[1]) {
        setTargetHandle(pathParts[1]);
      }
    }
  }, []);

  // 2. Fetch cloud data when targetHandle or logged in user changes
  useEffect(() => {
    async function loadCloudProfile() {
      if (!isConfigured) return;

      if (targetHandle) {
        setIsLoadingCloud(true);
        const data = await profileService.fetchByHandle(targetHandle);
        setIsLoadingCloud(false);

        if (data) {
          setProfile(data.profile);
          setCards(data.cards);
          if (data.themeId) {
            const found = themes.find(t => t.id === data.themeId);
            if (found) setTheme(found);
          }
          if (data.typography) setTypography(data.typography);
          if (data.visibility) setVisibility(data.visibility);
          if (data.customTheme) setCustomTheme(data.customTheme);
          if (data.analytics) setAnalytics(data.analytics);

          // Check if logged in user owns this profile
          if (user && user.user_metadata?.user_name === targetHandle) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
            setIsVisitorMode(true);
          }
        }
      } else if (user) {
        // Logged in owner without query param
        setIsLoadingCloud(true);
        const data = await profileService.fetchByUserId(user.id);
        setIsLoadingCloud(false);

        if (data) {
          setProfile(data.profile);
          setCards(data.cards);
          if (data.themeId) {
            const found = themes.find(t => t.id === data.themeId);
            if (found) setTheme(found);
          }
          if (data.typography) setTypography(data.typography);
          if (data.visibility) setVisibility(data.visibility);
          if (data.customTheme) setCustomTheme(data.customTheme);
          if (data.analytics) setAnalytics(data.analytics);
          setIsOwner(true);
        }
      }
    }

    loadCloudProfile();
  }, [targetHandle, user, isConfigured]);

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

  // Live Sync handlers (Local + Supabase Cloud)
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    if (user && isConfigured) {
      profileService.saveProfile(user.id, newProfile, {
        themeId: theme.id,
        customTheme,
        typography,
        visibility
      });
    }
  };

  const handleSaveCards = (newCards: AnyBentoCard[]) => {
    setCards(newCards);
    localStorage.setItem(CARDS_KEY, JSON.stringify(newCards));
    if (user && isConfigured) {
      profileService.saveCards(user.id, newCards);
    }
  };

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme.id);
    if (user && isConfigured) {
      profileService.saveProfile(user.id, profile, { themeId: newTheme.id });
    }
  };

  const handleSaveTypography = (newTypo: TypographyConfig) => {
    setTypography(newTypo);
    localStorage.setItem(TYPO_KEY, JSON.stringify(newTypo));
    if (user && isConfigured) {
      profileService.saveProfile(user.id, profile, { typography: newTypo });
    }
  };

  const handleSaveVisibility = (newVis: VisibilityConfig) => {
    setVisibility(newVis);
    localStorage.setItem(VIS_KEY, JSON.stringify(newVis));
    if (user && isConfigured) {
      profileService.saveProfile(user.id, profile, { visibility: newVis });
    }
  };

  const handleSaveCustomTheme = (newCustom: CustomThemeConfig) => {
    setCustomTheme(newCustom);
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(newCustom));
    if (user && isConfigured) {
      profileService.saveProfile(user.id, profile, { customTheme: newCustom });
    }
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
        {/* Left Side: Mode Indicator / Switch */}
        <div className="pointer-events-auto flex items-center gap-2">
          {isOwner ? (
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
              title="Alternar entre visualização pública e modo de edição"
            >
              {isVisitorMode ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>👁️ Visão do Visitante</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>✏️ Modo Dono</span>
                </>
              )}
            </button>
          ) : (
            <a
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 text-xs font-bold shadow-xl transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Criar meu meFolio Grátis</span>
            </a>
          )}

          {isLoadingCloud && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 text-zinc-400 text-xs font-mono border border-zinc-800">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
              <span>Sincronizando...</span>
            </div>
          )}
        </div>

        {/* Right Side: Owner Controls & Google Auth Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Owner Tools (Hidden in Visitor Mode) */}
          {isOwner && !isVisitorMode && (
            <>
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
            </>
          )}

          {/* Google Auth Button / User Session */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
                {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img
                    src={user.user_metadata.avatar_url || user.user_metadata.picture}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover border border-indigo-500/40"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-zinc-200 hidden md:inline truncate max-w-[120px]">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={signOut}
                  className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors ml-1"
                  title="Sair da conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
              title="Entrar com sua conta Google"
            >
              {/* Google G Logo */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>
          )}
        </div>
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
            isVisualEditMode={isOwner && !isVisitorMode && isVisualEditMode}
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

      {/* Footer Branding for Visitors */}
      {!isOwner && (
        <footer className="relative z-10 py-6 text-center text-xs text-zinc-500">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Feito com <strong>meFolio</strong> — Crie o seu gratuitamente</span>
          </a>
        </footer>
      )}

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
