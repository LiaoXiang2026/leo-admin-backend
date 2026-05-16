import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OperateLogController } from './operate-log.controller';
import { OperateLogService } from './operate-log.service';

@Module({
  imports: [PrismaModule],
  controllers: [OperateLogController],
  providers: [OperateLogService],
  exports: [OperateLogService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OperateLogModule {}
