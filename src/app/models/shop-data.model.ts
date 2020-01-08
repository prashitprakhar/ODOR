import { IShopOfferedItems } from './shop-offered-items.model';

export interface IShopData {
    shopId: string;
    shopName: string;
    shopType: string;
    shopOfferedItems: Array<IShopOfferedItems>;
    shopLocation: string;
    shopAddress: string;
    shopPostalCode: number;
    shopImageUrl: string;
    shopRating: number;
    userId: string;
    firstOrderTime: string;
    lastOrderTime: string;
    isShopOpen: boolean;
    email: string;
    role: string;
    shopAddressLineOne: string;
    shopAddressLineTwo: string;
    shopCity: string;
    shopMobileNumber: string;
    shopPincode: string;
    shopState: string;
}
