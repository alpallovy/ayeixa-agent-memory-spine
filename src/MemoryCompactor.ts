import { EpisodicRecord } from './types';

export class MemoryCompactor {
  public compact(records: EpisodicRecord[], maxRecords = 10): EpisodicRecord[] {
    // 1. Deduplicate by normalized content (keep record with highest importance)
    const uniqueMap = new Map<string, EpisodicRecord>();
    for (const r of records) {
      const normalized = r.content.trim().toLowerCase();
      if (!uniqueMap.has(normalized) || (r.importance > uniqueMap.get(normalized)!.importance)) {
        uniqueMap.set(normalized, r);
      }
    }

    const uniqueList = Array.from(uniqueMap.values());

    if (uniqueList.length <= maxRecords) {
      return uniqueList.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    // 2. Sort by importance descending, then recency
    uniqueList.sort((a, b) => {
      if (b.importance !== a.importance) return b.importance - a.importance;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return uniqueList.slice(0, maxRecords).sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}
