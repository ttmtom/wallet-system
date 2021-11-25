import { Transactions } from '@transactions/transaction.entity';

export class CreateTransactionCommand {
  constructor(public readonly transaction: Transactions) {}
}
