import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Wallet } from '@wallet/wallet.entity';
import {
  WalletRepository,
  WalletRepositorySymbol,
} from '@wallet/wallet.repository';
import { GetWalletsQuery } from './getWallets.query';

@QueryHandler(GetWalletsQuery)
export class GetWalletHandler implements IQueryHandler<GetWalletsQuery> {
  constructor(
    @Inject(WalletRepositorySymbol)
    private readonly repository: WalletRepository,
  ) {}

  async execute(query: GetWalletsQuery): Promise<Wallet[]> {
    console.log(query.ownerId);
    return this.repository.findAll();
  }
}
