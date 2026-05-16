import type { Request } from 'express';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';

import { OPERATE_LOG_KEY, type OperateLogOptions } from '../decorators/operate-log.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OperateLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.getAllAndOverride<OperateLogOptions>(OPERATE_LOG_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!options) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { module, action, description } = options;
        const duration = Date.now() - start;
        const descriptionText = description
          ? description.replace(/\{(\w+)\}/g, (_, key) => (req.params as any)[key] ?? `{${key}}`)
          : undefined;

        this.prisma.operateLog.create({
          data: {
            operator: (req.user as any)?.username ?? 'unknown',
            module,
            action,
            description: descriptionText,
            method: req.method,
            url: req.originalUrl ?? req.url,
            params: ['GET', 'DELETE'].includes(req.method) ? undefined : JSON.stringify(req.body),
            duration,
            ip: req.ip ?? '',
          },
        }).catch(() => {
          // 日志写入失败不影响主流程
        });
      }),
    );
  }
}
