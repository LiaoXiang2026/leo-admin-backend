# leo-admin-backend

NestJS 后端项目，独立部署。

## 项目结构

```
├── src/
│   ├── main.ts              # 应用入口
│   ├── app.module.ts        # 根模块
│   ├── app.controller.ts    # 根控制器
│   └── app.service.ts       # 根服务
├── test/                    # 测试文件
├── prisma/                  # Prisma schema 和迁移
├── nest-cli.json            # Nest CLI 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 包配置
```

## 可用命令

```bash
# 安装依赖
pnpm install

# 开发模式（热重载）
pnpm dev

# 构建
pnpm build

# 生产模式启动
pnpm start:prod

# 测试
pnpm test

# 测试覆盖率
pnpm test:cov

# E2E 测试
pnpm test:e2e

# 数据库迁移
pnpm db:migrate

# 数据库管理界面
pnpm db:studio
```
