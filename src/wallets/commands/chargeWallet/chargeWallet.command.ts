import { ChargeSource } from '@constants/chargeSource';

export class ChargeWalletCommand {
  constructor(
    public readonly ownerId: string,
    public readonly walletId: string,
    public readonly from: ChargeSource,
    public readonly amount: number,
  ) {}
}
