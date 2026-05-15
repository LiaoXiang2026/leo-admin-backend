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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  @ApiOkResponse({ type: [String], description: '权限码列表' })
  @Get('codes')
  @UseGuards(JwtAuthGuard)
  async getCodes(@Req() req: Request & { user: { userId: string } }): Promise<string[]> {
    return this.authService.getAccessCodes(req.user.userId);
  }

  @ApiOperation({ summary: '登录' })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    const tokens = await this.authService.login(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      ...user,
    } as unknown as LoginResponse;
  }

  @ApiOperation({ summary: '退出登录' })
  @Post('logout')
  async logout(): Promise<null> {
    return null;
  }

  @ApiOperation({ summary: '刷新 AccessToken' })
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<RefreshResponse> {
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