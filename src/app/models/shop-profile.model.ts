export interface IShopProfile {
    shopId: string;
    userId: string;
    email: string;
    shopName: string;
    shopAddressLineOne: string;
    shopAddressLineTwo: string;
    shopPincode: number;
    shopCity: string;
    shopState: string;
    shopMobileNumber: number;
    role: string;
    shopType: string;
    shopRating: string;
    firstOrderTime: string;
    lastOrderTime: string;
    isShopOpen: boolean;
    shopImageUrl: string;
}