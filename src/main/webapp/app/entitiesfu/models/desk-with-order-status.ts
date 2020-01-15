import { Desk } from '../../shared/model/desk.model';
export class DeskWithOrderStatus extends Desk {
  constructor(public status?: number, public hasSubDesk?: boolean) {
    super();
  }
}
