import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminFunctionsService {

  constructor(private http: HttpClient) { }

  addNewShop(email: string) {
  }
}
