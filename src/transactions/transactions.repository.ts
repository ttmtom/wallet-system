import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Repository } from 'typeorm';
import { Transactions } from './transaction.entity';

export interface ITransactionsRepository {
  save(wallets: Transactions[]): Promise<Transactions[]>;
  findAll(): Promise<Transactions[]>;
  findByIds(ids: string[]): Promise<Transactions[]>;
  // findByOwnerId(id: string): Promise<Transactions[]>;
  findByWalletId(id: string): Promise<Transactions[]>;
}

export const TransactionsRepositorySymbol = Symbol('transactions_repository');

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    @InjectRepository(Transactions, connectionName)
    private readonly repository: Repository<Transactions>,
  ) {}

  async save(wallets: Transactions[]): Promise<Transactions[]> {
    const resp = await this.repository.save(wallets);
    return resp;
  }

  findAll(): Promise<Transactions[]> {
    return this.repository.find();
  }

  findByIds(ids: string[]): Promise<Transactions[]> {
    return this.repository.findByIds(ids);
  }

  findByWalletId(id: string): Promise<Transactions[]> {
    return this.repository.find({
      where: [{ from: id }, { to: id }],
    });
  }

  // findByOwnerId(id: string): Promise<Transactions[]> {
  //   return this.repository.find({
  //     where: {},
  //   });
  // }
}
