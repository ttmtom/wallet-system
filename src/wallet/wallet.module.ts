import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormDbConnection } from 'src/db/connection';
import { Wallet } from './wallet.entity';
import { WalletController } from './wallet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet], typeormDbConnection)],
  controllers: [WalletController],
})
export class WalletModule {}
