import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Wallet } from 'src/wallets/wallet.entity';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from 'src/wallets/wallets.repository';
import { GetWalletsQuery } from './getWallets.query';

@QueryHandler(GetWalletsQuery)
export class GetWalletsHandler
  implements IQueryHandler<GetWalletsQuery, Wallet[]>
{
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly repository: WalletsRepository,
  ) {}

  async execute(query: GetWalletsQuery): Promise<Wallet[]> {
    return this.repository.findByOwnerId(query.ownerId, query.currency);
  }
}
