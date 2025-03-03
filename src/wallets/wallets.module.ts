import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Wallet } from './wallet.entity';
import { WalletsController } from './wallets.controller';
import { CqrsModule } from '@nestjs/cqrs';
import queries from './queries';
import commands from './commands';
import events from './events';
import {
  WalletsRepository,
  WalletsRepositorySymbol,
} from './wallets.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Wallet], connectionName)],
  controllers: [WalletsController],
  providers: [
    {
      provide: WalletsRepositorySymbol,
      useClass: WalletsRepository,
    },
    ...queries,
    ...commands,
    ...events,
  ],
  exports: [WalletsRepositorySymbol],
})
export class WalletsModule {}
