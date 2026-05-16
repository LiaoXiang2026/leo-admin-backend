import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OperateLogQueryDto, BatchDeleteOperateLogDto } from './dto/operate-log.dto';
import { paginate } from '../../common/utils/paginate';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

export interface CreateOperateLogDto {
  operator: string;
  module: string;
  action: string;
  description?: string;
  method: string;
  url: string;
  params?: string;
  duration?: number;
  ip: string;
}

@Injectable()
export class OperateLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOperateLogDto) {
    return this.prisma.operateLog.create({ data: dto });
  }

  async findAll(query: OperateLogQueryDto): Promise<PaginatedResult<any>> {
    const { page, pageSize, operator, module, action } = query;
    const where: any = {};
    if (operator) {
      where.operator = { contains: operator };
    }
    if (module) {
      where.module = { contains: module };
    }
    if (action) {
      where.action = action;
    }
    return paginate(this.prisma, 'operateLog', {
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const log = await this.prisma.operateLog.findUnique({ where: { id } });
    if (!log) {
      throw new NotFoundException(`操作日志 ${id} 不存在`);
    }
    return log;
  }

  async delete(id: number) {
    await this.findById(id);
    await this.prisma.operateLog.delete({ where: { id } });
    return true;
  }

  async batchDelete(dto: BatchDeleteOperateLogDto) {
    await this.prisma.operateLog.deleteMany({
      where: { id: { in: dto.ids } },
    });
    return true;
  }
}
