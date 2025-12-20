
import React, { useState, useMemo } from 'react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { TOTAL_POP_DATA, UI_STRINGS } from '../constants';
import { Language } from '../types';

interface ModelingToolProps {
  onAskAI: (query: string) => void;
  lang: Language;
}

const ModelingTool: React.FC<ModelingToolProps> = ({ onAskAI, lang }) => {
  const [fertility, setFertility] = useState(0.75);
  const [migration, setMigration] = useState(1.2);
  const [retirement, setRetirement] = useState(60);
  const tStrings = UI_STRINGS[lang];

  const L = <T,>(m: Record<Language, T>): T => m[lang];

  const simulatedData = useMemo(() => {
    const baseYear = 2020;
    const years = [2020, 2025, 2030, 2035, 2040, 2045, 2050];
    
    return years.map(year => {
      const t = (year - baseYear) / 30;
      const elapsed = year - baseYear;
      const baselinePop = TOTAL_POP_DATA.find(d => d.year.includes(year.toString()))?.neChina || 6262;
      
      const fertilityImpact = (fertility - 0.75) * 0.2 * Math.pow(t, 1.8); 
      const migrationImpact = (migration / 100) * elapsed * 0.75; 
      
      let simulatedValue = baselinePop * (1 + fertilityImpact) * (1 - migrationImpact);
      simulatedValue = Math.max(simulatedValue, 4200);

      const laborRatio = 0.72 - (0.22 * t);
      const retirementBonus = (retirement - 60) * 0.028; 
      const simulatedLabor = simulatedValue * laborRatio * (1 + retirementBonus);

      const depRatio = ((simulatedValue - simulatedLabor) / simulatedLabor * 100).toFixed(1);

      return {
        year: year.toString(),
        baseline: Math.round(baselinePop),
        simulated: Math.round(simulatedValue),
        labor: Math.round(simulatedLabor),
        ratio: parseFloat(depRatio)
      };
    });
  }, [fertility, migration, retirement]);

  const currentResult = simulatedData[simulatedData.length - 1];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">🧪</div>
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-none">{tStrings.sim_title}</h3>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Model Config</span>
              </div>
            </div>

            <div className="space-y-10">
              <ParameterSlider label={tStrings.sim_fertility} value={fertility} min={0.5} max={2.1} step={0.05} unit="" onChange={setFertility} color="text-blue-600" accent="bg-blue-600" />
              <ParameterSlider label={tStrings.sim_migration} value={migration} min={0} max={3} step={0.1} unit="%" onChange={setMigration} color="text-rose-500" accent="bg-rose-500" />
              <ParameterSlider label={tStrings.sim_retirement} value={retirement} min={60} max={70} step={1} unit={L({ zh: '岁', de: 'J.', en: 'yr', ru: 'лет' })} onChange={setRetirement} color="text-emerald-500" accent="bg-emerald-500" />
            </div>
          </div>

          <button 
            onClick={() => onAskAI(
              lang === 'zh' 
              ? `专家审计请求：我在仿真模型中设定生育率为${fertility}，年均净迁出率为${migration}%，退休年龄为${retirement}岁。结果显示到2050年，东北总人口将为${currentResult.simulated}万，抚养比达到${currentResult.ratio}。请从社会保障可持续性和产业转型角度给出专业评估。` 
              : `Experten-Audit: Simulation bei TFR ${fertility}, Migration ${migration}% und Rente ${retirement} J. Ergebnisse für 2050: Bev. ${currentResult.simulated} Mio., Abhängigkeitsindex ${currentResult.ratio}. Bitte bewerten Sie die Rentensicherheit und den Strukturwandel.`
            )}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 group"
          >
            <span>{tStrings.sim_btn}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl min-h-[550px] flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{tStrings.sim_chart_title}</h3>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-[0.2em]">Strategic Projection: 2020 - 2050</p>
              </div>
              <div className="flex bg-slate-50/80 backdrop-blur-sm p-1.5 rounded-xl text-[10px] font-black border border-slate-100">
                <div className="px-3 py-2 flex items-center"><span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-2"></span> {lang === 'zh' ? '预测总人口' : 'Bevölkerung'}</div>
                <div className="px-3 py-2 flex items-center"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2"></span> {lang === 'zh' ? '有效劳动力' : 'Arbeitskraft'}</div>
              </div>
            </div>
            
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={simulatedData}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} domain={[0, 150]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}}
                    cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="simulated" name={L({ zh: '仿真总人口', de: 'Bev. Simulation', en: 'Simulated population', ru: 'Симуляция населения' })} stroke="#2563eb" strokeWidth={5} fill="#2563eb" fillOpacity={0.03} animationDuration={1500} />
                  <Line yAxisId="left" type="monotone" dataKey="labor" name={L({ zh: '仿真劳动力', de: 'Arbeitskraft', en: 'Simulated labor', ru: 'Симуляция рабочей силы' })} stroke="#10b981" strokeWidth={4} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} animationDuration={1500} />
                  <Line yAxisId="left" type="monotone" dataKey="baseline" name={L({ zh: '论文基准线', de: 'Baseline', en: 'Paper baseline', ru: 'Базовая линия' })} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="8 8" dot={false} opacity={0.5} />
                  <Line yAxisId="right" type="monotone" dataKey="ratio" name={L({ zh: '总抚养比指数', de: 'Abhängigkeit', en: 'Dependency index', ru: 'Индекс нагрузки' })} stroke="#f59e0b" strokeWidth={3} dot={false} opacity={0.4} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <ResultMetric label={L({ zh: '2050 终端规模', de: 'Bevölkerung 2050', en: '2050 terminal size', ru: 'Итог 2050' })} value={`${currentResult.simulated}`} unit={L({ zh: "万人", de: "Mio.", en: "10k", ru: "10 тыс." })} sub={lang === 'zh' ? `偏差值: ${currentResult.simulated - currentResult.baseline > 0 ? '+' : ''}${currentResult.simulated - currentResult.baseline}` : `Abweichung: ${currentResult.simulated - currentResult.baseline}`} />
             <ResultMetric label={L({ zh: '劳动力存续', de: 'Arbeitskraft 2050', en: 'Labor in 2050', ru: 'Рабочая сила 2050' })} value={`${currentResult.labor}`} unit={L({ zh: "万人", de: "Mio.", en: "10k", ru: "10 тыс." })} sub={L({ zh: '含延迟退休综合修正', de: 'Inkl. Rentenkorrektur', en: 'Incl. retirement correction', ru: 'С учётом пенсионной коррекции' })} color="text-emerald-600" />
             <ResultMetric label={L({ zh: '社会压力指数', de: 'Last-Index', en: 'Social pressure index', ru: 'Индекс нагрузки' })} value={`${currentResult.ratio}`} unit="" sub={L({ zh: '每100名劳动者负担人口', de: 'Pro 100 Erwerbstätige', en: 'Per 100 workers', ru: 'На 100 работников' })} color="text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultMetric = ({ label, value, unit, sub, color = "text-blue-600" }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{label}</div>
    <div className={`text-4xl font-black ${color} mb-2 tracking-tight`}>{value}<span className="text-sm ml-1.5 opacity-40 font-bold">{unit}</span></div>
    <div className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full inline-block">{sub}</div>
  </div>
);

const ParameterSlider = ({ label, value, min, max, step, unit, onChange, color, accent }: any) => (
  <div className="space-y-5">
    <div className="flex justify-between items-end">
      <label className="text-sm font-black text-slate-700">{label}</label>
      <div className={`text-xl font-black ${color} tabular-nums`}>{value}<span className="text-xs ml-0.5 opacity-50">{unit}</span></div>
    </div>
    <input 
      type="range" 
      min={min} max={max} step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-current ${accent} transition-all`}
    />
  </div>
);

export default ModelingTool;
