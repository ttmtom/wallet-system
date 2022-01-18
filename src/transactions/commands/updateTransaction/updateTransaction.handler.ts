import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactions } from 'src/transactions/transaction.entity';
import {
  TransactionsRepository,
  TransactionsRepositorySymbol,
} from 'src/transactions/transactions.repository';
import { UpdateTransactionCommand } from './updateTransaction.command';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    @Inject(TransactionsRepositorySymbol)
    private readonly repository: TransactionsRepository,
  ) {}

  async execute(command: UpdateTransactionCommand): Promise<Transactions> {
    const { transactionId, status, remark } = command;
    const transactions = await this.repository.findByIds([transactionId]);

    const targetTransaction = transactions.find((t) => t.id === transactionId);
    if (!targetTransaction) {
      throw new HttpException(
        'Target transaction not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    targetTransaction.status = status;
    targetTransaction.remark = remark ?? '';
    await this.repository.save([targetTransaction]);
    return targetTransaction;
  }
}
