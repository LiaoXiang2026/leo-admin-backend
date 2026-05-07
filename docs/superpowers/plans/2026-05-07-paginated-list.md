# Paginated List Response Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change role list endpoint to return `{ total, items }` and support `page`/`pageSize` query params, with reusable primitives for future list endpoints.

**Architecture:** Three generic files in `src/common/` — `PageDto` (request params), `PaginatedResult<T>` (response interface), `paginate()` (utility) — plus one module-specific Swagger DTO. Role controller accepts `PageDto` and Role service delegates to `paginate()`.

**Tech Stack:** NestJS 11, Prisma 7, Jest 30, class-validator, class-transformer, @nestjs/swagger

---

### Task 1: Create PageDto — pagination request params base class

**Files:**
- Create: `src/common/dto/page.dto.ts`

- [ ] **Step 1: Create the DTO**

```ts
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageDto {
  @ApiPropertyOptional({ description: '页码', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}
```

- [ ] **Step 2: Verify file compiles**

Run: `pnpm build 2>&1 | head -20`
Expected: Build succeeds (no type errors from the new file).

- [ ] **Step 3: Commit**

```bash
git add src/common/dto/page.dto.ts
git commit -m "feat: add PageDto base class for pagination params"
```

---

### Task 2: Create PaginatedResult interface

**Files:**
- Create: `src/common/dto/paginated-result.dto.ts`

- [ ] **Step 1: Create the interface**

```ts
export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
```

- [ ] **Step 2: Verify file compiles**

Run: `pnpm build 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/common/dto/paginated-result.dto.ts
git commit -m "feat: add PaginatedResult<T> interface"
```

---

### Task 3: Create paginate utility function

**Files:**
- Create: `src/common/utils/paginate.ts`

- [ ] **Step 1: Write the failing test**

Create `src/common/utils/paginate.spec.ts`:

```ts
import { paginate } from './paginate';

describe('paginate', () => {
  const mockFindMany = jest.fn().mockResolvedValue([{ id: 'a' }, { id: 'b' }]);
  const mockCount = jest.fn().mockResolvedValue(42);

  const mockPrisma = {
    testModel: {
      findMany: mockFindMany,
      count: mockCount,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call findMany and count with correct pagination', async () => {
    const result = await paginate(mockPrisma as any, 'testModel', {
      page: 2,
      pageSize: 15,
      where: { active: true },
      include: { relations: true },
      orderBy: { createdAt: 'desc' },
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { active: true },
      include: { relations: true },
      orderBy: { createdAt: 'desc' },
      skip: 15,
      take: 15,
    });
    expect(mockCount).toHaveBeenCalledWith({
      where: { active: true },
    });
    expect(result).toEqual({
      items: [{ id: 'a' }, { id: 'b' }],
      total: 42,
    });
  });

  it('should default page to 1 and pageSize to 10', async () => {
    await paginate(mockPrisma as any, 'testModel', { page: 1, pageSize: 10 });

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 0,
      take: 10,
    }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --testPathPattern="paginate.spec"`
Expected: FAIL — `paginate` not defined.

- [ ] **Step 3: Implement paginate**

```ts
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedResult } from '../dto/paginated-result.dto';

export interface PaginateOptions {
  page: number;
  pageSize: number;
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  orderBy?: Record<string, string>;
}

export async function paginate<T>(
  prisma: PrismaService,
  model: string,
  options: PaginateOptions,
): Promise<PaginatedResult<T>> {
  const { page, pageSize, where, include, orderBy } = options;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    (prisma as any)[model].findMany({ where, include, orderBy, skip, take: pageSize }),
    (prisma as any)[model].count({ where }),
  ]);

  return { items: items as T[], total };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --testPathPattern="paginate.spec"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/common/utils/paginate.ts src/common/utils/paginate.spec.ts
git commit -m "feat: add paginate utility for Prisma pagination"
```

---

### Task 4: Create RolePageResultDto for Swagger

**Files:**
- Create: `src/modules/role/dto/role-page-result.dto.ts`

- [ ] **Step 1: Create the Swagger response DTO**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from './role-entities.dto';

export class RolePageResultDto {
  @ApiProperty({ type: [RoleEntity], description: '角色列表' })
  items: RoleEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}
```

- [ ] **Step 2: Verify file compiles**

Run: `pnpm build 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/modules/role/dto/role-page-result.dto.ts
git commit -m "feat: add RolePageResultDto for paginated swagger response"
```

---

### Task 5: Update RoleService.findAll to support pagination

**Files:**
- Modify: `src/modules/role/role.service.ts`

- [ ] **Step 1: Update the existing test**

In `src/modules/role/role.service.spec.ts`, add `count` to mockPrisma and update the `findAll` test block:

Replace:
```ts
const mockPrisma = {
  role: {
    findMany: jest.fn().mockResolvedValue([mockRole]),
    findUnique: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    delete: jest.fn().mockResolvedValue(mockRole),
  },
};
```

With:
```ts
const mockPrisma = {
  role: {
    findMany: jest.fn().mockResolvedValue([mockRole]),
    count: jest.fn().mockResolvedValue(1),
    findUnique: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    delete: jest.fn().mockResolvedValue(mockRole),
  },
};
```

Replace the `findAll` describe block:
```ts
describe('findAll', () => {
  it('should return paginated roles', async () => {
    const result = await service.findAll({ page: 1, pageSize: 10 });
    expect(result).toEqual({ items: [mockRole], total: 1 });
    expect(prisma.role.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 0,
      take: 10,
    }));
    expect(prisma.role.count).toHaveBeenCalled();
  });
});
```

Add import at top:
```ts
import { PageDto } from '../../common/dto/page.dto';
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --testPathPattern="role.service.spec"`
Expected: FAIL — `findAll` signature changed but implementation hasn't.

- [ ] **Step 3: Update RoleService.findAll**

In `src/modules/role/role.service.ts`, add imports:
```ts
import { PageDto } from '../../common/dto/page.dto';
import { paginate, PaginateOptions } from '../../common/utils/paginate';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
```

Replace `findAll`:
```ts
async findAll(query: PageDto): Promise<PaginatedResult<any>> {
  return paginate(this.prisma, 'role', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    include: { permissions: true },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --testPathPattern="role.service.spec"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/modules/role/role.service.ts src/modules/role/role.service.spec.ts
git commit -m "feat: add pagination support to RoleService.findAll"
```

---

### Task 6: Update RoleController.list to accept query params

**Files:**
- Modify: `src/modules/role/role.controller.ts`

- [ ] **Step 1: Update the existing test**

In `src/modules/role/role.controller.spec.ts`, update the mock and list test.

Replace `findAll` in mockRoleService:
```ts
const mockRoleService = {
  findAll: jest.fn().mockResolvedValue({ items: [mockRole], total: 1 }),
  findById: jest.fn().mockResolvedValue(mockRole),
  create: jest.fn().mockResolvedValue(mockRole),
  update: jest.fn().mockResolvedValue(mockRole),
  delete: jest.fn().mockResolvedValue(undefined),
};
```

Update the `list` describe block:
```ts
describe('list', () => {
  it('should return paginated roles', async () => {
    const result = await controller.list({ page: 1, pageSize: 10 });
    expect(result).toEqual({ items: [mockRole], total: 1 });
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --testPathPattern="role.controller.spec"`
Expected: FAIL — `controller.list` signature changed.

- [ ] **Step 3: Update RoleController**

In `src/modules/role/role.controller.ts`, add imports:
```ts
import { Query } from '@nestjs/common';
import { PageDto } from '../../common/dto/page.dto';
import { RolePageResultDto } from './dto/role-page-result.dto';
```

Update the `list` method:
```ts
@ApiOperation({ summary: '获取角色列表' })
@ApiOkResponse({ type: RolePageResultDto })
@Get()
async list(@Query() query: PageDto) {
  return this.roleService.findAll(query);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --testPathPattern="role.controller.spec"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/modules/role/role.controller.ts src/modules/role/role.controller.spec.ts
git commit -m "feat: add PageDto query param to role list endpoint"
```

---

### Task 7: Run full test suite and verify build

**Files:** (none — verification only)

- [ ] **Step 1: Run all unit tests**

Run: `pnpm test`
Expected: All tests pass.

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds with no errors.
