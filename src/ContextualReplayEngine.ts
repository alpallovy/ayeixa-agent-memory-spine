import { EpisodicMemoryStore } from './EpisodicMemoryStore';
import { MemoryCompactor } from './MemoryCompactor';
import { ReplayOptions, ReplayContext, EpisodicRecord } from './types';

export class ContextualReplayEngine {
  private compactor = new MemoryCompactor();

  constructor(private store: EpisodicMemoryStore) {}

  public buildReplayContext(
    tenantId: string,
    sessionId: string,
    options: ReplayOptions
  ): ReplayContext {
    let records = this.store.getEpisodes(tenantId, sessionId);

    if (options.minImportance !== undefined) {
      records = records.filter(r => r.importance >= options.minImportance!);
    }

    if (options.tagFilter && options.tagFilter.length > 0) {
      records = records.filter(r => r.tags.some(t => options.tagFilter!.includes(t)));
    }

    // Estimate tokens (roughly 1 token per 4 chars)
    const estimateTokens = (recs: EpisodicRecord[]) =>
      Math.ceil(recs.reduce((sum, r) => sum + r.content.length, 0) / 4);

    let compacted = this.compactor.compact(records, 20);
    while (compacted.length > 0 && estimateTokens(compacted) > options.maxTokenBudget) {
      // Drop lowest importance episode
      compacted.sort((a, b) => a.importance - b.importance);
      compacted.shift();
      compacted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return {
      tenantId,
      sessionId,
      episodes: compacted,
      estimatedTokens: estimateTokens(compacted)
    };
  }
}
