import { Transactions } from '@transactions/transaction.entity';

export class CreateTransactionEvent {
  constructor(public readonly transaction: Transactions) {}
}
