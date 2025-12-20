import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../constants';

type Localized<T> = Record<Language, T>;

const PolicyView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  const recommendations: Array<{ title: Localized<string>; details: Localized<string> }> = [
    {
      title: { zh: "完善生育支持", de: "Geburtenförderung", en: "Strengthen fertility support", ru: "Поддержка рождаемости" },
      details: {
        zh: "实施生育补贴，大力发展普惠托育，降低家庭养育成本。",
        de: "Finanzielle Anreize und Ausbau der Kinderbetreuung, um Familien zu entlasten.",
        en: "Introduce child allowances and expand affordable childcare to lower family costs.",
        ru: "Ввести субсидии и расширить доступные услуги ухода за детьми, снижая издержки семей."
      }
    },
    {
      title: { zh: "教育科技赋能", de: "Bildung & Technik", en: "Education & innovation", ru: "Образование и инновации" },
      details: {
        zh: "加大教育投入，提升高校与科研机构创新能力，带动产业升级。",
        de: "Investitionen in Universitäten und Forschung, um Innovation und Industrietransformation zu beschleunigen.",
        en: "Invest in universities and R&D to drive innovation and industrial upgrading.",
        ru: "Увеличить инвестиции в вузы и НИОКР для ускорения инноваций и модернизации промышленности."
      }
    },
    {
      title: { zh: "优化空间布局", de: "Raumplanung", en: "Optimize spatial planning", ru: "Пространственное планирование" },
      details: {
        zh: "引导人口与产业向大都市圈集聚，推进公共服务与基础设施的再配置。",
        de: "Bevölkerung und Wirtschaft in Metropolregionen bündeln und Infrastruktur sowie Dienste neu ausrichten.",
        en: "Guide people and industry toward metro areas, reallocating infrastructure and public services accordingly.",
        ru: "Сконцентрировать население и экономику в агломерациях, перераспределяя инфраструктуру и услуги."
      }
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl p-8 border shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">🚀</span> {t.nav_policy}
        </h2>

        <div className="space-y-4">
          {recommendations.map((r, i) => (
            <div key={i} className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title[lang]}</h3>
              <p className="text-gray-700 leading-relaxed">{r.details[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyView;
