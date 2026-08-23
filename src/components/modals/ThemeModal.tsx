import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Sliders, Check } from 'lucide-react';
import type { AppTheme, CustomThemeConfig } from '../../types';
import { themes } from '../../data/initialData';

interface ThemeModalProps {
  isOpen: boolean;
  currentTheme: AppTheme;
  customTheme: CustomThemeConfig;
  onSelectTheme: (theme: AppTheme) => void;
  onSaveCustomTheme: (ct: CustomThemeConfig) => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  currentTheme,
  customTheme,
  onSelectTheme,
  onSaveCustomTheme,
  onClose
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'preset' | 'custom'>('preset');

  if (!isOpen) return null;

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
          className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl z-10 flex flex-col text-zinc-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-none">
                  🎨 Central de Estilos & Temas
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Escolha um estilo pronto ou personalize cores e texturas</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-4 gap-2 shrink-0">
            <button
              onClick={() => setActiveSubTab('preset')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSubTab === 'preset'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Temas Prontos (8)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('custom')}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSubTab === 'custom'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Criar Tema Próprio</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 1. PRESET THEMES */}
            {activeSubTab === 'preset' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">8 Temas Curados com Design Refinado</h4>
                  <p className="text-xs text-zinc-400">Clique para aplicar instantaneamente ao vivo na tela</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t);
                        onSaveCustomTheme({ ...customTheme, isCustom: false });
                      }}
                      className={`relative p-3.5 rounded-2xl text-left border transition-all ${
                        !customTheme.isCustom && currentTheme.id === t.id
                          ? 'border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-950/40 ring-2 ring-indigo-500'
                          : 'border-zinc-800 bg-zinc-800/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className={`h-12 w-full rounded-xl mb-2.5 bg-gradient-to-r ${t.previewGradient} border border-white/10 flex items-center justify-end px-3`}>
                        {!customTheme.isCustom && currentTheme.id === t.id && (
                          <div className="w-5 h-5 rounded-full bg-white text-zinc-950 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-white">{t.name}</h5>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. CUSTOM THEME STUDIO */}
            {activeSubTab === 'custom' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">Criador de Tema Exclusivo</h4>
                    <p className="text-xs text-zinc-400">Texturas de fundo, cores, transparência e bordas</p>
                  </div>

                  <button
                    onClick={() => onSaveCustomTheme({ ...customTheme, isCustom: true })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      customTheme.isCustom 
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' 
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {customTheme.isCustom ? '✓ Usando Tema Customizado' : 'Ativar Meu Tema'}
                  </button>
                </div>

                {/* Estilo e Textura de Fundo */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">Textura do Fundo da Página</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'gradient' as const, label: 'Gradiente Suave' },
                      { id: 'dots' as const, label: 'Grid de Pontos (Dots)' },
                      { id: 'mesh' as const, label: 'Mesh Orgânico' },
                      { id: 'solid' as const, label: 'OLED / Sólido' },
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => onSaveCustomTheme({ ...customTheme, isCustom: true, pageBgType: bg.id })}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                          customTheme.pageBgType === bg.id
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Cor de Fundo 1</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.pageBgColor1}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, pageBgColor1: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.pageBgColor1}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, pageBgColor1: e.target.value })}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Cor de Fundo 2</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.pageBgColor2}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, pageBgColor2: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.pageBgColor2}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, pageBgColor2: e.target.value })}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Cor dos Cards</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.cardBgColor}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, cardBgColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.cardBgColor}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, cardBgColor: e.target.value })}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Cor de Destaque / Botões</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.accentColor}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, accentColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.accentColor}
                        onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, accentColor: e.target.value })}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Opacity & Blur */}
                <div className="space-y-4 pt-3 border-t border-zinc-800">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                      <span>Transparência dos Cards</span>
                      <span className="font-mono text-indigo-400">{customTheme.cardOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={customTheme.cardOpacity}
                      onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, cardOpacity: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                      <span>Desfoque de Vidro (Blur)</span>
                      <span className="font-mono text-indigo-400">{customTheme.cardBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={customTheme.cardBlur}
                      onChange={(e) => onSaveCustomTheme({ ...customTheme, isCustom: true, cardBlur: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
