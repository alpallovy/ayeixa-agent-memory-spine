# Ayeixa Agent Memory Spine

> Transactional multi-tenant session isolation and contextual memory replay engine.

## Status: Pre-Release (v0.1.0-alpha)
*Note: Public npm registry publication is pending. To use or evaluate this package, clone and build locally.*

## Features
- **Hermetic Tenant Isolation**: Cryptographic tenant boundaries preventing cross-tenant and cross-session data leakage.
- **Structured Episodic Storage**: In-memory and extensible storage for decision logs, episodic dialogues, and error precedents.
- **Contextual Replay Engine**: Time-windowed retrieval engine generating token-budgeted replay prompts for continuous learning.
- **Sliding-Window Memory Compactor**: Deduplicates historical records and applies relevance decay to fit LLM context limits.

## Installation & Local Build
```bash
# Clone the repository
git clone https://github.com/alpallovy/ayeixa-agent-memory-spine.git
cd ayeixa-agent-memory-spine

# Install dependencies and build
npm install
npm run build
npm test
```

## Quick Start
```typescript
import { SessionIsolationEngine, EpisodicMemoryStore, ContextualReplayEngine, MemoryCompactor } from './src';

// 1. Initialize store
const store = new EpisodicMemoryStore();
const isolator = new SessionIsolationEngine(store);

// 2. Store isolated episode
isolator.storeEpisode("tenant-1", "session-A", {
  id: "ep-1",
  role: "developer",
  content: "Fixed regression in auth token validation",
  tags: ["auth", "security"],
  timestamp: new Date().toISOString(),
  importance: 0.9
});

// 3. Replay with token budget
const replay = new ContextualReplayEngine(store);
const context = replay.buildReplayContext("tenant-1", "session-A", { maxTokenBudget: 500 });
console.log("Replay Episodes:", context.episodes);
```

## License
Distributed under the **MIT** License. See `LICENSE` for details.

## Technical Deep Dive
Read the full launch technical article: [`docs/blog/introducing-ayeixa-agent-memory-spine.md`](docs/blog/introducing-ayeixa-agent-memory-spine.md)
