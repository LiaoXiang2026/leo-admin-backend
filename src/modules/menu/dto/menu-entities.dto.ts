import { ApiProperty } from '@nestjs/swagger';

export class MenuMetaEntity {
  @ApiProperty({ description: '标题', required: false })
  title?: string;

  @ApiProperty({ description: '图标', required: false })
  icon?: string;

  @ApiProperty({ description: '排序', required: false })
  order?: number;

  @ApiProperty({ description: '是否在菜单中隐藏', required: false })
  hideInMenu?: boolean;

  @ApiProperty({ description: '是否在标签页中隐藏', required: false })
  hideInTab?: boolean;

  @ApiProperty({ description: '是否缓存', required: false })
  keepAlive?: boolean;

  @ApiProperty({ description: '是否固定标签页', required: false })
  affixTab?: boolean;

  @ApiProperty({ description: '徽章', required: false })
  badge?: string;

  @ApiProperty({ description: '徽章类型', required: false })
  badgeType?: string;
}

export class MenuItemEntity {
  @ApiProperty({ description: '菜单名称' })
  name: string;

  @ApiProperty({ description: '菜单路径' })
  path: string;

  @ApiProperty({ description: '组件路径' })
  component: string;

  @ApiProperty({ type: MenuMetaEntity, description: '菜单元数据', required: false })
  meta?: MenuMetaEntity;

  @ApiProperty({ type: [MenuItemEntity], description: '子菜单', required: false })
  children?: MenuItemEntity[];
}
