import { Product } from '../../../shared/model/product.model';
export class ProductAnalyzed {
  constructor(
    public product: Product,
    public quantity: number,
    public purchPriceNet: number,
    public purchPriceGross: number,
    public purchVatValue: number,
    public sellPriceNet: number,
    public sellPriceGross: number,
    public sellVatValue: number,
    public previousPeriodQuantity: number
  ) {}
}
