import { Injectable } from '@angular/core';
import { ICustomOrderItem } from 'src/app/models/custom-order-items.model';
import { ICustomerAddress } from 'src/app/models/customer-address.model';

@Injectable({
  providedIn: 'root'
})
export class SortByService {

  constructor() { }

  sortBy(arrayList: any[]): ICustomOrderItem[] {
    const sortedArray: ICustomOrderItem[] = this.sortArrayByItemName(arrayList);
    return sortedArray;
  }

  sortArrayByItemName(arrayList: any[]) {
    let sortedArray;
    sortedArray = arrayList.sort((a, b) => {
      const itemOne = a.itemName.toUpperCase(); // ignore upper and lowercase
      const itemTwo = b.itemName.toUpperCase(); // ignore upper and lowercase
      if (itemOne < itemTwo) {
        return -1;
      }
      if (itemOne > itemTwo) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    // console.log(" sortedArray sortedArray >>>>>", sortedArray);
    return sortedArray;
  }

  sortCustomerAddress(arrayList: any[]): ICustomerAddress[] {
    let sortedArray;
    sortedArray = arrayList.sort((a, b) => {
      const itemOne = a.createdAt; // .toUpperCase(); // ignore upper and lowercase
      const itemTwo = b.createdAt; // .toUpperCase(); // ignore upper and lowercase
      if (new Date(itemOne) < new Date(itemTwo)) {
        return -1;
      }
      if (new Date(itemOne) > new Date(itemTwo)) {
        return 1;
      }
      // names must be equal
      return 0;
      // return new Date(itemOne) - new Date(itemTwo);
    });
    // console.log(" sortedArray sortedArray >>>>>", sortedArray);
    return sortedArray;
  }

  sortOrdersByTimestamp(arrayList: any[]) {
    const sortedArray = arrayList.sort((a, b) => {
      const itemOne = a.createdAt;
      const itemTwo = b.createdAt;
      if (new Date(itemOne) < new Date(itemTwo)) {
        return -1;
      }
      if (new Date(itemOne) > new Date(itemTwo)) {
        return 1;
      }
      // names must be equal
      return 0;
      // return new Date(itemOne) - new Date(itemTwo);
    });
    // console.log(" sortedArray sortedArray >>>>>", sortedArray);
    // return 0;
    // });
    return sortedArray;
      // return 0;
  }

  sortLatestToOld(arrayList: any[]) {
    const sortedArray = arrayList.sort((a, b) => {
      const itemOne = a.createdAt;
      const itemTwo = b.createdAt;
      if (new Date(itemOne) < new Date(itemTwo)) {
        return 1;
      }
      if (new Date(itemOne) > new Date(itemTwo)) {
        return -1;
      }
      // names must be equal
      return 0;
      // return new Date(itemOne) - new Date(itemTwo);
    });
    // console.log(" sortedArray sortedArray >>>>>", sortedArray);
    // return 0;
    // });
    return sortedArray;
      // return 0;
  }

}
