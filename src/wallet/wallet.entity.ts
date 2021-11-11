import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn('uuid')
  id: string;

  @Column('int')
  balance: number;

  @Column('char')
  owner: string;

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
