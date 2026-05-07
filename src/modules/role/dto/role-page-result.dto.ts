import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from './role-entities.dto';

export class RolePageResultDto {
  @ApiProperty({ type: [RoleEntity], description: '角色列表' })
  items: RoleEntity[];

  @ApiProperty({ description: '总数' })
  total: number;
}
