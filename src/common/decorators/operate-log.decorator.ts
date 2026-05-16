import { SetMetadata } from '@nestjs/common';

export const OPERATE_LOG_KEY = 'operateLog';

export interface OperateLogOptions {
  module: string;
  action: string;
  description?: string;
}

export const OperateLog = (options: OperateLogOptions) =>
  SetMetadata(OPERATE_LOG_KEY, options);
