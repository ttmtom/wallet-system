import { Currency } from '@constants/currency';

export class CreateWalletCommand {
  constructor(
    public readonly ownerId: string,
    public readonly currency: Currency,
  ) {}
}
