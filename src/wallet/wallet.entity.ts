import { Currency } from '@constants/currency';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp')
  lastUpdate: Date;

  @Column('float')
  balance: number;

  @Column('text')
  owner: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  constructor(id: string, owner: string, currency: Currency) {
    this.id = id;
    this.owner = owner;
    this.currency = currency;
    this.balance = 0;
    this.createdAt = new Date();
    this.lastUpdate = new Date();
  }

  pay(amount: number) {
    this.balance -= amount;
  }

  charge(amount: number) {
    this.balance += amount;
  }
}
