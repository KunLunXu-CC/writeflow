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
# create a changeset for package changes
pnpm changeset

# apply version bumps
pnpm version-packages

# publish packages
pnpm release
```

You do not need to manually edit package versions in `packages/*/package.json`.
Changesets manages version bumps for publishable packages.

Recommended workflow:

1. Make changes to one or more publishable packages in `packages/*`.
2. Run `pnpm changeset`.
3. Select the affected package(s) and choose a version bump type: `patch`, `minor`, or `major`.
4. Commit the generated `.changeset/*.md` file together with your code changes.

Notes:

- `pnpm version-packages` runs `changeset version` and updates package versions automatically.
- The root package `@kunlunxu/wf` is `private` and is not published to npm.
- The `examples` app is also `private` and is not published.
- The release workflow uses `changesets/action` to create a release PR or publish from `main`.

Release automation is configured in:

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
