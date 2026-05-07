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
  @ApiOkResponse({ type: RolePageResultDto })
  @Get()
  async list(@Query() query: PageDto) {
    return this.roleService.findAll(query);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @ApiOkResponse({ type: RoleEntity })
  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiCreatedResponse({ type: RoleEntity })
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiOkResponse({ type: RoleEntity })
  @Post(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
