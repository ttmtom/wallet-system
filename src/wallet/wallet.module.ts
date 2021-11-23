import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Wallet } from './wallet.entity';
import { WalletController } from './wallet.controller';
import { CqrsModule } from '@nestjs/cqrs';
import queries from './queries';
import commands from './commands';
import { WalletRepository, WalletRepositorySymbol } from './wallet.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Wallet], connectionName)],
  controllers: [WalletController],
  providers: [
    {
      provide: WalletRepositorySymbol,
      useClass: WalletRepository,
    },
    ...queries,
    ...commands,
  ],
  exports: [WalletRepositorySymbol],
})
export class WalletModule {}
