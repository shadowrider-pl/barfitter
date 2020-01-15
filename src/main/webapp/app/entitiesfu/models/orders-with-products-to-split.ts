import { OrderWithProducts } from './order-opened-with-products.model';
export class OrdersWithProductsToSplit {
  constructor(public oldOrder: OrderWithProducts, public newOrder: OrderWithProducts) {}
}
