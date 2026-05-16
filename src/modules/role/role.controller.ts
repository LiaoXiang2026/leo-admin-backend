import type { Request } from 'express';

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, RoleEntity, RolePageResultDto } from './dto/role.dto';
import { PageDto } from '../../common/dto/page.dto';
import { SkipTransform } from '../../common/decorators/skip-transform.decorator';
import { OperateLogService } from '../operate-log/operate-log.service';

@ApiBearerAuth()
@ApiTags('角色模块')
@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly operateLogService: OperateLogService,
  ) {}

  @ApiOperation({ summary: '获取角色列表' })
  @ApiOkResponse({ type: RolePageResultDto })
  @SkipTransform()
  @Get()
  async list(@Query() query: PageDto): Promise<RolePageResultDto> {
    return this.roleService.findAll(query);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @ApiOkResponse({ type: RoleEntity })
  @Get(':id')
  async detail(@Param('id') id: string): Promise<RoleEntity> {
    return this.roleService.findById(id) as unknown as RoleEntity;
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiCreatedResponse({ type: RoleEntity })
  @Post()
  async create(@Body() dto: CreateRoleDto, @Req() req: Request): Promise<RoleEntity> {
    const result = await this.roleService.create(dto) as unknown as RoleEntity;
    await this.operateLogService.create({
      operator: (req.user as any)?.username ?? 'unknown',
      module: '角色管理',
      action: 'CREATE',
      description: `创建角色 ${dto.name}`,
      method: 'POST',
      url: '/api/role',
      params: JSON.stringify(dto),
      ip: req.ip ?? '',
    });
    return result;
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiOkResponse({ type: RoleEntity })
  @Post(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto, @Req() req: Request): Promise<RoleEntity> {
    const result = await this.roleService.update(id, dto) as unknown as RoleEntity;
    await this.operateLogService.create({
      operator: (req.user as any)?.username ?? 'unknown',
      module: '角色管理',
      action: 'UPDATE',
      description: `更新角色 ${id}`,
      method: 'POST',
      url: `/api/role/${id}`,
      params: JSON.stringify(dto),
      ip: req.ip ?? '',
    });
    return result;
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiOkResponse({ type: Object, description: '删除成功' })
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    await this.roleService.delete(id);
    await this.operateLogService.create({
      operator: (req.user as any)?.username ?? 'unknown',
      module: '角色管理',
      action: 'DELETE',
      description: `删除角色 ${id}`,
      method: 'DELETE',
      url: `/api/role/${id}`,
      ip: req.ip ?? '',
    });
  }
}