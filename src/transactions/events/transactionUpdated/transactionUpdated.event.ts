import { TransactionStatus } from '@constants/transactionStatus';

export class TransactionUpdatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly status: TransactionStatus,
    public readonly remark?: string,
  ) {}
}
