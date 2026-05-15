import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UserEntity } from './dto/user-entities.dto';

@ApiBearerAuth()
@ApiTags('用户模块')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取当前用户信息' })
  @Get('info')
  async getUserInfo(@Req() req: Request & { user: { userId: string } }): Promise<UserEntity> {
    return (await this.userService.findById(req.user.userId)) as unknown as UserEntity;
  }
}