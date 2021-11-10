import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn('uuid')
  id: string;

  @Column('int')
  balance: number;
}
