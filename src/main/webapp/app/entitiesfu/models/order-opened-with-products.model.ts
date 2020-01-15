import { OrderOpened } from '../../shared/model/order-opened.model';
import { ProductOrdered } from '../../shared/model/product-ordered.model';
export class OrderWithProducts extends OrderOpened {
  constructor(public productsToOrder?: Array<ProductOrdered>) {
    super();
  }
}
