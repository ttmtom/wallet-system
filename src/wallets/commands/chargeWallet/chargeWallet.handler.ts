import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import * as UUID from 'uuid';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from 'src/wallets/wallets.repository';
import { ChargeWalletCommand } from './chargeWallet.command';
import { Transactions } from 'src/transactions/transaction.entity';
import { TransactionInitiatedEvent } from '@transactions/events/transactionInitiated/transactionInitiated.event';
import { ChargeConfirmedEvent } from '@wallet/events/chargeConfirmed/chargeConfirmed.event';

@CommandHandler(ChargeWalletCommand)
export class ChargeWalletHandler
  implements ICommandHandler<ChargeWalletCommand>
{
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly walletsRepository: WalletsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChargeWalletCommand): Promise<Transactions> {
    const { walletId, ownerId, amount, from } = command;

    const wallets = await this.walletsRepository.findByWalletIds([walletId]);
    const sourceWallets = await this.walletsRepository.findByOwnerId(from);

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

    const sourceWallet = sourceWallets.find((w) => w.owner === from);

    const transactionId = UUID.v4();
    const transaction = new Transactions(
      transactionId,
      amount,
      sourceWallet,
      targetWallet,
    );

    this.eventBus.publish(new TransactionInitiatedEvent(transaction));

    setTimeout(async () => {
      this.eventBus.publish(
        new ChargeConfirmedEvent(
          transactionId,
          amount,
          sourceWallet,
          targetWallet,
        ),
      );
    }, 10000);

    return transaction;
  }
}
