import { TransactionStatus } from '@constants/transactionStatus';

export class UpdateTransactionCommand {
  constructor(
    public readonly transactionId: string,
    public readonly status: TransactionStatus,
    public readonly remark?: string,
  ) {}
}
