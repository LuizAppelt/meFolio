import type { 
  UserProfile, 
  AnyBentoCard, 
  AppTheme, 
  FontOption, 
  TypographyConfig,
  VisibilityConfig,
  CustomThemeConfig,
  AnalyticsData
} from '../types';

export const defaultVisibility: VisibilityConfig = {
  showTags: true,
  showSocialLinks: true,
  showAudioPlayer: true,
  showDonation: true,
  showWhatsapp: true,
  showEmailContact: true,
  showCategoryFilters: true,
  showShareButton: true,
  showGlowEffect: true
};

export const defaultCustomTheme: CustomThemeConfig = {
  isCustom: false,
  pageBgType: 'gradient',
  pageBgColor1: '#090a0f',
  pageBgColor2: '#12141d',
  cardBgColor: '#161922',
  cardOpacity: 75,
  cardBlur: 16,
  cardBorderColor: '#272b38',
  cardBorderRadius: 'rounded-3xl',
  borderGlow: true,
  shadowElevation: 'soft',
  accentColor: '#6366f1',
  textPrimaryColor: '#f4f4f5',
  textSecondaryColor: '#a1a1aa',
  glowColor: '#6366f1'
};

export const defaultAnalytics: AnalyticsData = {
  pageViews: 1284,
  totalClicks: 439,
  linkClicks: {
    'card-1': 162,
    'card-2': 94,
    'card-3': 78,
    'card-4': 45,
    'card-6': 60
  },
  donationCopies: 28,
  whatsappClicks: 37,
  contactMessages: 19,
  lastUpdated: new Date().toISOString()
};

export const availableFonts: FontOption[] = [
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', sans-serif",
    category: 'sans',
    googleFont: 'Plus+Jakarta+Sans:wght@400;500;600;700;800'
  },
  {
    id: 'inter',
    name: 'Inter Modern',
    family: "'Inter', sans-serif",
    category: 'sans',
    googleFont: 'Inter:wght@400;500;600;700;800'
  },
  {
    id: 'outfit',
    name: 'Outfit Geometric',
    family: "'Outfit', sans-serif",
    category: 'display',
    googleFont: 'Outfit:wght@400;500;600;700;800'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk (Tech)',
    family: "'Space Grotesk', sans-serif",
    category: 'display',
    googleFont: 'Space+Grotesk:wght@400;500;600;700'
  },
  {
    id: 'syne',
    name: 'Syne (Avant-Garde)',
    family: "'Syne', sans-serif",
    category: 'display',
    googleFont: 'Syne:wght@500;700;800'
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display (Luxury)',
    family: "'Playfair Display', serif",
    category: 'serif',
    googleFont: 'Playfair+Display:ital,wght@0,600;0,700;0,800;1,600'
  },
  {
    id: 'poppins',
    name: 'Poppins Friendly',
    family: "'Poppins', sans-serif",
    category: 'sans',
    googleFont: 'Poppins:wght@400;500;600;700'
  },
  {
    id: 'sora',
    name: 'Sora Clean',
    family: "'Sora', sans-serif",
    category: 'sans',
    googleFont: 'Sora:wght@400;600;700;800'
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono (Developer)',
    family: "'JetBrains Mono', monospace",
    category: 'mono',
    googleFont: 'JetBrains+Mono:wght@400;500;700'
  },
  {
    id: 'montserrat',
    name: 'Montserrat Editorial',
    family: "'Montserrat', sans-serif",
    category: 'sans',
    googleFont: 'Montserrat:wght@400;600;700;800'
  }
];

export const defaultTypography: TypographyConfig = {
  headingFontId: 'plus-jakarta-sans',
  bodyFontId: 'plus-jakarta-sans',
  accentFontId: 'space-grotesk'
};

export const initialProfile: UserProfile = {
  name: 'Alexandre Souza',
  handle: '@alexandre.dev',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop',
  bio: 'Designer & Desenvolvedor Fullstack. Criando interfaces refinadas, produtos digitais e compartilhando bastidores de tecnologia. ⚡',
  tags: ['UI/UX Design', 'React & Next.js', 'Criador de Conteúdo', 'Branding'],
  socialLinks: [
    { id: 'soc-1', platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
    { id: 'soc-2', platform: 'tiktok', url: 'https://tiktok.com', label: 'TikTok' },
    { id: 'soc-3', platform: 'youtube', url: 'https://youtube.com', label: 'YouTube' },
    { id: 'soc-4', platform: 'github', url: 'https://github.com', label: 'GitHub' },
    { id: 'soc-5', platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    { id: 'soc-6', platform: 'twitter', url: 'https://x.com', label: 'Twitter / X' }
  ],
  audioConfig: {
    enabled: true,
    sourceType: 'preset',
    title: 'Midnight Chill Beats',
    artist: 'Lofi Flow & Alexandre',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    spotifyUrl: '',
    youtubeUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=200&auto=format&fit=crop',
    defaultVolume: 0.25,
    autoplay: false
  },
  verified: true,
  actions: {
    whatsapp: '5511999999999',
    whatsappMessage: 'Olá Alexandre! Vi seu Link na Bio e gostaria de bater um papo.',
    donationKey: 'contato.alexandre@exemplo.com.br',
    donationType: 'Chave Pix para Apoio',
    email: 'contato.alexandre@exemplo.com.br'
  }
};

export const initialCards: AnyBentoCard[] = [
  {
    id: 'card-1',
    type: 'content_review',
    size: '2x2',
    order: 1,
    category: 'reviews',
    platform: 'instagram',
    platformLabel: 'Post em Destaque',
    badge: '🔥 Dica Rápida',
    title: '5 Segredos de UI/UX para Aumentar Conversão',
    subtitle: 'Carrossel prático no Instagram',
    url: 'https://instagram.com',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop'
    ],
    shortReview: 'Neste carrossel desmistifico o uso de tipografia, contraste e micro-interações que aumentaram em 40% o clique dos meus botões.',
    fullReview: 'Neste conteúdo especial publicado no Instagram, fiz um raio-X completo das melhores práticas de micro-interações e hierarquia visual.\n\nVocê vai entender:\n• Como calcular a escala tipográfica ideal para telas mobile;\n• O erro clássico de baixo contraste que espanta usuários;\n• A regra de 3 segundos para links de conversão e botões flutuantes.',
    highlights: [
      'Mais de 4.500 salvamentos no feed',
      'Guia prático passo a passo',
      'Exemplos visuais com Antes & Depois'
    ],
    rating: 5,
    buttonText: 'Ver Post no Instagram'
  },
  {
    id: 'card-2',
    type: 'social',
    size: '1x1',
    order: 2,
    category: 'socials',
    platform: 'instagram',
    title: 'Instagram',
    handleOrCount: '@alexandre.dev',
    url: 'https://instagram.com',
    customColor: '#E1306C'
  },
  {
    id: 'card-3',
    type: 'social',
    size: '1x1',
    order: 3,
    category: 'socials',
    platform: 'tiktok',
    title: 'TikTok',
    handleOrCount: '58.4k seguidores',
    url: 'https://tiktok.com',
    customColor: '#00F2FE'
  },
  {
    id: 'card-4',
    type: 'content_review',
    size: '2x1',
    order: 4,
    category: 'projects',
    platform: 'behance',
    platformLabel: 'Case Study',
    badge: '💎 Portfólio',
    title: 'Redesign do App FlowPay',
    subtitle: 'Estudo de caso completo no Behance',
    url: 'https://behance.net',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop'
    ],
    shortReview: 'Redesenho de um app bancário simplificando o fluxo de transferências de 5 para apenas 2 toques.',
    fullReview: 'O case study do FlowPay detalha todo o processo de Design Thinking, desde as 30 entrevistas de usuários até a entrega do Design System completo em Figma com protótipos de alta fidelidade.',
    highlights: [
      'Design System com 120+ componentes',
      'Testes de usabilidade A/B',
      'Prototipagem interativa'
    ],
    rating: 5,
    buttonText: 'Ver Projeto no Behance'
  },
  {
    id: 'card-5',
    type: 'media',
    size: '1x2',
    order: 5,
    category: 'media',
    mediaType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    title: 'Vídeo: Criando um App do Zero',
    description: 'Aprenda na prática como estruturar seu projeto moderno.'
  },
  {
    id: 'card-6',
    type: 'github',
    size: '2x1',
    order: 6,
    category: 'projects',
    repoName: 'bento-link-starter',
    repoOwner: 'alexandresouza',
    description: 'Template open-source para criar páginas de bio interativas estilo Bento Grid.',
    language: 'TypeScript',
    stars: 342,
    forks: 48,
    url: 'https://github.com',
    showStars: true,
    showForks: true,
    showLanguage: true,
    topics: ['react', 'tailwind', 'bento', 'portfolio']
  },
  {
    id: 'card-7',
    type: 'stats',
    size: '1x1',
    order: 7,
    category: 'projects',
    title: 'Impacto Criativo',
    value: '+150k',
    subtitle: 'Views no Mês',
    icon: 'Sparkles'
  },
  {
    id: 'card-8',
    type: 'quick_action',
    size: '2x1',
    order: 8,
    category: 'reviews',
    actionType: 'pix',
    title: 'Apoie o meu trabalho',
    subtitle: 'Clique para copiar a chave de Doação e apoiar meus conteúdos.',
    pixKey: 'contato.alexandre@exemplo.com.br'
  }
];

export const themes: AppTheme[] = [
  {
    id: 'obsidian-glass',
    name: '🌌 Obsidian Glass',
    previewGradient: 'from-slate-900 via-neutral-900 to-black',
    pageBackground: 'bg-[#08090d] text-zinc-100',
    cardBackground: 'bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 hover:border-zinc-700/80 shadow-2xl shadow-black/40',
    cardBorder: 'border-zinc-800/80',
    cardHoverBorder: 'hover:border-zinc-600',
    accent: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    accentText: 'text-indigo-400',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    badgeBg: 'bg-zinc-800/90 text-zinc-200 border border-zinc-700 font-medium',
    glowEffect: 'rgba(99, 102, 241, 0.2)'
  },
  {
    id: 'cyber-neon',
    name: '⚡ Cyber Neon',
    previewGradient: 'from-slate-950 via-cyan-950 to-blue-950',
    pageBackground: 'bg-[#040812] text-cyan-50',
    cardBackground: 'bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400/70 shadow-2xl shadow-cyan-950/40',
    cardBorder: 'border-cyan-500/30',
    cardHoverBorder: 'hover:border-cyan-400',
    accent: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold',
    accentText: 'text-cyan-400',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/80',
    badgeBg: 'bg-slate-800/90 text-cyan-200 border border-cyan-500/40 font-medium',
    glowEffect: 'rgba(6, 182, 212, 0.3)'
  },
  {
    id: 'tokyo-dusk',
    name: '🌅 Tokyo Dusk',
    previewGradient: 'from-rose-950 via-purple-950 to-amber-950',
    pageBackground: 'bg-[#0f0714] text-rose-50',
    cardBackground: 'bg-stone-900/60 backdrop-blur-xl border border-rose-500/30 hover:border-rose-400/60 shadow-2xl shadow-rose-950/40',
    cardBorder: 'border-rose-500/30',
    cardHoverBorder: 'hover:border-rose-400',
    accent: 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-semibold',
    accentText: 'text-rose-400',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200/80',
    badgeBg: 'bg-stone-800/90 text-rose-200 border border-rose-500/40 font-medium',
    glowEffect: 'rgba(244, 63, 94, 0.25)'
  },
  {
    id: 'nordic-clean',
    name: '❄️ Nordic Clean',
    previewGradient: 'from-slate-100 via-sky-50 to-slate-200',
    pageBackground: 'bg-[#f4f7fb] text-slate-900',
    cardBackground: 'bg-white/90 backdrop-blur-xl border border-slate-300 hover:border-slate-400 shadow-xl shadow-slate-300/40',
    cardBorder: 'border-slate-300',
    cardHoverBorder: 'hover:border-slate-400',
    accent: 'bg-slate-900 hover:bg-slate-800 text-white font-semibold',
    accentText: 'text-sky-700',
    textPrimary: 'text-slate-900 font-bold',
    textSecondary: 'text-slate-700 font-medium',
    badgeBg: 'bg-slate-200 text-slate-900 border border-slate-300 font-semibold',
    glowEffect: 'rgba(14, 165, 233, 0.1)'
  },
  {
    id: 'emerald-matrix',
    name: '🌿 Emerald Matrix',
    previewGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    pageBackground: 'bg-[#03120e] text-emerald-50',
    cardBackground: 'bg-emerald-950/40 backdrop-blur-xl border border-emerald-800/40 hover:border-emerald-500/60 shadow-2xl shadow-emerald-950/50',
    cardBorder: 'border-emerald-800/40',
    cardHoverBorder: 'hover:border-emerald-500',
    accent: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
    accentText: 'text-emerald-400',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200/80',
    badgeBg: 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 font-medium',
    glowEffect: 'rgba(16, 185, 129, 0.25)'
  },
  {
    id: 'neo-brutalism',
    name: '🟡 Neo-Brutalism',
    previewGradient: 'from-yellow-400 via-amber-300 to-yellow-500',
    pageBackground: 'bg-[#fcfaf6] text-zinc-950',
    cardBackground: 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all',
    cardBorder: 'border-2 border-black',
    cardHoverBorder: 'border-black',
    accent: 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    accentText: 'text-black font-extrabold underline',
    textPrimary: 'text-black font-extrabold',
    textSecondary: 'text-zinc-800 font-semibold',
    badgeBg: 'bg-zinc-100 text-black border-2 border-black font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
    glowEffect: 'rgba(250, 204, 21, 0.2)'
  },
  {
    id: 'midnight-velvet',
    name: '👑 Midnight Velvet',
    previewGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    pageBackground: 'bg-[#0a0514] text-purple-50',
    cardBackground: 'bg-purple-950/40 backdrop-blur-xl border border-purple-800/40 hover:border-purple-600/60 shadow-2xl shadow-purple-950/50',
    cardBorder: 'border-purple-800/40',
    cardHoverBorder: 'hover:border-purple-500',
    accent: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold',
    accentText: 'text-fuchsia-400',
    textPrimary: 'text-purple-50',
    textSecondary: 'text-purple-200/80',
    badgeBg: 'bg-purple-900/80 text-purple-200 border border-purple-500/40 font-medium',
    glowEffect: 'rgba(192, 38, 211, 0.25)'
  },
  {
    id: 'vaporwave-80s',
    name: '🌇 Vaporwave 80s',
    previewGradient: 'from-fuchsia-950 via-indigo-950 to-pink-950',
    pageBackground: 'bg-[#0d071a] text-pink-50',
    cardBackground: 'bg-indigo-950/50 backdrop-blur-xl border border-pink-500/30 hover:border-cyan-400/60 shadow-2xl shadow-fuchsia-950/40',
    cardBorder: 'border-pink-500/30',
    cardHoverBorder: 'hover:border-cyan-400',
    accent: 'bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-400 hover:to-cyan-300 text-slate-950 font-bold',
    accentText: 'text-pink-400',
    textPrimary: 'text-pink-50',
    textSecondary: 'text-pink-200/80',
    badgeBg: 'bg-indigo-900/80 text-pink-200 border border-pink-500/40 font-medium',
    glowEffect: 'rgba(236, 72, 153, 0.3)'
  }
];
