import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  username: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getAccessCodes(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
        permissions: true,
      },
    });

    if (!user) return [];

    const codes = new Set<string>();
    // 从角色获取权限
    user.roles.forEach((role) => {
      role.permissions.forEach((perm) => codes.add(perm.code));
    });
    // 从用户直接关联获取权限
    user.permissions.forEach((perm) => codes.add(perm.code));

    return [...codes];
  }

  async login(user: any): Promise<TokenPair> {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '2h'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const newPayload: JwtPayload = {
        sub: payload.sub,
        username: payload.username,
      };
      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '2h'),
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: true },
    });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const { password: _pwd, ...result } = user;
    return result;
  }
}
