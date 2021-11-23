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
  ParseIntPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetWalletsQuery } from './queries/getWallets/getWallets.query';
import { Wallet } from './wallet.entity';
import { GetWalletQueryDto } from './dto/getWalletsQuery.dto';
import { Currency } from '@constants/currency';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiHeader({
    name: 'X-user-id',
    description: 'user id',
  })
  @ApiQuery({ name: 'currency', enum: Currency, required: false })
  async getWallets(
    @Req() request: Request,
    @Query() query: GetWalletQueryDto,
  ): Promise<Wallet[]> {
    const userId = request.get('X-user-id');

    return this.queryBus.execute(new GetWalletsQuery(userId, query.currency));
  }

  @Get(':id')
  @ApiHeader({
    name: 'X-user-id',
    description: 'user id',
  })
  async getWallet(
    @Req() request: Request,
    @Param('Wallet Id', new ParseIntPipe()) id: number,
  ): Promise<Wallet[]> {
    const userId = request.get('X-user-id');
    return this.queryBus.execute(new GetWalletsQuery(userId));
  }

  // @Post()
  // @ApiHeader({
  //   name: 'X-user-id',
  //   description: 'user id',
  // })
  // @ApiBody({type: GetWalletsBody})
  // async createWallet(): Promise<string> {
  // 	return
  // }
}
