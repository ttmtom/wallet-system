import { Currency } from '@constants/currency';
import { Transactions } from 'src/transactions/transaction.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn('uuid')
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

  @Column('uuid', { array: true })
  transactionRecords: string[] = [];

  constructor(id: string, owner: string, currency: Currency) {
    this.id = id;
    this.owner = owner;
    this.currency = currency;
    this.balance = 0;
    this.createdAt = this.updateAt = new Date();
  }

  pay(amount: number) {
    this.balance -= amount;
  }

  charge(amount: number) {
    this.balance += amount;
  }

  createTransaction(transaction: Transactions) {
    this.transactionRecords.push(transaction.id);
  }
}
