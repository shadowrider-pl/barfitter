import { Vat } from '../../../app/shared/model/vat.model';
import { Desk } from '../../../app/shared/model/desk.model';
import { Category } from '../../../app/shared/model/category.model';

export class Defaults {
  constructor(public vats?: Vat[], public desks?: Desk[], public categories?: Category[]) {}
}
