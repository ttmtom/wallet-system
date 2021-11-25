import {
  Controller,
  Get,
  Req,
  Headers,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetWalletsQuery } from './queries/getWallets/getWallets.query';
import { Wallet } from './wallet.entity';
import { GetWalletsQueryDto } from './dto/getWalletsQuery.dto';
import { PostWalletBodyDto } from './dto/postWalletBody.dto';
import { Currency } from '@constants/currency';
import { GetWalletByIdQuery } from './queries/getWalletById/getWalletById.query';
import { CreateWalletCommand } from './commands/createWallet/createWallet.command';
import { ChargeWalletBody } from './dto/chargeWalletBody.dto';
import { ICreateWalletResponse } from './response/createWalletResponse';
import { IGetWalletResponse } from './response/getWalletResponse';
import { IGetWalletsResponse } from './response/getWalletsResponse';
import { ChargeWalletCommand } from './commands/chargeWallet/chargeWallet.command';
import { SourceId } from '@constants/chargeSource';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiQuery({ name: 'currency', enum: Currency, required: false })
  async getWallets(
    @Query() query: GetWalletsQueryDto,
    @Headers('X-user-id') userId: string,
  ): Promise<IGetWalletsResponse> {
    const wallets = await this.queryBus.execute(
      new GetWalletsQuery(userId, query.currency),
    );
    return { wallets };
  }

  @Get('/:id')
  async getWallet(
    @Headers('X-user-id') userId: string,
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<IGetWalletResponse> {
    const wallet = await this.queryBus.execute(
      new GetWalletByIdQuery(userId, id),
    );
    return { wallet };
  }

  @Post()
  async createWallet(
    @Body() postWalletBody: PostWalletBodyDto,
    @Headers('X-user-id') userId: string,
  ): Promise<ICreateWalletResponse> {
    const wallet = await this.commandBus.execute(
      new CreateWalletCommand(userId, postWalletBody.currency),
    );
    return { wallet: wallet };
  }

  @Post('/:id/charge')
  async chargeWallet(
    @Headers('X-user-id') userId: string,
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() chargeWalletBody: ChargeWalletBody,
  ): Promise<string> {
    const sourceId = SourceId[chargeWalletBody.from];
    if (!sourceId) {
      throw new HttpException('Source not support', HttpStatus.BAD_REQUEST);
    }

    return this.commandBus.execute(
      new ChargeWalletCommand(userId, id, sourceId, chargeWalletBody.amount),
    );
  }
}
