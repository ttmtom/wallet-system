import { ChargeSource, SourceId } from '@constants/chargeSource';
import { Currency } from '@constants/currency';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectionName } from 'src/db/connection';
import { EntityManager, Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

export interface IWalletsRepository {
  save(wallets: Wallet[], manager: EntityManager): Promise<Wallet[]>;
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
  ) {
    const bankWallet = new Wallet(
      SourceId[ChargeSource.BANK],
      ChargeSource.BANK,
      Currency.HKD,
    );
    bankWallet.charge(99999999);
    const cardWallet = new Wallet(
      SourceId[ChargeSource.CREDIT_CARD],
      ChargeSource.CREDIT_CARD,
      Currency.HKD,
    );
    cardWallet.charge(99999999);

    this.repository.save([bankWallet, cardWallet]);
  }

  async save(wallets: Wallet[]): Promise<Wallet[]> {
    const resp = await this.repository.save(wallets);
    return resp;
  }

  findAll(): Promise<Wallet[]> {
    return this.repository.find();
  }

  async isWalletBelongToUser(
    ownerId: string,
    walletId: string,
  ): Promise<boolean> {
    const targetWallet = await this.repository.find({
      where: {
        owner: ownerId,
        id: walletId,
      },
    });

    return !!targetWallet.length;
  }

  async findByWalletIds(ids: string[]): Promise<Wallet[]> {
    const wallets = await this.repository.findByIds(ids);
    return wallets;
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
