import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEntity } from '../../role/dto/role.dto';

// --- Request DTOs ---

export class LoginDto {
  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;

  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;
}

// --- Response DTOs ---

export class LoginResponse {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;

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

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;

  @ApiProperty({ type: [RoleEntity], description: '角色列表', required: false })
  roles?: RoleEntity[];
}

export class CodesResponse {
  @ApiProperty({ type: [String], description: '权限码列表' })
  codes: string[];
}

export class RefreshResponse {
  @ApiProperty({ description: '新的访问令牌' })
  data: string;

  @ApiProperty({ description: '状态码' })
  status: number;
}
