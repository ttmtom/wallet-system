import { Request } from 'express';
import {
  Controller,
  Get,
  Req,
  Headers,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { GetWalletsQuery } from './queries/getWallets/getWallets.query';
import { Wallet } from './wallet.entity';
import { GetWalletBodyDto } from './dto/getWalletsBody.dto';
import { Currency } from '@constants/currency';

@Controller('wallet')
export class WalletController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiHeader({
    name: 'X-user-id',
    description: 'user id',
  })
  @ApiQuery({ name: 'currency', enum: Currency, required: false })
  @Get()
  async getWallets(
    @Req() request: Request,
    @Query() query: GetWalletBodyDto,
  ): Promise<Wallet[]> {
    const userId = request.headers['X-user-id'];
    console.log('--- hii param', query);

    return this.queryBus.execute(
      new GetWalletsQuery(userId as string, query.curreny),
    );
  }

  // @Post()
  // async createWallet(): Promise<string> {
  // 	return
  // }
}
