import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Repository } from 'typeorm';
import { Transactions } from './transaction.entity';

export interface ITransactionsRepository {
  save(wallets: Transactions[]): Promise<string[]>;
  findAll(): Promise<Transactions[]>;
  findByOwnerId(id: string): Promise<Transactions[]>;
  findByWalletId(id: string): Promise<Transactions[]>;
}

export const TransactionsRepositorySymbol = Symbol('transactions_repository');

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    @InjectRepository(Transactions, connectionName)
    private readonly repository: Repository<Transactions>,
  ) {}

  async save(wallets: Transactions[]): Promise<string[]> {
    const resp = await this.repository.save(wallets);
    return resp.map((wallet) => wallet.id);
  }

  findAll(): Promise<Transactions[]> {
    return this.repository.find();
  }

  findByWalletId(id: string): Promise<Transactions[]> {
    return this.repository.find({
      where: {
        from: id,
      },
    });
  }

  findByOwnerId(id: string): Promise<Transactions[]> {
    return this.repository.find({
      where: {},
    });
  }
}
