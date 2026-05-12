import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DictController } from './dict.controller';
import { DictService } from './dict.service';

@Module({
  imports: [PrismaModule],
  controllers: [DictController],
  providers: [DictService],
  exports: [DictService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DictModule {}
