# Role Management Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add role CRUD + permission assignment module to the NestJS backend.

**Architecture:** Standard NestJS module (controller → service → Prisma). DTOs use class-validator for validation. Permission assignment via inline `permissionIds` with full replacement on update.

**Tech Stack:** NestJS 11, Prisma 7, class-validator, @nestjs/swagger

---

### Task 1: Create DTO

**Files:**
- Create: `src/modules/role/dto/role.dto.ts`

- [ ] **Step 1: Create DTO file**

```bash
mkdir -p src/modules/role/dto
```

Write `src/modules/role/dto/role.dto.ts`:

```typescript
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '权限ID数组' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '权限ID数组（全量替换）' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/role/dto/role.dto.ts
git commit -m "feat: add CreateRoleDto and UpdateRoleDto"
```

---

### Task 2: Create RoleService with tests

**Files:**
- Create: `src/modules/role/role.service.spec.ts`
- Create: `src/modules/role/role.service.ts`

- [ ] **Step 1: Write the failing service test**

Write `src/modules/role/role.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: PrismaService;

  const mockRole = {
    id: 'role-1',
    name: 'admin',
    description: '管理员',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [],
  };

  const mockPrisma = {
    role: {
      findMany: jest.fn().mockResolvedValue([mockRole]),
      findUnique: jest.fn().mockResolvedValue(mockRole),
      create: jest.fn().mockResolvedValue(mockRole),
      update: jest.fn().mockResolvedValue(mockRole),
      delete: jest.fn().mockResolvedValue(mockRole),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles with permissions', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockRole]);
      expect(prisma.role.findMany).toHaveBeenCalledWith({
        include: { permissions: true },
      });
    });
  });

  describe('findById', () => {
    it('should return a role with permissions', async () => {
      const result = await service.findById('role-1');
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findById('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a role without permissions', async () => {
      const dto = { name: 'editor' };
      await service.create(dto);
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: { name: 'editor' },
        include: { permissions: true },
      });
    });

    it('should create a role with permissions', async () => {
      const dto = { name: 'editor', permissionIds: ['perm-1', 'perm-2'] };
      await service.create(dto);
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          name: 'editor',
          permissions: { connect: [{ id: 'perm-1' }, { id: 'perm-2' }] },
        },
        include: { permissions: true },
      });
    });
  });

  describe('update', () => {
    it('should update role name', async () => {
      const dto = { name: 'superadmin' };
      await service.update('role-1', dto);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 'role-1' },
        data: { name: 'superadmin' },
        include: { permissions: true },
      });
    });

    it('should replace permissions with set', async () => {
      const dto = { permissionIds: ['perm-3'] };
      await service.update('role-1', dto);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 'role-1' },
        data: { permissions: { set: [{ id: 'perm-3' }] } },
        include: { permissions: true },
      });
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.update('not-exist', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      await service.delete('role-1');
      expect(prisma.role.delete).toHaveBeenCalledWith({
        where: { id: 'role-1' },
      });
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.delete('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx jest --testPathPattern="role.service.spec" --no-coverage
```

Expected: All tests FAIL — "Cannot find module './role.service'"

- [ ] **Step 3: Write RoleService implementation**

Write `src/modules/role/role.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async findById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException(`角色 ${id} 不存在`);
    }
    return role;
  }

  async create(dto: CreateRoleDto) {
    const { permissionIds, ...data } = dto;
    return this.prisma.role.create({
      data: {
        ...data,
        ...(permissionIds?.length
          ? { permissions: { connect: permissionIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { permissions: true },
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findById(id);
    const { permissionIds, ...data } = dto;
    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        ...(permissionIds !== undefined
          ? { permissions: { set: permissionIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { permissions: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.role.delete({ where: { id } });
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest --testPathPattern="role.service.spec" --no-coverage
```

Expected: All 10 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/role/role.service.spec.ts src/modules/role/role.service.ts
git commit -m "feat: add RoleService with CRUD + permission assignment"
```

---

### Task 3: Create RoleController with tests

**Files:**
- Create: `src/modules/role/role.controller.spec.ts`
- Create: `src/modules/role/role.controller.ts`

- [ ] **Step 1: Write the failing controller test**

Write `src/modules/role/role.controller.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRole = { id: 'role-1', name: 'admin', permissions: [] };

  const mockRoleService = {
    findAll: jest.fn().mockResolvedValue([mockRole]),
    findById: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: RoleService, useValue: mockRoleService }],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return all roles', async () => {
      const result = await controller.list();
      expect(result).toEqual([mockRole]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('detail', () => {
    it('should return a role by id', async () => {
      const result = await controller.detail('role-1');
      expect(result).toEqual(mockRole);
      expect(service.findById).toHaveBeenCalledWith('role-1');
    });
  });

  describe('create', () => {
    it('should create a role', async () => {
      const dto = { name: 'editor' };
      const result = await controller.create(dto);
      expect(result).toEqual(mockRole);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const dto = { name: 'superadmin' };
      const result = await controller.update('role-1', dto);
      expect(result).toEqual(mockRole);
      expect(service.update).toHaveBeenCalledWith('role-1', dto);
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      const result = await controller.delete('role-1');
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith('role-1');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx jest --testPathPattern="role.controller.spec" --no-coverage
```

Expected: All tests FAIL — "Cannot find module './role.controller'"

- [ ] **Step 3: Write RoleController implementation**

Write `src/modules/role/role.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@ApiBearerAuth()
@ApiTags('角色模块')
@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '获取角色列表' })
  @Get()
  async list() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: '获取角色详情' })
  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @ApiOperation({ summary: '创建角色' })
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @ApiOperation({ summary: '更新角色' })
  @Post(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest --testPathPattern="role.controller.spec" --no-coverage
```

Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/role/role.controller.spec.ts src/modules/role/role.controller.ts
git commit -m "feat: add RoleController with CRUD endpoints"
```

---

### Task 4: Create RoleModule and register in AppModule

**Files:**
- Create: `src/modules/role/role.module.ts`
- Modify: `src/app.module.ts`

- [ ] **Step 1: Create RoleModule**

Write `src/modules/role/role.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RoleModule {}
```

- [ ] **Step 2: Register RoleModule in AppModule**

Modify `src/app.module.ts`, add the `RoleModule` import and add it to the `imports` array:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MenuModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
```

- [ ] **Step 3: Build to verify compilation**

```bash
npx nest build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Run full test suite**

```bash
npx jest --no-coverage
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/modules/role/role.module.ts src/app.module.ts
git commit -m "feat: register RoleModule in AppModule"
```

---

### Task 5: E2E smoke test

- [ ] **Step 1: Start the dev server**

```bash
npx nest start --watch &
sleep 3
```

- [ ] **Step 2: Test list endpoint**

```bash
curl -s http://localhost:3200/api/role | cat
```

Expected: `{"success":true,"data":[],"message":"ok"}` (empty list or existing roles)

- [ ] **Step 3: Verify Swagger docs**

Open `http://localhost:3200/api/docs` in browser, confirm "角色模块" tag appears with 5 endpoints.

