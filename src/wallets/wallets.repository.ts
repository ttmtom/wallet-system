import { Currency } from '@constants/currency';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

export interface IWalletsRepository {
  save(wallets: Wallet[]): Promise<string[]>;
  findAll(): Promise<Wallet[]>;
  findByOwnerId(id: string): Promise<Wallet[]>;
  findByWalletIds(ids: string[]): Promise<Wallet[]>;
}

export const WalletsRepositorySymbol = Symbol('wallet_repository');

@Injectable()
export class WalletsRepository implements IWalletsRepository {
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

  findByWalletIds(ids: string[]): Promise<Wallet[]> {
    return this.repository.findByIds(ids);
  }

  findByOwnerId(id: string, currency?: Currency): Promise<Wallet[]> {
    return this.repository.find({
      where: {
        ...(currency && { currency }),
        owner: id,
      },
    });
  }
}
