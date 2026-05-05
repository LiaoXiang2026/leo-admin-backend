import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

export interface MenuItem {
  name: string;
  path: string;
  component: string;
  meta?: {
    affixTab?: boolean;
    badge?: string;
    badgeType?: 'dot' | 'normal';
    hideInMenu?: boolean;
    hideInTab?: boolean;
    icon?: string;
    keepAlive?: boolean;
    order?: number;
    title?: string;
  };
  children?: MenuItem[];
}

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MenuItem[]> {
    const menus = await this.prisma.menu.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return menus.map((menu) => this.buildMenuItem(menu));
  }

  private buildMenuItem(menu: any): MenuItem {
    const item: MenuItem = {
      name: menu.name,
      path: menu.path,
      component: menu.component,
    };

    const meta: any = {};
    if (menu.title) meta.title = menu.title;
    if (menu.icon) meta.icon = menu.icon;
    if (menu.order !== undefined) meta.order = menu.order;
    if (menu.hideInMenu) meta.hideInMenu = menu.hideInMenu;
    if (menu.hideInTab) meta.hideInTab = menu.hideInTab;
    if (menu.keepAlive) meta.keepAlive = menu.keepAlive;
    if (menu.affixTab) meta.affixTab = menu.affixTab;
    if (menu.badge) meta.badge = menu.badge;
    if (menu.badgeType) meta.badgeType = menu.badgeType;

    if (Object.keys(meta).length > 0) {
      item.meta = meta;
    }

    if (menu.children && menu.children.length > 0) {
      item.children = menu.children.map((child: any) =>
        this.buildMenuItem(child),
      );
    }

    return item;
  }
}
