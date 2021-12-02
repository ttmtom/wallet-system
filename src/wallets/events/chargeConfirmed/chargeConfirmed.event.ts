import { Wallet } from '@wallet/wallet.entity';

export class ChargeConfirmedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly amount: number,
    public readonly sourceWallet: Wallet,
    public readonly targetWallet: Wallet,
  ) {}
}
