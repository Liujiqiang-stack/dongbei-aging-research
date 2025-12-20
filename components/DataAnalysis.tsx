
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Brush 
} from 'recharts';
import { TOTAL_POP_DATA, WORKING_AGE_DATA, ELDERLY_POP_DATA, UI_STRINGS } from '../constants';
import { Language } from '../types';

const DataAnalysis: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = UI_STRINGS[lang];
  const L = <T,>(m: Record<Language, T>): T => m[lang];
  const [visibleRegions, setVisibleRegions] = useState({
    liaoning: true,
    jilin: true,
    heilongjiang: true,
    neChina: true
  });

  const toggleRegion = (region: keyof typeof visibleRegions) => {
    setVisibleRegions(prev => ({ ...prev, [region]: !prev[region] }));
  };

  const FilterButton = ({ id, label, color }: { id: keyof typeof visibleRegions, label: string, color: string }) => (
    <button
      onClick={() => toggleRegion(id)}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
        visibleRegions[id] 
          ? `${color} border-transparent shadow-sm` 
          : 'bg-gray-100 text-gray-400 border-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{L({ zh: '人口总量预测趋势', de: 'Trend: Bevölkerungsprojektion', en: 'Projected population trend', ru: 'Тренд: прогноз населения' })}</h2>
            <p className="text-gray-500 text-sm">{L({ zh: '单位：万人。拖动图表下方滑块可缩放时间轴。', de: 'Einheit: 10.000 Personen. Ziehen Sie den Regler, um die Zeitachse zu zoomen.', en: 'Unit: 10k people. Drag the slider to zoom the timeline.', ru: 'Ед.: 10 тыс. человек. Перетаскивайте ползунок, чтобы масштабировать ось времени.' })}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton id="neChina" label={L({ zh: '东北三省合计', de: 'Nordostchina gesamt', en: 'Northeast total', ru: 'СВ всего' })} color="bg-blue-600 text-white" />
            <FilterButton id="liaoning" label={L({ zh: '辽宁', de: 'Liaoning', en: 'Liaoning', ru: 'Ляонин' })} color="bg-indigo-500 text-white" />
            <FilterButton id="jilin" label={L({ zh: '吉林', de: 'Jilin', en: 'Jilin', ru: 'Цзилинь' })} color="bg-amber-500 text-white" />
            <FilterButton id="heilongjiang" label={L({ zh: '黑龙江', de: 'Heilongjiang', en: 'Heilongjiang', ru: 'Хэйлунцзян' })} color="bg-rose-500 text-white" />
          </div>
        </div>
        
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TOTAL_POP_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => val.toLocaleString()} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                itemStyle={{fontSize: '13px', fontWeight: 'bold'}}
              />
              <Legend verticalAlign="top" align="right" height={40} iconType="circle" />
              {visibleRegions.neChina && (
                <Area type="monotone" dataKey="neChina" name="东北合计" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorNe)" />
              )}
              {visibleRegions.liaoning && (
                <Line type="monotone" dataKey="liaoning" name="辽宁" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
              {visibleRegions.jilin && (
                <Line type="monotone" dataKey="jilin" name="吉林" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
              {visibleRegions.heilongjiang && (
                <Line type="monotone" dataKey="heilongjiang" name="黑龙江" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              )}
              <Brush dataKey="year" height={30} stroke="#cbd5e1" fill="#f8fafc" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">{L({ zh: '15-64岁劳动力', de: 'Erwerbsfähige (15–64)', en: 'Working-age (15–64)', ru: 'Трудоспособные (15–64)' })}</h3>
            <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-1 rounded">{L({ zh: '断崖式下跌风险', de: 'Risiko: starker Einbruch', en: 'Risk: steep drop', ru: 'Риск: резкое падение' })}</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WORKING_AGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="neChina" name="东北总劳动力" stroke="#3b82f6" strokeWidth={4} dot={false} />
                <Line type="monotone" dataKey="national" name="全国对比(标尺)" stroke="#94a3b8" strokeDasharray="10 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-gray-400 italic text-center">
            {L({ zh: '预测到2050年，东北劳动力规模仅为2010年顶峰时期的37%左右。', de: 'Bis 2050 könnte die Erwerbsbevölkerung nur noch rund 37% des Peaks von 2010 betragen.', en: 'By 2050, the labor force may be only ~37% of its 2010 peak.', ru: 'К 2050 году рабочая сила может составить лишь ~37% от пика 2010 года.' })}
          </p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">{L({ zh: '老年人口(65+)堆叠', de: 'Senioren (65+) – gestapelt', en: 'Elderly (65+) stacked', ru: 'Пожилые (65+) – накоп.' })}</h3>
            <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded">{L({ zh: '2040达峰预警', de: 'Warnung: Peak 2040', en: 'Alert: peak around 2040', ru: 'Предупр.: пик около 2040' })}</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ELDERLY_POP_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="liaoning" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Area type="monotone" dataKey="jilin" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area type="monotone" dataKey="heilongjiang" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-gray-400 italic text-center">
            {L({ zh: '各省老年人口规模持续扩张，社会抚养比压力剧增。', de: 'Die Zahl der Senioren wächst weiter – der Abhängigkeitsdruck steigt stark.', en: 'Elderly populations keep expanding, sharply increasing dependency pressure.', ru: 'Численность пожилых растёт, усиливая нагрузку коэффициента иждивения.' })}
          </p>
        </section>
      </div>
    </div>
  );
};

export default DataAnalysis;
