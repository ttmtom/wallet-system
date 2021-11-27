import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import * as UUID from 'uuid';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from 'src/wallets/wallets.repository';
import { ChargeWalletCommand } from './chargeWallet.command';
import { Transactions } from 'src/transactions/transaction.entity';
import { TransactionInitiatedEvent } from '@transactions/events/transactionInitiated/transactionInitiated.event';
import { TransactionUpdatedEvent } from '@transactions/events/transactionUpdated/transactionUpdated.event';
import { TransactionStatus } from '@constants/transactionStatus';
import { SourceId } from '@constants/chargeSource';

@CommandHandler(ChargeWalletCommand)
export class ChargeWalletHandler
  implements ICommandHandler<ChargeWalletCommand>
{
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly walletsRepository: WalletsRepository,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: ChargeWalletCommand): Promise<Transactions> {
    const { walletId, ownerId, amount, from } = command;

    const wallets = await this.walletsRepository.findByWalletIds([
      walletId,
      SourceId[from],
    ]);

    const targetWallet = wallets.find((w) => w.id === walletId);

    if (!wallets.length || !targetWallet) {
      throw new HttpException(
        'Target Wallet not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (targetWallet.owner !== ownerId) {
      throw new HttpException(
        'Wallet is not belong to user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sourceWallet = wallets.find((w) => w.id === SourceId[from]);

    const transactionId = UUID.v4();
    const transaction = new Transactions(
      transactionId,
      amount,
      sourceWallet,
      targetWallet,
    );

    this.eventBus.publish(new TransactionInitiatedEvent(transaction));

    setTimeout(async () => {
      targetWallet.charge(amount);
      await this.walletsRepository.save([targetWallet]);
      this.eventBus.publish(
        new TransactionUpdatedEvent(transactionId, TransactionStatus.SUCCESS),
      );
    }, 20000);

    return transaction;
  }
}
