import { Injectable } from '@angular/core';
import { IStandardDeliveryTime } from './../models/standard-delivery-time.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryTimeService {

  public standardDeliveryTime: IStandardDeliveryTime = {
    deliveryTimeWithin1K: 20,
    deliveryTime1KTo2K: 30,
    deliveryTime2KTo3K: 45,
    deliveryTime3KTo4K: 45,
    deliveryTime4KTo5K: 45,
    deliveryTime5KTo6K: 45,
    deliveryTime6KTo7K: 45,
    deliveryTime7KTo8K: 60,
    deliveryTime8KTo9K: 75,
    deliveryTime9KTo10K: 90
  };

  constructor() { }

  getManipulatedDeliveryTime() {
    return {...this.standardDeliveryTime};
  }
}
