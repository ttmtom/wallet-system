import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactions } from 'src/transactions/transaction.entity';
import {
  TransactionsRepository,
  TransactionsRepositorySymbol,
} from 'src/transactions/transactions.repository';
import { CreateTransactionCommand } from './createTransaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject(TransactionsRepositorySymbol)
    private readonly repository: TransactionsRepository,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Transactions> {
    const transaction = await this.repository.save([command.transaction]);
    return transaction[0];
  }
}
