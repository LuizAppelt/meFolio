import React from 'react';
import { 
  Music, 
  MessageCircle, 
  Mail, 
  Globe 
} from 'lucide-react';
import type { SocialPlatform } from '../types';

interface SocialIconProps {
  platform: SocialPlatform | string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-5 h-5' }) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.05.86.13V8.98a6.38 6.38 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.25a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34v-7a8.16 8.16 0 0 0 4.81 1.56v-3.46a4.85 4.85 0 0 1-.9-.66z" />
        </svg>
      );
    case 'behance':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.938 4.5c-3.834 0-4.938 2.658-4.938 5.674 0 3.238 1.416 5.826 4.938 5.826 3.328 0 4.673-2.072 4.673-2.072l-1.92-1.397s-.863 1.189-2.607 1.189c-1.636 0-2.39-1.077-2.484-2.428h7.245c.445-3.863-1.674-6.792-4.907-6.792zm-2.31 4.394c.15-1.348.972-2.308 2.296-2.308 1.34 0 2.052.96 2.146 2.308H4.628zM14.5 7h4v1.5h-4V7zm.83 3.5h2.89c1.688 0 2.78.966 2.78 2.455 0 1.05-.623 1.93-1.657 2.25 1.25.32 1.957 1.3 1.957 2.535 0 1.77-1.378 2.76-3.17 2.76H14.5V10.5zm2.465 3.33c.8 0 1.265-.41 1.265-1.07 0-.66-.465-1.03-1.265-1.03h-1.2v2.1h1.2zm.23 3.97c.92 0 1.44-.45 1.44-1.18 0-.74-.52-1.19-1.44-1.19h-1.43v2.37h1.43z"/>
        </svg>
      );
    case 'spotify':
      return <Music className={className} />;
    case 'whatsapp':
      return <MessageCircle className={className} />;
    case 'email':
    case 'mail':
      return <Mail className={className} />;
    default:
      return <Globe className={className} />;
  }
};
