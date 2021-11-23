import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

export interface IWalletRepository {
  save(wallets: Wallet[]): Promise<string[]>;
  findAll(): Promise<Wallet[]>;
  findByIds(ids: string[]): Promise<Wallet[]>;
}

export const WalletRepositorySymbol = Symbol('wallet_repository');

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet, connectionName)
    private readonly repository: Repository<Wallet>,
  ) {}

  async save(wallets: Wallet[]): Promise<string[]> {
    const resp = await this.repository.save(wallets);
    return resp.map((wallet) => wallet.id);
  }

  findAll(): Promise<Wallet[]> {
    return this.repository.find();
  }

  findByIds(ids: string[]): Promise<Wallet[]> {
    return this.repository.findByIds(ids);
  }
}
