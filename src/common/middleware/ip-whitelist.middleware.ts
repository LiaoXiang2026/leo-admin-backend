import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * IP / 域名白名单中间件
 *
 * 通过环境变量 ALLOWED_ORIGINS 控制可访问的来源。
 * 默认自动放行 localhost / 127.0.0.1 / ::1。
 *
 * 配置示例（.env）：
 *   ALLOWED_ORIGINS=localhost,mydomain.com,192.168.1.100
 *
 * 检查优先级：
 *   1. Origin header
 *   2. Referer header
 *   3. Host header
 *   4. X-Forwarded-For header（反向代理后的真实 IP）
 *   5. socket.remoteAddress
 */
@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly allowedList: string[];

  constructor() {
    const envList = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    // 默认总是允许本地地址
    const localhostVariants = ['localhost', '127.0.0.1', '::1'];
    this.allowedList = Array.from(new Set([...localhostVariants, ...envList]));
  }

  use(req: Request, res: Response, next: NextFunction) {
    const origin = this.extractOrigin(req);

    if (!origin) {
      // 没有任何来源信息时放行（如内网服务、健康检查等）
      return next();
    }

    if (this.isAllowed(origin)) {
      return next();
    }

    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      data: null,
      message: 'Forbidden: origin not allowed',
    });
  }

  private extractOrigin(req: Request): string | null {
    // 1. Origin header（跨域预检或浏览器请求时最准确）
    const originHeader = req.headers.origin;
    if (originHeader) {
      return this.cleanOrigin(originHeader);
    }

    // 2. Referer header
    const referer = req.headers.referer;
    if (referer) {
      try {
        return this.cleanOrigin(new URL(referer).origin);
      } catch {
        // 解析失败则回退到直接清理字符串
        return this.cleanOrigin(referer);
      }
    }

    // 3. Host header
    const host = req.headers.host;
    if (host) {
      return this.cleanOrigin(host);
    }

    // 4. X-Forwarded-For（经过反向代理后的真实客户端 IP）
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }

    // 5. 直接连接地址
    const remote = req.socket.remoteAddress;
    if (remote) {
      return remote;
    }

    return null;
  }

  private cleanOrigin(origin: string): string {
    return origin
      .replace(/^https?:\/\//, '')
      .replace(/:\d+$/, '')
      .toLowerCase();
  }

  private isAllowed(origin: string): boolean {
    const clean = this.cleanOrigin(origin);
    return this.allowedList.some((allowed) => clean === allowed || clean.endsWith('.' + allowed));
  }
}
