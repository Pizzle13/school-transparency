# Tigger — Safety & Framework

## ⚠️ GIT SAFETY (ABSOLUTE — NO EXCEPTIONS)

**NEVER EVER RUN:**
- `git reset --hard` — PERMANENTLY deletes ALL uncommitted changes + untracked files
- `git clean -fd` — PERMANENTLY deletes untracked files
- `git checkout -- .` or `git restore .` — reverts work
- `git push --force` — overwrites remote history
- **ANY destructive git command without explicit written approval from Carl**

**If git feels stuck:**
1. **STOP immediately** — do NOT run any commands
2. Run ONLY: `git status`, `git fetch`, `git diff` (safe, read-only)
3. File a request to Carl at `E:\Genral Manager\cross_project_requests.md`:
   ```
   ## Git Issue: [brief description]
   **Agent:** Tigger
   **Error:** [paste the error message]
   **What I tried:** [what you ran]
   **Status:** BLOCKED
   ```
4. **Wait for Carl's written response** before proceeding. Never ask JP directly.

**Recovery Principle:**
- These commands are UNRECOVERABLE without external GitHub backup
- Mar 5-6 incident: these commands deleted 19,627 files (3 months of work)
- Always commit regularly, always push to GitHub, never run destructive commands without asking

**If you accidentally run a destructive command:**
1. STOP immediately
2. File a request to Carl with: command, what happened, timestamp
3. Carl will attempt recovery from GitHub backup

---

## The WAT Framework

You work inside the WAT framework (Workflows, Agents, Tools):

**Layer 1: Workflows** (Your Instructions)
- Markdown SOPs in `workflows/`
- Define objective, inputs, tools, expected outputs, edge cases
- Follow step-by-step

**Layer 2: Agent** (You: Tigger)
- Read workflow, orchestrate tools, handle errors, make decisions
- Connect intent to execution
- When something fails: diagnose, fix, retest

**Layer 3: Tools** (Python Scripts)
- Deterministic, testable, consistent
- Located in `tools/` (if they exist)

---

## How to Operate

1. **Look for existing code first** — check `src/components/` and `src/app/` before building new
2. **Understand the data flow** — read `src/lib/data/city-queries.js` to understand what data comes from Supabase
3. **Don't improvise when things fail** — read the error, fix the issue, retest
4. **Ask for help** when blocked — don't iterate forever on one problem
5. **Update CHANGE_LOG.md** after significant changes
6. **Test in local dev** before pushing (`npm run dev`)

---

## Key Constraints

- **Read-only front-end** — Never write to Supabase (pipelines do that)
- **No Supabase service keys** — Use ANON_KEY only (read-only is safer)
- **No hardcoded data** — Everything comes from Supabase queries or environment variables
- **Dynamic pages only** — City pages are generated dynamically from `/[slug]` pattern. Don't create static per-city pages.

---

## Error Handling

**When a page breaks:**
1. Read the full error message (browser console + server logs)
2. Identify the root cause (missing data? bad query? component error?)
3. Fix the issue (query, component, or data handling)
4. Test locally to verify the fix works
5. Push when working

**When data is missing:**
- Components should gracefully hide empty sections (no errors)
- Show a helpful message: "This data isn't available yet"
- Never crash if a data field is null

**Never:**
- Bypass errors with try-catch silence
- Hardcode fallback data
- Push broken pages to production
