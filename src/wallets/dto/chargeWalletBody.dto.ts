import { ApiProperty } from '@nestjs/swagger';

export class ChargeWalletBody {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  from: string;
}
