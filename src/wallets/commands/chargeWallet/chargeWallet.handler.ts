import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Wallet } from 'src/wallets/wallet.entity';
import * as uuid from 'uuid';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from 'src/wallets/wallets.repository';
import { ChargeWalletCommand } from './chargeWallet.command';
import { Transactions } from 'src/transactions/transaction.entity';
import { CreateTransactionEvent } from '@transactions/events/createTransaction/createTransaction.event';
import { UpdateTransactionEvent } from '@transactions/events/updateTransaction/updateTransaction.event';
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

    const wallets = await this.walletsRepository.findByWalletIds([walletId]);

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

    const sourceWallets = await this.walletsRepository.findByWalletIds([
      SourceId[from],
    ]);

    const transactionId = uuid.v4();
    const transaction = new Transactions(
      transactionId,
      amount,
      sourceWallets[0],
      targetWallet,
    );

    this.eventBus.publish(new CreateTransactionEvent(transaction));

    setTimeout(async () => {
      targetWallet.charge(amount);
      await this.walletsRepository.save([targetWallet]);
      this.eventBus.publish(
        new UpdateTransactionEvent(transactionId, TransactionStatus.SUCCESS),
      );
    }, 20000);

    return transaction;
  }
}
