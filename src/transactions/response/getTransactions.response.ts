import { Transactions } from '@transactions/transaction.entity';

export interface IGetTransactionsResponse {
  transactions: Transactions;
}
