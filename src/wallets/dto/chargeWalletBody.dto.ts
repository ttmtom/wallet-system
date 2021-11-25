import { ChargeSource } from '@constants/chargeSource';
import { ApiProperty } from '@nestjs/swagger';

export class ChargeWalletBody {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  from: ChargeSource;
}
