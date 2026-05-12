import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDictTypeDto,
  UpdateDictTypeDto,
  CreateDictDataDto,
  UpdateDictDataDto,
  BatchDeleteDictDataDto,
  DictTypeQueryDto,
  DictDataQueryDto,
} from './dto/dict.dto';
import { paginate } from '../../common/utils/paginate';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class DictService {
  constructor(private readonly prisma: PrismaService) {}

  // --- DictType ---

  async findAllType(query: DictTypeQueryDto): Promise<PaginatedResult<any>> {
    const { page, pageSize, code, name } = query;
    const where: any = {};
    if (code) {
      where.code = { contains: code };
    }
    if (name) {
      where.name = { contains: name };
    }
    return paginate(this.prisma, 'dictType', {
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      where,
    });
  }

  async findTypeById(id: number) {
    const type = await this.prisma.dictType.findUnique({ where: { id } });
    if (!type) {
      throw new NotFoundException(`字典类型 ${id} 不存在`);
    }
    return type;
  }

  async createType(dto: CreateDictTypeDto) {
    return this.prisma.dictType.create({ data: dto });
  }

  async updateType(id: number, dto: UpdateDictTypeDto) {
    await this.findTypeById(id);
    return this.prisma.dictType.update({ where: { id }, data: dto });
  }

  async deleteType(id: number) {
    const type = await this.findTypeById(id);
    const count = await this.prisma.dictData.count({
      where: { typeCode: type.code },
    });
    if (count > 0) {
      throw new BadRequestException('该类型下存在字典数据，请先删除数据');
    }
    await this.prisma.dictType.delete({ where: { id } });
    return true;
  }

  // --- DictData ---

  async findAllData(query: DictDataQueryDto): Promise<PaginatedResult<any>> {
    const { page, pageSize, typeCode, label } = query;
    const where: any = {};
    if (typeCode) {
      where.typeCode = typeCode;
    }
    if (label) {
      where.label = { contains: label };
    }
    return paginate(this.prisma, 'dictData', {
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      where,
      orderBy: { sort: 'asc' },
    });
  }

  async findDataById(id: number) {
    const data = await this.prisma.dictData.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`字典数据 ${id} 不存在`);
    }
    return data;
  }

  async createData(dto: CreateDictDataDto) {
    return this.prisma.dictData.create({ data: dto });
  }

  async updateData(id: number, dto: UpdateDictDataDto) {
    await this.findDataById(id);
    return this.prisma.dictData.update({ where: { id }, data: dto });
  }

  async deleteData(id: number) {
    await this.findDataById(id);
    await this.prisma.dictData.delete({ where: { id } });
    return true;
  }

  async batchDeleteData(dto: BatchDeleteDictDataDto) {
    await this.prisma.dictData.deleteMany({
      where: { id: { in: dto.ids } },
    });
    return true;
  }
}
