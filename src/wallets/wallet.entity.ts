import { Currency } from '@constants/currency';
import * as currency from 'currency.js';
import { Transactions } from 'src/transactions/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp')
  updateAt: Date;

  @Column('numeric')
  balance: number;

  @Column('text')
  owner: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @OneToMany(
    () => Transactions,
    (transactions: Transactions) => transactions.from,
    // {eager: true},
  )
  payRecords: Transactions[];

  @OneToMany(
    () => Transactions,
    (transactions: Transactions) => transactions.to,
    // {eager: true},
  )
  chargeRecords: Transactions[];

  constructor(owner: string, currency: Currency) {
    this.owner = owner;
    this.currency = currency;
    this.balance = 0;
    this.createdAt = this.updateAt = new Date();
  }

  pay(amount: number) {
    this.balance = currency(this.balance).subtract(amount).value;
  }

  charge(amount: number) {
    this.balance = currency(this.balance).add(amount).value;
  }
}
