import { Currency } from '@constants/currency';

export class GetWalletQuery {
  constructor(
    public readonly ownerId: string,
    public readonly walletId: string,
  ) {}
}
