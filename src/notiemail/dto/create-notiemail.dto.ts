import { ApiProperty } from '@nestjs/swagger';

export class CreateNotiemailDto {
  @ApiProperty()
  time: string;
}
