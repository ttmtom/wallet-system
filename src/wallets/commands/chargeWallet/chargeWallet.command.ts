export class ChargeWalletCommand {
  constructor(
    public readonly ownerId: string,
    public readonly walletId: string,
    public readonly from: string,
    public readonly amount: number,
  ) {}
}
