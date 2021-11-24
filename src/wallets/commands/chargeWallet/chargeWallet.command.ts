export class ChargeWalletCommand {
  constructor(
    public readonly ownerId: string,
    public readonly walletId: string,
    public readonly from: string | null,
    public readonly amount: number,
  ) {}
}
