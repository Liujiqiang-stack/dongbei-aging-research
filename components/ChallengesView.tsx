import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../constants';

interface ChallengesViewProps {
  onAskAI: (query: string) => void;
  lang: Language;
}

type Localized<T> = Record<Language, T>;

const ChallengesView: React.FC<ChallengesViewProps> = ({ onAskAI, lang }) => {
  const t = UI_STRINGS[lang];

  const challenges: Array<{
    title: Localized<string>;
    desc: Localized<string>;
    query: Localized<string>;
  }> = [
    {
      title: {
        zh: "劳动力资源枯竭",
        de: "Arbeitskräfteschwund",
        en: "Labor-force erosion",
        ru: "Истощение рабочей силы"
      },
      desc: {
        zh: "相比全国劳动年龄人口减少23%，东北将减少55%以上。",
        de: "Während China insgesamt rund 23% verliert, schrumpft die Region um über 55%.",
        en: "While China overall loses about 23% of working-age people, the region may lose 55%+.",
        ru: "По сравнению с общенациональным снижением ~23%, регион может потерять более 55% трудоспособного населения."
      },
      query: {
        zh: "分析劳动力枯竭对产业结构与企业用工的影响，并给出应对路径。",
        de: "Analysieren Sie die Folgen des Arbeitskräfteschwunds für Industrie und Arbeitsmärkte und skizzieren Sie Gegenstrategien.",
        en: "Analyze how labor erosion affects industry structure and firms, and propose responses.",
        ru: "Проанализируйте влияние истощения рабочей силы на промышленность и рынок труда и предложите меры реагирования."
      }
    },
    {
      title: {
        zh: "城市大面积收缩",
        de: "Massive Stadtschrumpfung",
        en: "Widespread urban shrinkage",
        ru: "Масштабное сжатие городов"
      },
      desc: {
        zh: "37个地级市中仅沈阳、大连、长春保持增长。",
        de: "Nur Shenyang, Dalian und Changchun wachsen – 34 von 37 Städte schrumpfen.",
        en: "Only Shenyang, Dalian and Changchun keep growing; 34 of 37 cities are shrinking.",
        ru: "Рост сохраняют лишь Шэньян, Далянь и Чанчунь; 34 из 37 городов сокращаются."
      },
      query: {
        zh: "收缩城市如何转型？请给出财政、产业与公共服务的综合方案。",
        de: "Wie können schrumpfende Städte transformiert werden? Bitte nennen Sie Maßnahmen zu Finanzen, Industrie und öffentlichen Diensten.",
        en: "How can shrinking cities transform? Provide an integrated plan across finance, industry and public services.",
        ru: "Как трансформировать сокращающиеся города? Дайте комплексный план по финансам, промышленности и общественным услугам."
      }
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6">{t.nav_challenges}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {challenges.map((c, i) => (
          <div
            key={i}
            className="group bg-white p-10 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          >
            <h3 className="text-xl font-black text-gray-900 mb-4">{c.title[lang]}</h3>
            <p className="text-gray-600 leading-relaxed mb-8">{c.desc[lang]}</p>
            <button
              onClick={() => onAskAI(c.query[lang])}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300"
            >
              {t.nav_ai}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesView;
