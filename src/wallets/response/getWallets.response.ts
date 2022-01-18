import { Wallet } from 'src/wallets/wallet.entity';

export interface IGetWalletsResponse {
  wallets: Wallet[];
}
