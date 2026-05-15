import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DictService } from './dict.service';
import { SkipTransform } from '../../common/decorators/skip-transform.decorator';
import {
  CreateDictTypeDto,
  UpdateDictTypeDto,
  DictTypeQueryDto,
  CreateDictDataDto,
  UpdateDictDataDto,
  DictDataQueryDto,
  BatchDeleteDictDataDto,
  DictTypeEntity,
  DictDataEntity,
  DictTypePageResultDto,
  DictDataPageResultDto,
} from './dto/dict.dto';

@ApiBearerAuth()
@ApiTags('字典管理')
@Controller('dict')
@UseGuards(JwtAuthGuard)
export class DictController {
  constructor(private readonly dictService: DictService) {}

  // --- DictType ---

  @ApiOperation({ summary: '分页查询字典类型' })
  @ApiOkResponse({ type: DictTypePageResultDto })
  @SkipTransform()
  @Get('type/list')
  async listType(@Query() query: DictTypeQueryDto): Promise<DictTypePageResultDto> {
    return this.dictService.findAllType(query);
  }

  @ApiOperation({ summary: '创建字典类型' })
  @ApiCreatedResponse({ type: DictTypeEntity })
  @Post('type')
  async createType(@Body() dto: CreateDictTypeDto): Promise<DictTypeEntity> {
    return this.dictService.createType(dto) as unknown as DictTypeEntity;
  }

  @ApiOperation({ summary: '更新字典类型' })
  @ApiOkResponse({ type: DictTypeEntity })
  @Post('type/:id')
  async updateType(@Param('id') id: string, @Body() dto: UpdateDictTypeDto): Promise<DictTypeEntity> {
    return this.dictService.updateType(+id, dto) as unknown as DictTypeEntity;
  }

  @ApiOperation({ summary: '删除字典类型' })
  @ApiOkResponse({ type: Boolean })
  @Post('type/delete/:id')
  async deleteType(@Param('id') id: string): Promise<boolean> {
    return this.dictService.deleteType(+id);
  }

  // --- DictData ---

  @ApiOperation({ summary: '分页查询字典数据' })
  @ApiOkResponse({ type: DictDataPageResultDto })
  @SkipTransform()
  @Get('data/list')
  async listData(@Query() query: DictDataQueryDto): Promise<DictDataPageResultDto> {
    return this.dictService.findAllData(query);
  }

  @ApiOperation({ summary: '创建字典数据' })
  @ApiCreatedResponse({ type: DictDataEntity })
  @Post('data')
  async createData(@Body() dto: CreateDictDataDto): Promise<DictDataEntity> {
    return this.dictService.createData(dto) as unknown as DictDataEntity;
  }

  @ApiOperation({ summary: '更新字典数据' })
  @ApiOkResponse({ type: DictDataEntity })
  @Post('data/:id')
  async updateData(@Param('id') id: string, @Body() dto: UpdateDictDataDto): Promise<DictDataEntity> {
    return this.dictService.updateData(+id, dto) as unknown as DictDataEntity;
  }

  @ApiOperation({ summary: '删除单条字典数据' })
  @ApiOkResponse({ type: Boolean })
  @Post('data/delete/:id')
  async deleteData(@Param('id') id: string): Promise<boolean> {
    return this.dictService.deleteData(+id);
  }

  @ApiOperation({ summary: '批量删除字典数据' })
  @ApiOkResponse({ type: Boolean })
  @Post('data/batchDelete')
  async batchDeleteData(@Body() dto: BatchDeleteDictDataDto): Promise<boolean> {
    return this.dictService.batchDeleteData(dto);
  }
}