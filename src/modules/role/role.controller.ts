import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleEntity } from './dto/role-entities.dto';
import { PageDto } from '../../common/dto/page.dto';
import { RolePageResultDto } from './dto/role-page-result.dto';

@ApiBearerAuth()
@ApiTags('角色模块')
@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '获取角色列表' })
  @Get()
  async list(@Query() query: PageDto): Promise<RolePageResultDto> {
    return this.roleService.findAll(query);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @Get(':id')
  async detail(@Param('id') id: string): Promise<RoleEntity> {
    return this.roleService.findById(id) as unknown as RoleEntity;
  }

  @ApiOperation({ summary: '创建角色' })
  @Post()
  async create(@Body() dto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.create(dto) as unknown as RoleEntity;
  }

  @ApiOperation({ summary: '更新角色' })
  @Post(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto): Promise<RoleEntity> {
    return this.roleService.update(id, dto) as unknown as RoleEntity;
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.roleService.delete(id);
  }
}