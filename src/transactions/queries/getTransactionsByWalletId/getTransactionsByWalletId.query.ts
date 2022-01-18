export class GetTransactionByWalletIdQuery {
  constructor(
    public readonly ownerId: string,
    public readonly walletId: string,
  ) {}
}
