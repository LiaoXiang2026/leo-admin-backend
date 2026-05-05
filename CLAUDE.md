# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # 安装依赖
pnpm dev              # 开发模式（热重载）
pnpm build            # 构建（SWC 编译 + 类型检查）
pnpm start:prod       # 生产启动
pnpm test             # 运行所有单元测试
pnpm test -- --testPathPattern="role.service"  # 运行单个测试文件
pnpm test:cov         # 测试覆盖率
pnpm test:e2e         # E2E 测试
pnpm db:migrate       # Prisma 数据库迁移
pnpm db:generate      # 重新生成 Prisma Client
pnpm db:studio        # Prisma 数据库管理界面
```

## Architecture

**NestJS 11** backend with **Prisma 7** ORM on **Neon PostgreSQL** (serverless). Compiles with SWC. Package manager is pnpm.

### Request flow

```
Global prefix /api
  → ValidationPipe (whitelist, transform, forbidNonWhitelisted)
  → Controller (JwtAuthGuard on protected routes)
  → Service (injects PrismaService)
  → TransformInterceptor wraps response: { success: true, data, message: "ok" }
  → HttpExceptionFilter catches all exceptions: { success: false, data: null, message }
```

### Module pattern

Every feature module follows the same structure:

```
src/modules/<name>/
├── <name>.module.ts      # imports PrismaModule, exports Service
├── <name>.controller.ts  # @ApiTags, @ApiBearerAuth(), @UseGuards(JwtAuthGuard)
├── <name>.service.ts     # injects PrismaService
└── dto/                  # class-validator + @ApiProperty decorators
```

`PrismaModule` is a global module that exports `PrismaService` (extends `PrismaClient`, uses `PrismaNeon` adapter).

### Auth

JWT-based. `JwtAuthGuard` extends `AuthGuard('jwt')`. Login returns access + refresh tokens. `GET /api/auth/codes` returns the current user's permission codes by aggregating permissions from `user → roles → permissions` and `user → permissions` (direct).

### Database (Prisma)

Models: `User`, `Role`, `Permission`, `Menu`. All use UUID primary keys and implicit many-to-many relations (Prisma manages join tables). Key relations:
- `User ↔ Role` (many-to-many)
- `User ↔ Permission` (many-to-many, direct)
- `Role ↔ Permission` (many-to-many)
- `Menu` is self-referential (parent/children) and has many-to-many with `User`

### API prefix & Swagger

All endpoints are under `/api/`. Swagger UI at `/api/docs`. `@ApiBearerAuth()` on protected endpoints adds lock icon in Swagger.
