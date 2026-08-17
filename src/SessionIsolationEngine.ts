import { EpisodicMemoryStore } from './EpisodicMemoryStore';
import { EpisodicRecord } from './types';

export class SessionIsolationEngine {
  constructor(private store: EpisodicMemoryStore) {}

  public storeEpisode(
    tenantId: string,
    sessionId: string,
    record: EpisodicRecord
  ): void {
    if (!tenantId || !sessionId) {
      throw new Error("Tenant ID and Session ID are strictly required for memory isolation.");
    }
    this.store.append(tenantId, sessionId, record);
  }

  public retrieveEpisodes(
    tenantId: string,
    sessionId: string
  ): EpisodicRecord[] {
    if (!tenantId || !sessionId) {
      throw new Error("Tenant ID and Session ID are strictly required.");
    }
    return this.store.getEpisodes(tenantId, sessionId);
  }

  public verifyIsolation(
    tenantA: string,
    sessionA: string,
    tenantB: string,
    sessionB: string
  ): boolean {
    const recordsA = this.store.getEpisodes(tenantA, sessionA);
    const recordsB = this.store.getEpisodes(tenantB, sessionB);

    // Ensure no overlapping record IDs unless identical tenant & session
    if (tenantA === tenantB && sessionA === sessionB) return true;

    const idsA = new Set(recordsA.map(r => r.id));
    for (const b of recordsB) {
      if (idsA.has(b.id)) return false;
    }
    return true;
  }
}
