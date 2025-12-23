// src/App.tsx
import React, { useEffect, useState } from 'react';
import { AnalysisView, Language } from './types';
import { UI_STRINGS } from './constants';

import Dashboard from './components/Dashboard';
import DataAnalysis from './components/DataAnalysis';
import ChallengesView from './components/ChallengesView';
import PolicyView from './components/PolicyView';
import ChatBot from './components/ChatBot';
import ModelingTool from './components/ModelingTool';
import MapView from './components/MapView';

import commentaryMd from './dongbei_commentary_clean.md?raw';
import CommentaryView from './components/CommentaryView';

// Language bootstrap: remember last choice; otherwise follow browser preference.
const getInitialLang = (): Language => {
  const saved = localStorage.getItem('lang') as Language | null;
  if (saved) return saved;

  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('ru')) return 'ru';
  return 'zh';
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AnalysisView>(AnalysisView.SUMMARY);
  const [currentLang, setCurrentLang] = useState<Language>(getInitialLang);
  const [prefilledQuery, setPrefilledQuery] = useState<string | null>(null);

  // ✅ 防止 ru 缺字段导致白屏
  const t = (UI_STRINGS as any)[currentLang] ?? (UI_STRINGS as any).zh;

  useEffect(() => {
    localStorage.setItem('lang', currentLang);
  }, [currentLang]);

  const handleAskAI = (query: string) => {
    setPrefilledQuery(query);
    setActiveView(AnalysisView.AI_CHAT);
  };

  const NavItem = ({ view, label, icon }: { view: AnalysisView; label: string; icon: string }) => (
    <button
      onClick={() => {
        setActiveView(view);
        if (view !== AnalysisView.AI_CHAT) setPrefilledQuery(null);
      }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        activeView === view
          ? 'bg-blue-600 text-white shadow-lg scale-105'
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm whitespace-nowrap">{label}</span>
    </button>
  );

  const headerTitle =
    currentLang === 'zh'
      ? '东北人口研究工作台'
      : currentLang === 'de'
      ? 'Demo-Labor Nordostchina'
      : 'Исследовательская панель (Северо-Восток Китая)';

  const headerLogo =
    currentLang === 'zh' ? '智' : currentLang === 'ru' ? 'Р' : 'D';

  const footerRef =
    currentLang === 'zh'
      ? '学术引用: 人口学刊 2024.1'
      : currentLang === 'ru'
      ? 'Ссылка: Population Journal 2024.1'
      : 'Referenz: Population Journal 2024.1';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 左侧 Logo+标题 */}
          <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => setActiveView(AnalysisView.SUMMARY)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {headerLogo}
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">{headerTitle}</h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                Expert Research Suite v2.5 | {currentLang.toUpperCase()}
              </p>
            </div>
          </div>

          {/* 右侧：导航 + 语言切换 */}
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
              <NavItem view={AnalysisView.SUMMARY} label={t.nav_summary} icon="📄" />
              <NavItem view={AnalysisView.DATA_VIS} label={t.nav_data} icon="📈" />
              <NavItem view={AnalysisView.MAP} label={t.nav_map} icon="🗺️" />
              <NavItem view={AnalysisView.MODELING} label={t.nav_modeling} icon="🧪" />
              <NavItem view={AnalysisView.CHALLENGES} label={t.nav_challenges} icon="⚠️" />
              <NavItem view={AnalysisView.POLICY} label={t.nav_policy} icon="💡" />
              <NavItem view={AnalysisView.COMMENTARY} label={t.nav_commentary} icon="📰" />
              <NavItem view={AnalysisView.AI_CHAT} label={t.nav_ai} icon="🤖" />
            </nav>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
              <button
                onClick={() => setCurrentLang('zh')}
                className={`px-2 py-1 text-[10px] font-bold ${
                  currentLang === 'zh' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'
                }`}
              >
                CN
              </button>
              <button
                onClick={() => setCurrentLang('de')}
                className={`px-2 py-1 text-[10px] font-bold ${
                  currentLang === 'de' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setCurrentLang('ru')}
                className={`px-2 py-1 text-[10px] font-bold ${
                  currentLang === 'ru' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'
                }`}
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="transition-all duration-500">
          {activeView === AnalysisView.SUMMARY && <Dashboard onAskAI={handleAskAI} lang={currentLang} />}
          {activeView === AnalysisView.DATA_VIS && <DataAnalysis lang={currentLang} />}
          {activeView === AnalysisView.MAP && <MapView onAskAI={handleAskAI} lang={currentLang} />}
          {activeView === AnalysisView.MODELING && <ModelingTool onAskAI={handleAskAI} lang={currentLang} />}
          {activeView === AnalysisView.CHALLENGES && <ChallengesView onAskAI={handleAskAI} lang={currentLang} />}
          {activeView === AnalysisView.POLICY && <PolicyView lang={currentLang} />}

          {activeView === AnalysisView.COMMENTARY && (
            <CommentaryView lang={currentLang} markdown={commentaryMd} />
          )}

          {activeView === AnalysisView.AI_CHAT && (
            <ChatBot
              prefilledQuery={prefilledQuery}
              onClearPrefill={() => setPrefilledQuery(null)}
              lang={currentLang}
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
          <div className="mb-4 md:mb-0">
            <p className="font-bold text-gray-600">
              Decision Support System for Northeast China Demographic Change
            </p>
            <p className="mt-1 italic">Interdisziplinäres Forschungs-Tool | {footerRef}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
