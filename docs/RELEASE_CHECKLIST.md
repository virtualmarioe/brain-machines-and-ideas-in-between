# Release checks

## Local changes

- Guided learning journeys: three localized paths with five stops, learning outcomes, reflection prompts, and URL progress.
- Reading depth: the complexity level selects the initial description tab while keeping every tab available.
- Graph chronology: an explicit distinction between ordered layout and proportional time, with a timeline link.
- Research evidence: a filterable review queue, 16 narrowly checked claims, five scoped relationship explanations, and explicit pending work.
- Winter previews: keyboard focus handling and accessible dialog semantics.
- Dependency policy: exact-version install-script approvals for esbuild 0.28.2 and unrs-resolver 1.12.2. Review these approvals when upgrading either dependency.
- Continuous integration: content validation, unit tests, type checking, lint, desktop/phone browser checks, and production build.

## Verification commands

```sh
npm run check
npm run test:e2e
npm run build
npm run smoke:deployment -- https://brain-machines-and-ideas-in-between.vercel.app
```

The deployment smoke check performs read-only requests against three locale routes, the research reader, and the winter deep link. It checks HTTP success and expected page markup; it does not prove that uncommitted changes have been deployed or replace browser interaction tests.

## Vercel environment follow-up

There is no `cache-dir` npm setting in the repository. The deployment warning must be traced in the build environment. Inspect project environment variables and install-command overrides for `npm_config_cache_dir` or `NPM_CONFIG_CACHE_DIR`. Remove the unsupported setting, or use npm's supported `cache` configuration (`npm_config_cache` / `NPM_CONFIG_CACHE`) if a custom cache directory is needed. Do not change unrelated variables. Confirm the warning is gone on the next deployment. This environment change has not been applied from the local checkout.

Set `NEXT_PUBLIC_SITE_URL` to the deployed canonical HTTPS origin for production metadata. The package funding notice is informational. Exact install-script approvals address the two named script-policy warnings; confirm the deployed npm version honors this policy on the next build.

## Editorial follow-up

The review ledger covers publication metadata and abstract-level claims for 16 imported records. It does not certify the entire catalog. There are 104 imported concepts without a recorded claim-level check, and one unresolved relationship endpoint. Review original dates, priority, influence, attribution, and translations before promoting full entries from `needs-review`.

## Publishing

Review the final diff and approve the exact commit message and push before publishing repository changes. A successful check of the current live site does not publish this release.

## Validation recorded 2026-10-17

- Content validation: 157 entities, 110 relationships, 77 references, 65 claims.
- Unit tests: 132 passed. TypeScript and ESLint passed.
- Browser suite: 194 passed, 10 skipped, four outdated date-range/URL assertions failed. After updating those assertions, all four focused reruns passed. Phone and desktop journey screenshots were inspected.
- Production build passed.
- Existing Vercel deployment: all five smoke-check routes returned HTTP 200 with expected page markup. These results describe the existing deployment, not the uncommitted changes.
