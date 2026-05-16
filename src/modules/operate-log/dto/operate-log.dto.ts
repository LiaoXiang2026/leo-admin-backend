import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PageDto } from '../../../common/dto/page.dto';

// --- Request DTOs ---

export class OperateLogQueryDto extends PageDto {
  @ApiPropertyOptional({ description: '操作人（模糊匹配）' })
  @IsOptional()
  @IsString()
  operator?: string;

  @ApiPropertyOptional({ description: '操作模块（模糊匹配）' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: '操作类型（精确匹配）' })
  @IsOptional()
  @IsString()
  action?: string;
}

export class BatchDeleteOperateLogDto {
  @ApiProperty({ description: '要删除的日志ID数组', isArray: true, type: Number })
  @IsInt({ each: true })
  ids: number[];
}

// --- Response DTOs ---

export class OperateLogEntity {
  @ApiProperty({ description: '日志ID' })
  id: number;

  @ApiProperty({ description: '操作人' })
  operator: string;

  @ApiProperty({ description: '操作模块' })
  module: string;

  @ApiProperty({ description: '操作类型' })
  action: string;

  @ApiProperty({ description: '操作描述', required: false })
  description?: string;

  @ApiProperty({ description: '请求方法' })
  method: string;

  @ApiProperty({ description: '请求URL' })
  url: string;

  @ApiProperty({ description: '请求参数', required: false })
  params?: string;

  @ApiProperty({ description: '耗时(ms)', required: false })
  duration?: number;

  @ApiProperty({ description: 'IP地址' })
  ip: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

export class OperateLogPageResultDto {
  @ApiProperty({ type: [OperateLogEntity], description: '日志列表' })
  items: OperateLogEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}
