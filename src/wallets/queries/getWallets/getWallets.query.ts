import { Currency } from '@constants/currency';

export class GetWalletsQuery {
  constructor(
    public readonly ownerId: string,
    public readonly currency?: Currency,
  ) {}
}
