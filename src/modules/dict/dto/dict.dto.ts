import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PageDto } from '../../../common/dto/page.dto';

// --- DictType DTOs ---

export class CreateDictTypeDto {
  @ApiProperty({ description: '类型编码' })
  @IsString()
  code: string;

  @ApiProperty({ description: '类型名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictTypeDto {
  @ApiPropertyOptional({ description: '类型编码' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '类型名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class DictTypeQueryDto extends PageDto {
  @ApiPropertyOptional({ description: '类型编码（模糊匹配）' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '类型名称（模糊匹配）' })
  @IsOptional()
  @IsString()
  name?: string;
}

// --- DictData DTOs ---

export class CreateDictDataDto {
  @ApiProperty({ description: '所属类型编码' })
  @IsString()
  typeCode: string;

  @ApiProperty({ description: '标签名' })
  @IsString()
  label: string;

  @ApiProperty({ description: '字典值' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;

  @ApiPropertyOptional({ description: '状态：1启用，0禁用', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateDictDataDto {
  @ApiPropertyOptional({ description: '标签名' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ description: '字典值' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;

  @ApiPropertyOptional({ description: '状态：1启用，0禁用' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class DictDataQueryDto extends PageDto {
  @ApiProperty({ description: '所属字典类型编码' })
  @IsString()
  typeCode: string;

  @ApiPropertyOptional({ description: '标签名（模糊匹配）' })
  @IsOptional()
  @IsString()
  label?: string;
}

export class BatchDeleteDictDataDto {
  @ApiProperty({ description: '要删除的数据ID数组', isArray: true, type: Number })
  @IsInt({ each: true })
  ids: number[];
}
