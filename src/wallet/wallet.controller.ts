import { Controller, Get, Req, Headers, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetWalletsQuery } from './queries/getWallets/getWallets.query';
import { Wallet } from './wallet.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getWallets(): Promise<Wallet[]> {
    return this.queryBus.execute(new GetWalletsQuery());
  }

  // @Post()
  // async createWallet(): Promise<string> {
  // 	return
  // }
}
