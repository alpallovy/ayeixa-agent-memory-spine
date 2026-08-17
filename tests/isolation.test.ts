import { EpisodicMemoryStore } from '../src/EpisodicMemoryStore';
import { SessionIsolationEngine } from '../src/SessionIsolationEngine';

describe('SessionIsolationEngine', () => {
  it('strictly isolates memory records across tenants', () => {
    const store = new EpisodicMemoryStore();
    const isolator = new SessionIsolationEngine(store);

    isolator.storeEpisode('tenant-1', 's1', {
      id: 'ep-1',
      role: 'user',
      content: 'Confidential tenant 1 data',
      tags: ['confidential'],
      timestamp: new Date().toISOString(),
      importance: 1.0
    });

    isolator.storeEpisode('tenant-2', 's2', {
      id: 'ep-2',
      role: 'user',
      content: 'Tenant 2 public data',
      tags: ['public'],
      timestamp: new Date().toISOString(),
      importance: 0.5
    });

    const t1Data = isolator.retrieveEpisodes('tenant-1', 's1');
    const t2Data = isolator.retrieveEpisodes('tenant-2', 's2');

    expect(t1Data).toHaveLength(1);
    expect(t1Data[0].content).toContain('Confidential tenant 1');
    expect(t2Data).toHaveLength(1);
    expect(t2Data[0].content).toContain('Tenant 2');

    expect(isolator.verifyIsolation('tenant-1', 's1', 'tenant-2', 's2')).toBe(true);
  });
});
