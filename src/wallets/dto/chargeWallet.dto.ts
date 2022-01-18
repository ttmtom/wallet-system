import { ChargeSource } from '@constants/chargeSource';
import { ApiProperty } from '@nestjs/swagger';

export class ChargeWalletDto {
  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: ChargeSource })
  from: ChargeSource;
}
