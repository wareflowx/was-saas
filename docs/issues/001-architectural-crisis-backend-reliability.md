# Critical Architectural Problems: Backend Code Changes Not Taking Effect

## Problem Statement

The application suffers from a **critical architectural breakdown** where code changes in source files (`src/`) do not take effect in the running application. This creates an unreliable development environment where:

1. Modifications to TypeScript source files are ignored
2. Compiled output contains orphaned code with no corresponding source
3. Manual patches to compiled files are required for changes to work
4. The build process fails silently, leaving stale compiled output

This makes the application **impossible to maintain reliably** and violates the most basic principle of software development: **code changes should take effect**.

---

## Root Cause Analysis

### 1. Orphaned Compiled Files

**Compiled files exist without source:**

```
dist-backend/backend/services/
├── import-service.cjs      ✅ Exists at runtime
├── plugin-service.cjs      ✅ Exists at runtime
└── analysis-service.cjs    ✅ Exists at runtime

src/backend/services/
├── import-service.ts       ❌ DOES NOT EXIST
├── plugin-service.ts       ❌ DOES NOT EXIST
└── analysis-service.ts     ❌ DOES NOT EXIST
```

These service files are loaded by `electron/main.cjs` but have **no TypeScript source**. They cannot be modified through normal development workflow.

### 2. Duplicate Preload System

**Two preload systems exist, only one is used:**

```
src/preload/index.ts         (442 lines, TypeScript)
  ↓ compiled by tsconfig.electron.json
dist-electron/preload/index.cjs  (155 lines)
  ↓ NEVER LOADED ❌

electron/preload.cjs         (165 lines, manual CommonJS)
  ↓ copied by copy-preload.cjs
dist-electron/preload.cjs    (165 lines)
  ↓ LOADED BY ELECTRON ✅
```

**Impact:** Developers modify `src/preload/index.ts` thinking it will work, but changes are ignored.

### 3. Broken Build Process

The build process has multiple issues:

**package.json build command:**
```json
"build": "vite build && tsc && electron-builder && pnpm run rename-to-cjs && pnpm run copy-preload"
```

**Problems:**
- `tsc` uses default `tsconfig.json` which has `"noEmit": true` → **no output**
- Backend-specific configs (`tsconfig.backend.json`, `tsconfig.electron.json`) are **never used** in build
- `rename-to-cjs.js` runs even when compilation fails
- No validation that source files match compiled output

**Current state:** Running `npx tsc -p tsconfig.backend.json` produces **40+ TypeScript errors**, blocking compilation.

### 4. Runtime Module Resolution

**What Electron actually loads:**

```javascript
// electron/main.cjs lines 8-13
const queries = require('../dist-backend/backend/database/queries.cjs')
const importService = require('../dist-backend/backend/services/import-service.cjs')  // Orphan!
const pluginService = require('../dist-backend/backend/services/plugin-service.cjs')  // Orphan!
```

**What developers think they should modify:**

```typescript
// src/backend/database/queries.ts
// src/backend/services/import-service.ts  // Doesn't exist!
// src/backend/services/plugin-service.ts  // Doesn't exist!
```

---

## Impact on Development

### Severity: Critical

**User-facing symptoms:**
- Code changes don't work → "It's broken, why?"
- Manual patching required for every change → "I have to edit compiled files?"
- Impossible to debug → "Where is this code coming from?"
- Loss of developer trust in the codebase

**Technical debt accumulation:**
- Workarounds pile up
- No one knows which files are authoritative
- Git history becomes meaningless (editing compiled files)
- Onboarding is impossible

**Example from recent work:**
1. Modified `src/backend/import/plugins/mock-data-generator/index.ts` to fix user roles
2. Ran build → TypeScript errors, no compilation
3. Application still uses old compiled code with wrong roles
4. Required manual patch of `dist-backend/.../index.cjs` to fix

---

## Architectural Violations

The current state violates multiple stated principles from `CLAUDE.md`:

| Principle | Status | Evidence |
|-----------|--------|----------|
| "Functional programming only" | ❌ | Service layer with side effects exists |
| "No service layer" | ❌ | `import-service.cjs`, `plugin-service.cjs` exist |
| "Static imports only" | ❌ | Dynamic requires in main.cjs |
| "Code changes should take effect" | ❌ | Entire issue |

---

## Proposed Solutions

### Option A: Create Missing Source Files (Conservative)

**Action:** Create TypeScript sources for orphaned compiled files.

```bash
src/backend/services/
├── import-service.ts       ← Create from dist-backend/.../import-service.cjs
├── plugin-service.ts       ← Create from dist-backend/.../plugin-service.cjs
└── analysis-service.ts     ← Create if needed
```

**Pros:**
- Minimal changes to architecture
- Maintains current separation

**Cons:**
- Violates "no service layer" principle
- Doesn't fix duplicate preload problem
- Still overly complex

---

### Option B: Remove Service Layer (Recommended)

**Action:**
1. Delete orphaned service files
2. Move service logic into `electron/main.cjs` as pure functions
3. Direct imports from backend modules

**Before:**
```javascript
const importService = require('../dist-backend/backend/services/import-service.cjs')
await importService.generateMockData(warehouseId, plugin)
```

**After:**
```javascript
const { loadToDatabase } = require('../dist-backend/backend/import/loader.cjs')
const { mockDataGeneratorPlugin } = require('../dist-backend/backend/import/plugins/registry.cjs')
const normalizedData = mockDataGeneratorPlugin.transform(emptyInput, context)
const stats = loadToDatabase(normalizedData)
```

**Pros:**
- Follows stated architecture principles
- Removes phantom dependencies
- Simpler, more maintainable
- Code changes work as expected

**Cons:**
- Requires refactoring main.cjs
- Breaks current module structure

---

### Option C: Fix Build Process (Technical)

**Action:** Rewrite build configuration to work correctly.

**New build command:**
```json
{
  "scripts": {
    "build": "vite build",
    "build:backend": "tsc -p tsconfig.backend.json",
    "build:electron": "tsc -p tsconfig.electron.json",
    "build:all": "pnpm build:backend && pnpm build:electron && pnpm build",
    "dev": "concurrently \"vite\" \"pnpm dev:electron\"",
    "dev:electron": "pnpm build:electron && electron ."
  }
}
```

**tsconfig.base.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "strict": true,
    "skipLibCheck": true
  }
}
```

**tsconfig.backend.json extends base:**
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist-backend",
    "rootDir": "./src"
  },
  "include": ["src/backend/**/*", "src/types/**/*"]
}
```

**Pros:**
- Fix compilation issues
- Hot reload for backend changes
- Proper dependency tracking

**Cons:**
- Doesn't solve architectural problems
- Still overly complex

---

### Option D: Simplify Preload (Quick Win)

**Action:**
1. Delete `src/preload/index.ts` (it's not used anyway)
2. Delete `dist-electron/preload/` folder
3. Use only `electron/preload.cjs`
4. Remove `tsconfig.electron.json`

**Pros:**
- Eliminates confusion
- Single source of truth
- Immediate fix

**Cons:**
- Lose TypeScript types for preload
- Loses `typedElectronAPI` (but is it used?)

---

## Immediate Actions Required

### Phase 1: Emergency (Do Now)

1. **Document actual architecture** - Create diagram of what's actually loaded
2. **Audit all compiled files** - Identify which have sources
3. **Add build validation** - Fail build if source/compiled mismatch
4. **Fix mock data generator** - Manual patch already applied, needs source fix

### Phase 2: Short-term (This Week)

1. **Choose solution path** (Options A, B, C, or D above)
2. **Fix build process** - Make compilation work
3. **Remove duplicate preload** - Single source of truth
4. **Add hot reload** - Watch backend for changes

### Phase 3: Long-term (This Month)

1. **Simplify architecture** - Remove unnecessary layers
2. **Improve developer experience** - Clear documentation, simple build
3. **Add architectural tests** - Ensure source/compiled match
4. **Consider migration** - Evaluate Tauri for future projects

---

## Success Criteria

This issue is resolved when:

- [ ] All compiled files have corresponding TypeScript sources
- [ ] Running `npm run build` compiles all backend code without errors
- [ ] Modifying `src/backend/*.ts` and rebuilding changes application behavior
- [ ] No duplicate preload systems
- [ ] Clear documentation of which files to modify for which features
- [ ] New developers can make changes without editing compiled files

---

## Related Issues

- Issue with `users:getAll` IPC handler missing from contract
- Mock data generator role mismatch (Administrator vs admin)
- Operators page showing "No operators found" despite data in database

All these issues share the same root cause: **broken build/architecture**.

---

## Additional Notes

### Why This Happened

The project appears to have undergone multiple architectural transitions:

1. Started with simple CommonJS Electron setup (`electron/`)
2. Attempted migration to TypeScript (`src/`)
3. Adopted functional programming principles (`src/backend/`)
4. Created service layer (lost in transition)
5. Build process never properly updated

### Why It Persists

- No one wants to touch the build process (it's scary)
- Workarounds exist (manual patching)
- No ownership of architecture
- Fear of breaking things that "kind of work"

### The Cost

**Developer time wasted:**
- Debugging why changes don't work: 2-4 hours/week
- Manual patching compiled files: 1-2 hours/week
- Searching for "real" source files: 1-3 hours/week
- Total: **4-9 hours per week**

**Technical debt interest:**
- Each workaround adds complexity
- Each manual patch creates divergence
- Each confusion creates more bugs
- Compound interest: **exponential growth**

---

## References

- Project guidelines: `CLAUDE.md`
- Build scripts: `scripts/`
- Config files: `tsconfig*.json`, `vite.config.ts`, `electron-builder.json`
- Runtime entry point: `electron/main.cjs`
- Package.json: Build commands
