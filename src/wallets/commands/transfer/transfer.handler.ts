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
} from '@wallet/wallets.repository';
import { TransferCommand } from './transfer.command';
import { Transactions } from '@transactions/transaction.entity';
import { TransactionInitiatedEvent } from '@transactions/events/transactionInitiated/transactionInitiated.event';
import { TransactionUpdatedEvent } from '@transactions/events/transactionUpdated/transactionUpdated.event';
import { TransactionStatus } from '@constants/transactionStatus';

@CommandHandler(TransferCommand)
export class TransferHandler implements ICommandHandler<TransferCommand> {
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly walletsRepository: WalletsRepository,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: TransferCommand): Promise<Transactions> {
    const { ownerId, sourceWalletId, targetWalletId, amount } = command;

    const wallets = await this.walletsRepository.findByWalletIds([
      sourceWalletId,
      targetWalletId,
    ]);

    const sourceWallet = wallets.find((w) => w.id === sourceWalletId);

    if (!wallets.length || !sourceWallet) {
      throw new HttpException(
        'Source Wallet not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (sourceWallet.owner !== ownerId) {
      throw new HttpException(
        'Wallet is not belong to user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const targetWallet = wallets.find((w) => w.id === targetWalletId);

    if (!targetWallet) {
      throw new HttpException(
        'Target Wallet not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const transactionId = UUID.v4();
    const transaction = new Transactions(
      transactionId,
      amount,
      sourceWallet,
      targetWallet,
    );

    this.eventBus.publish(new TransactionInitiatedEvent(transaction));

    setTimeout(async () => {
      if (sourceWallet.balance < amount) {
        this.eventBus.publish(
          new TransactionUpdatedEvent(
            transactionId,
            TransactionStatus.FAILED,
            'Source wallet balance not enough',
          ),
        );
      } else {
        sourceWallet.pay(amount);
        targetWallet.charge(amount);
        await this.walletsRepository.save([sourceWallet, targetWallet]);
        this.eventBus.publish(
          new TransactionUpdatedEvent(transactionId, TransactionStatus.SUCCESS),
        );
      }
    }, 20000);

    return transaction;
  }
}
