export interface ICustomOrderItem {
  shopId: string;
  shopName: string;
  itemId: string;
  itemName: string;
  itemCount: number;
  itemUnit: string;
  totalPrice: number;
  itemDiscountedRate: number;
  itemWeight: number;
  orderType: string;
}
