import { ProductOnStock } from '../../shared/model/product-on-stock.model';
export class ProductOfCategoryWithOrderedQuantity extends ProductOnStock {
  constructor(public orderedQuantity?: number) {
    super();
  }
}
