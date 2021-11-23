import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Wallet } from 'src/wallet/wallet.entity';
import {
  WalletRepository,
  WalletRepositorySymbol,
} from 'src/wallet/wallet.repository';
import { GetWalletsQuery } from './getWallets.query';

@QueryHandler(GetWalletsQuery)
export class GetWalletHandler implements IQueryHandler<GetWalletsQuery> {
  constructor(
    @Inject(WalletRepositorySymbol)
    private readonly repository: WalletRepository,
  ) {}

  async execute(query: GetWalletsQuery): Promise<Wallet[]> {
    return this.repository.findByOwnerId(query.ownerId);
  }
}
