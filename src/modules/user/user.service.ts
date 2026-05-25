import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PageDto } from '../../common/dto/page.dto';
import { paginate } from '../../common/utils/paginate';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PageDto): Promise<PaginatedResult<any>> {
    return paginate(this.prisma, 'user', {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
      include: { roles: true },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
    if (!user) {
      throw new NotFoundException(`用户 ${id} 不存在`);
    }

    const { password: _password, ...result } = user;
    return {
      ...result,
      token: '',
    };
  }

  async create(dto: CreateUserDto) {
    const { roleIds, password, ...data } = dto;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        ...(roleIds?.length
          ? { roles: { connect: roleIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { roles: true },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id); // 检查用户是否存在
    
    const { roleIds, password, ...data } = dto;
    
    // 构建更新数据
    const updateData: any = { ...data };
    
    // 如果提供了新密码，则加密它
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // 处理角色关联
    if (roleIds !== undefined) {
      updateData.roles = {
        set: roleIds.map((id) => ({ id }))
      };
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { roles: true },
    });
  }

  async delete(id: string) {
    await this.findById(id); // 检查用户是否存在
    await this.prisma.user.delete({ where: { id } });
  }
}
