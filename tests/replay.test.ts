import { EpisodicMemoryStore } from '../src/EpisodicMemoryStore';
import { ContextualReplayEngine } from '../src/ContextualReplayEngine';

describe('ContextualReplayEngine', () => {
  it('builds replay context within specified token budget', () => {
    const store = new EpisodicMemoryStore();
    for (let i = 0; i < 10; i++) {
      store.append('tenant-A', 's-main', {
        id: 'rec-' + i,
        role: 'agent',
        content: 'Long explanatory episode memory line number ' + i,
        tags: ['log'],
        timestamp: new Date(Date.now() + i * 1000).toISOString(),
        importance: (i + 1) / 10
      });
    }

    const replay = new ContextualReplayEngine(store);
    const context = replay.buildReplayContext('tenant-A', 's-main', {
      maxTokenBudget: 50
    });

    expect(context.estimatedTokens).toBeLessThanOrEqual(50);
    expect(context.episodes.length).toBeGreaterThan(0);
  });
});
