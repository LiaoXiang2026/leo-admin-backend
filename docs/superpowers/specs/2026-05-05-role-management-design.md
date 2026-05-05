# Role Management Module Design

## Overview

Add a role management module to the NestJS backend. The `Role` model already exists in `schema.prisma` with fields `id`, `name`, `description` and relations to `users[]` and `permissions[]`. This module provides CRUD for roles plus permission assignment.

## File Structure

```
src/modules/role/
├── role.module.ts
├── role.controller.ts
├── role.service.ts
└── dto/
    └── role.dto.ts
```

## API Endpoints

All endpoints require JWT authentication.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/role` | List all roles with permissions |
| GET | `/api/role/:id` | Get single role with permissions |
| POST | `/api/role` | Create role |
| POST | `/api/role/:id` | Update role |
| DELETE | `/api/role/:id` | Delete role |

## DTOs

**CreateRoleDto**: `name` (required, unique), `description` (optional), `permissionIds` (optional, string[]).

**UpdateRoleDto**: All fields optional. `permissionIds` uses Prisma `set` for full replacement.

Validation via `class-validator` decorators, enforced by the global `ValidationPipe`.

## Service

- `findAll()` — returns all roles with permissions via `include: { permissions: true }`
- `findById(id)` — single role with permissions
- `create(dto)` — creates role, optionally connects permissions
- `update(id, dto)` — partial update, permissionIds replaced via `permissions: { set: [...] }`
- `delete(id)` — hard delete (Prisma cleans up implicit many-to-many join table)

Name uniqueness enforced by Prisma — P2002 error caught by global `HttpExceptionFilter`.

## Decisions

- No pagination (roles are typically few)
- Permission IDs submitted inline with role (not a separate endpoint)
- Update uses POST (not PATCH)
- Hard delete
- No user assignment in this phase
