import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransferWalletCommitCommand } from './transferWalletCommit.command';
import { TransactionUpdatedEvent } from '@transactions/events/transactionUpdated/transactionUpdated.event';
import { TransactionStatus } from '@constants/transactionStatus';
import { Wallet } from '@wallet/wallet.entity';
import { connectionName } from 'src/db/connection';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@CommandHandler(TransferWalletCommitCommand)
export class TransferWalletCommitHandler
  implements ICommandHandler<TransferWalletCommitCommand>
{
  constructor(
    private readonly eventBus: EventBus,
    @InjectConnection(connectionName)
    private readonly connection: Connection,
  ) {}

  async execute(command: TransferWalletCommitCommand): Promise<null> {
    const { transactionId, targetWallet, sourceWallet, amount } = command;

    if (sourceWallet.balance < amount) {
      this.eventBus.publish(
        new TransactionUpdatedEvent(
          transactionId,
          TransactionStatus.FAILED,
          'Source wallet balance not enough',
        ),
      );
    } else {
      const queryRunner = this.connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        sourceWallet.pay(amount);
        targetWallet.charge(amount);
        await queryRunner.manager.save<Wallet>([sourceWallet, targetWallet]);

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
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
    return;
  }
}
