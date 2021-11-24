import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Transactions } from './transaction.entity';
import {
  TransactionsRepository,
  TransactionsRepositorySymbol,
} from './transactions.repository';
import events from './events';
import commands from './commands';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Transactions], connectionName),
  ],
  providers: [
    {
      provide: TransactionsRepositorySymbol,
      useClass: TransactionsRepository,
    },
    ...commands,
    ...events,
  ],
  exports: [TransactionsRepositorySymbol],
})
export class TransactionsModule {}
