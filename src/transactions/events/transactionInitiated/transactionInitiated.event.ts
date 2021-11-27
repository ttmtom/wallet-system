import { Transactions } from '@transactions/transaction.entity';

export class TransactionInitiatedEvent {
  constructor(public readonly transaction: Transactions) {}
}
