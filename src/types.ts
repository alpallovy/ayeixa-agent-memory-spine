export interface EpisodicRecord {
  id: string;
  role: string;
  content: string;
  tags: string[];
  timestamp: string;
  importance: number; // 0.0 to 1.0
  metadata?: Record<string, unknown>;
}

export interface ReplayOptions {
  maxTokenBudget: number;
  minImportance?: number;
  tagFilter?: string[];
}

export interface ReplayContext {
  tenantId: string;
  sessionId: string;
  episodes: EpisodicRecord[];
  estimatedTokens: number;
}
