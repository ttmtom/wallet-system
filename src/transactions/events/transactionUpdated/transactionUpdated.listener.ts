import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from '@transactions/commands/updateTransaction/updateTransaction.command';
import { TransactionUpdatedEvent } from './transactionUpdated.event';

@EventsHandler(TransactionUpdatedEvent)
export class TransactionUpdatedListener
  implements IEventHandler<TransactionUpdatedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  handle(event: TransactionUpdatedEvent) {
    const { transactionId, status, remark } = event;
    this.commandBus.execute(
      new UpdateTransactionCommand(transactionId, status, remark),
    );
  }
}
