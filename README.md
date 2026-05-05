# @vben/backend

NestJS 后端项目，已集成到 monorepo 工作区。

## 项目位置

```
apps/backend/
├── src/
│   ├── main.ts              # 应用入口
│   ├── app.module.ts        # 根模块
│   ├── app.controller.ts    # 根控制器
│   └── app.service.ts       # 根服务
├── test/                    # 测试文件
├── nest-cli.json            # Nest CLI 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 包配置
```

## 主要配置

### 包名

设置为 `@vben/backend`，与现有项目命名规范保持一致。

### 根 package.json 命令

已新增：

```bash
pnpm dev:backend   # 启动 NestJS 开发模式（带热重载）
```

### turbo.json

已新增 `@vben/backend#build` 构建配置，输出目录为 `dist/**`。

### 统一配置

已移除独立的 `.prettierrc` 和 `eslint.config.mjs`，复用 monorepo 根目录统一的 lint/format 配置。

## 可用命令

```bash
# 开发模式（热重载）
pnpm dev:backend
# 或
pnpm --filter @vben/backend run dev

# 构建
pnpm --filter @vben/backend run build

# 生产模式启动
pnpm --filter @vben/backend run start:prod

# 测试
pnpm --filter @vben/backend run test

# 测试覆盖率
pnpm --filter @vben/backend run test:cov

# E2E 测试
pnpm --filter @vben/backend run test:e2e
```

## 验证结果

- `pnpm install`：成功，依赖已链接到 monorepo
- `pnpm --filter @vben/backend run build`：编译通过
- `pnpm dev:backend`：启动成功，服务运行在 `http://localhost:3000`，请求返回 `Hello World!`
