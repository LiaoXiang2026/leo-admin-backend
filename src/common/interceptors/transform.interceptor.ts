import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SKIP_TRANSFORM_KEY } from '../decorators/skip-transform.decorator';

// 全局统一响应格式
export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * 全局响应拦截器
 *
 * 默认行为：将所有返回值包装为 { success, data, message }
 *
 * 跳过包装：在 Controller 方法上添加 @SkipTransform()
 * 拦截器会读取 Reflector 元数据，检测到 skipTransform=true 时直接透传原始数据
 *
 * 注册方式：通过 APP_INTERCEPTOR 在 AppModule 注册，而非 app.useGlobalInterceptors，
 * 这样 Reflector 依赖可以正常注入
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T> | T> {
    // 从方法或类上读取 @SkipTransform() 元数据
    const skipTransform = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 跳过包装，直接返回原始数据（用于分页等前端不需要包裹的场景）
    if (skipTransform) {
      return next.handle();
    }

    // 默认包装为统一响应格式
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: 'ok',
      })),
    );
  }
}
