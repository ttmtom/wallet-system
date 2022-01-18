import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@constants/currency';

export class CreateWalletDto {
  @ApiProperty({ enum: Currency })
  currency: Currency;
}
