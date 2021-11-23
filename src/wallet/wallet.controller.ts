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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetWalletsQuery } from './queries/getWallets/getWallets.query';
import { Wallet } from './wallet.entity';
import { GetWalletQueryDto } from './dto/getWalletsQuery.dto';
import { PostWalletBodyDto } from './dto/postWalletBody.dto';
import { Currency } from '@constants/currency';
import { GetWalletQuery } from './queries/getWallet/getWallet.query';
import { CreateWalletCommand } from './commands/createWallet/createWallet.command';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

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
    @Param('Wallet Id', new ParseIntPipe()) walletId: string,
  ): Promise<Wallet> {
    const userId = request.get('X-user-id');
    return this.queryBus.execute(new GetWalletQuery(userId, walletId));
  }

  @Post()
  @ApiHeader({
    name: 'X-user-id',
    description: 'user id',
  })
  async createWallet(
    @Req() request: Request,
    @Body() postWalletBody: PostWalletBodyDto,
  ): Promise<string> {
    const userId = request.get('X-user-id');

    return this.commandBus.execute(
      new CreateWalletCommand(userId, postWalletBody.currency),
    );
  }
}
