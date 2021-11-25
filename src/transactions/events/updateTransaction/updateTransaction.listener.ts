import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from '@transactions/commands/updateTransaction/updateTransaction.command';
import { UpdateTransactionEvent } from './updateTransaction.event';

@EventsHandler(UpdateTransactionEvent)
export class UpdateTransactionListener
  implements IEventHandler<UpdateTransactionEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  handle(event: UpdateTransactionEvent) {
    const { transactionId, status, remark } = event;
    this.commandBus.execute(
      new UpdateTransactionCommand(transactionId, status, remark),
    );
  }
}
