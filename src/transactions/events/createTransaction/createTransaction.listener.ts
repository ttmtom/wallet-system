// import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { CreateTransactionEvent } from './createTransaction.event';

// @EventsHandler(CreateTransactionEvent)
// export class CreateTransactionListener
//   implements IEventHandler<CreateTransactionEvent>
// {
//   constructor(private readonly commandBus: CommandBus) {}

//   handle(event: CreateTransactionEvent) {
//       this.commandBus.execute();
//   }
// }
