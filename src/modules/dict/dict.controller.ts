import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DictService } from './dict.service';
import {
  CreateDictTypeDto,
  UpdateDictTypeDto,
  DictTypeQueryDto,
  CreateDictDataDto,
  UpdateDictDataDto,
  DictDataQueryDto,
  BatchDeleteDictDataDto,
} from './dto/dict.dto';
import { DictTypePageResultDto, DictDataPageResultDto } from './dto/dict-page-result.dto';
import { DictTypeEntity, DictDataEntity } from './dto/dict-entities.dto';

@ApiBearerAuth()
@ApiTags('字典管理')
@Controller('dict')
@UseGuards(JwtAuthGuard)
export class DictController {
  constructor(private readonly dictService: DictService) {}

  // --- DictType ---

  @ApiOperation({ summary: '分页查询字典类型' })
  @ApiOkResponse({ type: DictTypePageResultDto })
  @Get('type/list')
  async listType(@Query() query: DictTypeQueryDto) {
    return this.dictService.findAllType(query);
  }

  @ApiOperation({ summary: '创建字典类型' })
  @ApiCreatedResponse({ type: DictTypeEntity })
  @Post('type')
  async createType(@Body() dto: CreateDictTypeDto) {
    return this.dictService.createType(dto);
  }

  @ApiOperation({ summary: '更新字典类型' })
  @ApiOkResponse({ type: DictTypeEntity })
  @Put('type/:id')
  async updateType(@Param('id') id: string, @Body() dto: UpdateDictTypeDto) {
    return this.dictService.updateType(+id, dto);
  }

  @ApiOperation({ summary: '删除字典类型' })
  @ApiOkResponse({ description: 'true' })
  @Delete('type/:id')
  async deleteType(@Param('id') id: string) {
    return this.dictService.deleteType(+id);
  }

  // --- DictData ---

  @ApiOperation({ summary: '分页查询字典数据' })
  @ApiOkResponse({ type: DictDataPageResultDto })
  @Get('data/list')
  async listData(@Query() query: DictDataQueryDto) {
    return this.dictService.findAllData(query);
  }

  @ApiOperation({ summary: '创建字典数据' })
  @ApiCreatedResponse({ type: DictDataEntity })
  @Post('data')
  async createData(@Body() dto: CreateDictDataDto) {
    return this.dictService.createData(dto);
  }

  @ApiOperation({ summary: '更新字典数据' })
  @ApiOkResponse({ type: DictDataEntity })
  @Put('data/:id')
  async updateData(@Param('id') id: string, @Body() dto: UpdateDictDataDto) {
    return this.dictService.updateData(+id, dto);
  }

  @ApiOperation({ summary: '删除单条字典数据' })
  @ApiOkResponse({ description: 'true' })
  @Delete('data/:id')
  async deleteData(@Param('id') id: string) {
    return this.dictService.deleteData(+id);
  }

  @ApiOperation({ summary: '批量删除字典数据' })
  @ApiOkResponse({ description: 'true' })
  @Delete('data/batch')
  async batchDeleteData(@Body() dto: BatchDeleteDictDataDto) {
    return this.dictService.batchDeleteData(dto);
  }
}
