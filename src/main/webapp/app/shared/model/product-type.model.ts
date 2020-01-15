export interface IProductType {
  id?: number;
  description?: string;
  active?: boolean;
}

export class ProductType implements IProductType {
  constructor(public id?: number, public description?: string, public active?: boolean) {
    this.active = this.active || false;
  }
}
