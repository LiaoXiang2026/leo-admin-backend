import { ApiProperty } from '@nestjs/swagger';
import { DictTypeEntity, DictDataEntity } from './dict-entities.dto';

export class DictTypePageResultDto {
  @ApiProperty({ type: [DictTypeEntity], description: '字典类型列表' })
  items: DictTypeEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}

export class DictDataPageResultDto {
  @ApiProperty({ type: [DictDataEntity], description: '字典数据列表' })
  items: DictDataEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}
