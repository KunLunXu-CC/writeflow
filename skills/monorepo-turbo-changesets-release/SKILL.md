---
name: monorepo-turbo-changesets-release
description: 适用于搭建或修复基于 Turbo + tsup + Changesets 的 pnpm workspace 多包发布流程，尤其是 packages/* 为发布包、examples 为演示应用且不参与发布构建的场景。
---

# Monorepo Turbo + Changesets 发布技能

## 何时使用

当用户希望在 `pnpm workspace` 中新增构建与发布流程时被调用

适用仓库特征：

- 当前项目是一个 monorepo，使用 pnpm workspace 管理多个包
- 可发布库包位于 `packages/*`
- 可能存在演示应用（如 `examples`），但不参与正式发布流程

## 目标状态

<!-- - 从零搭建 monorepo 的构建、版本管理与发布链路
- 将现有仓库迁移到 `Turbo` / `Changesets`
- 对 `packages/*` 下多个包进行统一构建与批量发布
- 修复 workspace 中的构建顺序、包过滤、发布脚本或 CI 流水线问题 -->

目标是将仓库规范到以下状态。

1. 根 `package.json`
- 包含 `packageManager`（Turbo 解析 workspace 所需）
- 构建/发布脚本规范：
  - `build:packages` -> `turbo run build --filter=./packages/*`
  - `release` -> 先构建包，再执行 `changeset publish`
- devDependencies 包含 `turbo`、`tsup`、`@changesets/cli`

2. `turbo.json`
- 定义 `build` 任务
- 配置 `dependsOn: ["^build"]`
- 配置 `outputs: ["dist/**"]`

3. 共享 tsup 配置
- 根目录存在 `tsup.config.ts`
- 统一输出 `esm + cjs + d.ts`
- 支持 `scss`（通过 `esbuild-sass-plugin`）
- 显式指向构建专用 tsconfig（见下一项）

4. 构建专用 TypeScript 配置
- 根目录存在 `tsconfig.build.json`
- `incremental: false`
- `noEmit: false`
- 移除仅应用场景使用的插件（例如 next plugin）
- `include` 仅覆盖 `packages/**/*`

5. `packages/*` 下每个可发布包
- 都有 `build` 脚本（使用共享 tsup 配置）
- 都有 `main/module/types/exports/files/publishConfig`
- `sideEffects` 配置正确：
  - 样式包：包含 `**/*.css` 与 `**/*.scss`
  - 纯逻辑包：可设为 `false`
  - 若入口通过 TS 聚合文件引样式（如 `import './styles'`），需把对应路径加入 `sideEffects`

6. Changesets 配置完成
- 存在 `.changeset/config.json`
- `access: "public"`
- 已配置 `baseBranch`
- 忽略不发布包（如根包、examples）

7. CI / Release 流水线
- CI 只构建库包
- Release 使用 `changesets/action@v1`
- 发布前完成 npm 鉴权配置

8. 忽略构建与缓存产物: 修改 `.gitignore` 包含：
- `dist`
- `.turbo`

## 执行流程

按以下顺序执行。

1. 审计当前仓库结构
- 读取根 `package.json`、`pnpm-workspace.yaml`、所有 `packages/*/package.json`
- 明确哪些包发布，哪些仅演示

2. 规范根脚本
- 将构建/发布脚本收敛到 Turbo + Changesets
- 保留 demo 启动脚本，但发布构建需排除 demo

3. 统一包元数据
- 批量更新 `packages/*/package.json` 的发布字段
- 不改动非发布目录

4. 配置版本与发布自动化
- 增加 `.changeset/config.json`
- 新增或更新 `.github/workflows/ci.yml` 与 `release.yml`

5. 发布流水线补全 npm 鉴权
- 在 workflow 里将 token 写入 `$HOME/.npmrc`
- 使用 `${{ secrets.NPM_TOKEN }}`

6. 执行验证命令（环境允许时）
- `pnpm build:packages`
- 可选：`pnpm changeset status`

7. 若环境无法运行 Node/pnpm
- 仍先完成配置改造
- 明确告知用户哪些验证需本地补跑

## 常见故障与修复

1. Turbo 无法解析 workspaces
- 报错：根 `package.json` 缺少 `packageManager`
- 修复：补上 `"packageManager": "pnpm@<major.minor.patch>"`

2. DTS 构建报 TS5074（`--incremental`）
- 原因：tsup dts 继承了业务 tsconfig 的 `incremental: true`
- 修复：新增 `tsconfig.build.json`，设置 `incremental: false`、`noEmit: false`，并让 tsup 显式使用它

3. 样式导入被当作无副作用裁剪
- 现象：`import './styles'` 被 warning 提示可忽略
- 修复：将对应样式聚合路径加入包的 `sideEffects`

4. 发布鉴权失败
- 原因：`NPM_TOKEN` 缺失/失效，或 CI 未正确写入认证
- 修复：配置仓库 Secret `NPM_TOKEN`，并在 release workflow 显式写入 npm 认证

5. Turbo 缓存污染仓库
- 修复：`.gitignore` 增加 `.turbo` 与 `**/.turbo`

## 输出检查清单

使用本技能完成任务后，输出中需包含：

1. 变更文件清单
2. 已标准化项
3. 已验证与未验证项
4. 用户下一步应执行的本地命令
5. `NPM_TOKEN` 设置说明（至少包含 GitHub 仓库 Secret 配置路径、Secret 名称 `NPM_TOKEN`、以及其用于 npm 发布鉴权）
