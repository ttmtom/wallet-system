import {
  Controller,
  Get,
  Headers,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as UUID from 'uuid';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetWalletsQuery } from './queries/getWallets/getWallets.query';
import { Wallet } from './wallet.entity';
import { GetWalletsQueryDto } from './dto/getWalletsQuery.dto';
import { CreateWalletDto } from './dto/createWallet.dto';
import { Currency } from '@constants/currency';
import { GetWalletByIdQuery } from './queries/getWalletById/getWalletById.query';
import { CreateWalletCommand } from './commands/createWallet/createWallet.command';
import { ChargeWalletDto } from './dto/chargeWallet.dto';
import { ICreateWalletResponse } from './response/createWallet.response';
import { IGetWalletResponse } from './response/getWallet.response';
import { IGetWalletsResponse } from './response/getWallets.response';
import { ChargeWalletCommand } from './commands/chargeWallet/chargeWallet.command';
import { SourceId } from '@constants/chargeSource';
import { ChargeWalletResponse } from './response/chargeWallet.response';
import { TransferDto } from './dto/transfer.dto';
import { TransferResponse } from './response/transfer.response';
import { TransferCommand } from './commands/transfer/transfer.command';

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
    @Body() createWalletDto: CreateWalletDto,
    @Headers('X-user-id') userId: string,
  ): Promise<ICreateWalletResponse> {
    const wallet = await this.commandBus.execute(
      new CreateWalletCommand(userId, createWalletDto.currency),
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
    @Body() chargeWalletDto: ChargeWalletDto,
  ): Promise<ChargeWalletResponse> {
    const sourceId = SourceId[chargeWalletDto.from];
    if (!sourceId) {
      throw new HttpException('Source not support', HttpStatus.BAD_REQUEST);
    }

    const record = await this.commandBus.execute(
      new ChargeWalletCommand(
        userId,
        id,
        chargeWalletDto.from,
        chargeWalletDto.amount,
      ),
    );

    return { record };
  }

  @Post('/:id/transfer')
  async transfer(
    @Headers('X-user-id') userId: string,
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() transferDto: TransferDto,
  ): Promise<TransferResponse> {
    if (!UUID.validate(transferDto.targetWalletId)) {
      throw new HttpException(
        'Target Wallet Id not validate',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const record = await this.commandBus.execute(
      new TransferCommand(
        userId,
        id,
        transferDto.targetWalletId,
        transferDto.amount,
      ),
    );

    return { record };
  }
}
