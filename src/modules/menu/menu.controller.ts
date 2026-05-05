import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MenuService } from './menu.service';

@ApiBearerAuth()
@ApiTags('菜单模块')
@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '获取用户所有菜单' })
  @Get('all')
  async getAllMenus() {
    return this.menuService.findAll();
  }
}
