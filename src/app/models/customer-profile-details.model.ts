import { ICustomerAddress } from './customer-address.model';

export interface ICustomerProfileDetails {
    userId: string;
    email: string;
    username: string;
    customerAddressList: Array<ICustomerAddress>;
    role: string;
    customerRating: string;
    customerImageUrl: string;
  }
