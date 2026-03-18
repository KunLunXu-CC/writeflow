# WriteFlow Monorepo

This repository is a `pnpm workspace` monorepo:

- `packages/*`: publishable libraries
- `examples`: local demo app (not part of package build/release)

## Development

```bash
pnpm dev
```

## Build

Build libraries only (`packages/*`) with Turbo:

```bash
pnpm build:packages
```

## Versioning & Release

This repo uses Changesets for versioning/publishing.

```bash
# create changeset
pnpm changeset

# apply version bumps
pnpm version-packages

# publish packages
pnpm release
```

Release automation is configured in:

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
