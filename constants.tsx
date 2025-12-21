
import { PopulationData } from './types';

export const TOTAL_POP_DATA: PopulationData[] = [
  { year: '2000', national: 129533, neChina: 10655, liaoning: 4238, jilin: 2728, heilongjiang: 3689 },
  { year: '2010', national: 133972, neChina: 10952, liaoning: 4375, jilin: 2746, heilongjiang: 3831 },
  { year: '2020', national: 141178, neChina: 9851, liaoning: 4259, jilin: 2407, heilongjiang: 3185 },
  { year: '2050(E)', national: 129846, neChina: 6262, liaoning: 2881, jilin: 1571, heilongjiang: 1810 }
];

export const WORKING_AGE_DATA: PopulationData[] = [
  { year: '2000', national: 88793, neChina: 8000, liaoning: 3157, jilin: 2051, heilongjiang: 2792 },
  { year: '2010', national: 99844, neChina: 8665, liaoning: 3424, jilin: 2187, heilongjiang: 3054 },
  { year: '2020', national: 96776, neChina: 7153, liaoning: 3044, jilin: 1750, heilongjiang: 2359 },
  { year: '2050(E)', national: 74517, neChina: 3204, liaoning: 1506, jilin: 818, heilongjiang: 880 }
];

export const ELDERLY_POP_DATA: PopulationData[] = [
  { year: '2000', national: 8811, neChina: 692, liaoning: 332, jilin: 160, heilongjiang: 200 },
  { year: '2010', national: 11883, neChina: 1000, liaoning: 451, jilin: 230, heilongjiang: 319 },
  { year: '2020', national: 19064, neChina: 1615, liaoning: 742, jilin: 376, heilongjiang: 497 },
  { year: '2050(E)', national: 40199, neChina: 2630, liaoning: 1174, jilin: 642, heilongjiang: 814 }
];

export const PAPER_CONTENT = {
  zh: {
    title: "东北地区人口高质量发展面临的新挑战",
    author: "于潇, 高震极 (2024)",
    summary: "研究显示东北人口负增长加速，劳动力规模至2050年可能缩减至1/3，老龄化程度远超全国平均水平。37个城市中34个在收缩。建议通过提升人口素质、完善生育支持和数字化农业来实现‘以质代量’的振兴。",
    corePoints: [
      "人口负增长加速：2050年黑龙江降幅达43.2%",
      "劳动力枯竭：东北三省劳动年龄人口将减少55.2%",
      "深度老龄化：2040年达峰，比全国提前且程度更深",
      "收缩城市：91.8%的城市处于人口减少状态"
    ]
  },
  de: {
    title: "Neue Herausforderungen für die hochwertige Bevölkerungsentwicklung in Nordostchina",
    author: "Yu Xiao, Gao Zhenji (2024)",
    summary: "Die Studie zeigt, dass sich der Bevölkerungsrückgang in Nordostchina beschleunigt. Die Erwerbsbevölkerung könnte bis 2050 auf ein Drittel schrumpfen. 34 von 37 Städten schrumpfen. Empfohlen wird eine qualitative Entwicklung durch Bildung, Geburtenförderung und digitale Landwirtschaft.",
    corePoints: [
      "Beschleunigter Rückgang: -43,2% in Heilongjiang bis 2050",
      "Arbeitskräftemangel: -55,2% Erwerbsfähige in der Region",
      "Tiefe Überalterung: Peak 2040, früher als der nationale Schnitt",
      "Shrinking Cities: 91,8% der Städte verzeichnen Rückgang"
    ]
  }
};

export const UI_STRINGS = {
  zh: {
    nav_summary: "首页", nav_data: "趋势分析", nav_map: "地理图谱", nav_modeling: "仿真模拟", nav_challenges: "核心挑战", nav_policy: "振兴对策", nav_ai: "AI 智库",
    stat_drop: "2050 预测峰值降幅", stat_labor: "劳动力资源损耗", stat_cities: "城市收缩指数", stat_peak: "深度老龄化拐点",
    sim_title: "战略决策参数", sim_fertility: "总和生育率 (TFR)", sim_migration: "年均迁出率", sim_retirement: "退休制度调整",
    sim_btn: "提交 AI 专家系统审计模型", sim_chart_title: "战略预测：东北人口动态演变",
    ai_welcome: "您好！我是东北人口研究专家助手。我已深度学习 2024 年核心学术成果，请问您想从哪个维度展开研究？",
    role_scholar: "学术视角", role_policy: "政策规划", role_analyst: "数据建模",
    map_pop_title: "人口密度与风险空间分布", map_legend_shrink: "预测收缩强度", map_province_hlj: "黑龙江", map_province_jl: "吉林", map_province_ln: "辽宁"
    nav_commentary: "新闻评论",
  },
  de: {
    nav_summary: "Home", nav_data: "Trends", nav_map: "Karte", nav_modeling: "Simulation", nav_challenges: "Kernfragen", nav_policy: "Strategien", nav_ai: "KI-Experte",
    stat_drop: "Max. Rückgang 2050", stat_labor: "Arbeitskraftverlust", stat_cities: "Stadtschrumpfung", stat_peak: "Peak Überalterung",
    sim_title: "Strategische Parameter", sim_fertility: "Fertilität (TFR)", sim_migration: "Migration p.a.", sim_retirement: "Rentenanpassung",
    sim_btn: "Modell durch KI-Experten prüfen", sim_chart_title: "Strategische Prognose: Demografie Nordostchina",
    ai_welcome: "Hallo! Ich bin Ihr KI-Experte für die Demografie Nordostchinas. Aus welcher Perspektive möchten Sie forschen?",
    role_scholar: "Akademisch", role_policy: "Strategisch", role_analyst: "Analytisch",
    map_pop_title: "Bevölkerungsdichte & Risikoanalyse", map_legend_shrink: "Schrumpfungsintensität", map_province_hlj: "Heilongjiang", map_province_jl: "Jilin", map_province_ln: "Liaoning"
  nav_commentary: "Kommentar",
  }
};
