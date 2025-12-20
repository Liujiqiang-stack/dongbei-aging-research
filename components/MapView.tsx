
import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { UI_STRINGS, TOTAL_POP_DATA } from '../constants';

interface MapViewProps {
  onAskAI: (query: string) => void;
  lang: Language;
}

type MapMode = 'density' | 'risk';

const MapView: React.FC<MapViewProps> = ({ onAskAI, lang }) => {
  const t = UI_STRINGS[lang];
  const [hovered, setHovered] = useState<string | null>(null);
  const [mode, setMode] = useState<MapMode>('risk');

  const data2020 = TOTAL_POP_DATA.find(d => d.year === '2020')!;
  const data2050 = TOTAL_POP_DATA.find(d => d.year === '2050(E)')!;

  const provinces = useMemo(() => [
    {
      id: 'hlj',
      name: t.map_province_hlj,
      pop2020: data2020.heilongjiang,
      pop2050: data2050.heilongjiang,
      path: "M285,15 L320,30 L350,20 L380,45 L395,80 L385,130 L340,165 L310,180 L280,175 L250,150 L220,135 L200,90 L210,50 L240,20 Z",
      labelPos: { x: 300, y: 80 },
      densityColor: 'fill-blue-600',
      riskColor: 'fill-rose-700',
      shrink: ((data2050.heilongjiang - data2020.heilongjiang) / data2020.heilongjiang * 100).toFixed(1)
    },
    {
      id: 'jl',
      name: t.map_province_jl,
      pop2020: data2020.jilin,
      pop2050: data2050.jilin,
      path: "M220,135 L250,150 L280,175 L310,180 L340,165 L320,210 L280,245 L220,240 L180,225 L165,185 Z",
      labelPos: { x: 250, y: 195 },
      densityColor: 'fill-blue-400',
      riskColor: 'fill-rose-500',
      shrink: ((data2050.jilin - data2020.jilin) / data2020.jilin * 100).toFixed(1)
    },
    {
      id: 'ln',
      name: t.map_province_ln,
      pop2020: data2020.liaoning,
      pop2050: data2050.liaoning,
      path: "M165,185 L180,225 L220,240 L185,280 L160,310 L100,295 L85,260 L110,210 Z",
      labelPos: { x: 140, y: 250 },
      densityColor: 'fill-blue-500',
      riskColor: 'fill-rose-400',
      shrink: ((data2050.liaoning - data2020.liaoning) / data2020.liaoning * 100).toFixed(1)
    }
  ], [t, data2020, data2050]);

  const handleProvinceClick = (p: any) => {
    onAskAI(lang === 'zh' 
      ? t.map_ai_prompt(p.name, mode, p.shrink) : `Detaillierte Analyse von ${p.name} (${mode === 'risk' ? 'Schrumpfungsrisiko' : 'Bevölkerungsdichte'}). Prognose: ${p.shrink}% Rückgang bis 2050.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-3/5 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{t.map_pop_title}</h2>
                <div className="flex items-center mt-2 space-x-3">
                   <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                     Spatial Intelligence
                   </div>
                   <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                   <p className="text-xs text-slate-400 font-medium">{t.map_system_label}</p>
                </div>
              </div>

              <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                <button 
                  onClick={() => setMode('density')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'density' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t.map_mode_density}
                </button>
                <button 
                  onClick={() => setMode('risk')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'risk' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t.map_mode_risk}
                </button>
              </div>
            </div>

            <div className="relative aspect-square sm:aspect-video flex items-center justify-center bg-slate-800/20 rounded-3xl border border-slate-800/50 group/map">
              <svg viewBox="0 0 450 350" className="w-full h-full max-h-[500px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <defs>
                  <filter id="mapGlow">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>
                </defs>

                {provinces.map((p) => {
                  const isActive = hovered === p.id;
                  const fillColor = mode === 'density' ? p.densityColor : p.riskColor;
                  
                  return (
                    <g key={p.id} className="cursor-pointer transition-transform duration-500"
                       onMouseEnter={() => setHovered(p.id)}
                       onMouseLeave={() => setHovered(null)}
                       onClick={() => handleProvinceClick(p)}>
                      <path
                        d={p.path}
                        className={`transition-all duration-700 ease-out stroke-slate-900 stroke-[1.5px] ${fillColor} ${isActive ? 'filter brightness-125 saturate-150' : 'opacity-70 grayscale-[20%]'}`}
                        filter={isActive ? "url(#mapGlow)" : ""}
                      />
                      <text 
                        x={p.labelPos.x} y={p.labelPos.y} 
                        className={`pointer-events-none font-black text-[15px] fill-white/90 uppercase tracking-tighter transition-all duration-300 ${isActive ? 'opacity-100 translate-y-[-2px]' : 'opacity-30'}`}
                        textAnchor="middle"
                      >
                        {lang === 'zh' ? p.name : p.id.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                  {mode === 'density' ? t.map_legend_density : t.map_legend_risk}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-sm ${mode === 'density' ? 'bg-blue-300' : 'bg-rose-300'}`}></div>
                  <div className={`w-3.5 h-3.5 rounded-sm ${mode === 'density' ? 'bg-blue-400' : 'bg-rose-500'}`}></div>
                  <div className={`w-3.5 h-3.5 rounded-sm ${mode === 'density' ? 'bg-blue-600' : 'bg-rose-700'}`}></div>
                  <span className="text-[10px] font-bold text-slate-300 ml-3">
                    {mode === 'density' ? 'Dense → Sparse' : 'Moderate → Critical'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/5 flex flex-col justify-center">
            <div className="bg-slate-800/30 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 space-y-8 shadow-inner">
              <div className="space-y-3">
                <div className="w-10 h-1 bg-blue-500 rounded-full"></div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest">{t.map_panel_title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  {lang === 'zh' 
                    ? t.map_panel_desc 
                    : "Basierend auf aktuellen Zensusdaten und Modellprojektionen zur Lokalisierung demografischer Brennpunkte."}
                </p>
              </div>

              <div className="space-y-4">
                {provinces.map((p) => (
                  <div 
                    key={p.id}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleProvinceClick(p)}
                    className={`group w-full p-6 rounded-2xl border transition-all duration-500 text-left flex items-center justify-between cursor-pointer ${
                      hovered === p.id ? 'bg-white/10 border-white/20 shadow-xl -translate-y-1' : 'bg-slate-900/60 border-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`w-1.5 h-12 rounded-full transition-all duration-500 ${hovered === p.id ? 'scale-y-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''} ${mode === 'risk' ? p.riskColor : p.densityColor}`}></div>
                      <div>
                        <div className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{p.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          {mode === 'risk' ? t.map_metric_rate : t.map_metric_base}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-black ${mode === 'risk' ? 'text-rose-500' : 'text-blue-500'}`}>
                        {mode === 'risk' ? `-${p.shrink}%` : `${p.pop2020.toLocaleString()}`}
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                        {mode === 'risk' ? t.map_metric_threshold : t.map_metric_unit_people}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                <div className="flex items-start space-x-3">
                  <span className="text-amber-500 text-sm mt-0.5">⚡</span>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                    {lang === 'zh' 
                      ? t.map_warning_hlj 
                      : "Warnung: Heilongjiang verzeichnet den stärksten Rückgang (-43,2%), was enorme Infrastrukturrisiken birgt."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
