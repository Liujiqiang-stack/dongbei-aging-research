
export type Language = 'zh' | 'de' | 'en' | 'ru';

export interface PopulationData {
  year: string;
  national: number;
  neChina: number;
  liaoning: number;
  jilin: number;
  heilongjiang: number;
}

export enum AnalysisView {
  SUMMARY = 'summary',
  DATA_VIS = 'data_vis',
  MAP = 'map',
  MODELING = 'modeling',
  CHALLENGES = 'challenges',
  POLICY = 'policy',
  COMMENTARY = "COMMENTARY",
  AI_CHAT = 'ai_chat'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface SimulationParams {
  fertilityRate: number;
  outflowRate: number;
  retirementAge: number;
}
