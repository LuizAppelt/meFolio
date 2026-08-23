export type BentoCardSize = '1x1' | '2x1' | '1x2' | '2x2' | 'full';

export type BentoCardType = 
  | 'social' 
  | 'content_review' 
  | 'media' 
  | 'github' 
  | 'stats' 
  | 'quick_action';

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

export type CategoryFilterType = 'all' | 'reviews' | 'projects' | 'socials' | 'media';

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
  pageBgType: 'gradient' | 'solid' | 'dots' | 'mesh' | 'noise';
  pageBgColor1: string;
  pageBgColor2: string;
  cardBgColor: string;
  cardOpacity: number;
  cardBlur: number;
  cardBorderColor: string;
  cardBorderRadius: 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full';
  borderGlow: boolean;
  shadowElevation: 'none' | 'soft' | 'floating' | 'neon';
  accentColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  glowColor: string;
}

export type AudioSourceType = 'direct' | 'upload' | 'youtube' | 'spotify' | 'preset';

export interface AudioPlayerConfig {
  enabled: boolean;
  sourceType?: AudioSourceType;
  audioUrl?: string; // MP3 URL or base64 data URL
  youtubeUrl?: string;
  spotifyUrl?: string;
  title: string;
  artist: string;
  coverUrl?: string;
  defaultVolume: number; // 0 to 1
  autoplay: boolean;
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
  verified: boolean;
  actions: {
    whatsapp?: string;
    whatsappMessage?: string;
    donationKey?: string;
    donationType?: string;
    email?: string;
  };
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

export interface BaseCard {
  id: string;
  type: BentoCardType;
  size: BentoCardSize;
  order: number;
  category?: CategoryFilterType;
}

export interface SocialCardItem extends BaseCard {
  type: 'social';
  platform: SocialPlatform;
  title: string;
  handleOrCount?: string;
  url: string;
  customColor?: string;
  iconName?: string;
}

export interface ContentReviewCardItem extends BaseCard {
  type: 'content_review';
  platform: SocialPlatform;
  platformLabel?: string;
  title: string;
  subtitle?: string;
  url: string;
  coverImage: string;
  gallery?: string[];
  shortReview: string;
  fullReview: string;
  highlights?: string[];
  rating?: number;
  badge?: string;
  buttonText?: string;
}

export interface MediaCardItem extends BaseCard {
  type: 'media';
  mediaType: 'youtube' | 'spotify';
  embedUrl: string;
  title: string;
  description?: string;
}

export interface GithubCardItem extends BaseCard {
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

export interface StatsCardItem extends BaseCard {
  type: 'stats';
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  url?: string;
}

export interface QuickActionCardItem extends BaseCard {
  type: 'quick_action';
  actionType: 'pix' | 'whatsapp' | 'contact';
  title: string;
  subtitle?: string;
  pixKey?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export type AnyBentoCard = 
  | SocialCardItem 
  | ContentReviewCardItem 
  | MediaCardItem 
  | GithubCardItem 
  | StatsCardItem 
  | QuickActionCardItem;

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
