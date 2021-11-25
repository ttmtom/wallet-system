import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Wallet } from 'src/wallets/wallet.entity';
import * as uuid from 'uuid';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from 'src/wallets/wallets.repository';
import { CreateWalletCommand } from './createWallet.command';
import { GetWalletsQuery } from 'src/wallets/queries/getWallets/getWallets.query';

@CommandHandler(CreateWalletCommand)
export class CreateWalletHandler
  implements ICommandHandler<CreateWalletCommand>
{
  constructor(
    @Inject(WalletsRepositorySymbol)
    private readonly repository: WalletsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateWalletCommand): Promise<Wallet> {
    const { ownerId, currency } = command;
    const walletInDb: Wallet[] = await this.queryBus.execute(
      new GetWalletsQuery(ownerId, currency),
    );

    if (!!walletInDb.length) {
      throw new HttpException(
        `${currency} wallet existed`,
        HttpStatus.CONFLICT,
      );
    }

    const id = uuid.v4();

    const wallet = new Wallet(id, command.ownerId, command.currency);
    const resp = await this.repository.save([wallet]);
    return resp[0];
  }
}
