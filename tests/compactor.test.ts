import { MemoryCompactor } from '../src/MemoryCompactor';

describe('MemoryCompactor', () => {
  const compactor = new MemoryCompactor();

  it('deduplicates duplicate records and keeps highest importance', () => {
    const records = [
      { id: '1', role: 'dev', content: 'Database migration complete', tags: [], timestamp: '2026-08-17T00:00:00Z', importance: 0.5 },
      { id: '2', role: 'dev', content: 'database migration complete', tags: [], timestamp: '2026-08-17T00:01:00Z', importance: 0.9 }
    ];

    const compacted = compactor.compact(records, 5);
    expect(compacted).toHaveLength(1);
    expect(compacted[0].importance).toBe(0.9);
  });
});
