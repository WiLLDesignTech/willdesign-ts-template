---
name: review-all-and-commit
description: Run all reviews in parallel (simplify, BDD, security, feature, devops, performance), collect findings, fix all issues, then grouped commit with approval
---

# /review-all-and-commit

Comprehensive pre-commit review pipeline that runs all quality gates in parallel, collects findings, fixes issues in one pass, and prepares grouped commits for approval.

## Usage

```
/review-all-and-commit                          # review all changed files (unstaged + staged)
/review-all-and-commit --staged                 # review only staged files
/review-all-and-commit src/auth/                # review only files in a specific path
/review-all-and-commit --staged src/auth/        # staged files in a specific path
/review-all-and-commit --skip-fix               # audit mode — show findings only, no auto-fix
/review-all-and-commit --no-commit              # fix issues but don't prepare commits
```

## Pipeline

When invoked, execute the following pipeline exactly:

### Phase 1: Scope Detection

1. Parse arguments:
   - `--staged` → scope to `git diff --cached --name-only`
   - `<path>` → scope to files matching that path
   - `--skip-fix` → report only, no fixes
   - `--no-commit` → fix but skip commit phase
   - Default (no args) → `git diff --name-only` + `git diff --cached --name-only` (all changed files)
2. Read all in-scope files to understand the changes.
3. Get the base branch diff context (`git diff main...HEAD` or `git diff --cached` for staged).

### Phase 2: Parallel Reviews (spawn 6 agents simultaneously)

Launch ALL of these review agents **in parallel in a single message**. Each agent receives the list of in-scope files and their contents.

#### Agent 1: Simplify Review

- Check for code reuse opportunities (duplicate logic, extractable helpers)
- Evaluate code quality (naming, readability, complexity)
- Check efficiency (unnecessary loops, redundant operations, memory waste)
- Flag files over 500 lines
- Rate: pass/needs-work per file

#### Agent 2: BDD Test Coverage Review

- For every new/changed public function, check if BDD-style tests exist
- Check test quality: do tests cover happy path, edge cases, error cases?
- Flag any untested public API surface
- Check mock patterns follow project conventions (clean mocks, no `var`)
- Rate: covered/partial/missing per function

#### Agent 3: Security Review

- Scan for hardcoded secrets, API keys, credentials, .env references
- Check for OWASP top 10: injection, XSS, CSRF, broken auth, etc.
- Validate input sanitization at system boundaries
- Check for directory traversal in file path handling
- Check dependency versions for known CVEs (if package.json changed)
- Flag any `eval()`, `innerHTML`, raw SQL, or unsafe deserialization
- Rate: critical/warning/info per finding

#### Agent 4: Feature & Logic Review (Software Engineer)

- Review business logic correctness and edge case handling
- Check error handling completeness (not over-engineered, but sufficient)
- Validate API contracts and typed interfaces
- Check for race conditions, state management issues
- Review naming consistency and code organization
- Check adherence to project architecture (DDD, bounded contexts)
- Rate: bug/improvement/nitpick per finding

#### Agent 5: DevOps Review

- Check CI/CD pipeline impact (did workflow files change?)
- Review environment config changes
- Check Docker/deployment file changes
- Validate build scripts and dependency changes
- Check for breaking changes in package exports
- Review infrastructure-as-code changes
- Rate: breaking/warning/info per finding

#### Agent 6: Performance & Architecture Review

- Check for N+1 queries, unnecessary re-renders, expensive operations
- Review algorithm complexity (flag O(n^2)+ in hot paths)
- Check bundle size impact of new dependencies
- Validate event sourcing patterns for state changes
- Review module boundaries and coupling
- Rate: critical/warning/info per finding

### Phase 3: Findings Report

After all agents complete, compile a unified report:

```
## Review Findings Report

### Summary
| Review          | Pass | Warnings | Critical | Score |
|-----------------|------|----------|----------|-------|
| Simplify        |  12  |    2     |    0     | 85%   |
| BDD Coverage    |   8  |    3     |    1     | 72%   |
| Security        |  15  |    1     |    0     | 93%   |
| Feature/Logic   |  10  |    4     |    0     | 71%   |
| DevOps          |   5  |    0     |    0     | 100%  |
| Performance     |   7  |    2     |    1     | 78%   |

### Confidence Score Per File
| File                        | Risk   | Issues |
|-----------------------------|--------|--------|
| src/auth/handler.ts         | HIGH   | 3      |
| src/utils/format.ts         | LOW    | 0      |

### Detailed Findings
[Grouped by severity: Critical → Warning → Info]
[Each finding includes: file, line, category, description, suggested fix]
```

Display this report to the user and **ask if they want to proceed with fixes**.

### Phase 4: Fix All Issues (unless --skip-fix)

After user approval:

1. Fix all critical and warning-level issues in one pass
2. Apply fixes in dependency order (security first, then logic, then style)
3. For BDD gaps: generate missing test files following project conventions
4. For security issues: apply the safest remediation
5. For simplify issues: refactor but preserve behavior

### Phase 5: Fix Verification

After fixes are applied:

1. Re-run all failing checks against fixed files
2. Run `npm test` if test files were added/modified
3. Run `npm run build` to verify nothing breaks
4. Show a before/after comparison of the findings

```
### Fix Verification
| Review          | Before | After | Status |
|-----------------|--------|-------|--------|
| BDD Coverage    | 72%    | 95%   | PASS   |
| Security        | 93%    | 100%  | PASS   |
```

If any check still fails, report it and ask the user how to proceed.

### Phase 6: Grouped Commit (unless --no-commit or --skip-fix)

1. Group changes into logical commits by category:
   - `fix(security):` — security fixes
   - `fix:` — bug fixes from feature review
   - `refactor:` — simplify/quality improvements
   - `test:` — new/updated BDD tests
   - `chore:` — devops, config, dependency changes
   - `perf:` — performance improvements

2. For each commit group, show:

   ```
   Commit 1/3: fix(security): sanitize user input in auth handler
   Files: src/auth/handler.ts, src/auth/validator.ts

   Commit 2/3: test: add BDD coverage for auth flow
   Files: tests/auth/handler.test.ts

   Commit 3/3: refactor: extract duplicate validation logic
   Files: src/utils/validation.ts, src/auth/handler.ts
   ```

3. **Ask the user to approve the commit plan** before executing any commits.

4. After approval, execute commits in order. Do NOT add Co-Authored-By lines.

### Phase 7: Final Summary

```
## Review Complete

Reviewed: 15 files
Fixed: 8 issues (3 critical, 5 warnings)
Tests added: 4
Commits created: 3

All checks passing. Ready to push.
```

## Rules

- NEVER commit without showing the user the commit plan and getting approval
- NEVER skip the fix verification phase
- NEVER add Co-Authored-By lines to commits
- ALWAYS run reviews in parallel (6 agents, single message)
- ALWAYS show findings report before fixing
- ALWAYS ask before proceeding at each gate (findings → fix → commit)
- Use `const` arrow functions, never `var`
- Follow project's existing test patterns for new tests
- Group related fixes into minimal logical commits
- If no issues found, skip fix phase and report clean bill of health
