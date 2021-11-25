import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@constants/currency';

export class PostWalletBodyDto {
  @ApiProperty({ enum: Currency })
  currency: Currency;
}
