import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  UserProfile, 
  AnyBentoCard, 
  AnalyticsData, 
  TypographyConfig, 
  VisibilityConfig, 
  CustomThemeConfig 
} from '../types';

export interface FetchedUserData {
  profile: UserProfile;
  cards: AnyBentoCard[];
  analytics: AnalyticsData;
  typography: TypographyConfig;
  visibility: VisibilityConfig;
  customTheme: CustomThemeConfig;
  themeId: string;
}

export const profileService = {
  // 1. Fetch profile and cards by @handle (for public links like /u/alexandre)
  async fetchByHandle(handle: string): Promise<FetchedUserData | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
      
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('handle', cleanHandle)
        .maybeSingle();

      if (profileErr || !profileData) return null;

      const userId = profileData.id;

      // Fetch cards
      const { data: cardsData } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      // Fetch analytics
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const profile: UserProfile = {
        name: profileData.name,
        handle: profileData.handle,
        avatarUrl: profileData.avatar_url,
        logoUrl: profileData.logo_url,
        bio: profileData.bio,
        tags: profileData.tags || [],
        socialLinks: profileData.social_links || [],
        audioConfig: profileData.audio_config || { enabled: true, sourceType: 'preset' },
        actions: profileData.actions || {},
        verified: profileData.verified || false
      };

      const cards: AnyBentoCard[] = (cardsData || []).map((row) => ({
        id: row.id,
        size: row.size,
        order: row.order_index,
        type: row.type,
        category: row.category,
        ...row.data
      }));

      const analytics: AnalyticsData = {
        pageViews: analyticsData?.page_views || 1,
        totalClicks: analyticsData?.total_clicks || 0,
        linkClicks: analyticsData?.link_clicks || {},
        donationCopies: analyticsData?.donation_copies || 0,
        whatsappClicks: analyticsData?.whatsapp_clicks || 0,
        contactMessages: analyticsData?.contact_messages || 0,
        lastUpdated: analyticsData?.last_updated || new Date().toISOString()
      };

      return {
        profile,
        cards,
        analytics,
        typography: profileData.typography,
        visibility: profileData.visibility,
        customTheme: profileData.custom_theme,
        themeId: profileData.theme_id || 'obsidian-glass'
      };
    } catch (err) {
      console.error('Error fetching profile by handle:', err);
      return null;
    }
  },

  // 2. Fetch profile and cards by authenticated User ID
  async fetchByUserId(userId: string): Promise<FetchedUserData | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr || !profileData) return null;

      // Fetch cards
      const { data: cardsData } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      // Fetch analytics
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const profile: UserProfile = {
        name: profileData.name,
        handle: profileData.handle,
        avatarUrl: profileData.avatar_url,
        logoUrl: profileData.logo_url,
        bio: profileData.bio,
        tags: profileData.tags || [],
        socialLinks: profileData.social_links || [],
        audioConfig: profileData.audio_config || { enabled: true, sourceType: 'preset' },
        actions: profileData.actions || {},
        verified: profileData.verified || false
      };

      const cards: AnyBentoCard[] = (cardsData || []).map((row) => ({
        id: row.id,
        size: row.size,
        order: row.order_index,
        type: row.type,
        category: row.category,
        ...row.data
      }));

      const analytics: AnalyticsData = {
        pageViews: analyticsData?.page_views || 1,
        totalClicks: analyticsData?.total_clicks || 0,
        linkClicks: analyticsData?.link_clicks || {},
        donationCopies: analyticsData?.donation_copies || 0,
        whatsappClicks: analyticsData?.whatsapp_clicks || 0,
        contactMessages: analyticsData?.contact_messages || 0,
        lastUpdated: analyticsData?.last_updated || new Date().toISOString()
      };

      return {
        profile,
        cards,
        analytics,
        typography: profileData.typography,
        visibility: profileData.visibility,
        customTheme: profileData.custom_theme,
        themeId: profileData.theme_id || 'obsidian-glass'
      };
    } catch (err) {
      console.error('Error fetching profile by userId:', err);
      return null;
    }
  },

  // 3. Save profile data to Supabase
  async saveProfile(
    userId: string, 
    profile: UserProfile, 
    extra?: { 
      themeId?: string; 
      customTheme?: CustomThemeConfig; 
      typography?: TypographyConfig; 
      visibility?: VisibilityConfig; 
    }
  ): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) return false;

    try {
      const payload: any = {
        handle: profile.handle,
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
        logo_url: profile.logoUrl,
        tags: profile.tags,
        social_links: profile.socialLinks,
        audio_config: profile.audioConfig,
        actions: profile.actions,
        verified: profile.verified,
        updated_at: new Date().toISOString()
      };

      if (extra?.themeId) payload.theme_id = extra.themeId;
      if (extra?.customTheme) payload.custom_theme = extra.customTheme;
      if (extra?.typography) payload.typography = extra.typography;
      if (extra?.visibility) payload.visibility = extra.visibility;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      return !error;
    } catch (err) {
      console.error('Error saving profile to Supabase:', err);
      return false;
    }
  },

  // 4. Save cards array to Supabase
  async saveCards(userId: string, cards: AnyBentoCard[]): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) return false;

    try {
      // First delete removed cards
      const currentIds = cards.map(c => c.id);
      await supabase
        .from('cards')
        .delete()
        .eq('user_id', userId)
        .not('id', 'in', `(${currentIds.map(id => `"${id}"`).join(',')})`);

      // Upsert cards
      const rows = cards.map((c, idx) => {
        const { id, size, type, category, ...rest } = c;
        return {
          id,
          user_id: userId,
          size,
          order_index: idx + 1,
          type,
          category,
          data: rest,
          updated_at: new Date().toISOString()
        };
      });

      const { error } = await supabase
        .from('cards')
        .upsert(rows, { onConflict: 'id,user_id' });

      return !error;
    } catch (err) {
      console.error('Error saving cards to Supabase:', err);
      return false;
    }
  },

  // 5. Increment analytics (views / clicks)
  async incrementView(userId: string): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;
    try {
      await supabase.rpc('increment_page_view', { target_user_id: userId });
    } catch {
      // Fallback silent
    }
  }
};
