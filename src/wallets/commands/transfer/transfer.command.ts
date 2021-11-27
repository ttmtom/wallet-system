export class TransferCommand {
  constructor(
    public readonly ownerId: string,
    public readonly sourceWalletId: string,
    public readonly targetWalletId: string,
    public readonly amount: number,
  ) {}
}
