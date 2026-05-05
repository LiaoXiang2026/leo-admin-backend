import type { Request } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, RefreshResponse } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户权限码' })
  @ApiOkResponse({ type: [String] })
  @Get('codes')
  @UseGuards(JwtAuthGuard)
  async getCodes(@Req() req: Request & { user: { userId: string } }) {
    return this.authService.getAccessCodes(req.user.userId);
  }

  @ApiOperation({ summary: '登录' })
  @ApiCreatedResponse({ type: LoginResponse })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    const tokens = await this.authService.login(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      ...user,
    };
  }

  @ApiOperation({ summary: '退出登录' })
  @ApiOkResponse()
  @Post('logout')
  async logout() {
    return null;
  }

  @ApiOperation({ summary: '刷新 AccessToken' })
  @ApiCreatedResponse({ type: RefreshResponse })
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken =
      (req.body as any)?.refreshToken || req.cookies?.refreshToken || '';
    if (!refreshToken) {
      throw new UnauthorizedException('缺少刷新令牌');
    }
    const result = await this.authService.refreshToken(refreshToken);
    return {
      data: result.accessToken,
      status: 200,
    };
  }
}
