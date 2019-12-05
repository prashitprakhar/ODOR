import { ICustomOrderItem } from './custom-order-items.model';

export interface IUserFinalOrder {
    orderId: string;
    shopId: string;
    shopName: string;
    ordersList: Array<ICustomOrderItem>;
    selectedItemsTotalPrice: number;
    customItemsEstimatedPrice: number;
    estimatedDeliveryTime: string;
    estimatedDeliveryDateTimeFull: string;
    deliveryAddress: string;
    deliveryDate: Date;
    deliveryTimeSlot: string;
    deliveryCharge: string;
    maxDistance: string;
    orderPlaced: boolean;
    orderStatus: string;
    orderConfirmationStatus: string;
}
