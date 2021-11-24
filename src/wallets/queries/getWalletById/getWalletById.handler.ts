import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Wallet } from 'src/wallets/wallet.entity';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from 'src/wallets/wallets.repository';
import { GetWalletByIdQuery } from './getWalletById.query';

@QueryHandler(GetWalletByIdQuery)
export class GetWalletByIdHandler implements IQueryHandler<GetWalletByIdQuery> {
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly repository: WalletsRepository,
  ) {}

  async execute(query: GetWalletByIdQuery): Promise<Wallet[]> {
    return this.repository.findByWalletIds([query.walletId]);
  }
}
