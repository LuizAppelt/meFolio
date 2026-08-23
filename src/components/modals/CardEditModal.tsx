import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Trash2, 
  Layers, 
  FolderGit2, 
  Share2, 
  Play, 
  Heart, 
  BarChart3, 
  Upload, 
  Sparkles, 
  Loader2, 
  Check,
  Briefcase,
  Cpu,
  Plus
} from 'lucide-react';
import type { 
  AnyBentoCard, 
  BentoCardSize, 
  BentoCardType, 
  SocialPlatform,
  TimelineItem,
  TechSkillItem
} from '../../types';
import { fetchGithubRepoData } from '../../utils/github';

interface CardEditModalProps {
  isOpen: boolean;
  card: AnyBentoCard | null;
  isNew?: boolean;
  onSave: (card: AnyBentoCard) => void;
  onDelete?: (cardId: string) => void;
  onClose: () => void;
}

const techPresets = [
  'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma',
  'Node.js', 'Python', 'Docker', 'PostgreSQL', 'GraphQL',
  'Vue.js', 'Git & GitHub', 'UI/UX Design', 'AWS'
];

export const CardEditModal: React.FC<CardEditModalProps> = ({
  isOpen,
  card: initialCard,
  isNew = false,
  onSave,
  onDelete,
  onClose
}) => {
  const [formData, setFormData] = useState<AnyBentoCard | null>(initialCard);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubSuccessMsg, setGithubSuccessMsg] = useState(false);

  useEffect(() => {
    setFormData(initialCard);
  }, [initialCard]);

  if (!isOpen || !formData) return null;

  // File Upload Helper
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

  // GitHub Auto-Fetch
  const handleFetchGithub = async () => {
    if (formData.type !== 'github') return;
    const urlOrSlug = formData.url || `${formData.repoOwner}/${formData.repoName}`;
    if (!urlOrSlug.trim()) return;

    setIsFetchingGithub(true);
    const data = await fetchGithubRepoData(urlOrSlug);
    setIsFetchingGithub(false);

    if (data) {
      setFormData({
        ...formData,
        repoName: data.repoName,
        repoOwner: data.repoOwner,
        description: data.description,
        language: data.language,
        stars: data.stars,
        forks: data.forks,
        url: data.url,
        bannerImage: data.bannerImage,
        topics: data.topics
      });
      setGithubSuccessMsg(true);
      setTimeout(() => setGithubSuccessMsg(false), 3000);
    } else {
      alert('Não foi possível encontrar o repositório no GitHub. Verifique o link digitado.');
    }
  };

  const handleTypeChange = (newType: BentoCardType) => {
    const baseId = formData.id || `card-${Date.now()}`;
    const baseOrder = formData.order || 1;

    let newCard: AnyBentoCard;

    if (newType === 'content_review') {
      newCard = {
        id: baseId,
        type: 'content_review',
        size: '2x1',
        order: baseOrder,
        category: 'reviews',
        platform: 'instagram',
        platformLabel: 'Post em Destaque',
        title: 'Novo Conteúdo em Destaque',
        subtitle: 'Review / Prévia',
        url: 'https://instagram.com',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
        shortReview: 'Escreva um resumo do que o seguidor vai encontrar.',
        fullReview: 'Escreva o review completo e os ensinamentos.',
        highlights: ['Destaque 1', 'Destaque 2'],
        rating: 5,
        buttonText: 'Acessar Conteúdo'
      };
    } else if (newType === 'social') {
      newCard = {
        id: baseId,
        type: 'social',
        size: '1x1',
        order: baseOrder,
        category: 'socials',
        platform: 'instagram',
        title: 'Instagram',
        handleOrCount: '@seu.usuario',
        url: 'https://instagram.com',
        customColor: '#E1306C'
      };
    } else if (newType === 'github') {
      newCard = {
        id: baseId,
        type: 'github',
        size: '2x1',
        order: baseOrder,
        category: 'projects',
        repoName: 'meu-projeto-opensource',
        repoOwner: 'usuario',
        description: 'Descrição do repositório open source no GitHub.',
        language: 'TypeScript',
        stars: 150,
        forks: 24,
        url: 'https://github.com',
        showStars: true,
        showForks: true,
        showLanguage: true
      };
    } else if (newType === 'timeline') {
      newCard = {
        id: baseId,
        type: 'timeline',
        size: '1x2',
        order: baseOrder,
        category: 'career',
        title: 'Trajetória & Carreira',
        subtitle: 'Evolução Profissional',
        items: [
          {
            id: `time-${Date.now()}-1`,
            period: '2024 — Presente',
            role: 'Lead UI/UX & Developer',
            company: 'Tech Studio',
            description: 'Liderando arquitetura de interfaces, Design Systems e aplicações React.',
            current: true
          },
          {
            id: `time-${Date.now()}-2`,
            period: '2022 — 2024',
            role: 'Senior Frontend Developer',
            company: 'Digital Solutions',
            description: 'Desenvolvimento de produtos digitais escaláveis com TypeScript e Next.js.'
          }
        ]
      };
    } else if (newType === 'tech_stack') {
      newCard = {
        id: baseId,
        type: 'tech_stack',
        size: '2x1',
        order: baseOrder,
        category: 'career',
        title: 'Tech Arsenal',
        subtitle: 'Ferramentas & Tecnologias',
        skills: [
          { id: 'sk-1', name: 'React', level: 'Especialista' },
          { id: 'sk-2', name: 'TypeScript', level: 'Avançado' },
          { id: 'sk-3', name: 'Next.js', level: 'Avançado' },
          { id: 'sk-4', name: 'Tailwind CSS', level: 'Especialista' },
          { id: 'sk-5', name: 'Figma', level: 'Especialista' },
          { id: 'sk-6', name: 'Node.js', level: 'Intermediário' }
        ]
      };
    } else if (newType === 'media') {
      newCard = {
        id: baseId,
        type: 'media',
        size: '2x1',
        order: baseOrder,
        category: 'media',
        mediaType: 'youtube',
        embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        title: 'Vídeo em Destaque',
        description: 'Assista ao meu novo vídeo ou tutorial.'
      };
    } else if (newType === 'stats') {
      newCard = {
        id: baseId,
        type: 'stats',
        size: '1x1',
        order: baseOrder,
        category: 'projects',
        title: 'Visualizações',
        value: '+100k',
        subtitle: 'Crescimento Mensal',
        icon: 'Sparkles'
      };
    } else {
      newCard = {
        id: baseId,
        type: 'quick_action',
        size: '2x1',
        order: baseOrder,
        category: 'reviews',
        actionType: 'pix',
        title: 'Apoie o meu trabalho',
        subtitle: 'Chave Pix para incentivar a criação de conteúdo.',
        pixKey: 'sua-chave@exemplo.com'
      };
    }

    setFormData(newCard);
  };

  const handlePlatformChange = (platform: SocialPlatform) => {
    if (formData.type !== 'social') return;
    const colors: Record<SocialPlatform, string> = {
      instagram: '#E1306C',
      tiktok: '#00F2FE',
      youtube: '#FF0000',
      github: '#24292e',
      linkedin: '#0A66C2',
      twitter: '#1DA1F2',
      behance: '#0057ff',
      spotify: '#1DB954',
      whatsapp: '#25D366',
      discord: '#5865F2',
      email: '#6366f1',
      custom: '#6366f1'
    };

    setFormData({
      ...formData,
      platform,
      title: platform.charAt(0).toUpperCase() + platform.slice(1),
      customColor: colors[platform] || '#6366f1'
    });
  };

  // Timeline handlers
  const handleAddTimelineItem = () => {
    if (formData.type !== 'timeline') return;
    const newItem: TimelineItem = {
      id: `time-${Date.now()}`,
      period: '2023 — 2024',
      role: 'Novo Cargo',
      company: 'Empresa / Projeto',
      description: 'Principais realizações e responsabilidades.',
      current: false
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleUpdateTimelineItem = (index: number, updatedItem: TimelineItem) => {
    if (formData.type !== 'timeline') return;
    const newItems = [...formData.items];
    newItems[index] = updatedItem;
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveTimelineItem = (index: number) => {
    if (formData.type !== 'timeline') return;
    setFormData({ ...formData, items: formData.items.filter((_, idx) => idx !== index) });
  };

  // Tech Stack handlers
  const handleAddTechSkill = (name: string = 'Nova Skill') => {
    if (formData.type !== 'tech_stack') return;
    if (formData.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return;

    const newSkill: TechSkillItem = {
      id: `sk-${Date.now()}-${Math.random()}`,
      name,
      level: 'Avançado'
    };
    setFormData({ ...formData, skills: [...formData.skills, newSkill] });
  };

  const handleRemoveTechSkill = (id: string) => {
    if (formData.type !== 'tech_stack') return;
    setFormData({ ...formData, skills: formData.skills.filter(s => s.id !== id) });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
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
          className="relative w-full max-w-xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl z-10 flex flex-col text-zinc-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md shrink-0">
            <h3 className="text-base font-bold text-white">
              {isNew ? '✨ Adicionar Novo Bloco' : '✏️ Editar Bloco da Grade'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Type Selector if new */}
            {isNew && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Tipo de Bloco</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'timeline' as BentoCardType, label: 'Trajetória', icon: <Briefcase className="w-4 h-4" /> },
                    { type: 'tech_stack' as BentoCardType, label: 'Tech Stack', icon: <Cpu className="w-4 h-4" /> },
                    { type: 'github' as BentoCardType, label: 'GitHub Repo', icon: <FolderGit2 className="w-4 h-4" /> },
                    { type: 'content_review' as BentoCardType, label: 'Review / Post', icon: <Layers className="w-4 h-4" /> },
                    { type: 'social' as BentoCardType, label: 'Rede Social', icon: <Share2 className="w-4 h-4" /> },
                    { type: 'media' as BentoCardType, label: 'Vídeo / Player', icon: <Play className="w-4 h-4" /> },
                    { type: 'stats' as BentoCardType, label: 'Estatística', icon: <BarChart3 className="w-4 h-4" /> },
                    { type: 'quick_action' as BentoCardType, label: 'Doação / Apoio', icon: <Heart className="w-4 h-4" /> },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleTypeChange(item.type)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-semibold border transition-all ${
                        formData.type === item.type
                          ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/40'
                          : 'bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tamanho na Grade</label>
              <div className="grid grid-cols-5 gap-2">
                {(['1x1', '2x1', '1x2', '2x2', 'full'] as BentoCardSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({ ...formData, size })}
                    className={`py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
                      formData.size === size
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* FORM FIELDS BY TYPE */}

            {/* 1. TIMELINE / TRAJETÓRIA */}
            {formData.type === 'timeline' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Bloco</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Cargos & Experiências
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Cargo</span>
                    </button>
                  </div>

                  {formData.items.map((item, idx) => (
                    <div key={item.id || idx} className="p-3.5 rounded-2xl bg-zinc-800/50 border border-zinc-700 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Experiência #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.current || false}
                              onChange={(e) => handleUpdateTimelineItem(idx, { ...item, current: e.target.checked })}
                              className="rounded accent-emerald-500"
                            />
                            <span>Cargo Atual</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveTimelineItem(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Período (Ex: 2024 — Presente)"
                          value={item.period}
                          onChange={(e) => handleUpdateTimelineItem(idx, { ...item, period: e.target.value })}
                          className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Empresa / Estúdio"
                          value={item.company}
                          onChange={(e) => handleUpdateTimelineItem(idx, { ...item, company: e.target.value })}
                          className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Cargo (Ex: Senior Frontend Developer)"
                        value={item.role}
                        onChange={(e) => handleUpdateTimelineItem(idx, { ...item, role: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />

                      <textarea
                        rows={2}
                        placeholder="Breve descrição das conquistas (Opcional)"
                        value={item.description || ''}
                        onChange={(e) => handleUpdateTimelineItem(idx, { ...item, description: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. TECH STACK / ARSENAL */}
            {formData.type === 'tech_stack' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Bloco</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Presets rápidos em 1 clique */}
                <div className="p-3 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    ⚡ Clique para adicionar rapidamente:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {techPresets.map((preset) => {
                      const alreadyAdded = formData.skills.some(s => s.name.toLowerCase() === preset.toLowerCase());
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddTechSkill(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                            alreadyAdded
                              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                              : 'bg-zinc-800 hover:bg-cyan-600 text-zinc-200 hover:text-white border border-zinc-700'
                          }`}
                        >
                          + {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lista de Skills Ativas */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Tecnologias no Bloco ({formData.skills.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-white font-mono">{skill.name}</span>
                          <span className="text-[10px] text-indigo-400 font-semibold">{skill.level || 'Avançado'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTechSkill(skill.id)}
                          className="text-zinc-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. GITHUB CARD */}
            {formData.type === 'github' && (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Importação Automática do GitHub</span>
                    </span>
                    {githubSuccessMsg && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Dados importados!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://github.com/usuario/repo ou usuario/repo"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleFetchGithub}
                      disabled={isFetchingGithub}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    >
                      {isFetchingGithub ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isFetchingGithub ? 'Buscando...' : 'Puxar Dados'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Banner / Screenshot do Projeto (Opcional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="https://... ou faça upload"
                      value={formData.bannerImage || ''}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload do PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (dataUrl) => setFormData({ ...formData, bannerImage: dataUrl }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Proprietário (Usuário/Org)</label>
                    <input
                      type="text"
                      required
                      value={formData.repoOwner}
                      onChange={(e) => setFormData({ ...formData, repoOwner: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Repositório</label>
                    <input
                      type="text"
                      required
                      value={formData.repoName}
                      onChange={(e) => setFormData({ ...formData, repoName: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição do Projeto</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Linguagem</label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Estrelas ⭐</label>
                    <input
                      type="number"
                      value={formData.stars}
                      onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Forks 🍴</label>
                    <input
                      type="number"
                      value={formData.forks ?? 0}
                      onChange={(e) => setFormData({ ...formData, forks: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. CONTENT REVIEW */}
            {formData.type === 'content_review' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Conteúdo</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtítulo / Categoria</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Badge em Destaque</label>
                    <input
                      type="text"
                      placeholder="Ex: 🔥 Em Alta"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Imagem de Capa</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="https://... ou faça upload do computador"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload do PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (dataUrl) => setFormData({ ...formData, coverImage: dataUrl }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Resumo Rápido</label>
                  <textarea
                    rows={2}
                    value={formData.shortReview}
                    onChange={(e) => setFormData({ ...formData, shortReview: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Link de Destino</label>
                    <input
                      type="text"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={formData.buttonText || 'Acessar'}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. SOCIAL CARD */}
            {formData.type === 'social' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Plataforma</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => handlePlatformChange(e.target.value as SocialPlatform)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
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
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome de Exibição</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">@ ou Seguidores</label>
                    <input
                      type="text"
                      value={formData.handleOrCount || ''}
                      onChange={(e) => setFormData({ ...formData, handleOrCount: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor da Marca (Hex)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.customColor || '#6366f1'}
                        onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                        className="w-8 h-8 rounded-lg bg-transparent border border-zinc-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.customColor || '#6366f1'}
                        onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Link URL</label>
                  <input
                    type="text"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* 6. MEDIA */}
            {formData.type === 'media' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Link do Vídeo YouTube / Spotify</label>
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=... ou https://open.spotify.com/..."
                    value={formData.embedUrl}
                    onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Vídeo / Mídia</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* 7. STATS */}
            {formData.type === 'stats' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Valor Principal (Grande)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: +50k"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Título da Métrica</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Seguidores"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. QUICK ACTION */}
            {formData.type === 'quick_action' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Bloco de Apoio</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Chave Pix / Chave de Apoio</label>
                  <input
                    type="text"
                    required
                    value={formData.pixKey || ''}
                    onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              {!isNew && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja excluir este bloco da grade?')) {
                      onDelete(formData.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Bloco</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-950/50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Bloco</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
