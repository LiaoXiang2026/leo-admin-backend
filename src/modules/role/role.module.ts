import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { OperateLogModule } from '../operate-log/operate-log.module';

@Module({
  imports: [PrismaModule, OperateLogModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RoleModule {}
