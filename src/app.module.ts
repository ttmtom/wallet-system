import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WalletsModule } from 'src/wallets/wallets.module';
import { connectionName } from 'src/db/connection';
import { Wallet } from 'src/wallets/wallet.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { Transactions } from './transactions/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      name: connectionName,
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'DB',
      entities: [Wallet, Transactions],
      synchronize: true,
      // migrations: ['db/migration/*{.ts}'],
      // cli: {
      //   migrationsDir: 'db/migration',
      // },
      // migrationsRun: true,
    }),
    WalletsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
