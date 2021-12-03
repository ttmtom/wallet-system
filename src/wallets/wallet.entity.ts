import { Currency } from '@constants/currency';
import * as currency from 'currency.js';
import { BaseDBObject } from 'src/db/baseBDObject';
import { Transactions } from 'src/transactions/transaction.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Wallet extends BaseDBObject {
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
    super();
    this.owner = owner;
    this.currency = currency;
    this.balance = 0;
  }

  pay(amount: number) {
    this.balance = currency(this.balance).subtract(amount).value;
  }

  charge(amount: number) {
    this.balance = currency(this.balance).add(amount).value;
  }
}
