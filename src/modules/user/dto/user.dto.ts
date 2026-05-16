import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../role/dto/role.dto';

export class UserEntity {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '真实姓名' })
  realName: string;

  @ApiProperty({ description: '头像', required: false })
  avatar?: string;

  @ApiProperty({ description: '描述', required: false })
  desc?: string;

  @ApiProperty({ description: '首页路径' })
  homePath: string;

  @ApiProperty({ description: 'JWT Token' })
  token: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;

  @ApiProperty({ type: [RoleEntity], description: '角色列表', required: false })
  roles?: RoleEntity[];
}
