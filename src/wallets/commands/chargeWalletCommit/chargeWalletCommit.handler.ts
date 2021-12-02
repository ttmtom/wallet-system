import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ChargeWalletCommitCommand } from './chargeWalletCommit.command';
import { TransactionUpdatedEvent } from '@transactions/events/transactionUpdated/transactionUpdated.event';
import { TransactionStatus } from '@constants/transactionStatus';
import { getConnection } from 'typeorm';
import { Wallet } from '@wallet/wallet.entity';
import { connectionName } from 'src/db/connection';

@CommandHandler(ChargeWalletCommitCommand)
export class ChargeWalletCommitHandler
  implements ICommandHandler<ChargeWalletCommitCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: ChargeWalletCommitCommand): Promise<null> {
    const { transactionId, targetWallet, amount } = command;

    targetWallet.charge(amount);
    const connection = getConnection(connectionName);
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save<Wallet>(targetWallet);

      await queryRunner.commitTransaction();

      this.eventBus.publish(
        new TransactionUpdatedEvent(transactionId, TransactionStatus.SUCCESS),
      );
    } catch (err) {
      this.eventBus.publish(
        new TransactionUpdatedEvent(
          transactionId,
          TransactionStatus.FAILED,
          'transaction error',
        ),
      );
    } finally {
      await queryRunner.release();
    }
    return;
  }
}
