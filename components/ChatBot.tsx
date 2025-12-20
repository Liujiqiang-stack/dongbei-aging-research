
import React, { useState, useRef, useEffect } from 'react';
import { askGeminiAboutPaper } from '../geminiService';
import { ChatMessage, Language } from '../types';
import { UI_STRINGS } from '../constants';

interface ChatBotProps {
  prefilledQuery: string | null;
  onClearPrefill: () => void;
  lang: Language;
}

type ExpertRole = 'Scholar' | 'PolicyMaker' | 'DataAnalyst';

const ChatBot: React.FC<ChatBotProps> = ({ prefilledQuery, onClearPrefill, lang }) => {
  const tStrings = UI_STRINGS[lang];

  const L = <T,>(m: Record<Language, T>): T => m[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: tStrings.ai_welcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<ExpertRole>('Scholar');
  const scrollRef = useRef<HTMLDivElement>(null);

  const roleConfigs: Record<ExpertRole, { label: string; icon: string; prompt: string }> = {
    Scholar: {
      label: tStrings.role_scholar,
      icon: "🎓",
      prompt: L({
        zh: "学术严谨视角。",
        de: "Akademisch-theoretischer Fokus.",
        en: "Academic, theory-driven focus.",
        ru: "Академический, теоретический фокус."
      })
    },
    PolicyMaker: {
      label: tStrings.role_policy,
      icon: "🏛️",
      prompt: L({
        zh: "政策治理视角。",
        de: "Politisch-strategischer Fokus.",
        en: "Policy and governance focus.",
        ru: "Фокус на политике и управлении."
      })
    },
    DataAnalyst: {
      label: tStrings.role_analyst,
      icon: "📈",
      prompt: L({
        zh: "数据逻辑视角。",
        de: "Datenanalytischer Fokus.",
        en: "Data and modeling focus.",
        ru: "Фокус на данных и моделировании."
      })
    }
  };

  useEffect(() => {
    if (prefilledQuery) { handleSend(prefilledQuery); onClearPrefill(); }
  }, [prefilledQuery]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const queryText = text || input;
    if (!queryText.trim() || isLoading) return;
    const userMsg = queryText.trim();
    if (!text) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    const contextualPrompt = `[Role: ${roleConfigs[role].label}] Context: ${roleConfigs[role].prompt} Question: ${userMsg}`;
    const response = await askGeminiAboutPaper(contextualPrompt, messages, lang);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
      <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">🤖</div>
          <div><h3 className="font-black text-lg">{L({ zh: '专家助手', de: 'Experte', en: 'Assistant', ru: 'Эксперт' })}</h3><p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">{L({ zh: '研究引擎', de: 'Forschungs-Engine', en: 'Research Engine', ru: 'Исследовательский движок' })}</p></div>
        </div>
        <div className="flex bg-white/10 p-1 rounded-xl">
          {(Object.keys(roleConfigs) as ExpertRole[]).map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${role === r ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              <span className="sm:hidden">{roleConfigs[r].icon}</span><span className="hidden sm:inline">{roleConfigs[r].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-5 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-700 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white border p-4 rounded-2xl animate-pulse text-[10px] font-bold text-gray-400 uppercase tracking-widest">Analysieren...</div></div>}
      </div>

      <div className="p-8 border-t bg-white flex space-x-4">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={L({ zh: '输入问题...', de: 'Frage eingeben...', en: 'Type a question...', ru: 'Введите вопрос...' })} className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/20" />
        <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-black hover:bg-blue-600 transition-all disabled:opacity-30">
          {L({ zh: '咨询', de: 'Senden', en: 'Send', ru: 'Отправить' })}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
