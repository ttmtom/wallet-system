import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
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
import { GetWalletsQuery } from 'src/wallets/queries/getWallets/getWallets.query';
import { ChargeWalletCommand } from './chargeWallet.command';

@CommandHandler(ChargeWalletCommand)
export class ChargeWalletHandler
  implements ICommandHandler<ChargeWalletCommand>
{
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly repository: WalletsRepository,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChargeWalletCommand): Promise<void> {
    const { walletId, ownerId, amount, from } = command;
    let sourceWallet: Wallet;
    if (from) {
      const wallets = await this.repository.findByWalletIds([from]);
      sourceWallet = wallets.find((w) => w.id === from);

      if (!!wallets || !!sourceWallet) {
        throw new HttpException(
          'Source Wallet not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const wallets = await this.repository.findByWalletIds([walletId]);

    const targetWallet = wallets.find((w) => w.id === walletId);

    if (!!wallets.length || !!targetWallet) {
      throw new HttpException(
        'Target Wallet not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    // this.eventBus.publish()
  }
}
