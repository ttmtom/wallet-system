import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '@transactions/commands/createTransacntion/createTransaction.command';
import { TransactionInitiatedEvent } from './transactionInitiated.event';

@EventsHandler(TransactionInitiatedEvent)
export class TransactionInitiatedListener
  implements IEventHandler<TransactionInitiatedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  handle(event: TransactionInitiatedEvent) {
    this.commandBus.execute(new CreateTransactionCommand(event.transaction));
  }
}
