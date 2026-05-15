import { SetMetadata } from '@nestjs/common';

/**
 * 元数据 key，TransformInterceptor 通过它判断是否跳过响应包装
 */
export const SKIP_TRANSFORM_KEY = 'skipTransform';

/**
 * 标记分页查询接口，跳过 TransformInterceptor 的 { success, data, message } 包装
 *
 * 使用方法：在 Controller 方法上添加 @SkipTransform() 即可
 */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
