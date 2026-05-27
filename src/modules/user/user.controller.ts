import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UserEntity, CreateUserDto, UpdateUserDto, UserPageResultDto } from './dto/user.dto';
import { PageDto } from '../../common/dto/page.dto';
import { OperateLog } from '../../common/decorators/operate-log.decorator';

@ApiBearerAuth()
@ApiTags('用户模块')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取用户列表' })
  @ApiOkResponse({ type: UserPageResultDto })
  @Get()
  async list(@Req() req: Request & { user: { userId: string } }): Promise<UserPageResultDto> {
    const result = await this.userService.findAll({ page: 1, pageSize: 100 });
    return {
      items: result.items,
      total: result.total
    };
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiOkResponse({ type: UserEntity })
  @Get('info')
  async getUserInfo(@Req() req: Request & { user: { userId: string } }): Promise<UserEntity> {
    return (await this.userService.findById(req.user.userId)) as unknown as UserEntity;
  }

  @ApiOperation({ summary: '获取用户详情' })
  @ApiOkResponse({ type: UserEntity })
  @Get(':id')
  async detail(@Param('id') id: string): Promise<UserEntity> {
    return (await this.userService.findById(id)) as unknown as UserEntity;
  }

  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse({ type: UserEntity })
  @OperateLog({ module: '用户管理', action: 'CREATE', description: '创建用户' })
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return (await this.userService.create(dto)) as unknown as UserEntity;
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiOkResponse({ type: UserEntity })
  @OperateLog({ module: '用户管理', action: 'UPDATE', description: '更新用户 {id}' })
  @Post(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserEntity> {
    return (await this.userService.update(id, dto)) as unknown as UserEntity;
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiOkResponse({ type: Object, description: '删除成功' })
  @OperateLog({ module: '用户管理', action: 'DELETE', description: '删除用户 {id}' })
  @Post(':id/delete')
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}