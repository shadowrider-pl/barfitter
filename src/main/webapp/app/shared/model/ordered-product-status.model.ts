export interface IOrderedProductStatus {
  id?: number;
  description?: string;
  active?: boolean;
}

export class OrderedProductStatus implements IOrderedProductStatus {
  constructor(public id?: number, public description?: string, public active?: boolean) {
    this.active = this.active || false;
  }
}
