import { IShopOfferedItems } from './shop-offered-items.model';

export interface IShopList {
    shopId: string;
    shopName: string;
    shopType: string;
    shopOfferedItemsList: Array<IShopOfferedItems>;
    shopLocation: string;
    shopAddress: string;
    shopPostalCode: number;
    shopImageUrl: string;
    shopRating: number;
    userId: string;
    firstOrderTime: string;
    lastOrderTime: string;
    isShopOpen: boolean;
}
