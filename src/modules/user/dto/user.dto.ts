import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../role/dto/role.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({ description: '真实姓名', example: '系统管理员' })
  @IsString()
  @Length(1, 50)
  realName: string;

  @ApiProperty({ description: '头像', required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '描述', required: false, example: '系统管理员账户' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ description: '首页路径', example: '/dashboard' })
  @IsString()
  homePath: string;

  @ApiProperty({ description: '角色ID列表', required: false, example: ['role-uuid-1', 'role-uuid-2'] })
  @IsOptional()
  roleIds?: string[];
}

export class UpdateUserDto {
  @ApiProperty({ description: '用户名', required: false, example: 'admin' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @ApiProperty({ description: '密码', required: false, example: 'newpassword123' })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @ApiProperty({ description: '真实姓名', required: false, example: '系统管理员' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  realName?: string;

  @ApiProperty({ description: '头像', required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '描述', required: false, example: '系统管理员账户' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ description: '首页路径', required: false, example: '/dashboard' })
  @IsOptional()
  @IsString()
  homePath?: string;

  @ApiProperty({ description: '角色ID列表', required: false, example: ['role-uuid-1', 'role-uuid-2'] })
  @IsOptional()
  roleIds?: string[];
}

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

export class UserPageResultDto {
  @ApiProperty({ type: [UserEntity], description: '用户列表' })
  items: UserEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}