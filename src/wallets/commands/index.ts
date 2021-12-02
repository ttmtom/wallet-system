import { ChargeWalletHandler } from './chargeWallet/chargeWallet.handler';
import { ChargeWalletCommitHandler } from './chargeWalletCommit/chargeWalletCommit.handler';
import { CreateWalletHandler } from './createWallet/createWallet.handler';
import { TransferHandler } from './transfer/transfer.handler';
import { TransferWalletCommitHandler } from './transferWalletCommit/transferWalletCommit.handler';

export default [
  CreateWalletHandler,
  ChargeWalletHandler,
  ChargeWalletCommitHandler,
  TransferHandler,
  TransferWalletCommitHandler,
];
