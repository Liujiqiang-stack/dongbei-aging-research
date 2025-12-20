
import React from 'react';
import { Language } from '../types';
import { PAPER_CONTENT, UI_STRINGS } from '../constants';

interface DashboardProps {
  onAskAI: (query: string) => void;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ onAskAI, lang }) => {
  const t = UI_STRINGS[lang];
  const paper = PAPER_CONTENT[lang];

  const L = <T,>(m: Record<Language, T>): T => m[lang];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -mr-20 -mt-20 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/30 rounded-full -ml-10 -mb-10 blur-3xl -z-10"></div>
        
        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
          <div className="lg:w-3/5 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
                {t.dashboard_badge}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                {L({ zh: '东北人口高质量发展', de: 'Demografische Qualität in Nordostchina:', en: 'High-quality population development', ru: 'Качественное демографическое развитие' })} <br/>
                <span className="text-blue-600 font-black">{L({ zh: '面临的新挑战', de: 'Neue Herausforderungen', en: 'new challenges', ru: 'новые вызовы' })}</span>
              </h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-xl font-black text-slate-800 m-0">{L({ zh: '研究综述', de: 'Management Summary', en: 'Summary', ru: 'Резюме' })}</h3>
              </div>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                {paper.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => onAskAI(L({ zh: '详细解释什么是人口高质量发展，以及它对东北振兴的意义。', de: 'Bitte erklären Sie, was hochwertige Bevölkerungsentwicklung bedeutet und warum sie für die Revitalisierung des Nordostens wichtig ist.', en: 'Explain what high-quality population development means and why it matters for revitalization.', ru: 'Объясните, что означает качественное демографическое развитие и почему это важно для возрождения региона.' }))}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 hover:shadow-2xl transition-all shadow-xl active:scale-95"
              >
                {L({ zh: '深度解读高质量发展', de: 'Tiefenanalyse starten', en: 'Start deep dive', ru: 'Запустить разбор' })}
              </button>
              <button 
                onClick={() => onAskAI(L({ zh: '文章中提到的‘以质代量’具体指什么？', de: "Was bedeutet 'Qualität statt Quantität' in der Studie?", en: 'In the paper, what does “quality over quantity” mean?', ru: 'Что в статье означает «качество вместо количества»?' }))}
                className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                {L({ zh: '探索“以质代量”策略', de: 'Strategie entdecken', en: 'Explore “quality over quantity”', ru: 'Стратегия «качество вместо количества»' })}
              </button>
            </div>
          </div>

          <div className="lg:w-2/5 grid grid-cols-1 sm:grid-cols-2 gap-6 self-center">
            <StatCard title={t.stat_drop} value="43.2%" subtitle={L({ zh: '黑龙江最大降幅', de: 'Max. Rückgang HLJ', en: 'Largest drop (HLJ)', ru: 'Макс. падение (ХЛЦ)' })} color="text-rose-600 bg-rose-50/50 border-rose-100" onClick={() => onAskAI(L({ zh: '分析黑龙江人口收缩的地理因素。', de: 'Geografische Faktoren des Rückgangs in HLJ.', en: 'Analyze the geographic drivers of shrinkage in Heilongjiang.', ru: 'Проанализируйте географические факторы сокращения в Хэйлунцзяне.' }))} />
            <StatCard title={t.stat_labor} value="-55.2%" subtitle={L({ zh: '劳动力存量萎缩', de: 'Erwerbsfähige -55%', en: 'Labor stock shrink', ru: 'Сжатие трудовых ресурсов' })} color="text-amber-600 bg-amber-50/50 border-amber-100" onClick={() => onAskAI(L({ zh: '劳动力萎缩对当地养老金体系的挑战。', de: 'Herausforderung für das Rentensystem.', en: 'How labor shrinkage stresses pensions.', ru: 'Как сокращение рабочей силы давит на пенсионную систему.' }))} />
            <StatCard title={t.stat_cities} value="91.8%" subtitle={L({ zh: '地级市收缩占比', de: 'Stadtschrumpfung', en: 'Share of shrinking cities', ru: 'Доля сокращающихся городов' })} color="text-indigo-600 bg-indigo-50/50 border-indigo-100" onClick={() => onAskAI(L({ zh: '为什么只有沈阳、大连等核心城市在增长？', de: 'Wachstum nur in Kernstädten?', en: 'Why do only core cities keep growing?', ru: 'Почему растут только ключевые города?' }))} />
            <StatCard title={t.stat_peak} value="2040" subtitle={L({ zh: '深度老龄化达峰', de: 'Peak Alterung', en: 'Deep ageing peak', ru: 'Пик глубокого старения' })} color="text-blue-600 bg-blue-50/50 border-blue-100" onClick={() => onAskAI(L({ zh: '如何通过数字技术对冲老龄化风险？', de: 'Digitaltechnik gegen Alterung.', en: 'Can digital tech offset ageing risks?', ru: 'Может ли цифровизация снизить риски старения?' }))} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, color, onClick }: any) => (
  <button onClick={onClick} className={`p-8 rounded-[2rem] border-2 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:scale-95 group ${color}`}>
    <div className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60 mb-3">{title}</div>
    <div className="text-4xl font-black mb-2 tracking-tighter">{value}</div>
    <div className="text-xs font-bold opacity-80 leading-tight">{subtitle}</div>
    <div className="mt-6 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-xs">→</span>
    </div>
  </button>
);

export default Dashboard;
