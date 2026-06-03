# WriteFlow Monorepo

本仓库是一个基于 `pnpm workspace` 的 monorepo：

- `packages/*`：可发布的库
- `examples`：本地示例应用（不参与包构建和发布）

## 开发

```bash
pnpm dev
```

## 构建

使用 Turbo 仅构建库（`packages/*`）：

```bash
pnpm build:packages
```

## 版本管理与发布

本仓库使用 Changesets 进行版本管理和发布。

```bash
# 为包变更创建 changeset
pnpm changeset

# 应用版本号变更
pnpm version-packages

# 发布包
pnpm release

# 推送代码, 将自动触发构建、发布 npm 包
```

> 下面是一些解释

你不需要手动修改 `packages/*/package.json` 中的包版本号。
Changesets 会管理可发布包的版本号变更。

推荐工作流：

1. 修改 `packages/*` 中的一个或多个可发布包。
2. 运行 `pnpm changeset`。
3. 选择受影响的包，并选择版本变更类型：`patch`、`minor` 或 `major`。
4. 将自动生成的 `.changeset/*.md` 文件与代码变更一起提交。

说明：

- `pnpm version-packages` 会运行 `changeset version`，并自动更新包版本号。
- 根包 `@kunlunxu/wf` 是 `private`，不会发布到 npm。
- `examples` 应用同样是 `private`，不会发布。
- 发布工作流使用 `changesets/action` 创建发布 PR，或从 `main` 分支发布。

发布自动化配置在：

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
