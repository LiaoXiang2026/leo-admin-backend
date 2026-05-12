import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DictTypeEntity {
  @ApiProperty({ description: '字典类型ID' })
  id: number;

  @ApiProperty({ description: '类型编码' })
  code: string;

  @ApiProperty({ description: '类型名称' })
  name: string;

  @ApiProperty({ description: '备注', required: false })
  remark?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

export class DictDataEntity {
  @ApiProperty({ description: '字典数据ID' })
  id: number;

  @ApiProperty({ description: '所属类型编码' })
  typeCode: string;

  @ApiProperty({ description: '标签名' })
  label: string;

  @ApiProperty({ description: '字典值' })
  value: string;

  @ApiProperty({ description: '排序', required: false })
  sort?: number;

  @ApiProperty({ description: '状态：1启用，0禁用', required: false })
  status?: number;

  @ApiProperty({ description: '备注', required: false })
  remark?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
