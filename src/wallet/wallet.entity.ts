import { Currency } from '@constants/currency';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn('uuid')
  id: string;

  @Column('float')
  balance: number;

  @Column('uuid')
  owner: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  constructor(id: string, balance: number, owner: string) {
    this.id = id;
    this.balance = balance;
    this.owner = owner;
  }

  pay(amount: number) {
    this.balance -= amount;
  }

  charge(amount: number) {
    this.balance += amount;
  }
}
