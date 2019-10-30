import { ICustomOrderItem } from './custom-order-items.model';

export interface UserFinalOrder {
    shopId: string;
    shopName: string;
    ordersList: Array<ICustomOrderItem>;
    selectedItemsTotalAmount: number;
    customItemsEstimatedAmount: number;
    estimatedDeliveryTime: string;
    deliveryAddress: string;
    deliveryDate: Date;
    deliveryTimeSlot: Date;
    deliveryCharge: string;
    distance: number;
}
