import { Injectable } from '@angular/core';
import { ICustomOrderItem } from 'src/app/models/custom-order-items.model';

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
    console.log(" sortedArray sortedArray >>>>>", sortedArray);
    return sortedArray;
  }

}
