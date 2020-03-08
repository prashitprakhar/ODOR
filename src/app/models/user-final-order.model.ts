import { ICustomOrderItem } from './custom-order-items.model';
import { ICustomerAddress } from './customer-address.model';

export interface IUserFinalOrder {
    _id?: string;
    orderId: string;
    shopId: string;
    shopName: string;
    orderedItemsList: Array<ICustomOrderItem>;
    selectedItemsTotalPrice: number;
    customItemsEstimatedPrice: number;
    estimatedDeliveryTime: string;
    estimatedDeliveryDateTimeFull: string;
    deliveryAddress: ICustomerAddress;
    deliveryDate: Date;
    deliveryTimeSlot: string;
    deliveryCharge: string;
    maxDistance: string;
    orderPlaced: boolean;
    orderStatus: string;
    orderConfirmationStatus: string;
}
