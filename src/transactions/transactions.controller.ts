import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Headers,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { GetTransactionByWalletIdQuery } from './queries/getTransactionsByWalletId/getTransactionsByWalletId.query';
import { IGetTransactionsResponse } from './response/getTransactionsResponse';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:walletId')
  async getTransactions(
    @Param(
      'walletId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    walletId: string,
    @Headers('X-user-id') userId: string,
  ): Promise<IGetTransactionsResponse> {
    const transactions = await this.queryBus.execute(
      new GetTransactionByWalletIdQuery(userId, walletId),
    );
    return { transactions };
  }
}
