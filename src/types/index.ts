export type BentoCardSize = '1x1' | '2x1' | '1x2' | '2x2' | 'full';

export type BentoCardType = 
  | 'social' 
  | 'content_review' 
  | 'media' 
  | 'github' 
  | 'stats' 
  | 'quick_action'
  | 'timeline'
  | 'tech_stack';

export type SocialPlatform = 
  | 'instagram' 
  | 'tiktok' 
  | 'youtube' 
  | 'github' 
  | 'linkedin' 
  | 'twitter' 
  | 'behance' 
  | 'spotify' 
  | 'whatsapp'
  | 'discord'
  | 'email'
  | 'custom';

export type CategoryFilterType = 'all' | 'reviews' | 'projects' | 'socials' | 'media' | 'career';

export interface BentoCardBase {
  id: string;
  size: BentoCardSize;
  order: number;
  category: CategoryFilterType;
  visible?: boolean;
}

export interface SocialCardItem extends BentoCardBase {
  type: 'social';
  platform: SocialPlatform;
  title: string;
  handleOrCount?: string;
  url: string;
  customColor?: string;
  customIcon?: string;
}

export interface ContentReviewCardItem extends BentoCardBase {
  type: 'content_review';
  platform: SocialPlatform;
  platformLabel?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  coverImage: string;
  gallery?: string[];
  shortReview: string;
  fullReview: string;
  highlights?: string[];
  rating?: number; // 1 to 5
  url: string;
  buttonText?: string;
}

export interface MediaCardItem extends BentoCardBase {
  type: 'media';
  mediaType: 'youtube' | 'spotify' | 'video' | 'podcast';
  embedUrl: string;
  title: string;
  description?: string;
}

export interface GithubCardItem extends BentoCardBase {
  type: 'github';
  repoName: string;
  repoOwner: string;
  description: string;
  language: string;
  stars: number;
  forks?: number;
  url: string;
  bannerImage?: string;
  showStars?: boolean;
  showForks?: boolean;
  showLanguage?: boolean;
  topics?: string[];
}

export interface StatsCardItem extends BentoCardBase {
  type: 'stats';
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  trend?: string;
}

export interface QuickActionCardItem extends BentoCardBase {
  type: 'quick_action';
  actionType: 'pix' | 'whatsapp' | 'email' | 'custom_link';
  title: string;
  subtitle?: string;
  pixKey?: string;
  targetUrl?: string;
}

// 1. TIMELINE / CAREER ITEM
export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description?: string;
  current?: boolean;
  badge?: string;
}

export interface TimelineCardItem extends BentoCardBase {
  type: 'timeline';
  title: string;
  subtitle?: string;
  items: TimelineItem[];
}

// 2. TECH STACK / ARSENAL ITEM
export interface TechSkillItem {
  id: string;
  name: string;
  category?: 'frontend' | 'backend' | 'design' | 'tools' | 'cloud' | 'mobile';
  level?: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
  color?: string;
  icon?: string;
}

export interface TechStackCardItem extends BentoCardBase {
  type: 'tech_stack';
  title: string;
  subtitle?: string;
  skills: TechSkillItem[];
}

export type AnyBentoCard = 
  | SocialCardItem 
  | ContentReviewCardItem 
  | MediaCardItem 
  | GithubCardItem 
  | StatsCardItem 
  | QuickActionCardItem
  | TimelineCardItem
  | TechStackCardItem;

export type AudioSourceType = 'direct' | 'upload' | 'youtube' | 'spotify' | 'preset';

export interface AudioPlayerConfig {
  enabled: boolean;
  sourceType?: AudioSourceType;
  title?: string;
  artist?: string;
  audioUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  coverUrl?: string;
  defaultVolume?: number;
  autoplay?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  logoUrl?: string;
  bio: string;
  tags: string[];
  socialLinks: SocialLinkItem[];
  audioConfig: AudioPlayerConfig;
  verified?: boolean;
  actions: {
    whatsapp?: string;
    whatsappMessage?: string;
    donationKey?: string;
    donationType?: string;
    email?: string;
  };
}

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'display' | 'mono';
  googleFont: string;
}

export interface TypographyConfig {
  headingFontId: string;
  bodyFontId: string;
  accentFontId: string;
}

export interface VisibilityConfig {
  showTags: boolean;
  showSocialLinks: boolean;
  showAudioPlayer: boolean;
  showDonation: boolean;
  showWhatsapp: boolean;
  showEmailContact: boolean;
  showCategoryFilters: boolean;
  showShareButton: boolean;
  showGlowEffect: boolean;
}

export interface CustomThemeConfig {
  isCustom: boolean;
  pageBgType: 'solid' | 'gradient' | 'mesh' | 'dots' | 'noise' | 'oled';
  pageBgColor1: string;
  pageBgColor2: string;
  cardBgColor: string;
  cardOpacity: number; // 0 to 100
  cardBlur: number; // 0 to 32px
  cardBorderColor: string;
  cardBorderRadius: 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full';
  borderGlow: boolean;
  shadowElevation: 'none' | 'soft' | 'glow' | 'hard';
  accentColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  glowColor: string;
}

export interface AnalyticsData {
  pageViews: number;
  totalClicks: number;
  linkClicks: Record<string, number>;
  donationCopies: number;
  whatsappClicks: number;
  contactMessages: number;
  lastUpdated: string;
}

export interface AppTheme {
  id: string;
  name: string;
  previewGradient: string;
  pageBackground: string;
  cardBackground: string;
  cardBorder: string;
  cardHoverBorder: string;
  accent: string;
  accentText: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  glowEffect: string;
}
