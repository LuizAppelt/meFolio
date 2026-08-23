import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Send, 
  MessageCircle, 
  Check, 
  Share2, 
  Sparkles
} from 'lucide-react';
import type { UserProfile, AppTheme, VisibilityConfig, SocialPlatform } from '../types';
import { SocialIcon } from './SocialIcon';
import { AudioPlayer } from './AudioPlayer';
import { triggerConfetti } from '../utils/confetti';

interface ProfileHeaderProps {
  profile: UserProfile;
  theme: AppTheme;
  visibility: VisibilityConfig;
  onShareClick: () => void;
  onOpenContact: () => void;
  onTrackDonationCopy?: () => void;
  onTrackSocialClick?: (linkId: string) => void;
  onTrackWhatsAppClick?: () => void;
}

// Brand specific background colors and text colors for social buttons
const getSocialBrandStyle = (platform: SocialPlatform) => {
  switch (platform) {
    case 'instagram':
      return 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-rose-950/40 hover:shadow-rose-600/30';
    case 'tiktok':
      return 'bg-zinc-950 border border-cyan-500/40 text-cyan-300 shadow-cyan-950/40 hover:border-cyan-400 hover:text-white';
    case 'youtube':
      return 'bg-red-600 text-white shadow-red-950/40 hover:bg-red-500';
    case 'github':
      return 'bg-zinc-800 text-white border border-zinc-700 shadow-black/40 hover:bg-zinc-700';
    case 'linkedin':
      return 'bg-[#0A66C2] text-white shadow-blue-950/40 hover:bg-[#0077B5]';
    case 'twitter':
      return 'bg-zinc-900 border border-zinc-700 text-sky-400 shadow-sky-950/40 hover:border-sky-400 hover:text-white';
    case 'spotify':
      return 'bg-[#1DB954] text-black font-bold shadow-emerald-950/40 hover:bg-[#1ed760]';
    case 'whatsapp':
      return 'bg-[#25D366] text-white shadow-emerald-950/40 hover:bg-[#20ba5a]';
    case 'behance':
      return 'bg-[#0057ff] text-white shadow-blue-950/40 hover:bg-[#0047d1]';
    case 'discord':
      return 'bg-[#5865F2] text-white shadow-indigo-950/40 hover:bg-[#4752c4]';
    default:
      return 'bg-indigo-600 text-white shadow-indigo-950/40 hover:bg-indigo-500';
  }
};

// Tag color palette generator
const getTagColorClass = (index: number) => {
  const colors = [
    'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:border-indigo-400',
    'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:border-rose-400',
    'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400',
    'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-400',
    'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:border-cyan-400',
    'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:border-purple-400',
  ];
  return colors[index % colors.length];
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  theme,
  visibility,
  onShareClick,
  onOpenContact,
  onTrackDonationCopy,
  onTrackSocialClick,
  onTrackWhatsAppClick
}) => {
  const [copiedDonation, setCopiedDonation] = useState(false);

  const handleCopyDonation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile.actions.donationKey) return;
    navigator.clipboard.writeText(profile.actions.donationKey);
    setCopiedDonation(true);
    triggerConfetti();
    onTrackDonationCopy?.();
    setTimeout(() => setCopiedDonation(false), 2500);
  };

  const handleOpenWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile.actions.whatsapp) return;
    onTrackWhatsAppClick?.();
    const cleanNumber = profile.actions.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(profile.actions.whatsappMessage || 'Olá! Vi seu perfil e gostaria de conversar.');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <aside 
      className={`w-full lg:sticky lg:top-6 transition-all duration-300 ${theme.cardBackground} p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col justify-between`}
    >
      <div className="space-y-5">
        
        {/* Profile Avatar & Share Button */}
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-indigo-500/40 p-1 bg-gradient-to-tr from-indigo-500/30 to-violet-500/10 shadow-xl group">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {profile.verified && (
              <div 
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border border-zinc-900"
                title="Perfil Verificado"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Quick Share Button */}
          {visibility.showShareButton && (
            <button
              onClick={onShareClick}
              className="p-2.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all shadow-md active:scale-95 border border-zinc-700/60"
              title="Compartilhar Perfil & QR Code"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Identity: Single Name & @Handle */}
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary}`}>
            {profile.name}
          </h1>
          <p className="text-sm font-semibold text-indigo-400 mt-0.5 font-mono">
            {profile.handle}
          </p>
        </div>

        {/* Bio */}
        <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
          {profile.bio}
        </p>

        {/* Dynamic Colorful Tags */}
        {visibility.showTags && profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border backdrop-blur-md transition-transform duration-200 hover:scale-105 shadow-sm ${getTagColorClass(idx)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Dynamic Brand-Colored Social Links Strip */}
        {visibility.showSocialLinks && profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {profile.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onTrackSocialClick?.(link.id)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${getSocialBrandStyle(link.platform)}`}
                  title={link.label || link.platform}
                >
                  <SocialIcon platform={link.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Audio / Music Player */}
        {visibility.showAudioPlayer && profile.audioConfig.enabled && (
          <div className="pt-2">
            <AudioPlayer config={profile.audioConfig} theme={theme} />
          </div>
        )}

      </div>

      {/* Action Buttons: Contact, WhatsApp, Donation */}
      <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-2.5">
        
        {/* Email Contact */}
        {visibility.showEmailContact && profile.actions.email && (
          <button
            onClick={onOpenContact}
            className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${theme.accent}`}
          >
            <Send className="w-4 h-4" />
            <span>Entrar em Contato</span>
          </button>
        )}

        {/* WhatsApp Direct */}
        {visibility.showWhatsapp && profile.actions.whatsapp && (
          <button
            onClick={handleOpenWhatsapp}
            className="w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-950/40"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Conversar no WhatsApp</span>
          </button>
        )}

        {/* Donation / Support */}
        {visibility.showDonation && profile.actions.donationKey && (
          <button
            onClick={handleCopyDonation}
            className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] border border-zinc-700/80 ${
              copiedDonation 
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-950/50' 
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white'
            }`}
          >
            <AnimatePresence mode="wait">
              {copiedDonation ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  <span>Chave de Apoio Copiada!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
                  <span>Fazer uma Doação / Apoiar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}

      </div>
    </aside>
  );
};
