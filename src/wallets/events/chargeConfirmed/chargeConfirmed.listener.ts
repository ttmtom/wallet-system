import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ChargeWalletCommitCommand } from '@wallet/commands/chargeWalletCommit/chargeWalletCommit.command';
import { ChargeConfirmedEvent } from './chargeConfirmed.event';

@EventsHandler(ChargeConfirmedEvent)
export class ChargeConfirmedListener
  implements IEventHandler<ChargeConfirmedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ChargeConfirmedEvent) {
    const { transactionId, targetWallet, sourceWallet, amount } = event;
    this.commandBus.execute(
      new ChargeWalletCommitCommand(
        transactionId,
        amount,
        sourceWallet,
        targetWallet,
      ),
    );
  }
}
