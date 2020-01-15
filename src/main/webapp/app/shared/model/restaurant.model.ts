import { Moment } from 'moment';

export interface IRestaurant {
  id?: number;
  name?: string;
  country?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  vatNumber?: string;
  licenceDate?: Moment;
  licenceType?: string;
  nextLicenceType?: string;
  adsLevel?: number;
  currency?: string;
  createdDate?: Moment;
}

export class Restaurant implements IRestaurant {
  constructor(
    public id?: number,
    public name?: string,
    public country?: string,
    public address?: string,
    public zipCode?: string,
    public city?: string,
    public vatNumber?: string,
    public licenceDate?: Moment,
    public licenceType?: string,
    public nextLicenceType?: string,
    public adsLevel?: number,
    public currency?: string,
    public createdDate?: Moment
  ) {}
}
