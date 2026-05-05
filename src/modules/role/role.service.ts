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
