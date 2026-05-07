import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { PageDto } from '../../common/dto/page.dto';
import { paginate } from '../../common/utils/paginate';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PageDto): Promise<PaginatedResult<any>> {
    return paginate(this.prisma, 'role', {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
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
