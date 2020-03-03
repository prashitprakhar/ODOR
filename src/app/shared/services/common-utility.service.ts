import { Injectable } from "@angular/core";
import { ICityDetails } from "src/app/models/city-abbreviation-model";

@Injectable({
  providedIn: "root"
})
export class CommonUtilityService {

  public cityAbbr: ICityDetails[] = [
    {
      abbr: "HYD",
      value: "HYDERABAD"
    },
    {
      abbr: 'BLR',
      value: 'BANGALURU'
    }
  ];

  constructor() {}

  getCityDetails(abbr) {
    return this.cityAbbr.find(element => element.abbr === abbr);
  }

}
