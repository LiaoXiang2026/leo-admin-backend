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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, RoleEntity, RolePageResultDto } from './dto/role.dto';
import { PageDto } from '../../common/dto/page.dto';
import { SkipTransform } from '../../common/decorators/skip-transform.decorator';
import { OperateLog } from '../../common/decorators/operate-log.decorator';

@ApiBearerAuth()
@ApiTags('角色模块')
@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

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
  @OperateLog({ module: '角色管理', action: 'CREATE', description: '创建角色' })
  @Post()
  async create(@Body() dto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.create(dto) as unknown as RoleEntity;
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiOkResponse({ type: RoleEntity })
  @OperateLog({ module: '角色管理', action: 'UPDATE', description: '更新角色' })
  @Post(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto): Promise<RoleEntity> {
    return this.roleService.update(id, dto) as unknown as RoleEntity;
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiOkResponse({ type: Object, description: '删除成功' })
  @OperateLog({ module: '角色管理', action: 'DELETE', description: '删除角色 {id}' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.roleService.delete(id);
  }
}