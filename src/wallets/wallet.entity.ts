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

  @Column('float')
  balance: number;

  @Column('text')
  owner: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @OneToMany(() => Transactions, (transaction) => transaction.id)
  transactionRecord: Transactions[];

  constructor(id: string, owner: string, currency: Currency) {
    this.id = id;
    this.owner = owner;
    this.currency = currency;
    this.balance = 0;
    this.createdAt = this.updateAt = new Date();
    this.transactionRecord = [];
  }

  pay(amount: number) {
    this.balance -= amount;
  }

  charge(amount: number) {
    this.balance += amount;
  }

  createTransaction(transaction: Transactions) {
    if (transaction.from === this.id) {
      this.pay(transaction.amount);
    }
    if (transaction.to === this.id) {
      this.charge(transaction.amount);
    }
    this.transactionRecord.push(transaction);
  }
}
