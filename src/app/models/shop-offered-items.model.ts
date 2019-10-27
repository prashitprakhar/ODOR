export interface IShopOfferedItems {
    itemId: string;
    itemName: string;
    itemBrand: string;
    itemDescription: string;
    itemCategory: string; // Loose locally packed/Packaged
    itemUndiscountedRate: number;
    isDiscountedAvailable: boolean;
    itemDiscountedRate: number;
    discountAmount: number;
    discountPercentage: number;
    itemImageUrl: string;
    itemWeight: number;
    itemCount: number;
    itemUnit: string;
}
