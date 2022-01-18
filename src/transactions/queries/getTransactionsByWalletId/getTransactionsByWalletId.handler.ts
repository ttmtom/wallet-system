import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transactions } from '@transactions/transaction.entity';
import {
  TransactionsRepository,
  TransactionsRepositorySymbol,
} from '@transactions/transactions.repository';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from '@wallet/wallets.repository';
import { GetTransactionByWalletIdQuery } from './getTransactionsByWalletId.query';

@QueryHandler(GetTransactionByWalletIdQuery)
export class GetTransactionByWalletIdHandler
  implements IQueryHandler<GetTransactionByWalletIdQuery>
{
  constructor(
    @Inject(TransactionsRepositorySymbol)
    private readonly transactionRepository: TransactionsRepository,
    @Inject(WalletsRepositorySymbol)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async execute(query: GetTransactionByWalletIdQuery): Promise<Transactions[]> {
    const { ownerId, walletId } = query;
    const isBelong = await this.walletsRepository.isWalletBelongToUser(
      ownerId,
      walletId,
    );
    if (!isBelong) {
      throw new HttpException(
        'Wallet is not belong to user',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.transactionRepository.findByWalletId(query.walletId);
  }
}
