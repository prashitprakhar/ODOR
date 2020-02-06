import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(private http: HttpClient) { }

  postAPI(url, payload): Promise<any> {
    return this.http.post(url, payload).toPromise();
  }

  deleteAPI(url, payload, headersData) : Promise<any> {
    const headers = new HttpHeaders({'Authorization': `Bearer ${headersData}`});
    return this.http.post(url, payload, {headers}).toPromise();
  }

  authenticatedPostAPI(url, payload, headersData): Promise<any> {
    // tslint:disable-next-line: object-literal-key-quotes
    const headers = new HttpHeaders({'Authorization': `Bearer ${headersData}`});
    return this.http.post(url, payload, {headers}).toPromise();
  }

  uploadFile(url, payload, headersData): Promise<any>{
    // tslint:disable-next-line: object-literal-key-quotes
    const headers = new HttpHeaders({'Authorization': `Bearer ${headersData}`});
    return this.http.post(url, payload, {headers}).toPromise();
  }


}
