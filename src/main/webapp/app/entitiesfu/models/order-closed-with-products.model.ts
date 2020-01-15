import { OrderClosed } from '../../shared/model/order-closed.model';
import { ProductSold } from '../../shared/model/product-sold.model';
export class OrderClosedWithProducts extends OrderClosed {
  constructor(public productsSold?: Array<ProductSold>) {
    super();
  }
}
