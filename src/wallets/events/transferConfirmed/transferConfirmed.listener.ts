import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransferWalletCommitCommand } from '@wallet/commands/transferWalletCommit/transferWalletCommit.command';
import { TransferConfirmedEvent } from './transferConfirmed.event';

@EventsHandler(TransferConfirmedEvent)
export class TransferConfirmedListener
  implements IEventHandler<TransferConfirmedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: TransferConfirmedEvent) {
    const { transactionId, sourceWallet, targetWallet, amount } = event;
    this.commandBus.execute(
      new TransferWalletCommitCommand(
        transactionId,
        amount,
        sourceWallet,
        targetWallet,
      ),
    );
  }
}
