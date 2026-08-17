import { EpisodicRecord } from './types';

export class EpisodicMemoryStore {
  // Key: tenantId:sessionId -> Array of episodes
  private storage: Map<string, EpisodicRecord[]> = new Map();

  private makeKey(tenantId: string, sessionId: string): string {
    return `${tenantId}::${sessionId}`;
  }

  public append(tenantId: string, sessionId: string, record: EpisodicRecord): void {
    const key = this.makeKey(tenantId, sessionId);
    const existing = this.storage.get(key) || [];
    existing.push({ ...record });
    this.storage.set(key, existing);
  }

  public getEpisodes(tenantId: string, sessionId: string): EpisodicRecord[] {
    const key = this.makeKey(tenantId, sessionId);
    return [...(this.storage.get(key) || [])];
  }

  public clearSession(tenantId: string, sessionId: string): void {
    const key = this.makeKey(tenantId, sessionId);
    this.storage.delete(key);
  }
}
