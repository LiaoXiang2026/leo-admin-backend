# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
