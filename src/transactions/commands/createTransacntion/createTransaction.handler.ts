import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactions } from 'src/transactions/transaction.entity';
import {
  TransactionsRepository,
  TransactionsRepositorySymbol,
} from 'src/transactions/transactions.repository';
import { CreateTransactionCommand } from './createTransaction.command';
import uuid from 'uuid';

@CommandHandler(CreateTransactionCommand)
export class ChargeWalletHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject(TransactionsRepositorySymbol)
    private readonly repository: TransactionsRepository,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<string> {
    const { from, to, amount } = command;

    const transactionId = uuid.v4();
    const transaction = new Transactions(transactionId, amount, from, to);

    await this.repository.save([transaction]);
    return transactionId;
  }
}
