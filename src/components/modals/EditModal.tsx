import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  User, 
  Eye, 
  Type, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2,
  Music,
  BarChart3,
  Image as ImageIcon,
  Tag,
  Link as LinkIcon,
  Sparkles,
  Video,
  Radio,
  FileAudio
} from 'lucide-react';
import type { 
  UserProfile, 
  TypographyConfig, 
  VisibilityConfig, 
  AnalyticsData, 
  SocialPlatform, 
  SocialLinkItem,
  AnyBentoCard
} from '../../types';
import { availableFonts } from '../../data/initialData';
import { musicPresets } from '../../data/musicPresets';
import { SocialIcon } from '../SocialIcon';
import { triggerConfetti } from '../../utils/confetti';

interface EditModalProps {
  isOpen: boolean;
  profile: UserProfile;
  cards: AnyBentoCard[];
  typography: TypographyConfig;
  visibility: VisibilityConfig;
  analytics: AnalyticsData;
  onSaveProfile: (profile: UserProfile) => void;
  onSaveTypography: (typo: TypographyConfig) => void;
  onSaveVisibility: (vis: VisibilityConfig) => void;
  onResetAnalytics: () => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  profile,
  cards,
  typography,
  visibility,
  analytics,
  onSaveProfile,
  onSaveTypography,
  onSaveVisibility,
  onResetAnalytics,
  onResetDefaults,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'music' | 'analytics' | 'visibility' | 'typography' | 'backup'>('profile');
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform>('instagram');
  const [newSocialUrl, setNewSocialUrl] = useState<string>('https://instagram.com');

  if (!isOpen) return null;

  // File Upload Helper (converts selected local file to base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        fieldSetter(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // MP3 Audio File Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        onSaveProfile({
          ...profile,
          audioConfig: {
            ...profile.audioConfig,
            enabled: true,
            sourceType: 'upload',
            audioUrl: ev.target.result,
            youtubeUrl: '',
            spotifyUrl: '',
            title: fileName,
            artist: 'Áudio Local'
          }
        });
        triggerConfetti();
      }
    };
    reader.readAsDataURL(file);
  };

  // Live Tag Management
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (!profile.tags.includes(newTagInput.trim())) {
      onSaveProfile({ ...profile, tags: [...profile.tags, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onSaveProfile({ ...profile, tags: profile.tags.filter(t => t !== tagToRemove) });
  };

  // Live Social Links Management
  const handleAddSocialLink = () => {
    const newLink: SocialLinkItem = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      url: newSocialUrl,
      label: newSocialPlatform.toUpperCase()
    };
    onSaveProfile({ ...profile, socialLinks: [...(profile.socialLinks || []), newLink] });
    setNewSocialUrl('https://');
  };

  const handleRemoveSocialLink = (id: string) => {
    onSaveProfile({ ...profile, socialLinks: profile.socialLinks.filter(l => l.id !== id) });
  };

  const handleExportJSON = () => {
    const data = { profile, cards, typography, visibility };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bento-bio-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.profile) onSaveProfile(parsed.profile);
        if (parsed.typography) onSaveTypography(parsed.typography);
        if (parsed.visibility) onSaveVisibility(parsed.visibility);
        triggerConfetti();
        alert('Configurações importadas com sucesso!');
      } catch {
        alert('Erro ao carregar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const getCardTitle = (c: AnyBentoCard): string => {
    if ('title' in c && c.title) return c.title;
    if ('repoName' in c && c.repoName) return c.repoName;
    return 'Bloco Bento';
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
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl z-10 flex flex-col text-zinc-100 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-none">
                  Central de Personalização
                </h3>
                <p className="text-xs text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Alterações salvas instantaneamente</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-4 gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Perfil & Redes</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'music'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Música & Áudio</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics Privado</span>
            </button>

            <button
              onClick={() => setActiveTab('visibility')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'visibility'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visibilidade</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'typography'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Fontes</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'backup'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* TAB 1: PERFIL, LOGO, TAGS & REDES */}
            {activeTab === 'profile' && (
              <div className="space-y-5 max-w-2xl mx-auto">
                
                {/* Nome e Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Seu Nome Principal</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => onSaveProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">@ do Usuário (Identificador)</label>
                    <input
                      type="text"
                      value={profile.handle}
                      onChange={(e) => onSaveProfile({ ...profile, handle: e.target.value })}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Foto de Perfil & Logotipo com Upload do PC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Foto de Perfil</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={profile.avatarUrl}
                        onChange={(e) => onSaveProfile({ ...profile, avatarUrl: e.target.value })}
                        placeholder="https://... ou faça upload"
                        className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <label className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer shrink-0" title="Upload da foto do PC">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => onSaveProfile({ ...profile, avatarUrl: dataUrl }))}
                          className="hidden"
                        />
                      </label>
                      <img 
                        src={profile.avatarUrl} 
                        alt="Avatar" 
                        className="w-9 h-9 rounded-xl object-cover border border-zinc-700 shrink-0" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Logotipo (Usado no Favicon & QR Code)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={profile.logoUrl || ''}
                        onChange={(e) => onSaveProfile({ ...profile, logoUrl: e.target.value })}
                        placeholder="https://... (PNG/SVG)"
                        className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <label className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer shrink-0" title="Upload do logo do PC">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => onSaveProfile({ ...profile, logoUrl: dataUrl }))}
                          className="hidden"
                        />
                      </label>
                      {profile.logoUrl ? (
                        <img 
                          src={profile.logoUrl} 
                          alt="Logo" 
                          className="w-9 h-9 rounded-xl object-contain bg-zinc-800 p-1 border border-zinc-700 shrink-0" 
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-700 shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Bio do Perfil</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => onSaveProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Gerenciador Manual de Tags */}
                <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Habilidades & Tags do Perfil</h4>
                  </div>
                  
                  <form onSubmit={handleAddTag} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite uma nova tag e aperte Enter..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links Sociais da Barra Lateral */}
                <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Links Sociais da Barra Lateral</h4>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value as SocialPlatform)}
                      className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter / X</option>
                      <option value="behance">Behance</option>
                      <option value="spotify">Spotify</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="discord">Discord</option>
                    </select>

                    <input
                      type="text"
                      placeholder="https://..."
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />

                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Inserir</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {profile.socialLinks && profile.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <SocialIcon platform={link.platform} className="w-4 h-4 text-zinc-300" />
                          <span className="font-bold text-white uppercase">{link.platform}</span>
                          <span className="text-zinc-400 truncate">{link.url}</span>
                        </div>

                        <button
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="text-zinc-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações de Contato & Doação */}
                <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Ações de Contato & Apoio</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Seu E-mail de Contato</label>
                      <input
                        type="email"
                        placeholder="contato@exemplo.com"
                        value={profile.actions.email || ''}
                        onChange={(e) => onSaveProfile({
                          ...profile,
                          actions: { ...profile.actions, email: e.target.value }
                        })}
                        className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Número WhatsApp</label>
                      <input
                        type="text"
                        placeholder="5511999999999"
                        value={profile.actions.whatsapp || ''}
                        onChange={(e) => onSaveProfile({
                          ...profile,
                          actions: { ...profile.actions, whatsapp: e.target.value }
                        })}
                        className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Chave para Doação / Apoio (Pix)</label>
                    <input
                      type="text"
                      placeholder="sua-chave@exemplo.com"
                      value={profile.actions.donationKey || ''}
                      onChange={(e) => onSaveProfile({
                        ...profile,
                        actions: { ...profile.actions, donationKey: e.target.value }
                      })}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: MÚSICA & ÁUDIO (COM UPLOAD DE MP3, YOUTUBE, SPOTIFY & PRESETS) */}
            {activeTab === 'music' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">🎵 Central de Música & Áudio</h4>
                    <p className="text-xs text-zinc-400">Importe seu MP3, código incorporado do Spotify, YouTube ou presets</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSaveProfile({
                      ...profile,
                      audioConfig: { ...profile.audioConfig, enabled: !profile.audioConfig.enabled }
                    })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      profile.audioConfig.enabled 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {profile.audioConfig.enabled ? '✓ Habilitado' : 'Desabilitado'}
                  </button>
                </div>

                {/* Opção 1: Upload Direto de MP3 do PC */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileAudio className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Importar MP3 do Computador</h5>
                        <p className="text-[11px] text-zinc-400">Toca nativamente no site com visualizador de ondas</p>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Selecionar MP3</span>
                      <input
                        type="file"
                        accept="audio/mp3,audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {profile.audioConfig.sourceType === 'upload' && (
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-indigo-500/40 text-xs text-indigo-300 flex items-center justify-between">
                      <span className="truncate">Arquivo ativo: {profile.audioConfig.title}</span>
                      <span className="text-[10px] font-mono text-emerald-400">Pronto</span>
                    </div>
                  )}
                </div>

                {/* Opção 2: Presets Chill Prontos em 1 Clique */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400" />
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">Ou escolha uma trilha pronta (1 Clique)</h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {musicPresets.map((preset) => {
                      const isSelected = profile.audioConfig.audioUrl === preset.audioUrl;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => onSaveProfile({
                            ...profile,
                            audioConfig: {
                              ...profile.audioConfig,
                              enabled: true,
                              sourceType: 'preset',
                              audioUrl: preset.audioUrl,
                              youtubeUrl: '',
                              spotifyUrl: '',
                              title: preset.name,
                              artist: preset.artist,
                              coverUrl: preset.coverUrl
                            }
                          })}
                          className={`p-2.5 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40'
                              : 'bg-zinc-800/40 border-zinc-700/60 hover:bg-zinc-800'
                          }`}
                        >
                          <img
                            src={preset.coverUrl}
                            alt={preset.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h6 className="text-xs font-bold text-white truncate">{preset.name}</h6>
                            <p className="text-[10px] text-zinc-400 truncate">{preset.artist} • {preset.genre}</p>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Opção 3: Spotify Embed Code ou YouTube Link */}
                <div className="space-y-3 pt-3 border-t border-zinc-800">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ou use código Spotify / YouTube:</h5>

                  {/* Spotify */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">●</span>
                      <span>Código de Incorporar ou Link do Spotify</span>
                    </label>
                    <textarea
                      rows={2}
                      value={profile.audioConfig.spotifyUrl || ''}
                      onChange={(e) => onSaveProfile({
                        ...profile,
                        audioConfig: {
                          ...profile.audioConfig,
                          enabled: true,
                          sourceType: 'spotify',
                          spotifyUrl: e.target.value,
                          youtubeUrl: '',
                          title: 'Spotify Player',
                          artist: 'Spotify'
                        }
                      })}
                      placeholder='Cole o código "<iframe ...></iframe>" do Spotify ou o link https://open.spotify.com/track/...'
                      className="w-full bg-zinc-800 border border-emerald-700/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 font-mono"
                    />
                    <p className="text-[11px] text-zinc-400">
                      💡 No Spotify: clique em <strong>••• (Mais opções) ➜ Compartilhar ➜ Incorporar faixa</strong> e cole o código aqui!
                    </p>
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-500" />
                      <span>Link do YouTube (Vídeo ou Música)</span>
                    </label>
                    <input
                      type="text"
                      value={profile.audioConfig.youtubeUrl || ''}
                      onChange={(e) => onSaveProfile({
                        ...profile,
                        audioConfig: {
                          ...profile.audioConfig,
                          enabled: true,
                          sourceType: 'youtube',
                          youtubeUrl: e.target.value,
                          spotifyUrl: '',
                          title: 'YouTube Áudio',
                          artist: 'Streaming'
                        }
                      })}
                      placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Autoplay & Volume */}
                <div className="space-y-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/40 border border-zinc-700/60">
                    <div>
                      <h5 className="text-xs font-bold text-white">Tocar Automaticamente (Autoplay)</h5>
                      <p className="text-[11px] text-zinc-400">Inicia o som assim que a página é aberta</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSaveProfile({
                        ...profile,
                        audioConfig: { ...profile.audioConfig, autoplay: !profile.audioConfig.autoplay }
                      })}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                        profile.audioConfig.autoplay ? 'bg-indigo-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          profile.audioConfig.autoplay ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                      <span>Volume Inicial Padrão</span>
                      <span className="font-mono text-indigo-400">
                        {Math.round((profile.audioConfig.defaultVolume ?? 0.25) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={profile.audioConfig.defaultVolume ?? 0.25}
                      onChange={(e) => onSaveProfile({
                        ...profile,
                        audioConfig: { ...profile.audioConfig, defaultVolume: parseFloat(e.target.value) }
                      })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ANALYTICS PRIVADO */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">📊 Estatísticas & Analytics Privado</h4>
                    <p className="text-xs text-zinc-400">Acompanhe as visualizações e os links mais populares (visível apenas para você)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Deseja zerar as métricas de teste do Analytics?')) {
                        onResetAnalytics();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Zerar Estatísticas
                  </button>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase">Visualizações</span>
                    <p className="text-2xl font-extrabold text-white mt-1">{analytics.pageViews}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase">Cliques em Links</span>
                    <p className="text-2xl font-extrabold text-indigo-400 mt-1">{analytics.totalClicks}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase">Apoios / Doação</span>
                    <p className="text-2xl font-extrabold text-rose-400 mt-1">{analytics.donationCopies}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase">Contatos & WhatsApp</span>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-1">{analytics.whatsappClicks + analytics.contactMessages}</p>
                  </div>
                </div>

                {/* Top Clicked Links Table */}
                <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-3">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Desempenho dos Cards da Grade</h5>
                  
                  <div className="space-y-2">
                    {cards.map((card) => {
                      const clicks = analytics.linkClicks[card.id] || 0;
                      const title = getCardTitle(card);
                      const percentage = analytics.totalClicks > 0 ? Math.round((clicks / analytics.totalClicks) * 100) : 0;

                      return (
                        <div key={card.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-zinc-200 truncate max-w-[280px]">{title}</span>
                            <span className="font-mono text-zinc-400">{clicks} cliques ({percentage}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VISIBILIDADE & MÓDULOS */}
            {activeTab === 'visibility' && (
              <div className="space-y-4 max-w-xl mx-auto">
                <div>
                  <h4 className="text-sm font-bold text-white">Controle de Módulos e Visibilidade</h4>
                  <p className="text-xs text-zinc-400">Ative ou desative seções do seu perfil de acordo com seu objetivo</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'showTags' as const, label: '🏷️ Tags de Habilidades', desc: 'Pílulas com habilidades e especialidades' },
                    { key: 'showSocialLinks' as const, label: '🔗 Links Sociais na Barra Lateral', desc: 'Ícones das redes na lateral esquerda' },
                    { key: 'showAudioPlayer' as const, label: '🎵 Player de Música / Áudio', desc: 'Mini-player com controle de volume' },
                    { key: 'showDonation' as const, label: '💖 Botão de Doação / Apoio', desc: 'Botão para apoiar com chave Pix em 1 clique' },
                    { key: 'showEmailContact' as const, label: '✉️ Botão "Entrar em Contato"', desc: 'Abre o formulário de mensagem por e-mail' },
                    { key: 'showWhatsapp' as const, label: '💬 Botão de WhatsApp', desc: 'Link direto para o seu WhatsApp com mensagem' },
                    { key: 'showCategoryFilters' as const, label: '🔍 Barra de Filtros por Categoria', desc: 'Abas para filtrar Reviews, Projetos, Redes e Mídia' },
                    { key: 'showShareButton' as const, label: '🔗 Botão de Compartilhar / QR Code', desc: 'Modal para escanear QR Code com a sua logo' },
                    { key: 'showGlowEffect' as const, label: '✨ Efeitos de Brilho / Ambient Glow', desc: 'Luzes dinâmicas de fundo' },
                  ].map(({ key, label, desc }) => (
                    <div 
                      key={key} 
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-white">{label}</h5>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{desc}</p>
                      </div>

                      <button
                        onClick={() => onSaveVisibility({ ...visibility, [key]: !visibility[key] })}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                          visibility[key] ? 'bg-indigo-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            visibility[key] ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TIPOGRAFIA */}
            {activeTab === 'typography' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h4 className="text-sm font-bold text-white">Catálogo de Tipografia</h4>
                  <p className="text-xs text-zinc-400">Escolha as fontes para títulos e textos da sua página</p>
                </div>

                {/* Fonte de Títulos */}
                <div>
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    Fonte dos Títulos & Headings
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableFonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => onSaveTypography({ ...typography, headingFontId: font.id })}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          typography.headingFontId === font.id
                            ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500'
                            : 'border-zinc-800 bg-zinc-800/30 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-zinc-400 uppercase font-mono">{font.category}</span>
                          {typography.headingFontId === font.id && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <p 
                          className="text-base font-bold text-white truncate"
                          style={{ fontFamily: font.family }}
                        >
                          {font.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fonte do Corpo de Texto */}
                <div className="pt-4 border-t border-zinc-800">
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    Fonte do Corpo & Descrições
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableFonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => onSaveTypography({ ...typography, bodyFontId: font.id })}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          typography.bodyFontId === font.id
                            ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500'
                            : 'border-zinc-800 bg-zinc-800/30 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-zinc-400 uppercase font-mono">{font.category}</span>
                          {typography.bodyFontId === font.id && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <p 
                          className="text-sm font-semibold text-white truncate"
                          style={{ fontFamily: font.family }}
                        >
                          {font.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: BACKUP & RESTAURAR */}
            {activeTab === 'backup' && (
              <div className="space-y-5 max-w-xl mx-auto">
                <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-3">
                  <h4 className="text-sm font-bold text-white">Backup e Exportação</h4>
                  <p className="text-xs text-zinc-400">
                    Exporte todas as suas configurações em um arquivo JSON seguro ou importe de volta.
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={handleExportJSON}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar Configuração (JSON)</span>
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Importar JSON</span>
                      <input 
                        type="file" 
                        accept=".json" 
                        onChange={handleImportJSON} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-800/40 space-y-3">
                  <h4 className="text-sm font-bold text-red-300">Restaurar Padrão</h4>
                  <p className="text-xs text-red-200/70">
                    Deseja voltar a página para os dados iniciais de demonstração?
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza de que deseja restaurar as configurações padrão de demonstração?')) {
                        onResetDefaults();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Dados Padrão</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
