import { ApiProperty } from '@nestjs/swagger';

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
