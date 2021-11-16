import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

export interface IWalletRepository {
  save(wallet: Wallet): Promise<void>;
  findAll(): Promise<Wallet[]>;
  findById(id: string): Promise<Wallet>;
}

export const WalletRepositorySymbol = Symbol('wallet_repository');

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet, connectionName)
    private readonly repository: Repository<Wallet>,
  ) {}

  async save(wallet: Wallet): Promise<void> {
    await this.repository.save([wallet]);
    return;
  }

  findAll(): Promise<Wallet[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<Wallet> {
    throw new Error('Method not implemented.');
  }
}
