import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import type { UserProfile } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface ShareModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, profile, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://seusite.com';

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Code generator URL using public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=09090b&margin=10`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-700/80 p-6 shadow-2xl z-10 text-center text-zinc-100 flex flex-col items-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* QR Code Container with Logo in center */}
          <div className="relative p-3 bg-white rounded-2xl shadow-xl mb-4 mt-2">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-44 h-44 rounded-xl"
            />
            {/* Center Logo/Avatar if provided */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-zinc-300">
                <img
                  src={profile.logoUrl || profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-0.5">{profile.name}</h3>
          <p className="text-xs text-zinc-400 mb-5">
            Escaneie o QR Code ou compartilhe o link direto da sua bio
          </p>

          {/* Copy link bar */}
          <div className="w-full flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/80">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent px-3 text-xs text-zinc-300 font-mono focus:outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition-all active:scale-95 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
