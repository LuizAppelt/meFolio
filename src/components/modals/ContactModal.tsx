import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, Copy, Check } from 'lucide-react';
import type { UserProfile, AppTheme } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface ContactModalProps {
  isOpen: boolean;
  profile: UserProfile;
  theme: AppTheme;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  profile,
  onClose
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const recipientEmail = profile.actions.email || 'contato@exemplo.com';

  const getFormattedMessage = () => {
    return `Olá ${profile.name}!\n\nMeu nome é: ${name || 'Não informado'}\nMeu contato: ${contact || 'Não informado'}\n\nAssunto: ${subject || 'Contato através do Link na Bio'}\n\nMensagem:\n${message}`;
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const fullSubject = encodeURIComponent(`[Contato Bio] ${subject || 'Novo contato de ' + (name || 'Visitante')}`);
    const fullBody = encodeURIComponent(getFormattedMessage());
    
    // Open user's mail client
    window.location.href = `mailto:${recipientEmail}?subject=${fullSubject}&body=${fullBody}`;
    
    setSent(true);
    triggerConfetti();
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(getFormattedMessage());
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-700/80 p-6 sm:p-7 shadow-2xl z-10 text-zinc-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Enviar Mensagem</h3>
              <p className="text-xs text-zinc-400">Direto para <b>{profile.name}</b></p>
            </div>
          </div>

          {sent ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-white">Pronto para Enviar!</h4>
              <p className="text-xs text-zinc-300 max-w-xs mx-auto leading-relaxed">
                Seu aplicativo de e-mail foi aberto com a mensagem formatada. Caso não tenha aberto, você pode copiar o texto abaixo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Clara"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Seu E-mail ou WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="maria@email.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Assunto</label>
                <input
                  type="text"
                  placeholder="Ex: Proposta de Projeto ou Parceria"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Mensagem</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva sua mensagem ou detalhes do projeto..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-zinc-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar por E-mail</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
                  title="Copiar texto da mensagem formatado"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
