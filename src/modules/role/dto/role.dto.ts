import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// --- Request DTOs ---

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '权限ID数组' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '权限ID数组（全量替换）' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];
}

// --- Entity DTOs ---

export class PermissionEntity {
  @ApiProperty({ description: '权限ID' })
  id: string;

  @ApiProperty({ description: '权限码' })
  code: string;

  @ApiProperty({ description: '权限名称' })
  name: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;
}

export class RoleEntity {
  @ApiProperty({ description: '角色ID' })
  id: string;

  @ApiProperty({ description: '角色名称' })
  name: string;

  @ApiProperty({ description: '角色描述', required: false })
  description?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;

  @ApiProperty({ type: [PermissionEntity], description: '权限列表', required: false })
  permissions?: PermissionEntity[];
}

// --- Page Result DTOs ---

export class RolePageResultDto {
  @ApiProperty({ type: [RoleEntity], description: '角色列表' })
  items: RoleEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}
