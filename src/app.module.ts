import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from 'src/db/typeorm.config';
import { WalletModule } from 'src/wallet/wallet.module';
import { connectionName } from 'src/db/connection';
import { Wallet } from 'src/wallet/wallet.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forRoot({
      name: connectionName,
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'DB',
      entities: [Wallet],
      synchronize: true,
    }),
    WalletModule,
  ],
})
export class AppModule {}
