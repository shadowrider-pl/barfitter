import { OrderWithProducts } from './order-opened-with-products.model';
export class OrderWithProductsAndStatus extends OrderWithProducts {
  constructor(public status?: number) {
    super();
  }
}
