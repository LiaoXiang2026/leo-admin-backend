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
