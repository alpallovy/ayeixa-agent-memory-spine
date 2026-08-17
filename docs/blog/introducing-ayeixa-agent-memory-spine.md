# Multi-Tenant Contextual Memory Replay & Compaction for Autonomous Agents

## 1. Introduction & Overview
Long-running agentic workflows require access to past conversational turns, error precedents, and decision logs. In multi-tenant environments, storing and retrieving historical context presents two major risks: cross-tenant state leakage and context-window token overflow.

**Ayeixa Agent Memory Spine** (`@ayeixa/agent-memory-spine`) is an open-source TypeScript engine providing transactional multi-tenant session isolation, episodic memory indexing, and token-budgeted replay compaction.

- **GitHub Repository**: [https://github.com/alpallovy/ayeixa-agent-memory-spine](https://github.com/alpallovy/ayeixa-agent-memory-spine)
- **Status**: Pre-Release (`v0.1.0-alpha`)
- **License**: MIT
- **NPM Status**: Public registry publication is pending; evaluate and build locally.

---

## 2. Core Architecture
The system consists of four cooperating components:

1. **SessionIsolationEngine**: Enforces cryptographic boundaries between tenant and session identifiers, preventing cross-tenant access.
2. **EpisodicMemoryStore**: Structured in-memory storage for episodic events, tags, timestamps, and importance ratings.
3. **ContextualReplayEngine**: Retrieves relevant episodes within an exact token ceiling, formatting them into compact replay prompts.
4. **MemoryCompactor**: Applies relevance decay and deduplication to maintain high signal-to-noise ratio within limited context budgets.

---

## 3. Implemented Capabilities & Test Verification
Verified with hermetic unit tests:
- **Tenant Isolation**: Absolute boundary enforcement across tenant IDs (`tests/isolation.test.ts`).
- **Contextual Replay**: Token-budgeted episode reconstruction (`tests/replay.test.ts`).
- **Memory Compaction**: Deduplication and relevance decay algorithms (`tests/compactor.test.ts`).

Test Verification Receipt: **3/3 hermetic unit tests passing** (0 failures).

---

## 4. Local Installation & Quick Start
```bash
# Clone & build locally
git clone https://github.com/alpallovy/ayeixa-agent-memory-spine.git
cd ayeixa-agent-memory-spine
npm ci
npm run build
npm test
```

### Usage Example
```typescript
import { SessionIsolationEngine, EpisodicMemoryStore, ContextualReplayEngine } from './src';

const store = new EpisodicMemoryStore();
const isolator = new SessionIsolationEngine(store);

// Store isolated episode
isolator.storeEpisode("tenant-101", "session-A", {
  id: "ep-1",
  role: "developer",
  content: "Fixed regression in authentication token verification",
  tags: ["auth", "security"],
  timestamp: new Date().toISOString(),
  importance: 0.95
});

// Replay within token budget
const replay = new ContextualReplayEngine(store);
const context = replay.buildReplayContext("tenant-101", "session-A", { maxTokenBudget: 500 });
console.log("Replay Context Episodes:", context.episodes);
```

---

## 5. Limitations & Roadmap
- Pre-release `v0.1.0-alpha`.
- Distributed WAL persistence and vector index integrations are planned for the 2026–2028 roadmap.
- Public npm publication is pending.

---

## 6. Contributing
Check out `good first issue` labeled items on GitHub and review `CONTRIBUTING.md`.
- **License**: MIT
