import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [PrismaModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MenuModule {}
