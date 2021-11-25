import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Transactions } from './transaction.entity';
import {
  TransactionsRepository,
  TransactionsRepositorySymbol,
} from './transactions.repository';
import { TransactionsController } from './transactions.controller';
import events from './events';
import commands from './commands';
import queries from './queries';
import { WalletsModule } from '@wallet/wallets.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Transactions], connectionName),
    WalletsModule,
  ],
  providers: [
    {
      provide: TransactionsRepositorySymbol,
      useClass: TransactionsRepository,
    },
    ...commands,
    ...events,
    ...queries,
  ],
  exports: [TransactionsRepositorySymbol],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
