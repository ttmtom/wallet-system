export class GetWalletByIdQuery {
  constructor(
    public readonly ownerId: string,
    public readonly walletId: string,
  ) {}
}
