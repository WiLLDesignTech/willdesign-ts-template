# WiLLDesignTech TypeScript Project Template

Template repository for new WiLLDesignTech TypeScript projects. Includes commit hooks, branching strategy, CI pipeline, and code quality configuration.

## Creating a New Project

1. Click **"Use this template"** > **"Create a new repository"** on GitHub
2. Name your repo (e.g., `willdesign-my-app`)
3. Set visibility to Private (or Public if open-source)
4. Click **Create repository**

## What Happens Automatically

On the **first push**, the `setup-repo.yml` workflow runs and configures:

| Setting                      | Value                                              |
| ---------------------------- | -------------------------------------------------- |
| Default branch               | `staging`                                          |
| Production branch            | `main` (created automatically)                     |
| Auto-delete feature branches | Enabled                                            |
| Staging protection           | 1 developer approval, status checks, no force push |
| Main protection              | 1 approval, status checks, no force push           |
| Branch deletion              | Blocked on main + staging                          |
| Stale review dismissal       | Enabled                                            |

### What requires manual setup (org admin)

The automated workflow cannot enforce team-based review requirements. An org admin must:

1. Go to **Settings > Branches > main > Edit**
2. Under "Require pull request reviews", restrict approvals to the **senior-dev** team
3. Verify CI status check names match your project's workflow job names

## What's Included

| File                               | Purpose                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `package.json`                     | Base dependencies — commitlint, ESLint, prettier, husky, TypeScript 6.0 |
| `commitlint.config.mts`            | Conventional commit enforcement (feat, fix, hotfix, eod, etc.)          |
| `.lintstagedrc.json`               | Auto-lint and format staged files on commit                             |
| `.prettierrc`                      | Code formatting rules                                                   |
| `.nvmrc`                           | Node.js 22 LTS                                                          |
| `.gitignore`                       | Standard ignores for Node.js / TypeScript projects                      |
| `.husky/pre-commit`                | Runs lint-staged before every commit                                    |
| `.husky/commit-msg`                | Validates commit message format                                         |
| `.github/workflows/ci.yml`         | CI pipeline (lint, typecheck, test, build)                              |
| `.github/workflows/setup-repo.yml` | One-time repo setup (branches, protection, auto-delete)                 |

## Branching Strategy

Two-branch model with automated deployments:

```
feature/PROJ-123 ─── PR (1 dev approval) ──→ staging (*.staging.wilreji.com)
                                                 │
                                    PR (1 senior-dev approval)
                                                 │
                                                 ▼
                                              main (*.wilreji.com)
```

| Target    | Source                             | Merge method     | Approval     |
| --------- | ---------------------------------- | ---------------- | ------------ |
| `staging` | `feat/*`, `fix/*`, `chore/*`, etc. | **Squash**       | 1 developer  |
| `main`    | `staging` or `hotfix/*` only       | **Merge commit** | 1 senior-dev |

- Feature branches are auto-deleted after merge (restorable for 90 days)
- Hotfixes: `hotfix/*` → `main` directly, then cherry-pick to `staging`
- Force push is blocked on all protected branches
- Only `staging` and `hotfix/*` can target `main` (enforced by CI check)
- All other branches must go through `staging` first

## After Creating from Template

1. Wait for the `Setup Repository` workflow to complete (check Actions tab)
2. Ask an org admin to add senior-dev team requirement to `main` branch
3. Update `package.json` with your project name and description
4. Add project-specific configs:
   - `tsconfig.json` — TypeScript configuration
   - `eslint.config.mjs` — ESLint rules
   - Build/test/dev scripts in `package.json`
   - Deployment workflows for staging and production
5. Register in SSO if the app needs authentication
6. Update `catalog-info.yaml` (replace all `REPLACE-ME` fields)
7. Update `ARCHITECTURE.md` (replace with actual architecture)
8. Update `CODEOWNERS` (adjust team/directory ownership as needed)
9. Add first ADR to `docs/adr/` if you made a significant architectural decision

## Important

This template provides common rules as a starting point. It is every developer's
responsibility to cross-check and adapt these rules to the specific project's
requirements. The template is a baseline, not a final configuration.

## Files Included (template stubs to fill in)

| File | Purpose |
|---|---|
| `catalog-info.yaml` | Service catalog descriptor — fill in all `REPLACE-ME` fields |
| `ARCHITECTURE.md` | Architecture overview — replace with actual design |
| `CODEOWNERS` | Review routing — adjust team/directory ownership |
| `docs/adr/0000-template.md` | ADR template — copy + number for each significant decision |
| `docs/runbooks/service-down.md` | First-responder runbook — adapt to your service |

## References

- [How This Org Runs](https://github.com/WiLLDesignTech/willdesign-rules/blob/main/development/how-this-org-runs.md)
- [Per-Repo Doc Standard](https://github.com/WiLLDesignTech/willdesign-rules/blob/main/development/per-repo-doc-standard.md)
- [Branching Strategy](https://github.com/WiLLDesignTech/willdesign-rules/blob/main/development/branching-strategy.md)
- [Git Workflow Policy](https://github.com/WiLLDesignTech/willdesign-rules/blob/main/development/git-workflow.md)
- [Pipeline Catalog](https://github.com/WiLLDesignTech/willdesign-rules/blob/main/development/pipeline-catalog.md)
