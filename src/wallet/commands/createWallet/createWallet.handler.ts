import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Wallet } from '@wallet/wallet.entity';
import * as uuid from 'uuid';
import {
  WalletRepository,
  WalletRepositorySymbol,
} from '@wallet/wallet.repository';
import { CreateWalletCommand } from './createWallet.command';

@CommandHandler(CreateWalletCommand)
export class CreateWalletHandler
  implements ICommandHandler<CreateWalletCommand>
{
  constructor(
    @Inject(WalletRepositorySymbol)
    private readonly repository: WalletRepository,
  ) {}

  execute(command: CreateWalletCommand): Promise<string> {
    const id = uuid.v4();

    const wallet = new Wallet(id, command.ownerId, command.currency);

    return this.repository.save([wallet])[0];
  }
}
