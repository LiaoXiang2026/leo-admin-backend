import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OperateLogService } from './operate-log.service';
import {
  OperateLogQueryDto,
  BatchDeleteOperateLogDto,
  OperateLogEntity,
  OperateLogPageResultDto,
} from './dto/operate-log.dto';
import { SkipTransform } from '../../common/decorators/skip-transform.decorator';

@ApiBearerAuth()
@ApiTags('操作日志')
@Controller('operate-log')
@UseGuards(JwtAuthGuard)
export class OperateLogController {
  constructor(private readonly operateLogService: OperateLogService) {}

  @ApiOperation({ summary: '分页查询操作日志' })
  @ApiOkResponse({ type: OperateLogPageResultDto })
  @SkipTransform()
  @Get()
  async list(@Query() query: OperateLogQueryDto): Promise<OperateLogPageResultDto> {
    return this.operateLogService.findAll(query) as unknown as OperateLogPageResultDto;
  }

  @ApiOperation({ summary: '获取操作日志详情' })
  @ApiOkResponse({ type: OperateLogEntity })
  @Get(':id')
  async detail(@Param('id') id: string): Promise<OperateLogEntity> {
    return this.operateLogService.findById(+id) as unknown as OperateLogEntity;
  }

  @ApiOperation({ summary: '删除操作日志' })
  @ApiOkResponse({ type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.operateLogService.delete(+id);
  }

  @ApiOperation({ summary: '批量删除操作日志' })
  @ApiOkResponse({ type: Boolean })
  @Post('batchDelete')
  async batchDelete(@Body() dto: BatchDeleteOperateLogDto): Promise<boolean> {
    return this.operateLogService.batchDelete(dto);
  }
}
