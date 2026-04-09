# WiLLDesignTech Project Template

Template repository for new WiLLDesignTech projects. Includes commit hooks, branching strategy, CI pipeline, and code quality configuration.

## Usage

1. Click **"Use this template"** on GitHub to create a new repo
2. Update `package.json` with your project name and description
3. Run `pnpm install` to set up hooks
4. Set up branch protection on GitHub (see branching strategy below)
5. Register the app in SSO if it needs authentication

## What's Included

| File | Purpose |
|------|---------|
| `package.json` | Base dependencies — commitlint, eslint, prettier, husky |
| `commitlint.config.mts` | Conventional commit enforcement (feat, fix, hotfix, etc.) |
| `.lintstagedrc.json` | Auto-lint and format staged files on commit |
| `.prettierrc` | Code formatting rules |
| `.nvmrc` | Node.js version (22 LTS) |
| `.gitignore` | Standard ignores for Node.js / TypeScript projects |
| `.husky/` | Git hooks (pre-commit lint, commit-msg validation) |
| `.github/workflows/ci.yml` | CI pipeline template (lint, test, build) |

## Branching Strategy

Two-branch model with automated deployments:

```
feature/PROJ-123 → PR → staging (auto-deploy to *.staging.wilreji.com)
                           → PR → main (auto-deploy to *.wilreji.com)
```

- **staging**: 1 developer approval required
- **main**: 1 senior-dev approval required
- Feature branches auto-delete after merge
- Force push blocked on both protected branches

## After Creating from Template

1. Enable "Automatically delete head branches" in repo settings
2. Set default branch to `staging`
3. Add branch protection rules to `main` and `staging`
4. Add required CI status checks
5. Add project-specific scripts (build, test, typecheck, dev)
6. Set up AWS secrets for deployment (if applicable)

## Important

This template provides common rules as a starting point. It is every developer's
responsibility to cross-check and adapt these rules to the specific project's
requirements. The template is a baseline, not a final configuration.
