import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '@transactions/commands/createTransacntion/createTransaction.command';
import { CreateTransactionEvent } from './createTransaction.event';

@EventsHandler(CreateTransactionEvent)
export class CreateTransactionListener
  implements IEventHandler<CreateTransactionEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  handle(event: CreateTransactionEvent) {
    this.commandBus.execute(new CreateTransactionCommand(event.transaction));
  }
}
