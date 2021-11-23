import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Wallet } from 'src/wallet/wallet.entity';
import {
  WalletRepository,
  WalletRepositorySymbol,
} from 'src/wallet/wallet.repository';
import { GetWalletQuery } from './getWallet.query';

@QueryHandler(GetWalletQuery)
export class GetWalletHandler implements IQueryHandler<GetWalletQuery> {
  constructor(
    @Inject(WalletRepositorySymbol)
    private readonly repository: WalletRepository,
  ) {}

  async execute(query: GetWalletQuery): Promise<Wallet[]> {
    console.log('---- hii  exec');
    console.log(query);
    return this.repository.findAll();
  }
}
