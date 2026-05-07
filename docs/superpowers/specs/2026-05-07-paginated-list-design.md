# Paginated List Response Design

## Goal

Change list endpoints (starting with roles) so `data` returns `{ total, items }` instead of a raw array, and support `page` / `pageSize` query parameters. The pattern must be reusable for future list endpoints.

## Files to Create

### `src/common/dto/page.dto.ts`

Base DTO for pagination query parameters.

- `page: number` — 1-based, default `1`, validated `@Min(1)`
- `pageSize: number` — default `10`, validated `@Min(1) @Max(100)`
- Uses `@Type(() => Number)` for query string coercion
- Class-validator + Swagger decorators

### `src/common/dto/paginated-result.dto.ts`

Generic interface for paginated responses:

```ts
export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
```

### `src/common/utils/paginate.ts`

Reusable helper that takes a Prisma model name and options, runs `findMany` + `count` in parallel via `Promise.all`, and returns `{ items, total }`.

- `skip` computed as `(page - 1) * pageSize`
- `take` = `pageSize`

### `src/modules/role/dto/role-page-result.dto.ts`

Concrete Swagger response class. Since NestJS Swagger can't introspect generics, each module that needs pagination declares a concrete class extending the paginated shape with appropriate `@ApiProperty` types.

## Files to Modify

### `src/modules/role/role.controller.ts`

- Import `PageDto` and new response type
- `@Get()` list method: add `@Query() query: PageDto` parameter
- Pass query to service

### `src/modules/role/role.service.ts`

- `findAll()` accepts `PageDto`
- Calls `paginate(this.prisma, 'role', { ...query, include: { permissions: true } })`

## Response Shape

List (paginated):
```json
{ "success": true, "data": { "items": [...], "total": 10 }, "message": "ok" }
```

Non-list (detail/create/update/delete) — unchanged:
```json
{ "success": true, "data": { ... }, "message": "ok" }
```

## Reuse Pattern

Future list endpoints follow the same steps:
1. Import `PageDto` and `paginate`
2. Controller's `@Get()` accepts `@Query() query: PageDto`
3. Service calls `paginate(this.prisma, '<model>', { ...query, where, include, orderBy })`
4. If Swagger docs are needed, add a concrete result DTO
