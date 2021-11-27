import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  targetWalletId: string;
}
